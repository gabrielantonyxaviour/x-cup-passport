# Deployments

Date: 2026-05-22

## X Layer Testnet

Status: blocked

| Item | Value |
|---|---|
| RPC | `https://testrpc.xlayer.tech/terigon` |
| Chain ID | `1952` |
| Explorer | `https://www.okx.com/web3/explorer/xlayer-test` |
| Required env | `X_LAYER_DEPLOYER_PRIVATE_KEY` |
| Blocker | No funded deployer private key or approved wallet signing path is present in this workspace |

Deployment command once funded:

```bash
export X_LAYER_TESTNET_RPC_URL=https://testrpc.xlayer.tech/terigon
export X_LAYER_DEPLOYER_PRIVATE_KEY=0x...
pnpm deploy:xlayer:testnet
```

## Local / Anvil

Status: verified on 2026-05-22

Local command:

```bash
anvil
pnpm deploy:local
```

Verified local broadcast:

| Contract | Local address | Local deploy tx |
|---|---|---|
| `XCupPassport` | `0x0b306bf915c4d645ff596e518faf3f9669b97016` | `0xf4d5bee887a80e4e42efa3e2072f9fc0cd61baee401eeefc55260e76eef7002a` |
| `MatchResolver` | `0x959922be3caee4b8cd9a407cc3ac1c251c2007b1` | `0x1f4bfe48a07ee7aaf5427676888066e63b41b139738595246e88e37bddad8a09` |
| `PredictionPool` | `0x9a9f2ccfde556a7e9ff0848998aa4a0cfd8863ae` | `0x97c3a83141c504942401f653d23b8932c8d22b74516b840708e9dd3baf7ab76e` |
| `BanterBond` | `0x68b1d87f95878fe05b998f19b66f4baba5de1aed` | `0xd98c43c63ab3574ed60c8665359d3f988372d59e43fdc7e9502b728e3da3d601` |

Local state-transition smoke:

- Created fixture `Brazil vs Japan`.
- Minted passport from local account `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`.
- Submitted prediction for match `1`.
- Resolved result as Brazil `2-0`.
- Settled prediction and read passport state: owner `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`, nation `Brazil`, score `3`, predictions `1`, badges `1`.

This is local/anvil proof only, not X Layer deployment.
