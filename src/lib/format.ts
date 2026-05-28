import { formatEther } from "viem";

export const shortAddr = (a?: string) =>
  a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "";

export const fmtOKB = (wei?: bigint, dp = 4) =>
  wei === undefined ? "—" : Number(formatEther(wei)).toFixed(dp);

export const kickoffLabel = (kickoffSec: bigint | number) => {
  const d = new Date(Number(kickoffSec) * 1000);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

/** pick / result encoding: 1 = home win, 2 = draw, 3 = away win */
export const PICK = { HOME: 1, DRAW: 2, AWAY: 3 } as const;
export const pickLabel = (pick: number, home: string, away: string) =>
  pick === 1
    ? `${home} win`
    : pick === 2
      ? "Draw"
      : pick === 3
        ? `${away} win`
        : "—";

export const STAGES = [
  "Group Stage",
  "Round of 16",
  "Quarterfinal",
  "Semifinal",
  "Champion",
] as const;
export type Stage = (typeof STAGES)[number];

/** Mirror of the on-chain tier thresholds in XCupPassport._stageInfo. */
export function stageFromScore(score: number): Stage {
  if (score >= 200) return "Champion";
  if (score >= 120) return "Semifinal";
  if (score >= 70) return "Quarterfinal";
  if (score >= 30) return "Round of 16";
  return "Group Stage";
}

export function stageProgress(score: number): {
  pct: number;
  toNext: number | null;
} {
  const bands: [number, number | null][] = [
    [0, 30],
    [30, 70],
    [70, 120],
    [120, 200],
    [200, null],
  ];
  for (const [lo, hi] of bands) {
    if (hi === null) return { pct: 100, toNext: null };
    if (score < hi)
      return {
        pct: Math.round(((score - lo) / (hi - lo)) * 100),
        toNext: hi - score,
      };
  }
  return { pct: 100, toNext: null };
}

export const stageAccent: Record<Stage, string> = {
  "Group Stage": "#0ea5e9",
  "Round of 16": "#10b981",
  Quarterfinal: "#f59e0b",
  Semifinal: "#a855f7",
  Champion: "#fbbf24",
};
