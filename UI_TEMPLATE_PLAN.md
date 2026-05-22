# UI Template Plan

Date: 2026-05-22

## Selected Template Direction

- Production template catalog anchor: `template-creative-tool` / `template-saas-marketing` from Gabriel's templates catalog for product-first SaaS clarity.
- MotionSites prompt anchor: `orbis-nft-landing` for liquid glass, cinematic video-backed first viewport, condensed uppercase typography, receipt-card grid, and high-contrast collectible feel.
- Supporting prompt: `codenest-coding-platform` for dark hero with vertical grid lines, glow layer, and compact proof card above the headline.

## Visual System

- Product name: `X Cup Passport`.
- Mood: tournament-night command surface, not a plain CRUD dashboard.
- Typography: condensed display headings inspired by Orbis; readable sans/mono body for proof data and hashes.
- Palette: near-black field, off-white text, bright pitch-green accents, amber/orange result accents, and magenta receipt highlights. Avoid a one-note purple or dark-blue palette.
- Texture/motion: subtle grain, liquid-glass panels, moving/video-backed hero, animated proof rail, hover lift on receipts, and compact transaction chips.

## First-Screen Judge Moment

The first viewport must show the full loop at a glance:

`Mint passport -> Pick match -> Resolve fixture -> Claim receipt`

It must also show proof language: X Layer testnet target, non-cash predictions, fixture/demo label, and explorer links when available.

## Interaction Details

- Primary CTA opens the demo cockpit section.
- Demo cockpit has action buttons for local/anvil or connected wallet flow.
- Fixture labels are visible before any prediction action.
- Share card renders post copy tagging `@XLayerOfficial` and `#BuildX`, but it is copy-only until Gabriel approves real posting.
- Mobile layout keeps proof chips and action buttons readable without horizontal overflow.

## Code/Design Patterns To Reuse

- Liquid-glass CSS border treatment from `orbis-nft-landing`.
- Full-bleed motion/video hero from `orbis-nft-landing`, adapted to football/fan-proof language.
- Vertical grid lines and proof card composition from `codenest-coding-platform`.
- Dense product cockpit instead of marketing-only landing.

## Acceptance Criteria

- Local visual QA captures `/` at 375, 768, and 1440 widths.
- Hero, cockpit, cards, buttons, hashes, and fixture labels do not overlap.
- UI never calls fixture data live sports data.
- UI visibly borrows from Gabriel's template catalog while retaining this hackathon product identity.
