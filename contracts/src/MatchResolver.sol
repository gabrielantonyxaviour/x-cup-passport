// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MatchResolver {
    struct Fixture {
        string home;
        string away;
        uint64 kickoff;
        uint8 result;
        uint8 homeScore;
        uint8 awayScore;
        bool demoFixture;
        bool exists;
        bool resolved;
    }

    address public owner;
    uint256 public nextMatchId = 1;
    mapping(uint256 => Fixture) private fixtures;

    event MatchCreated(
        uint256 indexed matchId,
        string home,
        string away,
        uint64 kickoff,
        bool demoFixture
    );
    event MatchResolved(uint256 indexed matchId, uint8 result, uint8 homeScore, uint8 awayScore);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createMatch(
        string calldata home,
        string calldata away,
        uint64 kickoff,
        bool demoFixture
    ) external onlyOwner returns (uint256 matchId) {
        require(bytes(home).length > 0 && bytes(away).length > 0, "teams required");

        matchId = nextMatchId++;
        fixtures[matchId] = Fixture({
            home: home,
            away: away,
            kickoff: kickoff,
            result: 0,
            homeScore: 0,
            awayScore: 0,
            demoFixture: demoFixture,
            exists: true,
            resolved: false
        });
        emit MatchCreated(matchId, home, away, kickoff, demoFixture);
    }

    function resolveMatch(
        uint256 matchId,
        uint8 result,
        uint8 homeScore,
        uint8 awayScore
    ) external onlyOwner {
        Fixture storage fixture = fixtures[matchId];
        require(fixture.exists, "missing match");
        require(!fixture.resolved, "already resolved");
        require(result >= 1 && result <= 3, "bad result");

        fixture.result = result;
        fixture.homeScore = homeScore;
        fixture.awayScore = awayScore;
        fixture.resolved = true;
        emit MatchResolved(matchId, result, homeScore, awayScore);
    }

    function fixtureOf(uint256 matchId) external view returns (Fixture memory) {
        require(fixtures[matchId].exists, "missing match");
        return fixtures[matchId];
    }

    function isResolved(uint256 matchId) external view returns (bool) {
        return fixtures[matchId].resolved;
    }

    function resultOf(uint256 matchId) external view returns (uint8) {
        require(fixtures[matchId].resolved, "not resolved");
        return fixtures[matchId].result;
    }
}
