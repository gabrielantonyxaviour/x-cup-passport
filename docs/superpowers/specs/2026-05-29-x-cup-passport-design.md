# X Cup Passport — "Build to Win" Design Spec

**Date:** 2026-05-29
**Hackathon:** OKX / X Layer — X Cup (World Cup theme), May 19–28 2026 (treated as open/extended per owner)
**Persona / repo owner:** Ratna (migration pending, pre-submit)
**Status:** approved design — building

## Goal

Elevate the deployed MVP into a **winning, production-grade** World Cup fan app on X Layer. Not a demo that just proves things work — a product that feels shipped: real navigation, onboarding, empty/loading/error states, information placed where a user would expect it. Optimize for the official judging axes: **Innovation (within World Cup context)**, **Market potential (capture World Cup traffic → on-chain X Layer users)**, **Completion (demonstrable + on-chain-verifiable)**, **Demo video**.

## Locked decisions

1. **Hero mechanic — Evolving Passport NFT.** A real, **soulbound, dynamic ERC-721** whose **fully on-chain SVG** art visibly evolves through World-Cup tournament stages as the holder's on-chain score grows. Banter duels and nation leaderboards are supporting features.
2. **Wallet — Privy (email/social) default + OKX Wallet connector.** Frictionless onboarding for mainstream fans (market potential) plus an explicit OKX sponsor signal. X Layer testnet (chain 1952).
3. **Match data — real WC2026 fixtures + simulate.** Seed the actual announced World Cup 2026 schedule/teams on-chain; an owner-only `resolveMatch` ("simulate result") settles fixtures in-demo. Clearly labeled *pre-tournament simulation* (honest per `TRUTH_AUDIT.md`).
4. **Web3-first.** All product state lives on-chain. **Cloudflare (Workers/D1/R2/KV)** is used only for what genuinely cannot be web3 — an event-indexed leaderboard/stats read-layer and OG share-card image rendering — and always reads *from* the chain, which remains the source of truth.
5. **X account — deferred to pre-submit.** Build the share-card generator + `@XLayerOfficial` post copy now; account setup + posting handled right before submission.
6. **Contracts — Approach A**, self-contained (no OpenZeppelin/Solady submodules), matching the repo's existing dependency-free style.

## Architecture

### Contracts (redeployed clean to X Layer 1952)

| Contract | Change | Role |
|---|---|---|
| `XCupPassport` | **Rewrite** → soulbound dynamic ERC-721 + on-chain SVG `tokenURI` + ERC-4906 | Hero: evolving fan identity NFT |
| `MatchResolver` | Keep | Holds WC2026 fixtures; owner `resolveMatch` = simulate |
| `PredictionPool` | Keep (unchanged ABI to passport) | Non-cash picks → settle awards points → evolves passport |
| `BanterBond` | Keep | Supporting: friend-vs-friend rivalry → winner/loser receipt |
| `Base64` (lib) | **New** | On-chain base64 for `tokenURI` data URI |

`XCupPassport` keeps the exact interface `PredictionPool` depends on: `tokenOf(address)`, `recordPredictionResult(address,uint256,bool)` (onlyGame), plus `setGameAuthorization`, `mintPassport(string nation)`, `passportOf`, `getPassport`. Adds the full ERC-721 surface (`name`, `symbol`, `balanceOf`, `ownerOf`, `tokenURI`, `supportsInterface`, `Transfer` on mint) and **soulbound** behavior (transfer/approve revert). Emits ERC-4906 `MetadataUpdate(tokenId)` whenever score/badges change so wallets/explorers refresh the art.

### Tier system (on-theme, score-driven)

`Group Stage → Round of 16 → Quarterfinal → Semifinal → Champion`, derived from on-chain `score`. Points: **10 per correct prediction**. Thresholds tuned so a demo climbs 2–3 stages quickly while Champion remains an aspirational long-game (retention → market potential):

| Stage | Score |
|---|---|
| Group Stage | 0–29 |
| Round of 16 | 30–69 |
| Quarterfinal | 70–119 |
| Semifinal | 120–199 |
| Champion | 200+ |

SVG reflects: stage tier (color/crest treatment), nation, score, predictions, badge pips, progress bar to next stage.

### Frontend (rebuild from single-file MVP → production app)

Vite + React 19 + viem, componentized. Screens:

1. **Landing/hero** — World Cup theme, wallet connect (Privy + OKX), live on-chain counts (passports minted, predictions made), primary "Mint your passport" CTA.
2. **Mint** — WC2026 nation picker → mint → first passport (Group Stage).
3. **Passport / Profile (hero screen)** — large live render of the on-chain SVG (re-fetched from `tokenURI`), stage + progress, score/predictions/badges, **Share** → image card + X copy.
4. **Matchday** — real WC2026 fixtures, submit non-cash pick (with banter message), owner-only **Simulate result** → points settle → passport level-up moment.
5. **Banter duels** — challenge/accept/resolve → winner/loser receipt cards.
6. **Leaderboard** — global + by nation (Cloudflare-indexed from chain events).

Cross-cutting: real nav + routing, onboarding/empty states, skeletons only where data truly loads async, gas pre-check before every tx, explorer link surfaced on every tx, responsive 375/768/1440.

### Cloudflare layer (read-from-chain only)

- **Indexer Worker → D1**: subscribes/polls X Layer events (`PassportMinted`, `ScoreUpdated`, `PredictionSettled`, `BondSettled`) → fast global + per-nation leaderboard and homepage stats.
- **OG share-card Worker**: renders the passport + result as a PNG/OG image for X posts (R2 cache).
- **KV**: cache RPC reads / leaderboard snapshots.

## Done-when (proof)

- `forge test` green: ERC-721 mint Transfer, soulbound revert, valid base64 `tokenURI`, tier transitions across thresholds, settlement awards+evolves+4906, banter, resolver.
- 4 contracts redeployed to X Layer 1952; addresses + tx in `DEPLOYMENTS.md` + broadcast file; `tokenURI` verified on-chain via `cast`.
- Live E2E on deployed app: connect → mint → pick → simulate → **passport SVG evolves on-chain** → explorer links; screenshots in `/tmp/verify/`.
- `/polish` ≥90 (≥95 landing) at 375/768/1440.
- `TRUTH_AUDIT.md` updated: passport is now a **real** dynamic NFT.
- Share-card + `@XLayerOfficial` post copy artifacts ready.

## Out of scope (YAGNI)

Transferable passport (soulbound) · oracle integration (admin-simulated) · any fund escrow / cash betting (non-cash only) · heavy standalone indexer beyond the Cloudflare read-layer.

## Then

Repeat the cycle (spec → build → proof) for **AI Matchday Wallet Agent**, then **World Cup Trading Card Battle**.
