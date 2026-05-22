export type AddressMap = {
  xCupPassport?: `0x${string}`;
  matchResolver?: `0x${string}`;
  predictionPool?: `0x${string}`;
  banterBond?: `0x${string}`;
};

export const xLayerTestnet = {
  id: 1952,
  name: "X Layer testnet",
  rpcUrl: "https://testrpc.xlayer.tech/terigon",
  explorer: "https://www.okx.com/web3/explorer/xlayer-test",
  nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
} as const;

export const contracts: AddressMap = {
  xCupPassport: undefined,
  matchResolver: undefined,
  predictionPool: undefined,
  banterBond: undefined,
};

export const hasDeployment = Object.values(contracts).every(Boolean);
