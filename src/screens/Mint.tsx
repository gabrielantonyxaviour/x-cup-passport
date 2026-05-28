import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { NATIONS } from "../data/nations";
import { useXWallet, useBalance } from "../wallet/useXWallet";
import { useTx } from "../wallet/useTx";
import { usePassport } from "../hooks/useChainData";
import { passportAbi } from "../lib/abi";
import { CONTRACTS, FAUCET_URL } from "../config/chain";
import { Button, SectionLabel, Spinner } from "../components/ui";
import { PassportCard } from "../components/PassportCard";

export function Mint() {
  const { authenticated, address, login } = useXWallet();
  const { hasGas } = useBalance(address);
  const { data, loading, refetch } = usePassport(address);
  const tx = useTx();
  const navigate = useNavigate();
  const [nation, setNation] = useState<string>("");
  const [minting, setMinting] = useState(false);

  if (!authenticated) {
    return (
      <Gate
        onConnect={login}
        body="Connect with email, Google, or your OKX wallet to mint your soulbound World Cup passport."
      />
    );
  }

  if (loading && !data) return <Spinner label="Checking your passport…" />;

  if (data?.hasPassport) {
    return (
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-3xl">You already have a passport</h1>
        <p className="mt-2 text-muted">
          One passport per fan — yours is soulbound to {nation || data.nation}.
        </p>
        <div className="mx-auto mt-8 max-w-[300px]">
          <PassportCard tokenURI={data.tokenURI} />
        </div>
        <Button className="mt-8" onClick={() => navigate("/passport")}>
          Go to my passport <ArrowRight size={16} />
        </Button>
      </div>
    );
  }

  const mint = async () => {
    if (!nation) return;
    setMinting(true);
    const hash = await tx({
      address: CONTRACTS.passport,
      abi: passportAbi,
      functionName: "mintPassport",
      args: [nation],
      pending: `Minting your ${nation} passport…`,
      success: "Passport minted! Welcome to the tournament.",
    });
    setMinting(false);
    if (hash) {
      await refetch();
      navigate("/passport");
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <SectionLabel>Mint</SectionLabel>
      <h1 className="mt-3 text-4xl">Choose your nation.</h1>
      <p className="mt-2 max-w-xl text-muted">
        Your passport is soulbound — it carries your nation and your record.
        Pick the side you're riding with for the tournament.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {NATIONS.map((n) => {
          const selected = n.name === nation;
          return (
            <button
              key={n.name}
              onClick={() => setNation(n.name)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                selected
                  ? "border-accent bg-accent/10 text-text"
                  : "border-border bg-surface text-muted hover:border-accent/40 hover:text-text"
              }`}
            >
              <span className="text-2xl leading-none">{n.flag}</span>
              <span className="text-sm font-medium">{n.name}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-start gap-3">
        <Button onClick={mint} loading={minting} disabled={!nation || !hasGas}>
          {!hasGas
            ? "Insufficient gas"
            : nation
              ? `Mint ${nation} passport`
              : "Select a nation"}
          {nation && hasGas && <ArrowRight size={16} />}
        </Button>
        {!hasGas && (
          <p className="text-xs text-muted">
            You need a little OKB for gas.{" "}
            <a
              href={FAUCET_URL}
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline"
            >
              Get testnet OKB from the faucet
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}

function Gate({ onConnect, body }: { onConnect: () => void; body: string }) {
  return (
    <div className="mx-auto max-w-md py-10 text-center">
      <h1 className="text-4xl">Mint your passport</h1>
      <p className="mt-3 text-muted">{body}</p>
      <Button className="mt-8" onClick={onConnect}>
        Connect to continue
      </Button>
    </div>
  );
}
