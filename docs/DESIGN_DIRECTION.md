# X Cup Passport — Design Direction (locked)

Creative direction for the production rebuild. `ui-build` follows this exactly.

## Personality

**Archetype:** Dark Cinematic — pushed energetic (Linear/Vercel structural rigor + stadium-night atmosphere + World Cup vibrancy). Premium and credible, not a dev tool; exciting and alive, not a hackathon demo. Think a high-end sports-prediction product on a match night.

## The 3 dials

| Dial | Value | Meaning here |
|---|---|---|
| DESIGN_VARIANCE | **7** | Asymmetric, editorial. Left-aligned product-led hero (live passport on the right). No generic centered-grid layouts. |
| MOTION_INTENSITY | **7** | Cinematic: Lenis smooth scroll + GSAP scroll-scrub on landing, Framer Motion spring for the passport **level-up** moment, magnetic CTAs, kinetic score counters. Restrained on dense data screens. |
| VISUAL_DENSITY | **5** | Airy on landing/passport (one focal element), denser/cockpit on matchday + leaderboard (1px dividers, tabular/mono numbers). |

## Palette — "Stadium Night"

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#080B0A` | Deep stadium-night base (slight green-black undertone) |
| `--surface` | `#11161A` | Cards, panels |
| `--surface-2` | `#1A2128` | Raised / hover |
| `--border` | `#232C30` | 1px hairlines |
| `--text` | `#F2F5F4` | Primary text |
| `--text-muted` | `#8A9A93` | Secondary text |
| `--accent` | `#2BE38B` | **Electric pitch green** — primary CTA, "live", go. The signature color. |
| `--accent-press` | `#1FC578` | Pressed/active green |
| `--gold` | `#F5C451` | Championship/trophy/award moments only (sparingly) |
| `--danger` | `#FF5A5F` | Errors, loss, "fade" side of banter |

Floodlight glow = radial `--accent`/`--gold` at low opacity behind focal elements. Subtle film grain overlay for cinematic depth. **No purple. No white+purple gradient.**

## Typography (max 3 families)

- **Display / headings:** **Clash Display** 600/700 (Fontshare) — bold, sporty, confident.
- **Body / UI:** **Satoshi** 400/500/700 (Fontshare) — clean, modern, neutral-but-characterful.
- **Numbers / data:** **JetBrains Mono** 500 (Google) — scores, odds, leaderboard ranks, addresses (tabular, cockpit feel).
- Scale: **perfect-fourth (1.333)** on marketing surfaces, tighter (major-second) inside dense app screens. Fluid `clamp()` for hero.

```css
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&display=swap');
```
Add `preconnect` to fonts.googleapis.com + api.fontshare.com.

## Motion stack

`gsap + @gsap/react` (scroll-scrub hero, draw-in), `lenis` (smooth scroll on landing — mandatory), `framer-motion` (route transitions, passport level-up spring, banter receipt flip). Never animate width/height — use transform/clip-path. No CSS transitions for entrance.

## Layout / nav

- Real app shell: persistent top nav (logo · Matchday · Banter · Leaderboard · My Passport · wallet control on the right). Mobile = bottom tab bar (Matchday / Banter / Leaderboard / Passport).
- Wallet control per `ui-rules`: DiceBear avatar (`shapes` style, dark-cinematic), native OKB balance pill to the LEFT (single-chain → no chain switcher), dropdown with Manage Wallet (Privy `exportWallet`), copy address, disconnect.
- Every tx surfaces an explorer link; gas pre-check disables tx buttons when balance is dust ("Insufficient gas" + faucet link).

## Hero (landing)

Left-aligned, product-led: bold Clash Display headline + subcopy + primary CTA ("Mint your passport") on the left; the **live, evolving passport NFT** rendered on the right with a slow floodlight glow + grain. Atmospheric background (faint pitch-line grid + radial floodlight), NOT a plain dark void. **No floating "Live on X Layer" badge** above the headline — weave the chain into copy or a slim trust row.

## "How it works" / feature storytelling

NOT a card grid, NOT bento. Use a **numbered scroll-scrubbed narrative**: each step (Mint → Predict → Evolve → Share) gets its own viewport moment with a live mini-visual (the passport actually leveling up as you scroll). One feature = one moment.

## Anti-AI-slop bans (non-negotiable)

- ❌ Inter/Roboto/Space-Grotesk as primary face · ❌ purple / white+purple gradient
- ❌ feature card grid or bento on landing · ❌ floating beta/"Live on X" badge above headline
- ❌ stat cards as the dashboard hero (passport + primary action is the hero; matchday/leaderboard carry the data)
- ❌ search icon inside search inputs · ❌ back button atop detail pages · ❌ generic placeholder names/Lorem · ❌ skeletons everywhere (only where data truly loads)
- ❌ native `<input type=date|number>` — use proper components
