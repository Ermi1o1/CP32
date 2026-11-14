# Phase Status (updated 2026-11-14)
## Documentation phases (project brief)
| Phase | Status | Key files |
|---|---|---|
| 0 Reality check | Done (D1); **re-check #3 on 2026-11-14 changed the verdict** — official COP32 website and channels exist, no official app found (D68 proposed; D70 proposes amending D1) | research/reality-check.md |
| 1 Discovery | Done (D2–D7) | product/discovery-answers.md |
| 2 Project definition | Done (approved) | product/project-definition.md |
| 3 COP32 research | Done (two passes; re-run when official pages publish) | research/cop32-context.md, ethiopia-digital-landscape.md |
| 4 Benchmarks | Done (desk); **one app observed first-hand 2026-11-14** (COP31 host app, founder's captures); all others still desk evidence; hands-on test plan still open | research/benchmark-findings.md, benchmark-test-plan.md, cop31-app-teardown.md |
| 5 Gap analysis | Done (approved) | research/gap-analysis.md |
| 6 Personas & journeys | Done (approved); BA interviews pending (non-blocking) | ux/personas.md, user-journeys.md, interview-questionnaire.md |
| 7 Feature catalog | Done | product/feature-catalog.md |
| 8 MVP prioritisation | Done (D15) | product/mvp-prioritization.md, mvp-scoring.py |
| 9 Information architecture | Done (D16 v2); BA validation kit issued | ux/information-architecture.md, ia-validation-kit.md |
| 10 User flows | Done | ux/user-flows.md |
| 11 Technical architecture | Done (D17, D18); spikes S1–S7 pending | architecture/technical-architecture.md, spike-briefs.md |
| 12 Data & integration | Done (D19, D20); outreach pack drafted (not sent) | architecture/data-integration-strategy.md, outreach/ |
| 13 Security, privacy, governance | Done (D21–D23) | security/security-privacy-governance.md |
| 14 Accessibility & localisation | Done (D25–D27 incl. Android/iOS parity) | requirements/accessibility-localization.md |
| 15 Content & editorial | Done (D28–D30) | content/editorial-system.md |
| 16 Admin & operations | Done (D31–D33) | operations/admin-platform.md |
| 17 Business & sustainability | Done — D34, D36 approved; D35 = split ownership first (fallback A/C); D37 PPR terms recorded | product/business-sustainability-model.md |
| 18 Development roadmap | Done — D38, D39 approved 2026-10-03 | roadmap/development-roadmap.md | roadmap/development-roadmap.md |
| 19 Project team | Done — D40–D42 approved 2026-10-03 | roadmap/team-requirements.md |
| 20 Final product blueprint | Done — D43 approved 2026-10-03 | product/final-blueprint.md |
| 21 Stage 2 execution: IA heuristic validation, spikes, design system, clickable prototype, ADRs, dossier | **Done 2026-10-03 on heuristic/sandbox basis — real validation still pending** (D44–D52). Its S1 outcome ("no framework decision") is superseded by D64 | roadmap/stage2-execution-prompt.md; ux/ia-validation-results/; architecture/spike-results/, architecture/adr/; design/; prototype/; deliverables/COP32-Platform-Proposal-v1.docx |
| 22 Native build (Expo + React Native, Android APK first) | **In progress — build step 1 of 8 (app shell) done 2026-11-14; paused for founder review of screenshots; nothing tested on a phone yet** (D64–D72) | roadmap/phase22-execution-prompt.md, phase22-execution-plan.md; research/cop31-app-teardown.md; architecture/adr/ADR-007 |

## Track D v2 — visual redesign (2026-10-03)
**Done.** Direction "Highland Mist" chosen after four founder review rounds (D53; `docs/design/redesign-directions/`). Design system v0.2 + `tokens.json` updated; plan in `docs/design/redesign-plan.md`; every prototype screen rebuilt (5 batches); screenshots refreshed in `docs/design/prototype-screens/` (20). Checks: tokens 64/64 AA, axe-core 0 violations (16 screens × light/dark), 200% reflow without horizontal scroll, EN/AM and light/dark parity, tree-test T1–T12 all resolve. Private phone-viewable copy: https://claude.ai/artifact/X4MMCwgpeHVfpBCpLDh3wh (entry page `prototype/artifact-entry.html`). The GitHub Pages redeploy runs once this branch is merged to `main`.

## Track D v2.1 — visual layer (2026-10-03)
Card- and block-based redesign with illustrated SVG covers (D54); light mode default with a Dark mode switch. Checks: axe-core 0 violations, T1–T12 resolve, 200% reflow OK.

## Track D v2.2 — PWA + illustrated personas (2026-10-03)
The prototype is an installable, offline-capable PWA (D55), and every card shows an invented illustrated persona in a themed scene (D56). Checks: axe-core 0 violations, T1–T12 resolve, offline reload verified.

## Track D v2.3 — real photos (2026-10-03)
Cards, headers and the hero use 46 openly licensed photos with an in-app credits screen (D57); speaker avatars stay illustrated. Checks: axe 0 violations, T1–T12 resolve, offline OK.

## Repo hygiene + D44 cross-links (2026-10-05)
Added root `README.md` and `CONTRIBUTING.md`, `prototype/release.py` (single-command version bump with a `--check` CI guard in `pages.yml` and a new PR workflow `check.yml`), and completed the D44 cross-links (D44a). Prototype v0.6.1. These started from an external AI review package; it was fixed before adding (patch did not apply cleanly, release script failed on the current tree).

## Name and mark (2026-10-05)
The app is now **COP32 (Prototype)** with the original seedling mark carrying “COP32” on the leaf, across header, favicon, PWA and install icons (D59 supersedes D58 “Lemlem”, v0.8.0). Revisit the name before any public launch. The header Emergency button is in place (D44 complete).

## Hosting moved to Netlify (2026-11-04)
The repo is now **private**, which GitHub Pages cannot serve from on a free plan — the old
`ermi1o1.github.io/COP32` link started 404ing. The prototype now lives at
**https://cop32-prototype.netlify.app**, Git-linked to `main`: every push auto-deploys (D60).
`netlify.toml` publishes `prototype/` only, so `docs/`, `deliverables/` and `spikes/` stay off the
public site, and it runs the `release.py --check` stale-cache guard as the build command.
`.github/workflows/pages.yml` is retired; `check.yml` still runs on PRs.

## Continuous intel watch (2026-11-09)
`docs/intel/` is live: a daily GitHub Actions collector over RSS, Google News (EN+AM),
YouTube, public Telegram channels, watched pages (`cop32ethiopia.org`, UNFCCC COP32,
MinT) and the Apple app-search endpoint, delivered to Telegram with a GitHub issue on
Tier-1 alerts (D63). Grading is automatic-floor only; `/intel-review` does the real
grading and proposes document changes (D63a scopes D19 to product pipelines).
This supersedes the quarterly re-check cadence in D1, which stays as a backstop.
Zero Netlify impact — commits carry `[skip netlify]`.

**Open:** feed URLs in `sources.yml` were authored unverified; run
`collect.py --verify` and record the result. YouTube channel ids and Telegram
handles are placeholders and those sources are disabled until filled in.

## Phase 22 — native build (started 2026-11-14)
Work is on the branch `phase-22-native-build`; nothing is merged to `main` and the live prototype is unchanged.

**Done on 2026-11-14**
- **Track 0, reality re-check #3.** The federal government portal links "Official COP32 Website" to `cop32ethiopia.et` (a holding page with nine social channels). An official COP32 digital workstream therefore exists. **No official COP32 app, tender or contractor was found.** The procurement portal (e-GP) could not be reached and has still never been searched directly. The intel pipeline had been watching a different, apparently unofficial domain (`cop32ethiopia.org`). Detail: `docs/research/reality-check.md`.
- **Track A, COP31 teardown.** `docs/research/cop31-app-teardown.md`, from the founder's 20 screenshots and screen recording. Headline: on the three screens tested, the COP31 host app fails without a connection; offline-first is our main differentiator, with a seven-point testable target.
- **Decisions recorded.** D64 (Expo + React Native; supersedes the D18 real-device rule for mobile), D65 (own identity, swappable brand layer; retires the "COP32" name and mark of D59 for the native app), D66 (demo content: complete but honest), D67 (benchmark limits) — approved by the founder. D68 (Track 0 verdict), D69 (intel pipeline repair), D70 (amend D1 to "host-country app offered for adoption") — proposed that day and then confirmed by the founder.
- **Plan.** `docs/roadmap/phase22-execution-plan.md` — build order, quality gates, and ten questions for the founder.

**Founder answers, 2026-11-14 (recorded as D65a, D68–D72):** the app keeps the name "COP32" (against Claude's recommendation; the independence statements now carry that risk); the form of the "not official" statement, the "Day 1 … Day N" programme labels and Android 7.0 are agreed; D68–D70 are confirmed, so **D1 is amended** to "host-country app offered for adoption"; contributor IP assignments are **not signed** and the build continues regardless (D72 — the question of showing the APK before they are signed stays open).

**Intel pipeline repaired (D69)** on the branch: the official site `cop32ethiopia.et` is now the watched host; app listings are Tier 1 only when they say COP32; the daily digest reports alerts left open more than seven days. It takes effect for the daily run only when the branch is merged.

**Build step 1 of 8 done — app shell (in `app/`).** Five tabs, header with language switch, search, Emergency and profile; light and dark themes; English and Amharic; the brand layer with two switchable brands; bundled fonts; the one-time first-run statement; Settings, About, Sources and status; a component gallery; the content model and repository interface. Screenshots: `docs/design/app-screens/` (17 images — **browser renders, not a phone**).

| Check (build step 1) | Result | Where it ran |
|---|---|---|
| TypeScript strict | Pass | Cloud session |
| Unit tests | 74 of 74 pass (contrast for both brands, language-file parity, script-aware fonts, data layer, stored preferences) | Cloud session |
| Design-token contrast | 64 of 64 pairs pass WCAG 2.2 AA | Cloud session |
| Automated accessibility (axe-core) | 0 violations across 11 screens × 2 languages × 2 themes (two real faults found and fixed first) | Browser render only |
| 200% text at 320 px wide, Amharic | No sideways scrolling; no clipped text seen | Browser render only |
| Outside network requests | None — every font, icon and image came from the app itself | Browser render only |
| Release APK | See `docs/operations/apk-build-runbook.md` | Cloud session |
| Install, Amharic rendering, offline cold start, TalkBack, start-up time | **Not done — needs a phone.** Checklist: `docs/operations/device-checklist.md` | — |

**Work stops here until the founder has looked at the screenshots** (the Phase 22 prompt requires it). **Not started:** build steps 2–8 (Home and Updates; Programme; Map; Visit and Emergency; Learn and search; Settings detail; quality gates, demo script, one-pager, design system v1.0).

**Limits to keep in view:** the cloud session has no Android phone or emulator. Screenshots will be browser renders of the same code and labelled as such. Install, Amharic rendering, screen reader, cold start and airplane-mode tests must be run by the founder on a phone before anything is called validated.

**Still open across the project:** real-user testing of the information architecture; real-device spikes S1 and S6; hosting-provider outreach (S5); native-speaker Amharic review; the legal foundation (company registration, IP assignments, profit-participation agreement); official data access and alert authorisation; a direct search of the procurement portal; who owns COP32 digital delivery.

## Where the project stands in practice
- Phase 21 is complete on a heuristic/sandbox basis (see table). Real card sort/tree test, real-device spikes (S1, S6), provider outreach (S5), native-speaker Amharic review and user testing remain open.
- Planning documentation is complete through Phase 20 (blueprint approved, D43). Phase 21 ("Stage 2 execution") is defined and ready to run: `docs/roadmap/stage2-execution-prompt.md` is the operating prompt for it — paste it into a fresh Claude Code session (after `/clear`) to execute Tracks A–F (IA heuristic walkthrough, spikes S1–S7 sandbox proofs, design system, clickable prototype, architecture ADRs, external .docx dossier).
- **Not started yet (execution):** legal set-up (company registration, IP assignments, PPR agreement), outreach (letters drafted, not sent; **must be re-read against D68 before sending**), and real-world validation of Phase 21's heuristic/sandbox work (see above). The native-app build (Phase 22) started on 2026-11-14 — see the section above.
- **Important scope note for Phase 21:** nothing in it substitutes for real-user IA testing or real-device/real-provider spikes (`docs/ux/ia-validation-kit.md`, `docs/architecture/spike-briefs.md`). It produces heuristic/sandbox evidence only, clearly labeled, plus a tangible clickable prototype and a sendable proposal dossier — real validation stays a tracked open item.
- **Next gate:** G1 on 31 Dec 2026 (see roadmap).
## Decisions awaiting approval
D44–D52 recorded in the log with qualified status (heuristic/sandbox basis; provisional). Founder to confirm or amend.
## Next session should read first
`docs/decisions/log.md` (D64–D72), this file, `docs/roadmap/phase22-execution-plan.md` (build order; the founder answered its questions on 2026-11-14), `app/README.md`, `docs/operations/device-checklist.md`, `docs/research/reality-check.md` (re-check #3), `docs/research/cop31-app-teardown.md`, `docs/architecture/adr/ADR-007-mobile-framework-expo-react-native.md`, then `docs/design/design-system.md` and `docs/ux/information-architecture.md`. Earlier wording that Phase 22 is "blocked on a real-device S1 decision" no longer applies (D64).
