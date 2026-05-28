import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Wand2 } from "lucide-react";
import { useXWallet, useBalance } from "../wallet/useXWallet";
import { useTx } from "../wallet/useTx";
import {
  usePassport,
  useFixtures,
  useIsOwner,
  type Fixture,
} from "../hooks/useChainData";
import { useToast } from "../components/toast";
import { resolverAbi, predictionAbi } from "../lib/abi";
import { CONTRACTS, ORACLE_URL, FAUCET_URL } from "../config/chain";
import { Button, SectionLabel, Spinner, DemoTag, Pill } from "../components/ui";
import { kickoffLabel, PICK } from "../lib/format";

export function Matchday() {
  const { authenticated, address, login } = useXWallet();
  const { hasGas } = useBalance(address);
  const { data: passport } = usePassport(address);
  const { fixtures, loading, refetch } = useFixtures();
  const isOwner = useIsOwner(address);
  const navigate = useNavigate();

  const upcoming = fixtures.filter((f) => !f.resolved);
  const played = fixtures.filter((f) => f.resolved);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <SectionLabel>Matchday</SectionLabel>
          <h1 className="mt-3 text-4xl">Call the matches.</h1>
        </div>
        <DemoTag />
      </div>
      <p className="mt-2 max-w-2xl text-muted">
        Non-cash predictions only. Right calls bank points that evolve your
        passport. Results are admin-simulated before the real tournament kicks
        off.
      </p>

      {!authenticated && (
        <div className="card mt-6 flex items-center justify-between gap-4 p-4">
          <p className="text-sm text-muted">Connect to make predictions.</p>
          <Button onClick={login}>Connect</Button>
        </div>
      )}
      {authenticated && !passport?.hasPassport && (
        <div className="card mt-6 flex items-center justify-between gap-4 p-4">
          <p className="text-sm text-muted">
            You need a passport before you can predict.
          </p>
          <Button onClick={() => navigate("/mint")}>Mint a passport</Button>
        </div>
      )}

      {loading ? (
        <Spinner label="Loading fixtures…" />
      ) : (
        <>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {upcoming.map((f) => (
              <FixtureCard
                key={f.id}
                f={f}
                canPredict={!!passport?.hasPassport && hasGas}
                hasGas={hasGas}
                showSimulate={isOwner || !!ORACLE_URL}
                isOwner={isOwner}
                onChange={refetch}
              />
            ))}
          </div>

          {played.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl">Played</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {played.map((f) => (
                  <div
                    key={f.id}
                    className="card flex items-center justify-between p-4"
                  >
                    <div>
                      <p className="font-medium">
                        {f.home}{" "}
                        <span className="tabular text-muted">
                          {f.homeScore}–{f.awayScore}
                        </span>{" "}
                        {f.away}
                      </p>
                      <p className="text-xs text-muted">
                        {kickoffLabel(f.kickoff)}
                      </p>
                    </div>
                    <Pill className="bg-surface-2 text-muted">
                      <CheckCircle2 size={13} className="text-accent" />{" "}
                      Resolved
                    </Pill>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!hasGas && authenticated && (
            <p className="mt-6 text-xs text-muted">
              Low on gas?{" "}
              <a
                href={FAUCET_URL}
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline"
              >
                Get testnet OKB
              </a>
              .
            </p>
          )}
        </>
      )}
    </div>
  );
}

function FixtureCard({
  f,
  canPredict,
  hasGas,
  showSimulate,
  isOwner,
  onChange,
}: {
  f: Fixture;
  canPredict: boolean;
  hasGas: boolean;
  showSimulate: boolean;
  isOwner: boolean;
  onChange: () => void;
}) {
  const tx = useTx();
  const toast = useToast();
  const [pick, setPick] = useState<number>(0);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const options = [
    { v: PICK.HOME, label: f.home },
    { v: PICK.DRAW, label: "Draw" },
    { v: PICK.AWAY, label: f.away },
  ];

  const submit = async () => {
    if (!pick) return;
    setBusy(true);
    const hash = await tx({
      address: CONTRACTS.pool,
      abi: predictionAbi,
      functionName: "submitPrediction",
      args: [BigInt(f.id), pick, msg],
      pending: "Submitting your prediction…",
      success: "Prediction locked in.",
    });
    setBusy(false);
    if (hash) {
      setMsg("");
      setPick(0);
    }
  };

  const simulate = async () => {
    setBusy(true);
    try {
      if (isOwner) {
        const result = (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3;
        const hs = result === 1 ? 2 : result === 2 ? 1 : 0;
        const as = result === 3 ? 2 : result === 2 ? 1 : 0;
        const hash = await tx({
          address: CONTRACTS.resolver,
          abi: resolverAbi,
          functionName: "resolveMatch",
          args: [BigInt(f.id), result, hs, as],
          pending: `Simulating ${f.home} vs ${f.away}…`,
          success: "Match resolved. Settle your prediction to score.",
        });
        if (hash) onChange();
      } else if (ORACLE_URL) {
        const id = toast.push({
          kind: "pending",
          title: `Simulating ${f.home} vs ${f.away}…`,
        });
        const res = await fetch(`${ORACLE_URL}/resolve/${f.id}`, {
          method: "POST",
        });
        if (!res.ok) throw new Error("Oracle unavailable");
        toast.update(id, {
          kind: "success",
          title: "Match resolved by the oracle.",
        });
        onChange();
      }
    } catch {
      toast.push({
        kind: "error",
        title: "Could not simulate",
        detail: "Try again in a moment.",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="font-display text-lg">
          {f.home} <span className="text-muted">vs</span> {f.away}
        </p>
        <span className="text-xs text-muted">{kickoffLabel(f.kickoff)}</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {options.map((o) => (
          <button
            key={o.v}
            onClick={() => setPick(o.v)}
            disabled={!canPredict}
            className={`truncate rounded-lg border px-2 py-2.5 text-sm transition disabled:opacity-50 ${
              pick === o.v
                ? "border-accent bg-accent/10 text-text"
                : "border-border bg-surface-2/40 text-muted hover:text-text"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value.slice(0, 80))}
        disabled={!canPredict}
        placeholder="Add a bit of banter (optional)"
        className="mt-3 w-full rounded-lg border border-border bg-surface-2/40 px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-accent/50 disabled:opacity-50"
      />

      <div className="mt-3 flex items-center gap-2">
        <Button
          onClick={submit}
          loading={busy}
          disabled={!pick || !canPredict}
          className="h-10 flex-1"
        >
          {!hasGas ? "Insufficient gas" : "Submit prediction"}
        </Button>
        {showSimulate && (
          <Button
            onClick={simulate}
            variant="outline"
            loading={busy}
            className="h-10"
          >
            <Wand2 size={15} /> Simulate
          </Button>
        )}
      </div>
    </div>
  );
}
