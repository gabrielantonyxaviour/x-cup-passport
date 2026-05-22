# X Cup Passport

X Cup Passport is a World Cup-themed X Layer app for non-cash fan predictions and rivalry receipts. Fans mint a passport, submit a points-only match pick, resolve a labeled fixture through an admin resolver, and settle the result into passport score, badge, leaderboard, and banter receipt state.

This repo does not claim live World Cup data. The tournament fixtures used in the UI are labeled `fixture/demo data` because the World Cup matches are in the future. The real integration path is the Solidity resolver and deployment scripts; live X Layer deployment is blocked until a funded deployer key or approved wallet signing path is provided.

## Stack

- Foundry Solidity contracts in `contracts/src`
- Vite React TypeScript app in `src`
- `viem` wallet/RPC path for deployed contract calls
- X Layer testnet target: chain ID `1952`, OKB gas, explorer `https://www.okx.com/web3/explorer/xlayer-test`

## Core Contracts

| Contract | Role |
|---|---|
| `XCupPassport` | Mints a nation-tagged passport and records score/badge state |
| `MatchResolver` | Creates and resolves labeled fixtures through an admin path |
| `PredictionPool` | Records non-cash picks and settles points against resolver results |
| `BanterBond` | Creates, accepts, and settles non-cash rivalry receipts |

## Run Locally

```bash
pnpm install
forge test -vvv
pnpm build
pnpm dev
```

Open the local URL from Vite. The UI has two paths:

- `Fixture preview`: labeled local preview for judge storytelling, not a blockchain transaction.
- `Real tx`: disabled until contract addresses are configured in `src/config/contracts.ts` after deployment.

## X Layer Deployment

```bash
export X_LAYER_TESTNET_RPC_URL=https://testrpc.xlayer.tech/terigon
export X_LAYER_DEPLOYER_PRIVATE_KEY=0x...
pnpm deploy:xlayer:testnet
```

If the deployer is missing or unfunded, do not claim deployment. Record the blocker in `DEPLOYMENTS.md`, `TRUTH_AUDIT.md`, and `QUALITY_GATE.md`.

## Hackathon Submission Status

- Public repo: pending.
- X Layer deployment: blocked pending funded deployer/private key or approved wallet path.
- Dedicated project X handle/post: blocked pending Gabriel approval/provision.
- Google Form final submit: not authorized in this run.
