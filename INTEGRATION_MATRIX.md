# Integration Matrix

Hackathon: X Layer X Cup Hackathon 2026  
Idea: X Cup Passport + Banter Pools  
Date: 2026-05-22

| Dependency | Real access path | Env / credential | Proof command or browser proof | Fixture policy | Status | Blocker |
|---|---|---|---|---|---|---|
| X Layer testnet RPC | Official docs: `https://testrpc.xlayer.tech/terigon` or `https://xlayertestrpc.okx.com/terigon` | Optional `X_LAYER_TESTNET_RPC_URL` | `pnpm rpc:smoke` returned `1952` | No fixture | tested | None for read-only smoke |
| X Layer deployer | Funded testnet/mainnet wallet | `X_LAYER_DEPLOYER_PRIVATE_KEY` | `forge script script/Deploy.s.sol --broadcast` | No fixture | blocked | Missing funded private key / approved wallet path |
| X Layer faucet | Official faucet page | Wallet/profile may be required | `agent-browser` Gabriel profile if attempted | No fixture | planned | May require wallet/CAPTCHA/user approval |
| X Layer explorer | `https://www.okx.com/web3/explorer/xlayer-test` | None | Explorer links from tx hashes | No fixture | planned | Needs deployed tx hashes |
| Sports fixtures | Future World Cup matches | None | Fixture file labels only | Fixture/demo data only, not live | planned | No live match data claim allowed |
| GitHub repo | Gabriel profile or verified `gh` account | GitHub auth | `gh auth status` active account `gabrielantonyxaviour` | No fixture | planned | Repo creation/push pending final packet update |
| X account/post | Dedicated project X account | X login/profile | Live URL only after approval | Copy-only until live | blocked | Dedicated handle and approved post missing |
| Google Form | Official form | Gabriel Google profile | `agent-browser` preflight saw required fields and Gabriel email checkbox | No fixture | partial | Final submit not authorized; X handle/post/repo fields missing |
