# X Cup Passport 🏆

**An evolving, soulbound World Cup fan passport on X Layer that levels up through tournament stages as you predict matches and out-banter your rivals.**

🌐 **Live app:** https://xcup-passport.pages.dev · 🎬 **Demo:** https://xcup-passport.pages.dev/demo.mp4 · 𝕏 **[@XCupPassport](https://x.com/XCupPassport)** · ⛓ **X Layer testnet (chain 1952)**

---

## Why it stands out

- **A real dynamic NFT, 100% on-chain.** The passport is a soulbound ERC-721 whose artwork is generated **entirely on-chain** (on-chain SVG — no IPFS, no servers) and **visibly evolves** as your score grows: **Group Stage → Round of 16 → Quarterfinal → Semifinal → Champion.** It emits **ERC-4906** so wallets and explorers refresh the art live.
- **Full loop is live and on-chain-verifiable:** mint → non-cash prediction → resolve → settle → **passport evolves.** Four contracts deployed on X Layer testnet, proven end-to-end.
- **Web3-first.** The chain is the source of truth; the leaderboard reads **directly from the contracts.** The only off-chain piece is a Cloudflare *match-oracle* so any fan can self-serve the predict→evolve loop.
- **Production-grade, not a demo.** Privy (email/Google) + OKX wallet login, a real multi-screen app, responsive across mobile/desktop.
- **Innovation angle.** It turns the World Cup's natural **pick → banter → bragging-rights** ritual into a *compounding, on-chain fan identity* that grows across the whole tournament.

## Live deployment — X Layer testnet (chain 1952)

| Contract | Address |
|---|---|
| `XCupPassport` (soulbound dynamic ERC-721, on-chain SVG, ERC-4906) | [`0xf8a679f1…97f8`](https://www.okx.com/web3/explorer/xlayer-test/address/0xf8a679f1aeaa2482859175861a2c583ca1eb97f8) |
| `MatchResolver` (fixtures + resolution) | [`0x64b3787c…20dee`](https://www.okx.com/web3/explorer/xlayer-test/address/0x64b3787c041393c083b94e55becf2665fc520dee) |
| `PredictionPool` (non-cash picks → points) | [`0x087521f9…cc1e`](https://www.okx.com/web3/explorer/xlayer-test/address/0x087521f9ff3ecb4f3503d152e4d7a6dd68a0cc1e) |
| `BanterBond` (friend-vs-friend receipts) | [`0x24b52bf6…a74f`](https://www.okx.com/web3/explorer/xlayer-test/address/0x24b52bf60e99f4801446e2a12666041efeb2a74f) |

Match-oracle Worker: `https://xcup-oracle.gabrielaxy.workers.dev` · full addresses + tx hashes in [`DEPLOYMENTS.md`](./DEPLOYMENTS.md).

## How it works

1. **Mint** a soulbound passport for your nation.
2. **Predict** a fixture (non-cash, points-only) — add some banter.
3. **Resolve** the match (admin/oracle simulated — see note below).
4. **Settle** your prediction: correct calls bank points and your passport's **on-chain art evolves** to the next tournament stage.
5. **Banter duels:** challenge a rival head-to-head; the winner takes the receipt.
6. **Leaderboard:** global + per-nation, read live from the contracts.

> **Honest data note:** The real World Cup 2026 kicks off mid-June (after judging), so there is no live results feed. Fixtures are the real WC2026 line-up but outcomes are **admin/oracle-simulated and clearly labeled "pre-tournament simulation"** in the UI. No fake "live data" claims — see [`TRUTH_AUDIT.md`](./TRUTH_AUDIT.md).

## Stack

Foundry (self-contained Solidity, on-chain SVG via `via_ir`) · Vite + React 19 + TypeScript + `viem` · Tailwind v4 · Privy + OKX wallet · Cloudflare Pages + a match-oracle Worker.

## Run locally

```bash
pnpm install
forge test -vvv          # contract tests (incl. tier transitions, soulbound, on-chain tokenURI)
pnpm dev                 # app at http://127.0.0.1:5173
```

Reproduce the deployment (funded X Layer testnet key required):

```bash
set -a; source .env; set +a   # X_LAYER_TESTNET_RPC_URL, X_LAYER_DEPLOYER_PRIVATE_KEY
forge script contracts/script/Deploy.s.sol \
  --rpc-url "$X_LAYER_TESTNET_RPC_URL" --private-key "$X_LAYER_DEPLOYER_PRIVATE_KEY" \
  --broadcast --legacy
```

## Judging alignment

- **Innovation:** evolving soulbound on-chain identity built around World Cup fan rituals.
- **Market potential:** every matchday is a reason to come back — predict, climb, out-banter; built for mainstream fans (email/Google login).
- **Completion:** live app + 4 deployed contracts + full loop proven on-chain + on-chain-verifiable leaderboard.
- **Demo:** [1-minute walkthrough](https://xcup-passport.pages.dev/demo.mp4).
