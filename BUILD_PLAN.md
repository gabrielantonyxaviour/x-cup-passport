# Build Plan

Date: 2026-05-22

## Goal

Build a real, testable X Cup Passport + Banter Pools MVP with contracts, local/anvil proof, deploy scripts for X Layer, a high-end Vite React UI, and honest submission artifacts.

## Stack

- Solidity `^0.8.24` with Foundry.
- Vite React TypeScript frontend.
- `viem` for wallet/RPC interactions.
- `lucide-react` for UI icons.
- No hidden backend and no unlabeled mocks.

## Scope

| Phase | Work | Done when |
|---|---|---|
| 1 | Planning/truth docs | Mandatory docs exist and blockers are explicit |
| 2 | Contracts | Foundry compile and tests pass for passport, resolver, pool, bond |
| 3 | Scripts | Anvil deployment/seed works; X Layer deploy script is ready |
| 4 | UI | Landing/cockpit/readme demo path exists with fixture labels |
| 5 | Verification | Tests, build, RPC smoke, browser proof, visual QA |
| 6 | Packet | README, matrices, quality gate, report updated |

## Demo Path

1. Open app.
2. Review visible fixture/demo data label.
3. Mint passport for a nation.
4. Submit a non-cash pick.
5. Resolve the fixture through admin/demo resolver.
6. Settle prediction and view score.
7. Create/settle Banter receipt.
8. Copy the `@XLayerOfficial #BuildX` share text with tx placeholders or real hashes.

## External Dependencies

The only required external protocol path is X Layer. If deployer funds are missing, the build still ships deploy scripts and local/anvil tests, and final status remains blocked/prototype instead of pretending deployment happened.
