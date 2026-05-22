Execute this hackathon idea.

Gabriel hard override for this run:
- No fake implementation, no hidden mocks, no unlabeled simulations.
- Build real working and tested code. If a live X Layer transaction, funded deployer, wallet signature, sports-data API, X account action, GitHub account action, or submission portal action is required and cannot be obtained through documented self-service, stop that specific part and write the exact blocker plus what Gabriel must provide.
- The World Cup has future matches, so do not claim live match data. Use a real on-chain/admin resolver path or verifiable public fixture ingestion path. Test fixtures are allowed only inside tests or seed scripts and must be labeled as tests/fixtures in UI, README, TRUTH_AUDIT.md, and QUALITY_GATE.md.
- Prefer a real X Layer testnet/mainnet deployment path immediately. If deployer funds/private key are missing, implement the contracts, deployment scripts, RPC smoke checks, and local/anvil tests, then ask Gabriel for a funded deployer or approved wallet path.
- Team assignment: Gabriel, Marsella, Jenifa. Primary repo owner should be Gabriel unless browser preflight proves another assigned account is better.

Hackathon: X Layer X Cup Hackathon 2026
Idea: X Cup Passport + Banter Pools
Execution workspace: /Users/gabrielantonyxaviour/Documents/hackathons/x-layer-x-cup-hackathon-2026/execution/2026-05-22T01-33-56Z-x-cup-passport-banter-pools
Report output: /Users/gabrielantonyxaviour/Documents/hackathons/x-layer-x-cup-hackathon-2026/execution/2026-05-22T01-33-56Z-x-cup-passport-banter-pools/outputs/builder-report.md

## Assigned Team

No hard-coded team was found for this hackathon. Before persona-owned repo or submission work, read /Users/gabrielantonyxaviour/Documents/hackathons/submission-profile-registry.json and write TEAM.md with the chosen primary submitter, repo owner, and supporting personas. If the team is ambiguous, stop at a blocker note instead of guessing.


Required source files:
- /Users/gabrielantonyxaviour/Documents/agents/docs/hackathons/browser-execution-runbook.md
- /Users/gabrielantonyxaviour/Documents/agents/docs/hackathons/execution-quality-runbook.md
- /Users/gabrielantonyxaviour/Documents/hackathons/submission-profile-registry.json
- /Users/gabrielantonyxaviour/Documents/templates/INDEX.md
- /Users/gabrielantonyxaviour/Documents/templates/.motionsites-prompts/INDEX.json
- /Users/gabrielantonyxaviour/Documents/hackathons/x-layer-x-cup-hackathon-2026/council/LATEST

Execution contract:
0. Execution/code-building authority is GPT-5.5 or Claude Opus 4.7 only. Do not use Kimi to build project code. If Kimi artifacts exist, treat them as planning notes that must be verified before implementation.
1. Read the browser execution runbook, execution quality runbook, and profile registry before any GitHub, sponsor dashboard, Gmail, or submission-portal work.
2. Read the latest council run for this hackathon: TOP_10.json, EXECUTION_QUEUE.json, IDEAS.md, and the most relevant outputs/*.md files.
3. Before app generation, write SPONSOR_ACCESS_PLAN.md and API_PLAN.md:
   - Identify the official sponsor/platform APIs, SDKs, docs, faucets, wallets, dashboards, and submission surfaces required for this idea.
   - Use logged-in browser/profile flows where needed to obtain access, keys, faucets, test credentials, or dashboard state. Ask Gabriel only after documented self-service attempts fail.
   - Define the real state transition the demo must prove. Do not replace it with an unlabeled mock.
   - If a fixture is unavoidable, label it as fixture/demo data and keep a separate path to real integration proof.
5. Before app generation, inspect /Users/gabrielantonyxaviour/Documents/templates/INDEX.md plus /Users/gabrielantonyxaviour/Documents/templates/.motionsites-prompts/INDEX.json and the most relevant MotionSites prompt/source files. Write UI_TEMPLATE_PLAN.md with the chosen production template, chosen MotionSites prompt(s), visual system, first-screen judge moment, motion language, interaction details, and what should be copied as code/design patterns. High-end UI is required; a plain CRUD dashboard is not acceptable.
6. The project landing page and the whole product vibe must visibly borrow from Gabriel's templates catalog. Prefer direct code/style integration from the template repos/prompts when practical, while preserving the hackathon product's own brand and functionality.
7. Write these planning and truth files in the execution workspace before claiming implementation is underway:
   - TEAM.md: exact person, Chrome profile directory, email, and ownership role for this submission.
   - BUILD_PLAN.md: concrete build plan, stack, app scope, demo path, plugin/backend/API choices, UI direction, and timeboxed milestones.
   - FEATURE_MATRIX.md: every promised feature, source evidence, implementation file/route/API/contract, test/proof command, status, and gap.
   - INTEGRATION_MATRIX.md: every external protocol/API/platform/wallet/dashboard dependency, real access path, env var, proof command, fixture policy, and blocker.
   - TRUTH_AUDIT.md: claim-by-claim reality check separating real, fixture/demo, mock, blocked, not attempted, and removed claims.
   - QUALITY_GATE.md: checks, browser proof, local visual QA, formal polish status, security/audit status, repo/deploy/submission readiness, and final status.
   - SPONSOR_ACCESS_PLAN.md or PLUGIN_PLAN.md: concrete sponsor/platform/plugin access plan.
   - API_PLAN.md or BACKEND_PLAN.md: data model, APIs, functions, secrets, real integration proof path, and fallback policy.
   - UI_TEMPLATE_PLAN.md: selected production template, selected MotionSites prompt(s), landing-page vibe, motion/interaction rules, concrete files/components/styles to reuse or adapt, and visual QA acceptance criteria.
   - REPO_PLAN.md: public repo name, owner, creation method, visibility proof, and push/deploy steps.
   - SUBMISSION_PORTAL_PLAN.md: portal URL, account/profile used, required fields, assets still missing, and current prefill status.
   - EXECUTION_PACKET.md: single source of truth for README, demo script, video script, judging criteria mapping, links, and final checklist.
8. Create or verify a proper public GitHub repo for the selected primary owner only after confirming the active GitHub account matches the assigned chromeDir/profile. Use agent-browser for persona-owned repo creation when the repo must belong to a specific persona. Do not create private repos for hackathon submissions unless the rules explicitly require it.
9. Start submission portal preparation in parallel with build work: open the relevant portal with agent-browser, confirm login/profile, identify required fields, and record evidence in SUBMISSION_PORTAL_PLAN.md. Prefill only reversible fields if the portal safely supports drafts. Stop before legal attestations, eligibility checkboxes, irreversible registration, or final submission unless Gabriel explicitly authorizes that exact action.
10. Model and agent routing policy:
   - Use GPT-5.5 with xhigh reasoning effort for architecture, hard product calls, integration logic, real backend/API work, and final acceptance decisions.
   - Use Claude Opus/Claude CLI for frontend-heavy implementation, UI polish critique, copy/interaction refinement, and visual QA support when useful.
   - Use Kimi only for non-authoritative grunt work such as read-only inventory, summarizing local docs, extracting candidate data, or generating planning notes. Do not let Kimi write product code or decide architecture.
   - Any implementation from Claude or Kimi must be reviewed by the GPT-5.5 builder before it is treated as accepted.
11. Do not ship fake or mock implementation as if it were real. If an external API, faucet, wallet, sponsor system, or dashboard is needed, first try to obtain or configure it through logged-in browser/profile flows and documented runbooks. If that fails, write the exact blocker, what was attempted, and the smallest concrete thing Gabriel must provide. Fixtures are allowed only when they are visibly labeled in UI, README/demo copy, TRUTH_AUDIT.md, and QUALITY_GATE.md.
12. Begin reversible setup and implementation immediately after the plans and matrices are written. Reversible setup includes scaffolding the app/repo, writing README/demos/scripts, preparing seed data only when honestly labeled, opening owned browser/profile surfaces where needed, enabling backend services, and starting app implementation. Do not stop at a plan if build work can begin.
13. Keep a live progress log at PROGRESS.md with timestamped notes every phase, including blockers, exact files changed, active browser session name, owned app URL, public app URL when known, test/verification evidence, and quality-gate status.
14. Build, test, fix, and retest repeatedly. Run unit/type/build checks, integration/RPC/API/contract smoke checks, browser proof, and screenshot proof. If formal M2 /polish is unavailable, run local visual QA at 375, 768, and 1440 and label it local-visual-qa-passed; formal-polish-blocked-by-m2. Do not block visual QA just because M2 is down.
15. Before final report, update FEATURE_MATRIX.md, INTEGRATION_MATRIX.md, TRUTH_AUDIT.md, and QUALITY_GATE.md. Final status must be exactly one of submit-ready, demo-ready, blocked, or prototype. Do not call the app fully developed unless QUALITY_GATE.md says submit-ready.
16. Write the final builder report to /Users/gabrielantonyxaviour/Documents/hackathons/x-layer-x-cup-hackathon-2026/execution/2026-05-22T01-33-56Z-x-cup-passport-banter-pools/outputs/builder-report.md. The report must include final status, repo status, submission portal status, plugin/backend/API status, real integrations proven, fixtures/mocks with labels, UI/template status, build status, tests run, browser proof, local visual QA status, formal polish status, blockers, and next actions.

Start now.
