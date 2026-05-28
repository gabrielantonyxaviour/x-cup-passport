import { useEffect, useMemo, useState } from "react";
import type { Address } from "viem";
import { useXWallet } from "../wallet/useXWallet";
import { publicClient } from "../lib/viem";
import { passportAbi } from "../lib/abi";
import { CONTRACTS, INDEXER_URL } from "../config/chain";
import { SectionLabel, Spinner, EmptyState, Pill } from "../components/ui";
import { shortAddr, stageFromScore, stageAccent } from "../lib/format";
import { nationByName } from "../data/nations";

type Row = {
  owner: Address;
  nation: string;
  score: number;
  predictions: number;
  badges: number;
};

function useLeaderboard() {
  const [rows, setRows] = useState<Row[] | null>(null);
  useEffect(() => {
    (async () => {
      // Prefer the Cloudflare indexer when available; fall back to reading the chain directly.
      if (INDEXER_URL) {
        try {
          const res = await fetch(`${INDEXER_URL}/leaderboard`);
          if (res.ok) {
            setRows((await res.json()) as Row[]);
            return;
          }
        } catch {
          /* fall through to on-chain read */
        }
      }
      try {
        const total = (await publicClient.readContract({
          address: CONTRACTS.passport,
          abi: passportAbi,
          functionName: "totalMinted",
        })) as bigint;
        const ids = Array.from({ length: Number(total) }, (_, i) => i + 1);
        const list = await Promise.all(
          ids.map(async (id) => {
            const owner = (await publicClient.readContract({
              address: CONTRACTS.passport,
              abi: passportAbi,
              functionName: "ownerOf",
              args: [BigInt(id)],
            })) as Address;
            const p = (await publicClient.readContract({
              address: CONTRACTS.passport,
              abi: passportAbi,
              functionName: "passportOf",
              args: [owner],
            })) as {
              nation: string;
              score: bigint;
              predictions: bigint;
              badges: bigint;
            };
            return {
              owner,
              nation: p.nation,
              score: Number(p.score),
              predictions: Number(p.predictions),
              badges: Number(p.badges),
            };
          }),
        );
        setRows(list.sort((a, b) => b.score - a.score));
      } catch {
        setRows([]);
      }
    })();
  }, []);
  return rows;
}

export function Leaderboard() {
  const rows = useLeaderboard();
  const { address } = useXWallet();
  const [tab, setTab] = useState<"fans" | "nations">("fans");

  const nations = useMemo(() => {
    if (!rows) return [];
    const map = new Map<
      string,
      { nation: string; score: number; fans: number }
    >();
    for (const r of rows) {
      const cur = map.get(r.nation) ?? { nation: r.nation, score: 0, fans: 0 };
      cur.score += r.score;
      cur.fans += 1;
      map.set(r.nation, cur);
    }
    return [...map.values()].sort((a, b) => b.score - a.score);
  }, [rows]);

  if (!rows) return <Spinner label="Reading the table from chain…" />;

  return (
    <div>
      <SectionLabel>Leaderboard</SectionLabel>
      <h1 className="mt-3 text-4xl">Who's topping the table.</h1>

      <div className="mt-6 inline-flex rounded-xl border border-border p-1">
        {(["fans", "nations"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-1.5 text-sm capitalize transition ${
              tab === t
                ? "bg-surface-2 text-text"
                : "text-muted hover:text-text"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No fans on the board yet"
            body="Be the first — mint a passport and bank some points."
          />
        </div>
      ) : tab === "fans" ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          {rows.map((r, i) => {
            const stage = stageFromScore(r.score);
            const isMe =
              address && r.owner.toLowerCase() === address.toLowerCase();
            return (
              <div
                key={r.owner}
                className={`flex items-center gap-3 border-b border-border px-3 py-3 last:border-0 sm:gap-4 sm:px-4 ${
                  isMe ? "bg-accent/5" : "bg-surface"
                }`}
              >
                <span className="tabular w-5 shrink-0 text-center text-muted sm:w-8">
                  {i + 1}
                </span>
                <img
                  src={`https://api.dicebear.com/9.x/shapes/svg?seed=${r.owner}`}
                  alt=""
                  className="h-8 w-8 shrink-0 rounded-full"
                />
                <div className="min-w-0 flex-1">
                  <p className="tabular truncate text-sm font-medium">
                    {shortAddr(r.owner)}
                    {isMe && <span className="ml-1 text-accent">(you)</span>}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {nationByName(r.nation)?.flag} {r.nation} · {r.predictions}{" "}
                    predictions
                    <span
                      className="sm:hidden"
                      style={{ color: stageAccent[stage] }}
                    >
                      {" · "}
                      {stage}
                    </span>
                  </p>
                </div>
                <span className="hidden shrink-0 sm:inline-flex">
                  <Pill>
                    <span style={{ color: stageAccent[stage] }}>{stage}</span>
                  </Pill>
                </span>
                <span className="tabular w-12 shrink-0 text-right text-lg font-medium sm:w-16">
                  {r.score}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {nations.map((n, i) => (
            <div key={n.nation} className="card flex items-center gap-4 p-4">
              <span className="tabular w-6 text-muted">{i + 1}</span>
              <span className="text-2xl">{nationByName(n.nation)?.flag}</span>
              <div className="flex-1">
                <p className="font-medium">{n.nation}</p>
                <p className="text-xs text-muted">
                  {n.fans} fan{n.fans === 1 ? "" : "s"}
                </p>
              </div>
              <span className="tabular text-lg font-medium">{n.score}</span>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-muted">
        {INDEXER_URL
          ? "Indexed from X Layer events."
          : "Read live from X Layer contracts."}
      </p>
    </div>
  );
}
