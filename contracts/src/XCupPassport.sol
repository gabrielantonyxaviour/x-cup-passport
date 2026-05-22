// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract XCupPassport {
    struct Passport {
        address owner;
        string nation;
        uint256 score;
        uint256 predictions;
        uint256 badges;
        bool minted;
    }

    address public owner;
    uint256 public nextTokenId = 1;
    mapping(uint256 => Passport) private passports;
    mapping(address => uint256) public tokenOf;
    mapping(address => bool) public authorizedGames;

    event PassportMinted(uint256 indexed tokenId, address indexed fan, string nation);
    event GameAuthorizationUpdated(address indexed game, bool allowed);
    event ScoreUpdated(
        uint256 indexed tokenId,
        address indexed fan,
        uint256 score,
        uint256 predictions,
        uint256 badges
    );

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

    function mintPassport(string calldata nation) external returns (uint256 tokenId) {
        require(tokenOf[msg.sender] == 0, "passport exists");
        require(bytes(nation).length > 0, "nation required");

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
    }

    function ownerOf(uint256 tokenId) external view returns (address) {
        require(passports[tokenId].minted, "missing token");
        return passports[tokenId].owner;
    }

    function passportOf(address fan) external view returns (Passport memory) {
        uint256 tokenId = tokenOf[fan];
        require(tokenId != 0, "no passport");
        return passports[tokenId];
    }

    function getPassport(uint256 tokenId) external view returns (Passport memory) {
        require(passports[tokenId].minted, "missing token");
        return passports[tokenId];
    }
}
