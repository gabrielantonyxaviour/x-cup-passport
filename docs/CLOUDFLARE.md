# Cloudflare layer

The architecture is **web3-first**: all product state lives on X Layer, and the
leaderboard is read directly from the contracts. Cloudflare is used only for the
one thing that genuinely cannot be trustless.

## Match Oracle Worker (live)

- **URL:** https://xcup-oracle.gabrielaxy.workers.dev
- **Source:** `oracle/index.ts` · **Config:** `oracle/wrangler.toml`
- **Why it exists:** `MatchResolver.resolveMatch` is `onlyOwner`. To let *any* fan
  self-serve the full predict → resolve → settle → evolve loop (not just the
  deployer), a trusted keyholder simulates the fixture result. The user then
  settles their own prediction from their own wallet, so the scoring + evolution
  stays a user-signed on-chain action.
- **Secret:** `DEPLOYER_PRIVATE_KEY` (Ratna deployer / resolver owner), set via
  `wrangler secret put` — never committed.
- **Endpoints:**
  - `GET /health` → `{ ok: true }`
  - `POST /resolve/:matchId` → signs `resolveMatch` with a simulated scoreline,
    returns `{ hash, result, homeScore, awayScore }`.
- **Verified live (2026-05-29):** resolved match 2 (USA vs Wales) → tx mined,
  `isResolved(2) = true`.

### Deploy / update

```bash
export CLOUDFLARE_API_TOKEN=...   # from vault
export CLOUDFLARE_ACCOUNT_ID=893c47ccb111ed55932bf2c9316d5f9d
wrangler deploy --config oracle/wrangler.toml
printf '%s' "$DEPLOYER_KEY" | wrangler secret put DEPLOYER_PRIVATE_KEY --config oracle/wrangler.toml
```

## Deliberately NOT on Cloudflare (web3-first)

- **Leaderboard** — read live from `XCupPassport` on chain (client-side). A
  Cloudflare D1 indexer is only worth adding at real scale; the frontend already
  reads from `INDEXER_URL` first and falls back to chain, so it can be slotted in
  later with no UI change.
- **Share/OG image** — sharing uses an X intent with on-chain art; a Worker that
  renders the on-chain SVG → PNG OG card is a future enhancement (`OG_URL` hook
  already wired in the UI).
