# Feature Matrix

Hackathon: X Layer X Cup Hackathon 2026  
Idea: X Cup Passport + Banter Pools  
Date: 2026-05-22

| Feature / claim | Source evidence | Implementation path | Test / proof | Status | Gap / blocker |
|---|---|---|---|---|---|
| Passport mint | Council rank 1 requires dynamic passport NFT | `contracts/src/XCupPassport.sol`, UI mint panel | `forge test`, local/anvil smoke, browser preview | tested | X Layer live deployment still blocked |
| Non-cash prediction | Council and redteam require points/demo prediction, not betting | `PredictionPool.sol`, fixture UI | `forge test`, local/anvil smoke, browser preview | tested | X Layer live deployment still blocked |
| Admin resolver | User says future matches; use on-chain/admin resolver or public fixture ingestion | `MatchResolver.sol`, resolver UI | `forge test`, local/anvil smoke | tested | Uses labeled fixture/demo data for pre-tournament proof |
| Settlement updates score | Council demo path requires score/badge update | `PredictionPool.sol` calls `XCupPassport.recordPredictionResult` | `forge test`, local/anvil readback, Playwright proof `3 PTS` | tested | X Layer live deployment still blocked |
| Banter receipt | Council/rank 9 module requires non-cash rivalry receipt | `BanterBond.sol`, receipt card UI | `forge test`, browser preview | tested | Receipt is non-cash only |
| Leaderboard | Council requires leaderboard from events/state | UI reads local preview state; contracts expose state | Browser proof | implemented | Not global/live until indexed from deployed contracts |
| Share artifact | Official requires active X account; council requires share receipt | UI copy card, no live posting | Browser proof | implemented | Live X post blocked until handle/post approval |
| X Layer deployment | Official requires at least part deployed on X Layer | `script/Deploy.s.sol` and env vars | `forge script --rpc-url ... --broadcast` | blocked | Needs funded deployer/private key or approved wallet path |
| Test fixtures | User allows fixtures only in tests/seed scripts and labeled UI/docs | `src/data/fixtures.ts`, tests | Visible labels, truth audit, screenshots | tested | Must remain labeled |
