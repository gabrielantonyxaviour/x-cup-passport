// ABIs for the deployed X Cup contracts. Tuple outputs carry component names so
// viem decodes them into named objects.

export const passportAbi = [
  {
    type: "function",
    name: "name",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    type: "function",
    name: "owner",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "totalMinted",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "mintPassport",
    stateMutability: "nonpayable",
    inputs: [{ name: "nation", type: "string" }],
    outputs: [{ name: "tokenId", type: "uint256" }],
  },
  {
    type: "function",
    name: "tokenOf",
    stateMutability: "view",
    inputs: [{ type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ type: "uint256" }],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "tokenURI",
    stateMutability: "view",
    inputs: [{ type: "uint256" }],
    outputs: [{ type: "string" }],
  },
  {
    type: "function",
    name: "stageOf",
    stateMutability: "view",
    inputs: [{ type: "uint256" }],
    outputs: [{ type: "string" }],
  },
  {
    type: "function",
    name: "passportOf",
    stateMutability: "view",
    inputs: [{ name: "fan", type: "address" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "owner", type: "address" },
          { name: "nation", type: "string" },
          { name: "score", type: "uint256" },
          { name: "predictions", type: "uint256" },
          { name: "badges", type: "uint256" },
          { name: "minted", type: "bool" },
        ],
      },
    ],
  },
  {
    type: "event",
    name: "PassportMinted",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "fan", type: "address", indexed: true },
      { name: "nation", type: "string", indexed: false },
    ],
  },
  {
    type: "event",
    name: "ScoreUpdated",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "fan", type: "address", indexed: true },
      { name: "score", type: "uint256", indexed: false },
      { name: "predictions", type: "uint256", indexed: false },
      { name: "badges", type: "uint256", indexed: false },
    ],
  },
] as const;

export const resolverAbi = [
  {
    type: "function",
    name: "owner",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "nextMatchId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "resolveMatch",
    stateMutability: "nonpayable",
    inputs: [
      { name: "matchId", type: "uint256" },
      { name: "result", type: "uint8" },
      { name: "homeScore", type: "uint8" },
      { name: "awayScore", type: "uint8" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "fixtureOf",
    stateMutability: "view",
    inputs: [{ type: "uint256" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "home", type: "string" },
          { name: "away", type: "string" },
          { name: "kickoff", type: "uint64" },
          { name: "result", type: "uint8" },
          { name: "homeScore", type: "uint8" },
          { name: "awayScore", type: "uint8" },
          { name: "demoFixture", type: "bool" },
          { name: "exists", type: "bool" },
          { name: "resolved", type: "bool" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "isResolved",
    stateMutability: "view",
    inputs: [{ type: "uint256" }],
    outputs: [{ type: "bool" }],
  },
  {
    type: "event",
    name: "MatchResolved",
    inputs: [
      { name: "matchId", type: "uint256", indexed: true },
      { name: "result", type: "uint8", indexed: false },
      { name: "homeScore", type: "uint8", indexed: false },
      { name: "awayScore", type: "uint8", indexed: false },
    ],
  },
] as const;

export const predictionAbi = [
  {
    type: "function",
    name: "nextPredictionId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "submitPrediction",
    stateMutability: "nonpayable",
    inputs: [
      { name: "matchId", type: "uint256" },
      { name: "pick", type: "uint8" },
      { name: "message", type: "string" },
    ],
    outputs: [{ name: "predictionId", type: "uint256" }],
  },
  {
    type: "function",
    name: "settlePrediction",
    stateMutability: "nonpayable",
    inputs: [{ name: "predictionId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "fanPredictions",
    stateMutability: "view",
    inputs: [{ name: "fan", type: "address" }],
    outputs: [{ type: "uint256[]" }],
  },
  {
    type: "function",
    name: "predictionOf",
    stateMutability: "view",
    inputs: [{ type: "uint256" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "fan", type: "address" },
          { name: "matchId", type: "uint256" },
          { name: "pick", type: "uint8" },
          { name: "points", type: "uint256" },
          { name: "settled", type: "bool" },
          { name: "message", type: "string" },
        ],
      },
    ],
  },
  {
    type: "event",
    name: "PredictionSettled",
    inputs: [
      { name: "predictionId", type: "uint256", indexed: true },
      { name: "fan", type: "address", indexed: true },
      { name: "correct", type: "bool", indexed: false },
      { name: "points", type: "uint256", indexed: false },
    ],
  },
] as const;

export const banterAbi = [
  {
    type: "function",
    name: "nextBondId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "createBond",
    stateMutability: "nonpayable",
    inputs: [
      { name: "opponent", type: "address" },
      { name: "matchId", type: "uint256" },
      { name: "creatorPick", type: "uint8" },
      { name: "message", type: "string" },
    ],
    outputs: [{ name: "bondId", type: "uint256" }],
  },
  {
    type: "function",
    name: "acceptBond",
    stateMutability: "nonpayable",
    inputs: [
      { name: "bondId", type: "uint256" },
      { name: "opponentPick", type: "uint8" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "settleBond",
    stateMutability: "nonpayable",
    inputs: [{ name: "bondId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "bondOf",
    stateMutability: "view",
    inputs: [{ type: "uint256" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "creator", type: "address" },
          { name: "opponent", type: "address" },
          { name: "matchId", type: "uint256" },
          { name: "creatorPick", type: "uint8" },
          { name: "opponentPick", type: "uint8" },
          { name: "winner", type: "address" },
          { name: "accepted", type: "bool" },
          { name: "settled", type: "bool" },
          { name: "message", type: "string" },
        ],
      },
    ],
  },
] as const;
