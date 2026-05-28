/**
 * X Cup Match Oracle — Cloudflare Worker.
 *
 * The only piece that can't be web3: a trusted keyholder that resolves
 * (simulates) a World Cup fixture so any fan can self-serve the
 * predict → resolve → settle → evolve loop in the demo. It signs an
 * owner-only `resolveMatch` call on X Layer with the deployer key
 * (held as a Worker secret), then the user settles their own prediction.
 *
 * Endpoints:
 *   GET  /health            → { ok: true }
 *   POST /resolve/:matchId  → { hash, result, homeScore, awayScore }
 */
import {
  createPublicClient,
  createWalletClient,
  http,
  defineChain,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

const xLayer = defineChain({
  id: 1952,
  name: "X Layer Testnet",
  nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
  rpcUrls: { default: { http: ["https://testrpc.xlayer.tech/terigon"] } },
});

const RESOLVER = "0x64b3787c041393c083b94e55becf2665fc520dee" as const;

const resolverAbi = [
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
    name: "isResolved",
    stateMutability: "view",
    inputs: [{ type: "uint256" }],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "nextMatchId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
] as const;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });

// A plausible simulated scoreline for a given outcome (1 home, 2 draw, 3 away).
function scoreline(result: number): [number, number] {
  const rnd = (n: number) =>
    Math.floor((crypto.getRandomValues(new Uint8Array(1))[0] / 256) * n);
  if (result === 1) return [1 + rnd(3), rnd(2)];
  if (result === 3) return [rnd(2), 1 + rnd(3)];
  const g = rnd(3);
  return [g, g];
}

export default {
  async fetch(
    req: Request,
    env: { DEPLOYER_PRIVATE_KEY: string },
  ): Promise<Response> {
    if (req.method === "OPTIONS")
      return new Response(null, { status: 204, headers: cors });
    const url = new URL(req.url);

    if (req.method === "GET" && url.pathname === "/health")
      return json({ ok: true, oracle: "xcup", chain: 1952 });

    if (req.method === "GET" && url.pathname === "/rpc") {
      try {
        const r = await fetch("https://testrpc.xlayer.tech/terigon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "eth_chainId",
            params: [],
          }),
        });
        return json({ status: r.status, body: await r.text() });
      } catch (e) {
        return json({ rpcError: (e as Error).message }, 500);
      }
    }

    const m = url.pathname.match(/^\/resolve\/(\d+)$/);
    if (req.method === "POST" && m) {
      const matchId = BigInt(m[1]);
      try {
        const account = privateKeyToAccount(
          (env.DEPLOYER_PRIVATE_KEY.startsWith("0x")
            ? env.DEPLOYER_PRIVATE_KEY
            : `0x${env.DEPLOYER_PRIVATE_KEY}`) as `0x${string}`,
        );
        const wallet = createWalletClient({
          account,
          chain: xLayer,
          transport: http(),
        });

        const result = (Math.floor(
          (crypto.getRandomValues(new Uint8Array(1))[0] / 256) * 3,
        ) + 1) as 1 | 2 | 3;
        const [hs, as] = scoreline(result);

        // Single round-trip path: encode + sign + send. The contract's own
        // onlyOwner / "already resolved" / "bad result" requires guard edge cases
        // (a revert here is surfaced as a JSON error, not a worker crash).
        const hash = await wallet.writeContract({
          address: RESOLVER,
          abi: resolverAbi,
          functionName: "resolveMatch",
          args: [matchId, result, hs, as],
        });
        return json({ hash, result, homeScore: hs, awayScore: as });
      } catch (e) {
        return json(
          { error: (e as Error).message?.slice(0, 200) ?? "resolve failed" },
          500,
        );
      }
    }

    return json({ error: "not found" }, 404);
  },
};
