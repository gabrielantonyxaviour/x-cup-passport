import { defineChain } from "viem";

/** X Layer testnet (Terigon), chain id 1952. */
export const xLayerTestnet = defineChain({
  id: 1952,
  name: "X Layer Testnet",
  nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
  rpcUrls: { default: { http: ["https://testrpc.xlayer.tech/terigon"] } },
  blockExplorers: {
    default: {
      name: "OKX Explorer",
      url: "https://www.okx.com/web3/explorer/xlayer-test",
    },
  },
  testnet: true,
});

/** Live deployment on X Layer testnet (see DEPLOYMENTS.md). */
export const CONTRACTS = {
  passport: "0xf8a679f1aeaa2482859175861a2c583ca1eb97f8",
  resolver: "0x64b3787c041393c083b94e55becf2665fc520dee",
  pool: "0x087521f9ff3ecb4f3503d152e4d7a6dd68a0cc1e",
  bond: "0x24b52bf60e99f4801446e2a12666041efeb2a74f",
} as const satisfies Record<string, `0x${string}`>;

export const EXPLORER = "https://www.okx.com/web3/explorer/xlayer-test";
export const explorerTx = (hash: string) => `${EXPLORER}/tx/${hash}`;
export const explorerAddress = (addr: string) => `${EXPLORER}/address/${addr}`;
export const FAUCET_URL = "https://www.okx.com/xlayer/faucet";

/** Minimum native OKB to consider gas affordable (flat floor — gas is cheap on X Layer). */
export const GAS_FLOOR_WEI = 100_000_000_000_000n; // 0.0001 OKB

const env = import.meta.env as Record<string, string | undefined>;
// Dedicated X Cup Passport Privy app (public client identifiers — safe to ship).
export const PRIVY_APP_ID =
  env.NEXT_PUBLIC_PRIVY_APP_ID ?? "cmjzw9suo00p1l80c68gipkmc";
export const PRIVY_CLIENT_ID =
  env.NEXT_PUBLIC_PRIVY_CLIENT_ID ??
  "client-WY6UJU2Zie1XFu84CKnKgxA2GLctxN1yLXgnNnmcAuoua";
/** Cloudflare match-oracle Worker (owner-keyed resolveMatch) — lets any fan self-serve the loop. */
export const ORACLE_URL =
  env.NEXT_PUBLIC_ORACLE_URL ?? "https://xcup-oracle.gabrielaxy.workers.dev";
/** Cloudflare indexer Worker (leaderboard + stats from chain events). Empty until deployed. */
export const INDEXER_URL = env.NEXT_PUBLIC_INDEXER_URL ?? "";
/** Cloudflare OG share-card Worker. Empty until deployed. */
export const OG_URL = env.NEXT_PUBLIC_OG_URL ?? "";
