export const passportAbi = [
  {
    type: "function",
    name: "mintPassport",
    stateMutability: "nonpayable",
    inputs: [{ name: "nation", type: "string" }],
    outputs: [{ name: "tokenId", type: "uint256" }],
  },
] as const;

export const resolverAbi = [
  {
    type: "function",
    name: "createMatch",
    stateMutability: "nonpayable",
    inputs: [
      { name: "home", type: "string" },
      { name: "away", type: "string" },
      { name: "kickoff", type: "uint64" },
      { name: "demoFixture", type: "bool" },
    ],
    outputs: [{ name: "matchId", type: "uint256" }],
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
] as const;

export const predictionAbi = [
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
] as const;

export const banterAbi = [
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
] as const;
