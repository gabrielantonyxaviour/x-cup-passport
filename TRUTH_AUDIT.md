# Truth Audit

Hackathon: X Layer X Cup Hackathon 2026
Idea: X Cup Passport + Banter Pools
Updated: 2026-05-29

| Claim | Reality | Evidence | User-facing label? |
|---|---|---|---|
| Official hackathon exists, requires X Layer deployment | real | Official page verified | No |
| X Layer testnet chain ID is 1952 | real | Official network docs | No |
| Passport is a real, standards-compliant NFT | **real** | Soulbound ERC-721 + ERC-4906; `supportsInterface(0x80ac58cd/0x5b5e139f/0x49064906)=true` on-chain | No |
| Passport art is fully on-chain and evolves | **real** | `tokenURI` returns base64 JSON + on-chain SVG; tier changes with score; verified live | No |
| Product is deployed on X Layer | **real** | 4 contracts live on chain 1952 (see DEPLOYMENTS.md), tx hashes recorded | No |
| Full loop works end-to-end on-chain | **real** | mint→predict→resolve→settle→evolve proven via cast AND live UI E2E (screenshots in /tmp/verify) | No |
| Leaderboard reads from chain | **real** | Client reads `XCupPassport` directly; indexer optional | No |
| App is live and usable | **real** | https://xcup-passport.pages.dev (Privy + OKX login) | No |
| World Cup match results are live/real | **simulated** | WC2026 starts mid-June (after judging); no live feed exists | **Yes — labeled "pre-tournament simulation" in UI** |
| Match outcomes are admin/oracle-resolved, not a sports oracle | **real (by design)** | `MatchResolver` owner / Cloudflare oracle resolves; clearly stated | **Yes** |
| Product is submitted | **real** | Submitted to X Cup Google Form 2026-05-29 (see SUBMISSION.md) | No |
| Dedicated project X account exists | **real** | https://x.com/XCupPassport | No |

Rules:
- No claims of live/onchain/deployed/minted/verified without evidence (all above are evidenced).
- The only simulated element is **match outcomes** (real WC2026 is post-judging) — labeled everywhere it appears.
