import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Lenis from "lenis";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { publicClient } from "../lib/viem";
import { passportAbi } from "../lib/abi";
import { CONTRACTS, explorerAddress } from "../config/chain";
import { PassportCard } from "../components/PassportCard";
import { WalletButton } from "../components/WalletButton";
import { Button, SectionLabel } from "../components/ui";
import { useStats } from "../hooks/useChainData";
import { STAGES, stageAccent } from "../lib/format";

const STEPS = [
  {
    n: "01",
    title: "Mint your passport",
    body: "Pick your nation and mint a soulbound passport NFT. It's your fan identity on X Layer — it can't be traded, only earned.",
  },
  {
    n: "02",
    title: "Call the matches",
    body: "Submit non-cash predictions on World Cup fixtures. Right calls bank points; wrong ones still count toward your record.",
  },
  {
    n: "03",
    title: "Climb the stages",
    body: "Your passport art evolves on-chain — Group Stage to Champion — as your score grows. Fully on-chain SVG, no servers.",
  },
  {
    n: "04",
    title: "Settle the banter",
    body: "Challenge a rival head-to-head. The winner mints a banter receipt. Bragging rights, on the record.",
  },
];

export function Landing() {
  const stats = useStats();
  const [heroURI, setHeroURI] = useState<string>();

  useEffect(() => {
    const lenis = new Lenis();
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    publicClient
      .readContract({
        address: CONTRACTS.passport,
        abi: passportAbi,
        functionName: "tokenURI",
        args: [1n],
      })
      .then((u) => setHeroURI(u as string))
      .catch(() => undefined);
  }, []);

  return (
    <div className="grain min-h-screen">
      {/* top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-[15px] font-bold text-[#04130c]">
              X
            </span>
            <span className="font-display text-lg font-semibold">
              X Cup Passport
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/matchday"
              className="hidden text-sm text-muted hover:text-text sm:block"
            >
              Matchday
            </Link>
            <Link
              to="/leaderboard"
              className="hidden text-sm text-muted hover:text-text sm:block"
            >
              Leaderboard
            </Link>
            <WalletButton />
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="pitch-grid relative">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div>
            <SectionLabel>World Cup 2026 · built on X Layer</SectionLabel>
            <h1 className="mt-4 text-5xl leading-[1.02] sm:text-6xl">
              Mint a passport that{" "}
              <span className="text-accent">levels up</span> with every match
              you call.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              A soulbound fan identity on X Layer. Predict fixtures, climb the
              tournament stages from Group Stage to Champion, and settle banter
              with your rivals — all on-chain.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/mint">
                <Button className="h-12 px-6 text-base">
                  Mint your passport <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/matchday">
                <Button variant="outline" className="h-12 px-6 text-base">
                  See matchday
                </Button>
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
              <span>Live on X Layer testnet</span>
              <span className="text-border">•</span>
              <span>Soulbound ERC-721</span>
              <span className="text-border">•</span>
              <span>Fully on-chain art</span>
              <a
                href={explorerAddress(CONTRACTS.passport)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-accent hover:underline"
              >
                Contract <ExternalLink size={11} />
              </a>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[320px]">
            <PassportCard tokenURI={heroURI} />
            <p className="mt-3 text-center text-xs text-muted">
              Genesis passport #1 — rendered live from the chain
            </p>
          </div>
        </div>
      </section>

      {/* live stats strip */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-around gap-8 px-6 py-8 text-center">
          <Stat
            value={stats ? stats.passports.toString() : "—"}
            label="Passports minted"
          />
          <Stat
            value={stats ? stats.predictions.toString() : "—"}
            label="Predictions made"
          />
          <Stat value="5" label="Tournament stages" />
          <Stat value="14k" label="USDT prize pool" />
        </div>
      </section>

      {/* how it works — numbered narrative (no card grid) */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <SectionLabel>How it works</SectionLabel>
        <h2 className="mt-3 text-4xl">From kickoff to Champion.</h2>
        <div className="mt-12 flex flex-col gap-px overflow-hidden rounded-2xl border border-border">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="grid grid-cols-[auto_1fr] gap-5 bg-surface p-6 sm:p-8"
            >
              <span className="font-display text-3xl text-accent">{s.n}</span>
              <div>
                <h3 className="text-xl">{s.title}</h3>
                <p className="mt-1.5 max-w-2xl text-muted">{s.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* stage ladder */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {STAGES.map((st, i) => (
            <div key={st} className="flex items-center gap-2">
              <span
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  background: `${stageAccent[st]}22`,
                  color: stageAccent[st],
                }}
              >
                {st}
              </span>
              {i < STAGES.length - 1 && (
                <ArrowRight size={14} className="text-border" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* final cta */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="floodlight card flex flex-col items-center gap-5 px-6 py-16 text-center">
          <h2 className="relative z-[1] max-w-2xl text-4xl">
            Claim your place in the tournament.
          </h2>
          <Link to="/mint" className="relative z-[1]">
            <Button className="h-12 px-6 text-base">
              Mint your passport <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-muted sm:flex-row">
          <span>
            X Cup Passport · X Layer testnet · pre-tournament simulation
          </span>
          <a
            href={explorerAddress(CONTRACTS.passport)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-text"
          >
            <Github size={15} /> Contracts on explorer
          </a>
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="tabular text-3xl font-medium text-text">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted">
        {label}
      </div>
    </div>
  );
}
