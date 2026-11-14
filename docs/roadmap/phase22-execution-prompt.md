# Phase 22 — Execution prompt (native build)

Operating prompt for Phase 22, in the same role as
`docs/roadmap/stage2-execution-prompt.md` was for Phase 21. Paste the block
below into a fresh Claude Code session after `/clear`.

Agreed with the founder in a claude.ai Project chat on 2026-11-14. Nothing in
it is recorded as a decision until the session writes D64–D67 to
`docs/decisions/log.md`.

**Track 0 runs in parallel, not as a gate.** Material surfaced from
`docs/intel/` on 2026-11-14 re-dates the D1 premise: an official COP32 digital
workstream (website and communications channels) has existed since about July
2026. No official COP32 *application* has been found. The founder's decision on
2026-11-14 is to build regardless, on the reasoning that arriving with
something strong beats arriving with a plan. Track 0 therefore answers the
ownership question in time for the demo conversation rather than blocking the
build. See `docs/intel/proposals/2026-11-14-review.md`.

---

```
PHASE 22 — BUILD THE REAL APP (Expo/React Native, Android APK first)

You are continuing the COP32 platform project in this repo. The repo is the
single source of truth. Act as a critical professional advisor: challenge weak
assumptions, refuse unnecessary work, name technical risk, and never invent
official information.

## 0. READ FIRST (in this order, before any plan or code)
- CLAUDE.md
- docs/decisions/log.md (D1–D63a; note D1, D11, D15, D16, D19, D21, D25–D27,
  D44/D44a, D51, D53–D63a and S1 finding F1)
- docs/roadmap/phase-status.md
- docs/product/final-blueprint.md
- docs/research/reality-check.md
- docs/ux/information-architecture.md and docs/ux/user-flows.md
- docs/design/design-system.md, docs/design/redesign-plan.md,
  docs/design/tokens.json
- docs/architecture/technical-architecture.md and docs/architecture/adr/
- docs/research/benchmark-findings.md and docs/research/benchmark-test-plan.md
- docs/intel/README.md, docs/intel/ALERTS.md and the most recent files in
  docs/intel/daily/
- prototype/ (index.html, app.js, sw.js, release.py) — the working PWA
Then report the highest D-number, the phase-status date, and anything in the
above that contradicts this prompt. Do not start building until you have.

## TRACK 0 — REALITY RE-CHECK (runs in parallel with Tracks A–F; do not block
## the build on it, but report findings as soon as you have them)
D1 rests on "no official COP32 platform announced as of 2026-10-01". That
premise is now known to be out of date. The founder has decided to build
anyway: even if an official effort is under way, a working app is a stronger
thing to put in front of officials than a proposal. Track 0 therefore exists to
make sure the demo conversation happens with eyes open, not to decide whether
the build proceeds.

Found in docs/intel/ on 2026-11-14, unfiled:
- A Tier-1 alert dated 2026-07-06 (Fana Media): "Ethiopia Unveils Official
  Digital Platforms for COP32". Fana reporting of the same date states that
  Ethiopia's preparations include "the launch of the conference's official
  website and digital communication platforms to provide verified information
  and updates", and cites "the official COP32 Ethiopia platform" as a source.
  The alert sat unactioned for 131 days.
- An official-looking COP32 site is live at cop32ethiopia.et in a
  "coming soon" state ("The Official Site of COP32 is Coming Soon. Join us in
  Addis Ababa, Ethiopia... Addis Ababa, Ethiopia • 2027").
- docs/intel/ watches cop32ethiopia.org, a DIFFERENT domain, whose snapshot is
  a WordPress maintenance page. The collector may have been watching the wrong
  host since it went live.
- Ethiopia and UNECA signed an agreement (reported Dec 2025) to support the
  organisation and delivery of COP32.
- Named officials, to be verified before any use: Dr. Gedion Timothewos
  (Minister of Foreign Affairs) as COP32 President-Designate; Fitsum Assefa
  (Finance Minister) as COP32 Chief Negotiator.

Establish, from primary sources and with every claim graded A–F per the brief's
research rules:
1. Which domain is the official COP32 host site, who operates it, and what
   "official digital platforms" were actually launched in July 2026 — a
   website, social channels, a delegate platform, an app, or a plan for one.
2. Whether a host-country mobile app is announced, procured or in development,
   and who owns that workstream. Check Ethiopian public procurement (e-GP),
   MinT, EPA/EFCCC and the COP32 secretariat, plus UNFCCC statements.
3. What UNFCCC supplies centrally. COP31 ran two apps — a host-country Super
   App by Türkiye's environment ministry and a separate UNFCCC "COP 31 Digital
   Platform" (both appear in docs/intel/ALERTS.md). Establish which half, if
   either, is open for COP32.

Then present the founder with a verdict and options, as Phase 0 requires:
- Open ground → carry on; propose the D1 amendment to "host-country app, built
  and ready for adoption".
- Official effort underway without an app → carry on, same repositioning, and
  name the owning body so outreach goes to the right desk.
- Official app already procured or in development → carry on building, but tell
  the founder immediately and change the framing of the demo, not the code. An
  app shown to a team that has already contracted a vendor must read as
  "here is what is possible, and here is what we can contribute", never as a
  competing bid. Draft that framing and put it in docs/demo/demo-script.md.
  Scope questions (what to cut, what to emphasise) go to the founder.

Write findings to docs/research/reality-check.md as a dated re-check section,
not as a replacement, and raise a decision for the founder. Do not pass this
track on your own judgement — it is the founder's call.

### Track 0b — intel pipeline repair (do alongside)
The pipeline works; its filtering does not. ALERTS.md holds 48 open Tier-1
items, most of them App Store noise matched on substrings ("ESP32-Cam",
"Atlas Copco", "Hegemonia", "COPRA MIS", "Coperniq"), which is why the one
genuinely critical item was invisible. Propose and, on approval:
- Require a word-boundary COP31/COP32 token, or an explicit publisher match,
  before an app listing can reach Tier 1.
- Correct the watched COP32 host domain, after Track 0 establishes which is
  official; keep watching the other and flag it if it is not ours.
- Triage the existing 48 alerts into filed / dismissed, via /intel-review.
- Add sources for procurement notices and UNECA/MFA COP32 statements.
Record as a decision. Keep the [skip netlify] commit convention.

## 1. WHAT CHANGED STRATEGICALLY
COP31 ran in Antalya 9–20 Nov 2026. Türkiye shipped TWO apps: an official
host-country "COP31 Türkiye Super App" (published by the Ministry of
Environment, Urbanization and Climate Change; ~187 MB; Android 7.0+; agenda,
venue map, My Pass, in-venue navigation, transport, accommodation, catering,
news, guest mode, plus a gamified experience) and a separate UNFCCC "COP 31
Digital Platform" for the delegate side. Report as publicly reported, not as
verified by us.
Consequence to reason about, not accept: the host-government Super App occupies
almost exactly the public/practical niche D1 framed as "complementary".
Ethiopia will need the same thing for COP32. Whether it has started is Track 0's
question. If it has not, the pitch shifts from "an unofficial companion" to
"the host-country app for Addis, built and working, ready to be adopted."
Propose the D1 amendment; do not apply it unilaterally.

## 2. NEW DECISIONS TO RECORD (docs/decisions/log.md, with reason,
alternatives, impact, status — founder approved 2026-11-14. D63 and D63a are
taken by the intel pipeline; these start at D64.)
- D64: Mobile framework is Expo + React Native (TypeScript), APK via EAS.
  Resolves the S1/ADR-006 deferral. Reasons: real native build, real push and
  offline, iOS parity later on one codebase, and S1 finding F1 (Flutter
  Ethiopic tofu + remote font fetching) counts against Flutter for an
  Amharic-first app. Mark ADR-006 superseded and write ADR-007.
- D65: Visual identity is our own, implemented as a swappable brand-token layer
  (brand name, wordmark, logo, palette, typography in one config). No UNFCCC,
  COP32 or Ethiopian-government marks, names-as-branding, or endorsement
  implication anywhere — not in the app, APK metadata, splash, icon or
  screenshots. The brand slot is a demo feature: official assets become a
  config change if and when permission is granted in writing.
- D66: Demo content policy — visually complete, factually honest. Every screen
  is fully populated (no empty states, no greyed placeholders, no per-card
  watermarks). But: no invented COP32 dates, attendance figures, APIs,
  partnerships, official decisions, or real named officials presented as
  confirmed. Publicly reported facts are marked as such on a sources screen.
  Fictional speakers and sessions use clearly invented names and affiliations.
  One discreet statement on first run and in About that content is illustrative
  pending official data. Keep the existing "not an official COP32 product"
  mechanism but redesign it to read as professional rather than as a prototype
  warning — propose the treatment to the founder before implementing.
- D67: COP31 benchmark is a feature/IA/UX study from publicly available
  material and founder-captured screenshots only. No decompiling, no asset or
  code extraction, no reuse of their marks or illustrations.

## 3. TRACK A — COP31 BENCHMARK
Inputs are in the repo at docs/research/cop31-captures/ — 20 full-resolution
screenshots (1080×2400) in screenshots/, 3 contact sheets from a 3-minute
screen recording in recording-frames/, and a README with provenance, a
screen-by-screen inventory, key observations, usage restrictions and the
capture gaps. Read that README first. All captured by the founder on a real
device on 14 Nov 2026 during the live conference. Treat as observed evidence,
not our analysis. Do not go looking for the app yourself.

Carry into the teardown, verifying each against the images:
- OFFLINE IS THEIR WEAK POINT. Airplane mode shows an "Offline" banner, cached
  hero content renders, but event lists fail with "Something went wrong /
  Retry". Previously-visited detail pages render fully from cache. Cache-on-
  read, not offline-first. Observed on three screens; state what remains
  unverified, and make offline-first our primary differentiator with a
  concrete, testable target.
- No dark mode anywhere except the Caretta chat screen.
- Their search screen enumerates their whole content model: programme,
  speakers, areas, stands, restaurants, COP-ART, news, partners, pavilions,
  FAQs.
- Caretta is a generative AI chat carrying an accuracy disclaimer. Assess that
  risk on a safety-critical event app and propose a retrieval-only,
  offline-capable alternative answering from vetted content. Do not clone the
  mascot.
- Session detail depth is inconsistent — some pages carry speakers and full
  descriptions, others only a title, time and location card.
- Pavilion counts moved 157 → 160 within one evening; their content is live.
- Transport route planning and stand-level floor-plan wayfinding are their
  strongest features. Assess what an Addis equivalent needs and what it depends
  on that we do not have.
Also check docs/intel/ for COP31/COP32 app signals already collected — the
alerts list includes COP31 Volunteer and COP31 ITSM listings alongside the two
main apps, which indicates the wider app estate a host actually ships.

Produce docs/research/cop31-app-teardown.md with: full IA and navigation map ·
screen inventory · feature table tagged must-match / beat / deliberately skip,
each with a reason · interaction, motion and offline behaviour · visual
critique naming specific weaknesses we can beat · gap table against
docs/product/feature-catalog.md and our IA · a "how we win" section tied to
Ethiopian constraints (bandwidth, device mix, Amharic).

Tag every line: observed in app / publicly reported / our analysis. Nothing
about their internals, code or data model is observable — do not infer it.
Open gaps to list: cold start and first-run onboarding, whether dark mode
exists app-wide, Turkish layout under long strings, any signed-in state
(My Pass, My Reservations), push notification appearance, Programme Filter
sheet.

Then update docs/research/benchmark-findings.md, close the Phase 4 hands-on
gap, and state plainly what still rests on desk evidence.

## 4. TRACK B — DESIGN SYSTEM, PRODUCTION GRADE
Port and raise docs/design/ into a real RN design system package:
- Consume docs/design/tokens.json as the source; keep build_tokens.py as the
  generator. New tokens go there, never hardcoded in components.
- Highland Mist (D53) as the default brand, expressed as brand tokens (D65),
  with a second example brand proving the swap works.
- Typography: bundle Atkinson Hyperlegible Next + Noto Sans Ethiopic in the app
  (D11). No remote font fetching, ever. Verify Amharic rendering and the ✓
  glyph on device.
- Light and real dark mode; 200% text scale without clipping or horizontal
  scroll; 48/44 px targets; WCAG 2.2 AA contrast with a computed check in CI.
- Components: lists, grouped inset cards, sheets, tabs, large collapsing
  headers, chips, alerts/banners, map sheets, skeletons, empty and error
  states, toasts. Document usage rules for each.
- Motion: a small, consistent spec (durations, easings, reduced-motion
  honoured). This is where we beat COP31 — restrained, fast, deliberate.
- Lucide outline icons as SVG only; illustrated faceless avatars; keep the 46
  openly licensed photos (D57) with the in-app credits screen.
Write docs/design/design-system.md to v1.0 and keep the screenshot set current.

## 5. TRACK C — THE APP
Build every screen in docs/ux/information-architecture.md with the D44/D44a
cross-links intact. Offline-first: local store, background sync, graceful
degradation on throttled 3G against the D27 budgets — every list and detail
view must render from cache with no "something went wrong". i18n EN + Amharic
from the start, language switch, correct Ethiopic line-breaking. Guest-first,
no account required, device-first personal data, no ad or tracking SDKs (D21).
Content comes from a local seeded data layer behind a repository interface so a
real CMS/API can replace it later without touching screens. Push and alerts
wired but authorisation-gated and clearly non-live.
Build in ordered batches, committing after each: (1) app shell, navigation,
theming, i18n, fonts; (2) Home + Updates/alerts; (3) Programme + session pages
+ My agenda; (4) Map + place sheets; (5) Visit guides + Emergency; (6) Learn,
glossary, explainers, search; (7) Settings sheet, About, credits, sources.
After batch 1, STOP and show the founder a screenshot set before continuing.

## 6. TRACK D — QUALITY GATES (run and report; never claim what you did not run)
- TypeScript strict, lint, unit tests on the data layer and i18n
- Accessibility: automated checks on every screen, light and dark, EN and AM,
  plus a manual screen-reader checklist the founder can execute on a device
- Tree test T1–T12 still resolve
- Performance: cold start, first meaningful render, bundle size, APK size
  (COP31's is ~187 MB — beating that materially is a quotable win)
- Offline: airplane-mode cold start, airplane-mode navigation across every tab,
  sync-on-reconnect. This is the gate that matters most.
State which results are emulator/sandbox and which need real devices. Nothing
sandbox-derived is presented as real-device validation.

## 7. TRACK E — APK AND DEMO
- Signed release APK for sideloading, internal demo only (no store-ready legal
  entity yet per D39 — do not plan a Play listing). Document the build command,
  signing key handling (keys never committed), and how the founder rebuilds it.
- Verify install and run on Android 7.0+ and on a 320–390 px wide phone.
- docs/demo/demo-script.md: a 7–10 minute walkthrough for senior officials, the
  6 screens that carry the pitch, the offline demonstration, the brand-swap
  moment, the honest answer to "is this official?", and the three asks
  (official programme data access, alert authorisation, logo permission).
- docs/demo/one-pager.md.

## 8. TRACK F — UPDATE THE RECORD
Update docs/roadmap/phase-status.md (header date and a Phase 22 section),
docs/decisions/log.md (D64–D67, the Track 0 verdict, the intel-repair decision
and the D1 amendment proposal), ADR-006/007, and the Phase 0, 4 and 21 rows.
Keep both files readable to a chat surface with no repo tree. List every open
item honestly: real-user IA testing, real-device spikes S1/S6, provider
outreach S5, native-speaker Amharic review, legal foundation, official data
access.

## 9. HOW TO WORK
Work on a branch, not main, and do not push to main without the founder asking
in that conversation (CLAUDE.md). Plan first in writing as
docs/roadmap/phase22-execution-plan.md and show it before writing code. Commit
per batch with clear messages. Stop and ask when: a decision would change D1 or D65, an external
dependency is missing, a quality gate fails in a way that needs a scope call,
or you are about to invent a fact. Do not expand scope to match COP31
feature-for-feature. Do not lock anything beyond D64 without asking.
```
