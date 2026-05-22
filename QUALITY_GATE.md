# Quality Gate

Hackathon: X Layer X Cup Hackathon 2026  
Idea: X Cup Passport + Banter Pools  
Date: 2026-05-22

Final status: demo-ready

| Gate | Evidence | Status |
|---|---|---|
| Unit/type/build checks | `forge build`; `forge test -vvv` 3 passed; `pnpm build` passed | passed |
| Integration/API/RPC/contract smoke checks | `pnpm rpc:smoke` returned X Layer testnet chain ID `1952`; local/anvil deploy and state-transition smoke passed | partial |
| Browser proof for primary flow | Playwright local proof produced `3 PTS` after fixture-preview clicks and screenshot `screenshots/visual-qa/playwright-flow-after-clicks-final.png` | passed |
| Local visual QA at 375 / 768 / 1440 | `screenshots/visual-qa/home-375-final2.png`, `home-768-final.png`, `home-1440-final.png`; mobile overflow check returned width `375`, viewport `375` | local-visual-qa-passed |
| Formal /polish | M2 env present; no attached Chrome at check time; local fallback used per runbook | formal-polish-blocked-by-m2 |
| Security/audit/dependency check | Secret scan over project excluding generated cache/broadcast found no real committed secrets; `.env` ignored; no prod `console.log` in app code | passed |
| Repo pushed | GitHub active account verified as `gabrielantonyxaviour`; repo push pending until final packet is committed | pending |
| Public/local demo URL | Local server running at `http://127.0.0.1:5175/` | local-ready |
| Submission portal prep | `agent-browser` preflight with Gabriel profile identified required Google Form fields; no submit | partial |
| Hidden mock/fake claim audit | Fixtures labeled in UI/docs; X Layer deployment, X post, and final submission blockers recorded | passed |

Allowed final statuses: submit-ready, demo-ready, blocked, prototype.
