# Truth Audit

Hackathon: X Layer X Cup Hackathon 2026  
Idea: X Cup Passport + Banter Pools  
Date: 2026-05-22

| Claim | Reality: real / fixture / mock / blocked / not attempted / removed | Evidence | User-facing label needed? | Action |
|---|---|---|---|---|
| Official hackathon exists and requires X Layer deployment | real | Official page verified 2026-05-22 | No | Cite in README/report |
| X Layer testnet chain ID is 1952 | real | Official network docs verified 2026-05-22 | No | Use in config/scripts |
| World Cup match data is live | removed | User override says future matches | Yes | Never claim live match data |
| Demo fixture represents real live sports feed | removed | Fixture policy | Yes | Label as fixture/demo data |
| Product is deployed on X Layer | blocked | No funded deployer/private key yet; local/anvil deploy verified only | Yes | Ask Gabriel for funded deployer or approved wallet path |
| Product is submitted | not attempted | No final authorization | Yes | Stop before final form submit |
| Project X post exists | blocked | Required form field, no approved handle/post yet | Yes | Generate copy only |
| Local product works | real | `forge test`, `pnpm build`, local/anvil smoke, browser/Playwright proof | Fixture labels stay visible | Keep final status below submit-ready until live blockers clear |

Rules:
- Do not claim live, onchain, deployed, submitted, verified, paid, sent, minted, uploaded, or connected without evidence.
- Fixtures are allowed only when visible in UI, README, demo script, and QUALITY_GATE.md.
