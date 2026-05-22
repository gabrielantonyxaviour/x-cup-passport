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
    }

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
        assertUintEq(pass.score, 3);
        assertUintEq(pass.predictions, 1);
        assertUintEq(pass.badges, 1);

        PredictionPool.Prediction memory prediction = pool.predictionOf(predictionId);
        assertBoolTrue(prediction.settled);
        assertUintEq(prediction.points, 3);
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
