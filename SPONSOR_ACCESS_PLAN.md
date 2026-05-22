# Sponsor Access Plan

Date: 2026-05-22

## Official Surfaces

| Surface | Official URL | Purpose | Access path | Status |
|---|---|---|---|---|
| X Cup hackathon page | `https://web3.okx.com/xlayer/build-x-hackathon/xcup` | Rules, tracks, prize, deadline, submission link | Public web | Verified on 2026-05-22 |
| Submission Google Form | `https://docs.google.com/forms/d/e/1FAIpQLSdj19ZO-gQwLKEz36Z2XDLL7eTdSr-PRXcDmy4p6G2GFvrWKw/viewform?usp=dialog` | Final project submission | `agent-browser` with Gabriel profile for preflight only | Fields identified, not submitted |
| X Layer docs | `https://web3.okx.com/xlayer/docs/developer/build-on-xlayer/network-information` | RPC, chain IDs, explorer URLs | Public web | Verified on 2026-05-22 |
| X Layer testnet faucet | `https://web3.okx.com/xlayer/faucet` | Test OKB for deployer | `agent-browser` if wallet/account flow is needed | Public faucet page verified; wallet funding not yet attempted |
| X Layer explorer | `https://www.okx.com/web3/explorer/xlayer-test` | Contract and transaction proof | Public web | Used in planned deployment links |
| X Layer Builder Hub | `https://t.me` from official page | Support | Manual/community surface only | Not used in code path |

## Real State Transition To Prove

The demo must prove this real transition in code:

1. `mintPassport` creates a passport for a wallet and nation.
2. `createMatch` defines a labeled fixture in the resolver.
3. `submitPrediction` records a non-cash pick against that fixture.
4. `resolveMatch` posts a result through the admin resolver.
5. `settlePrediction` updates passport score and emits settlement proof.
6. `createBond` / `acceptBond` / `settleBond` records a non-cash rivalry receipt.
7. UI reads contract state or local anvil/test artifacts and labels any fixture as fixture/demo data.

## Blockers And Attempts Policy

- If `X_LAYER_DEPLOYER_PRIVATE_KEY` is absent or unfunded, stop live deployment and provide Foundry scripts, RPC smoke checks, and anvil tests.
- If the faucet requires CAPTCHA, wallet approval, passkey, or unavailable OKX Wallet state, record the exact blocker and ask Gabriel for a funded deployer or approved wallet path.
- If submission requires a live X post, do not fake one. Record blocker until Gabriel provides or approves a dedicated project X handle and post.
- If Google Form draft saving is unsafe or irreversible, record required fields only and stop.
