# Judging Map

Date: 2026-05-22

## Innovation

X Cup Passport is not a generic prediction dashboard. It makes the World Cup-specific sequence of pick, rivalry, result, score, and receipt into the product mechanic.

## Market Potential

The product can prompt repeat fan actions for every matchday: mint a passport, make a non-cash pick, challenge a friend, settle the result, compare nation scores, and share the receipt.

## Completion

Completion is measured by:

- Foundry tests passing for passport, resolver, prediction, and banter state transitions.
- A runnable React app with visible fixture labels.
- A deployment script for X Layer testnet.
- Honest blocker docs when live deployer funds or project X account are unavailable.

## On-Chain Data

The intended on-chain proof events are:

- `PassportMinted`
- `MatchCreated`
- `PredictionSubmitted`
- `MatchResolved`
- `PredictionSettled`
- `ScoreUpdated`
- `BondCreated`
- `BondAccepted`
- `BondSettled`

## Demo Video Arc

1. Show fixture/demo label.
2. Mint a passport.
3. Submit a non-cash prediction.
4. Resolve the fixture.
5. Settle score and badge.
6. Show banter receipt and share copy.
7. Show explorer links if deployment is complete; otherwise show local/anvil proof and the deployer blocker.
