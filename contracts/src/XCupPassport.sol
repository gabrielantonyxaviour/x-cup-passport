// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Base64} from "./Base64.sol";

/// @title X Cup Passport
/// @notice A soulbound, dynamic ERC-721 World Cup fan passport on X Layer.
///         The fully on-chain SVG art evolves through tournament stages
///         (Group Stage -> Round of 16 -> Quarterfinal -> Semifinal -> Champion)
///         as the holder's on-chain prediction score grows.
/// @dev Self-contained: no external library dependencies beyond an in-repo Base64.
///      Non-transferable (soulbound) — a passport is an identity, not an asset.
contract XCupPassport {
    struct Passport {
        address owner;
        string nation;
        uint256 score;
        uint256 predictions;
        uint256 badges;
        bool minted;
    }

    // --- ownership / access ---
    address public owner;
    uint256 public nextTokenId = 1;
    uint256 public totalMinted;

    mapping(uint256 => Passport) private passports;
    mapping(address => uint256) public tokenOf; // 0 == none
    mapping(address => bool) public authorizedGames;

    // --- ERC-721 metadata ---
    string public constant name = "X Cup Passport";
    string public constant symbol = "XCUP";

    // --- events ---
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    event PassportMinted(uint256 indexed tokenId, address indexed fan, string nation);
    event GameAuthorizationUpdated(address indexed game, bool allowed);
    event ScoreUpdated(
        uint256 indexed tokenId,
        address indexed fan,
        uint256 score,
        uint256 predictions,
        uint256 badges
    );
    // ERC-4906
    event MetadataUpdate(uint256 _tokenId);
    event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    modifier onlyGame() {
        require(authorizedGames[msg.sender], "not game");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // ---------------------------------------------------------------------
    // ERC-165
    // ---------------------------------------------------------------------
    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return
            interfaceId == 0x01ffc9a7 || // ERC-165
            interfaceId == 0x80ac58cd || // ERC-721
            interfaceId == 0x5b5e139f || // ERC-721 Metadata
            interfaceId == 0x49064906;   // ERC-4906 Metadata update
    }

    // ---------------------------------------------------------------------
    // ERC-721 core (read)
    // ---------------------------------------------------------------------
    function balanceOf(address account) external view returns (uint256) {
        require(account != address(0), "zero address");
        return tokenOf[account] == 0 ? 0 : 1;
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address holder = passports[tokenId].owner;
        require(holder != address(0), "missing token");
        return holder;
    }

    // ---------------------------------------------------------------------
    // Soulbound: transfers and approvals are disabled
    // ---------------------------------------------------------------------
    function approve(address, uint256) external pure {
        revert("soulbound");
    }

    function setApprovalForAll(address, bool) external pure {
        revert("soulbound");
    }

    function getApproved(uint256) external pure returns (address) {
        return address(0);
    }

    function isApprovedForAll(address, address) external pure returns (bool) {
        return false;
    }

    function transferFrom(address, address, uint256) external pure {
        revert("soulbound");
    }

    function safeTransferFrom(address, address, uint256) external pure {
        revert("soulbound");
    }

    function safeTransferFrom(address, address, uint256, bytes calldata) external pure {
        revert("soulbound");
    }

    // ---------------------------------------------------------------------
    // Minting + scoring
    // ---------------------------------------------------------------------
    function mintPassport(string calldata nation) external returns (uint256 tokenId) {
        require(tokenOf[msg.sender] == 0, "passport exists");
        uint256 len = bytes(nation).length;
        require(len > 0 && len <= 24, "bad nation");

        tokenId = nextTokenId++;
        passports[tokenId] = Passport({
            owner: msg.sender,
            nation: nation,
            score: 0,
            predictions: 0,
            badges: 0,
            minted: true
        });
        tokenOf[msg.sender] = tokenId;
        totalMinted += 1;

        emit Transfer(address(0), msg.sender, tokenId);
        emit PassportMinted(tokenId, msg.sender, nation);
    }

    function setGameAuthorization(address game, bool allowed) external onlyOwner {
        require(game != address(0), "bad game");
        authorizedGames[game] = allowed;
        emit GameAuthorizationUpdated(game, allowed);
    }

    function recordPredictionResult(address fan, uint256 points, bool badgeUnlocked) external onlyGame {
        uint256 tokenId = tokenOf[fan];
        require(tokenId != 0, "no passport");

        Passport storage passport = passports[tokenId];
        passport.score += points;
        passport.predictions += 1;
        if (badgeUnlocked) {
            passport.badges += 1;
        }

        emit ScoreUpdated(tokenId, fan, passport.score, passport.predictions, passport.badges);
        emit MetadataUpdate(tokenId); // ERC-4906: art evolved
    }

    // ---------------------------------------------------------------------
    // Views
    // ---------------------------------------------------------------------
    function passportOf(address fan) external view returns (Passport memory) {
        uint256 tokenId = tokenOf[fan];
        require(tokenId != 0, "no passport");
        return passports[tokenId];
    }

    function getPassport(uint256 tokenId) external view returns (Passport memory) {
        require(passports[tokenId].minted, "missing token");
        return passports[tokenId];
    }

    function stageOf(uint256 tokenId) external view returns (string memory) {
        require(passports[tokenId].minted, "missing token");
        (string memory stage, , , , ) = _stageInfo(passports[tokenId].score);
        return stage;
    }

    // ---------------------------------------------------------------------
    // Dynamic on-chain metadata
    // ---------------------------------------------------------------------
    function tokenURI(uint256 tokenId) external view returns (string memory) {
        Passport memory p = passports[tokenId];
        require(p.minted, "missing token");

        string memory image = Base64.encode(bytes(_buildSVG(tokenId, p)));
        (string memory stage, , , , ) = _stageInfo(p.score);

        bytes memory json = abi.encodePacked(
            '{"name":"X Cup Passport #', _toString(tokenId), " - ", p.nation,
            '","description":"A soulbound, evolving World Cup fan passport on X Layer. The art advances through tournament stages as the holder\'s on-chain prediction score grows.",',
            '"attributes":[',
                '{"trait_type":"Nation","value":"', p.nation, '"},',
                '{"trait_type":"Stage","value":"', stage, '"},',
                '{"trait_type":"Score","value":', _toString(p.score), "},",
                '{"trait_type":"Predictions","value":', _toString(p.predictions), "},",
                '{"trait_type":"Badges","value":', _toString(p.badges), "}",
            '],"image":"data:image/svg+xml;base64,', image, '"}'
        );

        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(json)));
    }

    function _stageInfo(uint256 score)
        internal
        pure
        returns (string memory stage, string memory c1, string memory c2, uint256 lo, uint256 hi)
    {
        if (score >= 200) return ("Champion", "#78350f", "#fbbf24", 200, 200);
        if (score >= 120) return ("Semifinal", "#581c87", "#a855f7", 120, 200);
        if (score >= 70) return ("Quarterfinal", "#7c2d12", "#f59e0b", 70, 120);
        if (score >= 30) return ("Round of 16", "#065f46", "#10b981", 30, 70);
        return ("Group Stage", "#1e3a8a", "#0ea5e9", 0, 30);
    }

    function _buildSVG(uint256 tokenId, Passport memory p) internal pure returns (string memory) {
        (string memory stage, string memory c1, string memory c2, uint256 lo, uint256 hi) = _stageInfo(p.score);
        uint256 pct = hi == lo ? 100 : ((p.score - lo) * 100) / (hi - lo);
        uint256 barW = (276 * pct) / 100;
        string memory accent = _accent(p.nation);
        string memory progressLabel = hi == lo
            ? "Max stage reached"
            : string(abi.encodePacked(_toString(pct), "% to next stage"));

        // Split into chunks to keep the stack shallow.
        string memory head = string(
            abi.encodePacked(
                "<svg xmlns='http://www.w3.org/2000/svg' width='360' height='500' viewBox='0 0 360 500'>",
                "<defs><linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>",
                "<stop offset='0' stop-color='", c1, "'/><stop offset='1' stop-color='", c2, "'/>",
                "</linearGradient></defs>",
                "<rect width='360' height='500' rx='28' fill='url(#bg)'/>",
                "<rect x='14' y='14' width='332' height='472' rx='20' fill='none' stroke='#ffffff' stroke-opacity='0.25' stroke-width='1.5'/>",
                "<rect x='42' y='38' width='276' height='4' rx='2' fill='", accent, "'/>"
            )
        );

        string memory top = string(
            abi.encodePacked(
                "<text x='42' y='74' fill='#ffffff' font-family='Georgia, serif' font-size='15' letter-spacing='3' opacity='0.85'>X CUP PASSPORT</text>",
                "<rect x='42' y='90' width='180' height='30' rx='15' fill='#000000' fill-opacity='0.28'/>",
                "<text x='58' y='110' fill='#ffffff' font-family='Arial, sans-serif' font-size='14' font-weight='700' letter-spacing='1'>", stage, "</text>",
                "<text x='42' y='214' fill='#ffffff' font-family='Georgia, serif' font-size='34' font-weight='700'>", p.nation, "</text>",
                "<text x='42' y='238' fill='#ffffff' opacity='0.7' font-family='Arial, sans-serif' font-size='12' letter-spacing='2'>FAN PASSPORT &#8226; SOULBOUND</text>"
            )
        );

        string memory mid = string(
            abi.encodePacked(
                "<text x='42' y='332' fill='#ffffff' font-family='Arial, sans-serif' font-size='72' font-weight='800'>", _toString(p.score), "</text>",
                "<text x='42' y='356' fill='#ffffff' opacity='0.7' font-family='Arial, sans-serif' font-size='12' letter-spacing='2'>TOTAL SCORE</text>",
                "<rect x='42' y='384' width='276' height='10' rx='5' fill='#000000' fill-opacity='0.25'/>",
                "<rect x='42' y='384' width='", _toString(barW), "' height='10' rx='5' fill='#ffffff'/>",
                "<text x='42' y='414' fill='#ffffff' opacity='0.8' font-family='Arial, sans-serif' font-size='12'>", progressLabel, "</text>"
            )
        );

        string memory bottom = string(
            abi.encodePacked(
                "<text x='42' y='452' fill='#ffffff' font-family='Arial, sans-serif' font-size='14'>",
                _toString(p.predictions), " predictions &#8226; ", _toString(p.badges), " badges</text>",
                "<text x='42' y='474' fill='#ffffff' opacity='0.6' font-family='Arial, sans-serif' font-size='11' letter-spacing='1'>X LAYER &#8226; #", _toString(tokenId), "</text>",
                "</svg>"
            )
        );

        return string(abi.encodePacked(head, top, mid, bottom));
    }

    function _accent(string memory nation) internal pure returns (string memory) {
        bytes32 h = keccak256(bytes(nation));
        return string(abi.encodePacked("#", _hexByte(uint8(h[0])), _hexByte(uint8(h[1])), _hexByte(uint8(h[2]))));
    }

    function _hexByte(uint8 b) internal pure returns (string memory) {
        bytes memory hexChars = "0123456789abcdef";
        bytes memory out = new bytes(2);
        out[0] = hexChars[b >> 4];
        out[1] = hexChars[b & 0x0f];
        return string(out);
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
