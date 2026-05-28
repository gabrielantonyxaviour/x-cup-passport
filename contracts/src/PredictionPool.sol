// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IPassport {
    function tokenOf(address fan) external view returns (uint256);
    function recordPredictionResult(address fan, uint256 points, bool badgeUnlocked) external;
}

interface IResolver {
    function isResolved(uint256 matchId) external view returns (bool);
    function resultOf(uint256 matchId) external view returns (uint8);
}

contract PredictionPool {
    struct Prediction {
        address fan;
        uint256 matchId;
        uint8 pick;
        uint256 points;
        bool settled;
        string message;
    }

    IPassport public immutable passport;
    IResolver public immutable resolver;
    uint256 public nextPredictionId = 1;
    mapping(uint256 => Prediction) private predictions;
    mapping(address => uint256[]) private predictionsByFan;

    event PredictionSubmitted(
        uint256 indexed predictionId,
        address indexed fan,
        uint256 indexed matchId,
        uint8 pick,
        string message
    );
    event PredictionSettled(uint256 indexed predictionId, address indexed fan, bool correct, uint256 points);

    constructor(address passportAddress, address resolverAddress) {
        require(passportAddress != address(0) && resolverAddress != address(0), "bad dependency");
        passport = IPassport(passportAddress);
        resolver = IResolver(resolverAddress);
    }

    function submitPrediction(
        uint256 matchId,
        uint8 pick,
        string calldata message
    ) external returns (uint256 predictionId) {
        require(passport.tokenOf(msg.sender) != 0, "passport required");
        require(pick >= 1 && pick <= 3, "bad pick");
        require(!resolver.isResolved(matchId), "match resolved");

        predictionId = nextPredictionId++;
        predictions[predictionId] = Prediction({
            fan: msg.sender,
            matchId: matchId,
            pick: pick,
            points: 0,
            settled: false,
            message: message
        });
        predictionsByFan[msg.sender].push(predictionId);
        emit PredictionSubmitted(predictionId, msg.sender, matchId, pick, message);
    }

    function settlePrediction(uint256 predictionId) external {
        Prediction storage prediction = predictions[predictionId];
        require(prediction.fan != address(0), "missing prediction");
        require(!prediction.settled, "already settled");

        uint8 result = resolver.resultOf(prediction.matchId);
        bool correct = result == prediction.pick;
        uint256 points = correct ? 10 : 0; // 10 pts/correct → tournament-stage tiers in XCupPassport
        prediction.points = points;
        prediction.settled = true;
        passport.recordPredictionResult(prediction.fan, points, correct);
        emit PredictionSettled(predictionId, prediction.fan, correct, points);
    }

    function predictionOf(uint256 predictionId) external view returns (Prediction memory) {
        require(predictions[predictionId].fan != address(0), "missing prediction");
        return predictions[predictionId];
    }

    function fanPredictions(address fan) external view returns (uint256[] memory) {
        return predictionsByFan[fan];
    }
}
