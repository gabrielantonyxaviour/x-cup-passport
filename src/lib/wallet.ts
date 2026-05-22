import { createWalletClient, custom, type Hex } from "viem";
import { xLayerTestnet } from "../config/contracts";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

export const xLayerChain = {
  id: xLayerTestnet.id,
  name: xLayerTestnet.name,
  nativeCurrency: xLayerTestnet.nativeCurrency,
  rpcUrls: { default: { http: [xLayerTestnet.rpcUrl] } },
  blockExplorers: { default: { name: "OKX Explorer", url: xLayerTestnet.explorer } },
} as const;

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("No injected wallet found. Use OKX Wallet or another EVM wallet.");
  }

  const [account] = (await window.ethereum.request({
    method: "eth_requestAccounts",
  })) as Hex[];

  const client = createWalletClient({
    account,
    chain: xLayerChain,
    transport: custom(window.ethereum),
  });

  return { account, client };
}

export const explorerTx = (hash?: string) =>
  hash ? `${xLayerTestnet.explorer}/tx/${hash}` : undefined;
