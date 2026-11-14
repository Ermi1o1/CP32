# COP31 app captures — benchmark source material

Primary source material for `docs/research/cop31-app-teardown.md` (Phase 22,
Track A). Everything here was captured by the founder from the **official COP31
Türkiye host-country app** on a personal Android device on **14 November 2026**,
during the live conference (COP31 ran 9–20 November 2026 in Antalya).

Captured while the app was fully populated with live conference data. That
window closes when COP31 ends on 20 November 2026, after which the app empties
out and this material cannot be reproduced.

## Provenance and method

- **App:** COP31 Türkiye (official host-country app, published by the Republic
  of Türkiye's Ministry of Environment, Urbanization and Climate Change).
  Reported at ~187 MB, Android 7.0+. Guest mode, not signed in.
- **Method:** on-device screenshots and one screen recording, taken by hand
  while navigating the app as an ordinary public user.
- **Not done, and not to be done:** no decompiling, no APK extraction, no asset
  or code extraction, no network interception, no scraping. Nothing about the
  app's internals, backend, data model or APIs is observable from this material
  and none of it may be inferred as fact. See D66.

## Usage restrictions

- **Internal benchmarking only.** These are screenshots of a third party's
  copyrighted application containing UNFCCC, Türkiye government and sponsor
  marks.
- **Never publish or redistribute them.** They must not appear in the proposal
  dossier (`deliverables/`), in demo material, in any outreach pack, or in
  anything shown outside the project team.
- **They must never be placed under `prototype/`.** That directory is published
  to the public CDN by `netlify.toml` (D60/D61). `docs/` is not published, which
  is why they live here.
- Our own app must not copy their marks, illustrations, mascot or layouts. The
  teardown informs what we build; it is not a template to trace (D64, D66).

## Contents

### `screenshots/` — 20 files, 1080×2400, named by capture time

| File | Screen |
|---|---|
| `Screenshot_20261114_180909.jpg` | Programme Detail (thin variant — title, time, actions, location card only) |
| `Screenshot_20261114_180915.jpg` | Venue map — place sheet (Go here / View on floor plan / View details), filter chips with counts, location-services prompt |
| `Screenshot_20261114_180940.jpg` | My Agenda — month calendar, All/Today/Reminder On/Saved/My registrations chips, empty state |
| `Screenshot_20261114_180955.jpg` | Search — empty state listing their full content model |
| `Screenshot_20261114_181021.jpg` | Caretta AI assistant — generative chat, suggested prompts, accuracy disclaimer (only dark-themed screen in the app) |
| `Screenshot_20261114_181051.jpg` | Transport — route planner, Route/Lines/Stops/Places tabs |
| `Screenshot_20261114_181101.jpg` | Food & Drink — 111 venues, 78 brands, 68 open now; category tiles, open/closed status |
| `Screenshot_20261114_181113.jpg` | Hubs list |
| `Screenshot_20261114_181121.jpg` | Hub detail — Science & Technology (areas/sessions counts, floor plan link, featured events) |
| `Screenshot_20261114_181229.jpg` | News article detail — Day 4 press release |
| `Screenshot_20261114_181303.jpg` | Pavilions list — 160 pavilions, search, zone filters, A–Z sort |
| `Screenshot_20261114_181311.jpg` | Pavilion detail — Africa Pavilion (Today/Total/Up Next stats, date strip, ENDED states) |
| `Screenshot_20261114_181339.jpg` | Visitor Services — 112 emergency call, service tiles |
| `Screenshot_20261114_181404.jpg` | Partners — sponsorship tiers with stand numbers |
| `Screenshot_20261114_181445.jpg` | COP31 Vision — thematic image tiles |
| `Screenshot_20261114_181516.jpg` | Press Releases — grid |
| `Screenshot_20261114_181541.jpg` | About — what is COP / what is COP31 |
| `Screenshot_20261114_181708.jpg` | **OFFLINE** — Thematic Days Day 7: banner, cached hero, events fail |
| `Screenshot_20261114_181756.jpg` | **OFFLINE** — Thematic Days Day 6: same pattern |
| `Screenshot_20261114_181816.jpg` | **OFFLINE** — Programme Detail renders fully from cache, speakers included |

### `recording-frames/` — 3 contact sheets

62 frames sampled at 3-second intervals from a 3 min 6 s screen recording
(480×1014 — too low for type or spacing detail, adequate for IA and layout).
Covers screens absent from the stills: Home in full scroll, Zones, Blue Zone
detail, Green Zone, floor plan with stand-level wayfinding, the drawer menu,
the TR/EN language toggle, the Turkish interface, and first-run coach marks.

The source `.mp4` is deliberately not committed (≈45 MB, and the frames are the
usable form). It is held by the founder.

## Key observations

Stated as **observed** — what the images show. Not verified beyond these
screens, and not to be generalised without saying so.

1. **Offline is cache-on-read, not offline-first.** In airplane mode the app
   shows an "Offline" banner and renders cached hero content, but event lists
   fail with "Something went wrong / Retry". A Programme Detail already visited
   renders in full. Observed on three screens; the pattern across the rest of
   the app is unverified. This is the clearest opening for an Ethiopia-targeted
   app on patchy mobile data.
2. **No dark mode** anywhere except the Caretta chat screen.
3. **Their search screen enumerates their whole content model:** programme,
   speakers, areas, stands, restaurants, COP-ART, news, partners, pavilions,
   FAQs.
4. **Caretta is a generative AI chat** carrying "responses may be inaccurate" —
   a real exposure on a safety-critical event app.
5. **Session detail depth is inconsistent** — some pages carry speakers and full
   panel descriptions, others only a title, time and location card.
6. **Content is live:** pavilion count moved 157 → 160 within the same evening.
7. **Transport route planning and stand-level floor-plan wayfinding** are their
   strongest features.

## Not captured — open gaps

- Cold start and the full first-run onboarding sequence
- Whether dark mode exists app-wide
- Turkish layout under long strings (our proxy for Amharic text expansion)
- Any signed-in state — My Pass, My Agenda with content, My Reservations
- Push notification and alert appearance
- The Programme Filter sheet
