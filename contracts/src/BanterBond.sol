// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IBanterResolver {
    function resultOf(uint256 matchId) external view returns (uint8);
}

contract BanterBond {
    struct Bond {
        address creator;
        address opponent;
        uint256 matchId;
        uint8 creatorPick;
        uint8 opponentPick;
        address winner;
        bool accepted;
        bool settled;
        string message;
    }

    IBanterResolver public immutable resolver;
    uint256 public nextBondId = 1;
    mapping(uint256 => Bond) private bonds;

    event BondCreated(
        uint256 indexed bondId,
        address indexed creator,
        address indexed opponent,
        uint256 matchId,
        uint8 creatorPick,
        string message
    );
    event BondAccepted(uint256 indexed bondId, address indexed opponent, uint8 opponentPick);
    event BondSettled(uint256 indexed bondId, address indexed winner, uint8 result);

    constructor(address resolverAddress) {
        require(resolverAddress != address(0), "bad resolver");
        resolver = IBanterResolver(resolverAddress);
    }

    function createBond(
        address opponent,
        uint256 matchId,
        uint8 creatorPick,
        string calldata message
    ) external returns (uint256 bondId) {
        require(opponent != address(0) && opponent != msg.sender, "bad opponent");
        require(creatorPick >= 1 && creatorPick <= 3, "bad pick");

        bondId = nextBondId++;
        bonds[bondId] = Bond({
            creator: msg.sender,
            opponent: opponent,
            matchId: matchId,
            creatorPick: creatorPick,
            opponentPick: 0,
            winner: address(0),
            accepted: false,
            settled: false,
            message: message
        });
        emit BondCreated(bondId, msg.sender, opponent, matchId, creatorPick, message);
    }

    function acceptBond(uint256 bondId, uint8 opponentPick) external {
        Bond storage bond = bonds[bondId];
        require(bond.creator != address(0), "missing bond");
        require(msg.sender == bond.opponent, "not opponent");
        require(!bond.accepted, "accepted");
        require(opponentPick >= 1 && opponentPick <= 3, "bad pick");

        bond.opponentPick = opponentPick;
        bond.accepted = true;
        emit BondAccepted(bondId, msg.sender, opponentPick);
    }

    function settleBond(uint256 bondId) external {
        Bond storage bond = bonds[bondId];
        require(bond.accepted, "not accepted");
        require(!bond.settled, "settled");

        uint8 result = resolver.resultOf(bond.matchId);
        if (bond.creatorPick == result && bond.opponentPick != result) {
            bond.winner = bond.creator;
        } else if (bond.opponentPick == result && bond.creatorPick != result) {
            bond.winner = bond.opponent;
        }
        bond.settled = true;
        emit BondSettled(bondId, bond.winner, result);
    }

    function bondOf(uint256 bondId) external view returns (Bond memory) {
        require(bonds[bondId].creator != address(0), "missing bond");
        return bonds[bondId];
    }
}
