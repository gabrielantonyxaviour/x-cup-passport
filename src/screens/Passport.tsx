import { useNavigate } from "react-router-dom";
import { Share2, ExternalLink, Sparkles } from "lucide-react";
import { useXWallet } from "../wallet/useXWallet";
import { useTx } from "../wallet/useTx";
import {
  usePassport,
  useFixtures,
  useFanPredictions,
} from "../hooks/useChainData";
import { predictionAbi } from "../lib/abi";
import { CONTRACTS, explorerAddress, OG_URL } from "../config/chain";
import { PassportCard } from "../components/PassportCard";
import { Button, EmptyState, Spinner, Pill } from "../components/ui";
import {
  stageFromScore,
  stageProgress,
  stageAccent,
  pickLabel,
} from "../lib/format";

export function Passport() {
  const { authenticated, address, login } = useXWallet();
  const { data, loading, refetch } = usePassport(address);
  const { fixtures } = useFixtures();
  const { items, refetch: refetchPreds } = useFanPredictions(address);
  const tx = useTx();
  const navigate = useNavigate();

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md py-10 text-center">
        <h1 className="text-4xl">My passport</h1>
        <p className="mt-3 text-muted">
          Connect to view your evolving World Cup passport.
        </p>
        <Button className="mt-8" onClick={login}>
          Connect
        </Button>
      </div>
    );
  }

  if (loading && !data) return <Spinner label="Loading your passport…" />;

  if (!data?.hasPassport) {
    return (
      <EmptyState
        title="No passport yet"
        body="Mint your soulbound World Cup passport to start predicting and climbing the tournament stages."
        action={
          <Button onClick={() => navigate("/mint")}>Mint a passport</Button>
        }
      />
    );
  }

  const stage = stageFromScore(data.score);
  const { pct, toNext } = stageProgress(data.score);
  const accent = stageAccent[stage];

  const share = () => {
    const text = `I'm at ${stage} with my ${data.nation} @XLayerOfficial X Cup Passport — score ${data.score}. Mint yours and climb to Champion. #XCup #XLayer`;
    const url = OG_URL ? `${OG_URL}/${data.tokenId}` : window.location.origin;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener",
    );
  };

  const settle = async (id: number) => {
    const hash = await tx({
      address: CONTRACTS.pool,
      abi: predictionAbi,
      functionName: "settlePrediction",
      args: [BigInt(id)],
      pending: "Settling your prediction…",
      success: "Settled — your passport evolved.",
    });
    if (hash) {
      await Promise.all([refetch(), refetchPreds()]);
    }
  };

  const fixtureFor = (matchId: number) =>
    fixtures.find((f) => f.id === matchId);
  const settleable = items.filter(
    (p) => !p.settled && fixtureFor(p.matchId)?.resolved,
  );

  return (
    <div>
      {/* cover */}
      <div
        className="relative -mx-4 -mt-8 h-44 overflow-hidden sm:-mx-6 sm:h-52"
        style={{
          background: `linear-gradient(120deg, ${accent}33, transparent 60%)`,
        }}
      >
        <div className="pitch-grid absolute inset-0 opacity-60" />
      </div>

      <div className="-mt-28 grid gap-8 md:grid-cols-[300px_1fr]">
        <div className="floodlight">
          <PassportCard tokenURI={data.tokenURI} glow={false} />
        </div>

        <div className="md:pt-28">
          <div className="flex flex-wrap items-center gap-3">
            <Pill className="text-sm">
              <span style={{ color: accent }}>●</span>
              <span className="font-medium" style={{ color: accent }}>
                {stage}
              </span>
            </Pill>
            <span className="text-muted">{data.nation}</span>
          </div>

          <div className="mt-4 flex items-end gap-3">
            <span className="tabular text-6xl font-medium leading-none">
              {data.score}
            </span>
            <span className="mb-1 text-sm uppercase tracking-wider text-muted">
              total score
            </span>
          </div>

          {/* progress */}
          <div className="mt-5 max-w-md">
            <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, background: accent }}
              />
            </div>
            <p className="mt-1.5 text-xs text-muted">
              {toNext === null
                ? "Champion — max stage reached"
                : `${toNext} points to the next stage`}
            </p>
          </div>

          <div className="mt-5 flex gap-6">
            <Metric label="Predictions" value={data.predictions} />
            <Metric label="Correct calls" value={data.badges} />
            <Metric label="Token" value={`#${data.tokenId}`} mono />
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button onClick={share}>
              <Share2 size={16} /> Share my passport
            </Button>
            <a
              href={explorerAddress(CONTRACTS.passport)}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="outline">
                View on explorer <ExternalLink size={15} />
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* settleable predictions nudge */}
      {settleable.length > 0 && (
        <div className="mt-12">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-accent" />
            <h2 className="text-xl">Ready to settle</h2>
          </div>
          <div className="flex flex-col gap-2">
            {settleable.map((p) => {
              const f = fixtureFor(p.matchId);
              return (
                <div
                  key={p.id}
                  className="card flex items-center justify-between gap-4 p-4"
                >
                  <div>
                    <p className="font-medium">
                      {f ? `${f.home} vs ${f.away}` : `Match #${p.matchId}`}
                    </p>
                    <p className="text-sm text-muted">
                      Your call:{" "}
                      {f ? pickLabel(p.pick, f.home, f.away) : p.pick}
                    </p>
                  </div>
                  <Button onClick={() => settle(p.id)}>Settle</Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* prediction history */}
      <div className="mt-12">
        <h2 className="text-xl">Your predictions</h2>
        {items.length === 0 ? (
          <p className="mt-3 text-muted">
            No predictions yet.{" "}
            <button
              onClick={() => navigate("/matchday")}
              className="text-accent hover:underline"
            >
              Head to matchday
            </button>{" "}
            to make your first call.
          </p>
        ) : (
          <div className="mt-3 flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border">
            {items.map((p) => {
              const f = fixtureFor(p.matchId);
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-4 bg-surface p-4"
                >
                  <div>
                    <p className="font-medium">
                      {f ? `${f.home} vs ${f.away}` : `Match #${p.matchId}`}
                    </p>
                    {p.message && (
                      <p className="mt-0.5 text-sm text-muted">“{p.message}”</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted">
                      {f ? pickLabel(p.pick, f.home, f.away) : `Pick ${p.pick}`}
                    </p>
                    <p
                      className={`tabular text-sm ${p.settled ? (p.points > 0 ? "text-accent" : "text-muted") : "text-gold"}`}
                    >
                      {p.settled
                        ? p.points > 0
                          ? `+${p.points}`
                          : "no points"
                        : "pending"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  mono,
}: {
  label: string;
  value: number | string;
  mono?: boolean;
}) {
  return (
    <div>
      <div className={`text-2xl font-medium ${mono ? "tabular" : ""}`}>
        {value}
      </div>
      <div className="mt-0.5 text-xs uppercase tracking-wider text-muted">
        {label}
      </div>
    </div>
  );
}
