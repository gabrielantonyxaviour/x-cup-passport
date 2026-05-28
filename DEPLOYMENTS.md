# Deployments

## X Layer Testnet (chain 1952) — build-to-win redeploy

**Deployed:** 2026-05-29
**Deployer:** `0x933A12041Aae93Ac24Ec739C21c85CF26200355f` (Ratna persona)
**Why redeployed:** `XCupPassport` rewritten as a real **soulbound, dynamic ERC-721** with fully on-chain SVG `tokenURI` + ERC-4906 (the previous version was a non-standard struct, not an NFT). All four contracts redeployed clean with WC2026 fixtures seeded.

| Contract | Address | Deploy Tx |
|---|---|---|
| XCupPassport (soulbound dynamic ERC-721) | [`0xf8a679f1aeaa2482859175861a2c583ca1eb97f8`](https://www.okx.com/web3/explorer/xlayer-test/address/0xf8a679f1aeaa2482859175861a2c583ca1eb97f8) | [`0x208dc3a6…`](https://www.okx.com/web3/explorer/xlayer-test/tx/0x208dc3a693cfd15e002481032cd595cdb212bb97ccf8c2000144a4ea810c3249) |
| MatchResolver | [`0x64b3787c041393c083b94e55becf2665fc520dee`](https://www.okx.com/web3/explorer/xlayer-test/address/0x64b3787c041393c083b94e55becf2665fc520dee) | [`0xbbc480d9…`](https://www.okx.com/web3/explorer/xlayer-test/tx/0xbbc480d9c565ab51058fe1744c68889e5ada0099dd06f1bdc467c5c526c419d2) |
| PredictionPool | [`0x087521f9ff3ecb4f3503d152e4d7a6dd68a0cc1e`](https://www.okx.com/web3/explorer/xlayer-test/address/0x087521f9ff3ecb4f3503d152e4d7a6dd68a0cc1e) | [`0xdefad585…`](https://www.okx.com/web3/explorer/xlayer-test/tx/0xdefad5850c0155a5b3eddb05051a35668270cb39e8efeb0cfced7d8256d639d1) |
| BanterBond | [`0x24b52bf60e99f4801446e2a12666041efeb2a74f`](https://www.okx.com/web3/explorer/xlayer-test/address/0x24b52bf60e99f4801446e2a12666041efeb2a74f) | [`0xfed53a5e…`](https://www.okx.com/web3/explorer/xlayer-test/tx/0xfed53a5ebe728fa87aed4a46bbe174bf9876a84840eb7e6e18355b2fa5ccf959) |

Post-deploy wiring (in the same broadcast): `XCupPassport.setGameAuthorization(PredictionPool, true)` + 8 `MatchResolver.createMatch(...)` seeding simulated WC2026 group-stage fixtures (`demoFixture = true`).

### On-chain verification (live, 2026-05-29)

- `name() = "X Cup Passport"`, `symbol() = "XCUP"`.
- `supportsInterface(0x80ac58cd) = true` (ERC-721), `supportsInterface(0x49064906) = true` (ERC-4906).
- `nextMatchId = 9` → 8 fixtures seeded.
- **Full loop proven on-chain:** minted passport #1 (Brazil) → submitted 3 predictions (matches 5/6/7) → resolved + settled → passport `score = 30`, `predictions = 3`, `badges = 3`, **`stageOf(1) = "Round of 16"`** (evolved from Group Stage). Live `tokenURI(1)` decodes to valid JSON + on-chain SVG reflecting the new stage.

### Fixtures (simulated, pre-tournament — admin/owner resolved, no live sports oracle)

| matchId | Fixture |
|---|---|
| 1 | Mexico vs Croatia |
| 2 | USA vs Wales |
| 3 | Canada vs Belgium |
| 4 | Argentina vs Nigeria |
| 5 | Brazil vs Serbia |
| 6 | France vs Australia |
| 7 | England vs Iran |
| 8 | Spain vs Japan |

## RPC

- `https://testrpc.xlayer.tech/terigon`
- Chain ID: 1952
- Explorer: `https://www.okx.com/web3/explorer/xlayer-test`

## Reproduce

```bash
set -a; source .env; set +a   # X_LAYER_TESTNET_RPC_URL, X_LAYER_DEPLOYER_PRIVATE_KEY
forge script contracts/script/Deploy.s.sol \
  --rpc-url "$X_LAYER_TESTNET_RPC_URL" \
  --private-key "$X_LAYER_DEPLOYER_PRIVATE_KEY" \
  --broadcast --legacy
```

## Proof artifacts

- `broadcast/Deploy.s.sol/1952/run-latest.json` — full forge broadcast record.

## X Layer Mainnet

Not attempted. Hackathon submission is testnet-only.
