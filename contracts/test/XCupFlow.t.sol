// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../src/XCupPassport.sol";
import "../src/MatchResolver.sol";
import "../src/PredictionPool.sol";
import "../src/BanterBond.sol";

interface Vm {
    function prank(address sender) external;
}

contract XCupFlowTest {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    XCupPassport passport;
    MatchResolver resolver;
    PredictionPool pool;
    BanterBond bond;

    address fan = address(0xA11CE);
    address rival = address(0xB0B);

    function setUp() public {
        passport = new XCupPassport();
        resolver = new MatchResolver();
        pool = new PredictionPool(address(passport), address(resolver));
        bond = new BanterBond(address(resolver));
        passport.setGameAuthorization(address(pool), true);
        // Authorize this test contract as a "game" so tier tests can drive score directly.
        passport.setGameAuthorization(address(this), true);
    }

    // --- ERC-721 / soulbound ---

    function testMintCreatesSoulboundNft() public {
        vm.prank(fan);
        uint256 tokenId = passport.mintPassport("Brazil");

        assertUintEq(tokenId, 1);
        assertUintEq(passport.tokenOf(fan), 1);
        assertAddressEq(passport.ownerOf(1), fan);
        assertUintEq(passport.balanceOf(fan), 1);
        assertUintEq(passport.totalMinted(), 1);
        assertStrEq(passport.stageOf(1), "Group Stage");
    }

    function testSoulboundTransferAndApproveRevert() public {
        vm.prank(fan);
        passport.mintPassport("Brazil");

        (bool okTransfer, ) = address(passport).call(
            abi.encodeWithSignature("transferFrom(address,address,uint256)", fan, rival, uint256(1))
        );
        require(!okTransfer, "transfer must revert");

        (bool okApprove, ) = address(passport).call(
            abi.encodeWithSignature("approve(address,uint256)", rival, uint256(1))
        );
        require(!okApprove, "approve must revert");

        (bool okOpAll, ) = address(passport).call(
            abi.encodeWithSignature("setApprovalForAll(address,bool)", rival, true)
        );
        require(!okOpAll, "setApprovalForAll must revert");
    }

    function testCannotMintTwice() public {
        vm.prank(fan);
        passport.mintPassport("Brazil");

        vm.prank(fan);
        (bool ok, ) = address(passport).call(
            abi.encodeWithSignature("mintPassport(string)", "Argentina")
        );
        require(!ok, "second mint must revert");
    }

    function testTokenUriIsOnchainJson() public {
        vm.prank(fan);
        passport.mintPassport("Brazil");

        string memory uri = passport.tokenURI(1);
        require(startsWith(uri, "data:application/json;base64,"), "bad tokenURI prefix");
        require(bytes(uri).length > 400, "tokenURI too short to hold svg");
    }

    // --- evolution / tiers ---

    function testTierProgressionAcrossStages() public {
        vm.prank(fan);
        passport.mintPassport("Brazil");

        // Drive score directly via authorized "game" (this contract).
        passport.recordPredictionResult(fan, 30, true); // 30 -> Round of 16
        assertStrEq(passport.stageOf(1), "Round of 16");

        passport.recordPredictionResult(fan, 40, true); // 70 -> Quarterfinal
        assertStrEq(passport.stageOf(1), "Quarterfinal");

        passport.recordPredictionResult(fan, 50, true); // 120 -> Semifinal
        assertStrEq(passport.stageOf(1), "Semifinal");

        passport.recordPredictionResult(fan, 80, true); // 200 -> Champion
        assertStrEq(passport.stageOf(1), "Champion");

        XCupPassport.Passport memory pass = passport.passportOf(fan);
        assertUintEq(pass.score, 200);
        assertUintEq(pass.predictions, 4);
        assertUintEq(pass.badges, 4);
    }

    // --- full prediction loop ---

    function testMintPredictResolveSettleUpdatesPassport() public {
        uint256 matchId = resolver.createMatch("Brazil", "Japan", 1781208000, true);

        vm.prank(fan);
        passport.mintPassport("Brazil");

        vm.prank(fan);
        uint256 predictionId = pool.submitPrediction(matchId, 1, "Brazil starts the run");

        resolver.resolveMatch(matchId, 1, 2, 0);
        pool.settlePrediction(predictionId);

        XCupPassport.Passport memory pass = passport.passportOf(fan);
        assertAddressEq(pass.owner, fan);
        assertUintEq(pass.score, 10);
        assertUintEq(pass.predictions, 1);
        assertUintEq(pass.badges, 1);

        PredictionPool.Prediction memory prediction = pool.predictionOf(predictionId);
        assertBoolTrue(prediction.settled);
        assertUintEq(prediction.points, 10);
    }

    function testWrongPredictionSettlesWithoutBadge() public {
        uint256 matchId = resolver.createMatch("Argentina", "USA", 1781294400, true);

        vm.prank(fan);
        passport.mintPassport("USA");

        vm.prank(fan);
        uint256 predictionId = pool.submitPrediction(matchId, 2, "USA upset watch");

        resolver.resolveMatch(matchId, 1, 1, 0);
        pool.settlePrediction(predictionId);

        XCupPassport.Passport memory pass = passport.passportOf(fan);
        assertUintEq(pass.score, 0);
        assertUintEq(pass.predictions, 1);
        assertUintEq(pass.badges, 0);
    }

    function testBanterBondSettlementChoosesWinner() public {
        uint256 matchId = resolver.createMatch("Brazil", "Japan", 1781208000, true);

        vm.prank(fan);
        uint256 bondId = bond.createBond(rival, matchId, 1, "Winner gets the receipt");

        vm.prank(rival);
        bond.acceptBond(bondId, 2);

        resolver.resolveMatch(matchId, 1, 2, 0);
        bond.settleBond(bondId);

        BanterBond.Bond memory settled = bond.bondOf(bondId);
        assertBoolTrue(settled.settled);
        assertAddressEq(settled.winner, fan);
    }

    // --- helpers ---

    function startsWith(string memory s, string memory prefix) internal pure returns (bool) {
        bytes memory b = bytes(s);
        bytes memory p = bytes(prefix);
        if (b.length < p.length) return false;
        for (uint256 i = 0; i < p.length; i++) {
            if (b[i] != p[i]) return false;
        }
        return true;
    }

    function assertStrEq(string memory actual, string memory expected) internal pure {
        require(keccak256(bytes(actual)) == keccak256(bytes(expected)), "string mismatch");
    }

    function assertUintEq(uint256 actual, uint256 expected) internal pure {
        require(actual == expected, "uint mismatch");
    }

    function assertAddressEq(address actual, address expected) internal pure {
        require(actual == expected, "address mismatch");
    }

    function assertBoolTrue(bool actual) internal pure {
        require(actual, "bool mismatch");
    }
}
