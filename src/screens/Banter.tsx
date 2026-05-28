import { useCallback, useEffect, useState } from "react";
import type { Address } from "viem";
import { isAddress } from "viem";
import { Flame, Trophy, Swords } from "lucide-react";
import { useXWallet, useBalance } from "../wallet/useXWallet";
import { useTx } from "../wallet/useTx";
import { useFixtures } from "../hooks/useChainData";
import { publicClient } from "../lib/viem";
import { banterAbi } from "../lib/abi";
import { CONTRACTS } from "../config/chain";
import { Button, SectionLabel, Pill, EmptyState } from "../components/ui";
import { shortAddr, pickLabel, PICK } from "../lib/format";

type Bond = {
  id: number;
  creator: Address;
  opponent: Address;
  matchId: number;
  creatorPick: number;
  opponentPick: number;
  winner: Address;
  accepted: boolean;
  settled: boolean;
  message: string;
};
const ZERO = "0x0000000000000000000000000000000000000000";

function useMyBonds(address?: Address) {
  const [bonds, setBonds] = useState<Bond[]>([]);
  const refetch = useCallback(async () => {
    if (!address) return setBonds([]);
    try {
      const next = (await publicClient.readContract({
        address: CONTRACTS.bond,
        abi: banterAbi,
        functionName: "nextBondId",
      })) as bigint;
      const ids = Array.from(
        { length: Math.max(0, Number(next) - 1) },
        (_, i) => i + 1,
      );
      const all = await Promise.all(
        ids.map(async (id) => {
          const b = (await publicClient.readContract({
            address: CONTRACTS.bond,
            abi: banterAbi,
            functionName: "bondOf",
            args: [BigInt(id)],
          })) as {
            creator: Address;
            opponent: Address;
            matchId: bigint;
            creatorPick: number;
            opponentPick: number;
            winner: Address;
            accepted: boolean;
            settled: boolean;
            message: string;
          };
          return {
            id,
            creator: b.creator,
            opponent: b.opponent,
            matchId: Number(b.matchId),
            creatorPick: b.creatorPick,
            opponentPick: b.opponentPick,
            winner: b.winner,
            accepted: b.accepted,
            settled: b.settled,
            message: b.message,
          } satisfies Bond;
        }),
      );
      const mine = all.filter(
        (b) =>
          b.creator.toLowerCase() === address.toLowerCase() ||
          b.opponent.toLowerCase() === address.toLowerCase(),
      );
      setBonds(mine.reverse());
    } catch {
      setBonds([]);
    }
  }, [address]);
  useEffect(() => {
    void refetch();
  }, [refetch]);
  return { bonds, refetch };
}

export function Banter() {
  const { authenticated, address, login } = useXWallet();
  const { hasGas } = useBalance(address);
  const { fixtures } = useFixtures();
  const { bonds, refetch } = useMyBonds(address);
  const tx = useTx();

  const [opp, setOpp] = useState("");
  const [matchId, setMatchId] = useState<number>(0);
  const [pick, setPick] = useState<number>(0);
  const [msg, setMsg] = useState("");

  const upcoming = fixtures.filter((f) => !f.resolved);
  const fixtureFor = (id: number) => fixtures.find((f) => f.id === id);
  const oppValid = isAddress(opp);

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md py-10 text-center">
        <h1 className="text-4xl">Banter duels</h1>
        <p className="mt-3 text-muted">
          Connect to challenge a rival head-to-head.
        </p>
        <Button className="mt-8" onClick={login}>
          Connect
        </Button>
      </div>
    );
  }

  const create = async () => {
    if (!oppValid || !matchId || !pick) return;
    const hash = await tx({
      address: CONTRACTS.bond,
      abi: banterAbi,
      functionName: "createBond",
      args: [opp as Address, BigInt(matchId), pick, msg],
      pending: "Sending your challenge…",
      success: "Challenge sent. Wait for them to accept.",
    });
    if (hash) {
      setOpp("");
      setMatchId(0);
      setPick(0);
      setMsg("");
      refetch();
    }
  };

  const accept = async (b: Bond, opponentPick: number) => {
    const hash = await tx({
      address: CONTRACTS.bond,
      abi: banterAbi,
      functionName: "acceptBond",
      args: [BigInt(b.id), opponentPick],
      pending: "Accepting the challenge…",
      success: "Challenge accepted. May the best fan win.",
    });
    if (hash) refetch();
  };

  const settle = async (b: Bond) => {
    const hash = await tx({
      address: CONTRACTS.bond,
      abi: banterAbi,
      functionName: "settleBond",
      args: [BigInt(b.id)],
      pending: "Settling the duel…",
      success: "Duel settled. Receipt minted.",
    });
    if (hash) refetch();
  };

  return (
    <div>
      <SectionLabel>Banter</SectionLabel>
      <h1 className="mt-3 text-4xl">Settle it head-to-head.</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Challenge a rival to opposing calls on a fixture. When it resolves, the
        winner takes the receipt. Non-cash — pure bragging rights, on the
        record.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* create challenge */}
        <div className="card h-fit p-5">
          <div className="mb-4 flex items-center gap-2">
            <Swords size={18} className="text-accent" />
            <h2 className="text-lg">New challenge</h2>
          </div>
          <label className="text-xs text-muted">Rival wallet address</label>
          <input
            value={opp}
            onChange={(e) => setOpp(e.target.value.trim())}
            placeholder="0x… your rival's address"
            className="mt-1 w-full rounded-lg border border-border bg-surface-2/40 px-3 py-2 text-sm outline-none focus:border-accent/50"
          />
          {opp && !oppValid && (
            <p className="mt-1 text-xs text-danger">Not a valid address</p>
          )}

          <label className="mt-4 block text-xs text-muted">Fixture</label>
          <select
            value={matchId}
            onChange={(e) => setMatchId(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-border bg-surface-2/40 px-3 py-2 text-sm outline-none focus:border-accent/50"
          >
            <option value={0}>Select a fixture…</option>
            {upcoming.map((f) => (
              <option key={f.id} value={f.id}>
                {f.home} vs {f.away}
              </option>
            ))}
          </select>

          {matchId > 0 && (
            <>
              <label className="mt-4 block text-xs text-muted">Your call</label>
              <div className="mt-1 grid grid-cols-3 gap-2">
                {[
                  { v: PICK.HOME, label: fixtureFor(matchId)?.home ?? "Home" },
                  { v: PICK.DRAW, label: "Draw" },
                  { v: PICK.AWAY, label: fixtureFor(matchId)?.away ?? "Away" },
                ].map((o) => (
                  <button
                    key={o.v}
                    onClick={() => setPick(o.v)}
                    className={`truncate rounded-lg border px-2 py-2 text-sm ${
                      pick === o.v
                        ? "border-accent bg-accent/10"
                        : "border-border text-muted hover:text-text"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </>
          )}

          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value.slice(0, 80))}
            placeholder="Trash talk (optional)"
            className="mt-4 w-full rounded-lg border border-border bg-surface-2/40 px-3 py-2 text-sm outline-none focus:border-accent/50"
          />
          <Button
            onClick={create}
            disabled={!oppValid || !matchId || !pick || !hasGas}
            className="mt-4 w-full"
          >
            {!hasGas ? "Insufficient gas" : "Send challenge"}
          </Button>
        </div>

        {/* my duels */}
        <div>
          <h2 className="mb-3 text-lg">Your duels</h2>
          {bonds.length === 0 ? (
            <EmptyState
              title="No duels yet"
              body="Challenge a friend with their wallet address to start your first banter duel."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {bonds.map((b) => (
                <BondRow
                  key={b.id}
                  b={b}
                  me={address!}
                  fixture={fixtureFor(b.matchId)}
                  onAccept={accept}
                  onSettle={settle}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BondRow({
  b,
  me,
  fixture,
  onAccept,
  onSettle,
}: {
  b: Bond;
  me: Address;
  fixture?: { home: string; away: string; resolved: boolean };
  onAccept: (b: Bond, pick: number) => void;
  onSettle: (b: Bond) => void;
}) {
  const iAmOpponent = b.opponent.toLowerCase() === me.toLowerCase();
  const title = fixture
    ? `${fixture.home} vs ${fixture.away}`
    : `Match #${b.matchId}`;
  const [oppPick, setOppPick] = useState(0);

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <p className="font-medium">{title}</p>
        {b.settled ? (
          <Pill className="bg-surface-2 text-muted">
            <Trophy size={13} className="text-gold" /> Settled
          </Pill>
        ) : b.accepted ? (
          <Pill className="bg-accent/10 text-accent">
            <Flame size={13} /> Live
          </Pill>
        ) : (
          <Pill className="bg-surface-2 text-muted">Pending</Pill>
        )}
      </div>
      {b.message && <p className="mt-1 text-sm text-muted">“{b.message}”</p>}
      <p className="mt-2 text-xs text-muted">
        {shortAddr(b.creator)} called{" "}
        {fixture
          ? pickLabel(b.creatorPick, fixture.home, fixture.away)
          : b.creatorPick}
        {b.accepted &&
          fixture &&
          ` · ${shortAddr(b.opponent)} called ${pickLabel(b.opponentPick, fixture.home, fixture.away)}`}
      </p>

      {b.settled && (
        <p className="mt-2 text-sm">
          {b.winner === ZERO
            ? "Push — nobody called it."
            : b.winner.toLowerCase() === me.toLowerCase()
              ? "🏆 You won the banter."
              : `Winner: ${shortAddr(b.winner)}`}
        </p>
      )}

      {/* opponent accept flow */}
      {!b.accepted && iAmOpponent && fixture && (
        <div className="mt-3 flex items-center gap-2">
          <div className="grid flex-1 grid-cols-3 gap-1.5">
            {[
              { v: PICK.HOME, label: fixture.home },
              { v: PICK.DRAW, label: "Draw" },
              { v: PICK.AWAY, label: fixture.away },
            ].map((o) => (
              <button
                key={o.v}
                onClick={() => setOppPick(o.v)}
                className={`truncate rounded-lg border px-2 py-1.5 text-xs ${
                  oppPick === o.v
                    ? "border-accent bg-accent/10"
                    : "border-border text-muted"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <Button
            className="h-9"
            disabled={!oppPick}
            onClick={() => onAccept(b, oppPick)}
          >
            Accept
          </Button>
        </div>
      )}

      {b.accepted && !b.settled && fixture?.resolved && (
        <Button className="mt-3 h-9" onClick={() => onSettle(b)}>
          Settle duel
        </Button>
      )}
      {b.accepted && !b.settled && !fixture?.resolved && (
        <p className="mt-3 text-xs text-muted">Waiting on the match result…</p>
      )}
    </div>
  );
}
