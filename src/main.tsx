import React from "react";
import ReactDOM from "react-dom/client";
import { ArrowRight, BadgeCheck, CircleDot, Copy, Github, Shield, Trophy, Wallet } from "lucide-react";
import { contracts, hasDeployment, xLayerTestnet } from "./config/contracts";
import { demoFixtures, resultLabel } from "./data/fixtures";
import { connectWallet, explorerTx } from "./lib/wallet";
import { passportAbi, predictionAbi, resolverAbi } from "./lib/contractAbi";
import "./styles.css";
import "./receipts.css";

type StepState = {
  passport: boolean;
  prediction: boolean;
  resolved: boolean;
  settled: boolean;
  receipt: boolean;
  score: number;
  txHashes: string[];
};

const initialStepState: StepState = {
  passport: false,
  prediction: false,
  resolved: false,
  settled: false,
  receipt: false,
  score: 0,
  txHashes: [],
};

function App() {
  const [steps, setSteps] = React.useState(initialStepState);
  const [wallet, setWallet] = React.useState<string>("");
  const [status, setStatus] = React.useState("Fixture preview ready. Real wallet actions unlock after deployment addresses are configured.");
  const fixture = demoFixtures[0];
  const shareText = `X Cup Passport settled ${fixture.home} ${fixture.homeScore}-${fixture.awayScore} ${fixture.away}. Non-cash fan proof on @XLayerOfficial #BuildX.`;

  const runPreviewStep = (step: keyof Omit<StepState, "score" | "txHashes">) => {
    setSteps((current) => {
      const next = { ...current, [step]: true };
      if (step === "settled") next.score = fixture.result === 1 ? 3 : 0;
      return next;
    });
  };

  const connect = async () => {
    try {
      const connected = await connectWallet();
      setWallet(connected.account);
      setStatus(`Wallet connected: ${connected.account}. Configure contract addresses before sending X Layer transactions.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Wallet connection failed.");
    }
  };

  const sendIfReady = async (action: "mint" | "createMatch" | "predict") => {
    if (!window.ethereum || !wallet || !hasDeployment) {
      setStatus("Real transaction path is blocked until wallet is connected and deployment addresses are configured.");
      return;
    }

    const { client, account } = await connectWallet();
    let hash: `0x${string}`;

    if (action === "mint" && contracts.xCupPassport) {
      hash = await client.writeContract({
        account,
        address: contracts.xCupPassport,
        abi: passportAbi,
        functionName: "mintPassport",
        args: ["Brazil"],
      });
    } else if (action === "createMatch" && contracts.matchResolver) {
      hash = await client.writeContract({
        account,
        address: contracts.matchResolver,
        abi: resolverAbi,
        functionName: "createMatch",
        args: [fixture.home, fixture.away, BigInt(Date.parse(fixture.kickoffUtc) / 1000), true],
      });
    } else if (action === "predict" && contracts.predictionPool) {
      hash = await client.writeContract({
        account,
        address: contracts.predictionPool,
        abi: predictionAbi,
        functionName: "submitPrediction",
        args: [BigInt(fixture.id), fixture.result, "Brazil starts the run"],
      });
    } else {
      setStatus("Missing contract address for this action.");
      return;
    }

    setSteps((current) => ({ ...current, txHashes: [...current.txHashes, hash] }));
    setStatus(`Transaction sent: ${hash}`);
  };

  const copyShare = async () => {
    await navigator.clipboard.writeText(shareText);
    setStatus("Share copy written to clipboard. This is not a live X post.");
  };

  return (
    <main>
      <section className="hero">
        <video
          className="heroVideo"
          autoPlay
          loop
          muted
          playsInline
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4"
        />
        <div className="grain" />
        <nav className="nav liquid">
          <span>X Cup Passport</span>
          <span>Non-cash</span>
          <span>X Layer {xLayerTestnet.id}</span>
        </nav>
        <div className="heroGrid">
          <div className="heroCopy">
            <p className="eyebrow">World Cup fixture proof</p>
            <h1>
              Mint. Pick.
              <br />
              Settle.
              <br />
              <span>Receipt.</span>
            </h1>
            <p className="lede">
              A dynamic fan passport where every non-cash prediction and rivalry settles into X Layer-readable score,
              badges, leaderboard movement, and shareable banter receipts.
            </p>
            <div className="heroActions">
              <a href="#cockpit" className="primary">
                Open demo cockpit <ArrowRight size={18} />
              </a>
              <button className="ghost" onClick={connect}>
                <Wallet size={18} /> Connect wallet
              </button>
            </div>
          </div>
          <div className="proofCard liquid">
            <span className="proofTag">[ 2026 X CUP ]</span>
            <strong>Fixture preview is labeled.</strong>
            <p>No live match feed, no real-money betting, no hidden mocks. Contracts and scripts handle the real state transition.</p>
          </div>
        </div>
      </section>

      <section id="cockpit" className="cockpit">
        <div className="sectionHead">
          <p className="eyebrow">Judge path</p>
          <h2>One fan loop, contract-first.</h2>
          <p>{status}</p>
        </div>

        <div className="fixture liquid">
          <div>
            <span className="label">{fixture.label}</span>
            <h3>
              {fixture.home} vs {fixture.away}
            </h3>
            <p>{new Date(fixture.kickoffUtc).toUTCString()}</p>
          </div>
          <div className="score">
            {fixture.homeScore}-{fixture.awayScore}
            <span>{resultLabel(fixture.result, fixture)}</span>
          </div>
        </div>

        <div className="steps">
          <ActionCard
            icon={<Shield />}
            title="1. Mint passport"
            done={steps.passport}
            text="Creates a nation-tagged passport. Real path calls XCupPassport.mintPassport."
            onPreview={() => runPreviewStep("passport")}
            onSend={() => sendIfReady("mint")}
          />
          <ActionCard
            icon={<CircleDot />}
            title="2. Submit pick"
            done={steps.prediction}
            text="Records a non-cash match pick. Real path calls PredictionPool.submitPrediction."
            onPreview={() => runPreviewStep("prediction")}
            onSend={() => sendIfReady("predict")}
          />
          <ActionCard
            icon={<Trophy />}
            title="3. Resolve fixture"
            done={steps.resolved}
            text="Admin resolver posts a demo fixture result. Real path calls MatchResolver.resolveMatch."
            onPreview={() => runPreviewStep("resolved")}
            onSend={() => sendIfReady("createMatch")}
          />
          <ActionCard
            icon={<BadgeCheck />}
            title="4. Settle receipt"
            done={steps.settled && steps.receipt}
            text="Settlement updates score and unlocks a banter receipt. Preview is labeled fixture state."
            onPreview={() => {
              setSteps((current) => ({
                ...current,
                settled: true,
                receipt: true,
                score: fixture.result === 1 ? 3 : 0,
              }));
            }}
            onSend={() => setStatus("Settle uses deployed match/prediction IDs after X Layer deployment.")}
          />
        </div>
      </section>

      <section className="receipts">
        <div className="receiptCard liquid">
          <p className="eyebrow">Passport state</p>
          <h2>{steps.score} pts</h2>
          <p>Predictions: {steps.prediction ? 1 : 0}</p>
          <p>Badges: {steps.settled && steps.score > 0 ? 1 : 0}</p>
        </div>
        <div className="receiptCard accent">
          <p className="eyebrow">Share artifact</p>
          <p>{shareText}</p>
          <button onClick={copyShare}>
            <Copy size={16} /> Copy text
          </button>
        </div>
        <div className="receiptCard liquid">
          <p className="eyebrow">Proof links</p>
          {steps.txHashes.length === 0 ? (
            <p>No real transaction hash yet. Deploy and configure addresses to populate explorer links.</p>
          ) : (
            steps.txHashes.map((hash) => (
              <a href={explorerTx(hash)} key={hash} target="_blank" rel="noreferrer">
                {hash.slice(0, 12)}...
              </a>
            ))
          )}
          <a href="https://github.com/" className="repoLink">
            <Github size={16} /> Public repo pending
          </a>
        </div>
      </section>
    </main>
  );
}

function ActionCard(props: {
  icon: React.ReactNode;
  title: string;
  text: string;
  done: boolean;
  onPreview: () => void;
  onSend: () => void;
}) {
  return (
    <article className={`actionCard liquid ${props.done ? "done" : ""}`}>
      <div className="cardIcon">{props.icon}</div>
      <h3>{props.title}</h3>
      <p>{props.text}</p>
      <div className="cardActions">
        <button onClick={props.onPreview}>Fixture preview</button>
        <button onClick={props.onSend}>Real tx</button>
      </div>
    </article>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
