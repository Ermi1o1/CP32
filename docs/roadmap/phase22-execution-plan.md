# Phase 22 — Execution plan (native build)

**Written:** 2026-11-14, on branch `phase-22-native-build`. **Status: for founder review. No app code has been written.**
**Operating prompt:** `docs/roadmap/phase22-execution-prompt.md`. **Read with:** `docs/decisions/log.md` (D64–D70), `docs/research/reality-check.md` (re-check #3), `docs/research/cop31-app-teardown.md`.

This plan says what will be built, in what order, what "done" means for each step, what cannot be done from a cloud session, and which decisions are needed from the founder before code starts. It can be read without the repository open.

---

## 1. Where things stand on 2026-11-14

| Track | State |
|---|---|
| Track 0 — reality re-check | **Done as far as a cloud session can take it.** Verdict: official COP32 website and channels exist (`cop32ethiopia.et`, linked from the federal government portal); no official app found; the procurement portal could not be searched. Recorded as proposed decision D68. Founder to confirm. |
| Track 0b — intel pipeline repair | **Proposed, not applied** (D69). Half of what the prompt asked for was already done earlier the same day. |
| Track A — COP31 benchmark | **Done.** `docs/research/cop31-app-teardown.md`; benchmark findings updated. |
| Track B — design system | Not started. Planned below. |
| Track C — the app | Not started. Planned below. |
| Track D — quality gates | Not started. Planned below. |
| Track E — APK and demo | Not started. Planned below. |
| Track F — the record | D64–D67 recorded as approved; D68–D70 recorded as proposed; ADR-006 superseded, ADR-007 written; phase status updated. |

## 2. Decisions needed from the founder before code starts

These are blocking for batch 1 unless marked otherwise. Each has a recommendation.

| # | Question | Why it blocks | Recommendation |
|---|---|---|---|
| Q1 | **What is the app called, and what is its mark?** D65 forbids "COP32" as the name or in the icon, which retires the current "COP32 (Prototype)" name and the seedling-with-"COP32" mark (D59). | The app name, icon and splash are part of batch 1 and of the APK itself. | Return to **Lemlem** (D58: ለምለም, "lush, green") with the existing seedling mark **without** the word on the leaf, and a descriptor line "Visitor guide · Addis Ababa 2027". The Amharic spelling still needs a native-speaker check. |
| Q2 | **How should the "independent, not official" statement look?** D66 keeps it but wants it to read as professional. | It appears on every screen, so it shapes the app shell. | Three parts: (a) a one-screen first-run statement, shown once; (b) a small permanent line under the brand name in the header area of Home and in Settings → About: "Independent guide · not an official COP32 app"; (c) a "Sources & status" screen listing what is reported, what is illustrative and what is unknown. No bar on every screen, no per-card labels. A treatment mock-up will be shown with the batch 1 screenshots before it is final. |
| Q3 | **Programme dates.** The prototype's sample programme uses 11–15 October 2027 — invented dates, which D66 forbids. | Programme screens are batch 3, but the data model is batch 1. | Label days "Day 1 … Day 5" with weekday-free headings and show the event as "November 2027 · dates to be confirmed". Mention the reported 8–19 November window only on the Sources screen, marked as reported. |
| Q4 | **Minimum Android version: 7.0 (prompt) or 8.0 (D27)?** | Build configuration. | **Android 7.0.** It is the default floor of the current Expo release, it matches the COP31 app, and it costs nothing extra. Record as a note on D27. |
| Q5 | **Scope of "every screen in the information architecture".** The IA document also contains an organiser portal, a volunteer mode, an archive and an outcomes tracker. | Sets the size of Track C. | Build the 18 screens and states of the prototype inventory (`docs/design/redesign-plan.md`) plus three new ones from this phase: Sources & status, the first-run statement, and "Ask" (retrieval-only help, teardown §6). Organiser portal and volunteer mode stay out. Archive and outcomes appear only in the post-event Home variant. |
| Q6 | **Map: real or schematic?** D48 chose a real offline map (MapLibre with our own map file). It needs a native map component and a map file built for Addis. | Batch 4 size, and APK size. | Batch 4 in two steps: first the schematic venue map and place sheets as in the prototype (certain to work); then the real offline city map as a separate, measured step, kept only if it stays inside the size budget. |
| Q7 | **How is the APK built?** The prompt says Expo's cloud build service (EAS), which needs an Expo account and a login token the project does not have. | Track E. | Build locally with Gradle in the cloud session (the Android build tools are downloadable there) so no account is needed now. Keep the configuration EAS-ready so the founder can switch later. |
| Q8 | **Netlify.** When this branch is eventually merged, every commit touching the new app folder would trigger a rebuild of the prototype site, because the "skip" rule in `netlify.toml` only excludes `docs/`, `deliverables/` and `spikes/`. The published site itself would not change. | Not blocking until merge. | Add the app folder to that exclusion list in the same merge. This touches `netlify.toml`, so it needs an explicit yes. |
| Q9 | **Legal entry criterion.** D39 and D41 say contributors sign intellectual-property assignments before work is shown or released. Nothing in the repository says they are signed. | Not blocking the build. Blocking for showing the APK to officials. | Founder to confirm the status before the demo. Flagged, not assumed. |
| Q10 | **Confirm or amend D68, D69, D70** (Track 0 verdict, intel repair, D1 amendment). | D70 changes the wording of the demo script and one-pager (Track E). D69 unblocks the intel fix. | Confirm all three. |

**Not blocking, but worth a founder action this week:** the COP31 app empties after 20 November. The teardown (§10) lists six extra captures in priority order, the first being an airplane-mode cold start across all five tabs.

## 3. What can and cannot be done from a cloud session

| Item | Possible here? | Consequence |
|---|---|---|
| Write the app, run type checks, lint and unit tests | Yes | — |
| Build a release APK | Very likely (Android build tools download; to be proven in batch 1) | If it fails, the fallback is EAS with the founder's account. |
| Run the app on an Android phone or emulator | **No.** No emulator can run here and no phone is attached. | Every screenshot from this session comes from the same code rendered in a browser, and will be labelled "browser render — not a device". |
| Verify install on Android 7.0+, on a 320–390 px wide phone, Amharic on real phones, TalkBack, cold start, airplane mode | **No.** | These become a written checklist the founder runs on a phone (about 30 minutes). Until then they are reported as **not done**. |
| Push notifications | Wiring only | Clearly non-live, per the prompt. |
| Search the Ethiopian procurement portal | **No** (unreachable) | A person in Ethiopia must do it. |

**Rule for this phase:** nothing rendered in a browser is described as device validation, anywhere.

## 4. Technical shape (inside D64; nothing else is locked)

- **Location in the repository:** a new top-level folder `app/` (Expo project). `prototype/` and `netlify.toml` are not touched.
- **Language and checks:** TypeScript in strict mode, lint, unit tests. A new pull-request workflow runs them; the existing prototype check is left as is.
- **Navigation:** five tabs (Home, Programme, Map, Visit, Updates), each with its own stack, plus a Settings sheet opened from the profile button. Deep links for every entity.
- **Data layer:** a repository interface (`getSessions`, `getSession`, `search`, and so on) with one implementation today: seeded content bundled in the app, loaded into a local store at first launch. Screens only ever talk to the interface, so a real content service can replace the seed without touching a screen. Content shape follows the IA entity model, with `event_id` on everything (D5). A sync module with the manifest design of D46 is stubbed and switched off; it performs no network calls in the demo.
- **Personal data:** saved sessions, reminders, language, theme and text-size choices live only on the phone (D21). No account, no analytics, no advertising or tracking kits. The dependency list is reviewed for this at every batch and reported.
- **Languages:** English and Amharic string files from the first commit; a language switch in the header; Amharic text gets its own line heights; every text element carries its language for screen readers. Amharic strings are carried over from the prototype and remain **unreviewed by a native speaker**.
- **Fonts and icons:** Atkinson Hyperlegible Next and Noto Sans Ethiopic bundled in the app; no font is ever fetched at run time; all symbols are bundled vector icons (D49).
- **Design tokens:** `docs/design/tokens.json` stays the single source. `build_tokens.py` gains a second output: a TypeScript theme file for the app. No colour or size is typed by hand into a component.
- **Brand layer (D65):** one configuration object — name, descriptor, mark, palette overrides, typography — read at start. Two brands ship: the default and one invented example, switchable from a demo control in Settings.
- **Size budget (D27):** APK target ≤ 30 MB, measured and reported per batch.

## 5. Build order

Each batch ends with: type check, lint, tests, a browser-rendered screenshot set (light and dark, English and Amharic), a size measurement, and a commit on this branch. **After batch 1, work stops until the founder has seen the screenshots.**

| Batch | Contents | Done when |
|---|---|---|
| 0 | Project scaffold; token generator output for the app; CI workflow; local APK build proven end to end with an empty shell | A signed-for-testing APK exists and its size is recorded; or the build blocker is named |
| 1 | App shell, five tabs, header (brand, language switch, search, alerts bell, Emergency, profile), theming light and dark, brand layer with two brands, fonts, English and Amharic, first-run statement, base components (list rows, grouped cards, chips, banners, buttons, sheet, skeleton, empty and error states) | Screenshot set shown to the founder — **stop** |
| 2 | Home (pre-, during- and post-event variants) and Updates (news, alerts history, press, explainers, digest); alert items shared across Home and Updates | All lists render from the local store |
| 3 | Programme: schedule by day, side events, speakers, exhibitors and pavilions; session page with speakers, access label, both time zones, glossary terms; My agenda with save and reminders | Save and reminder survive a restart |
| 4 | Map: schematic venue map, category chips, quick-access row (toilets, water, first aid, ATM), place sheets linking to Visit guides; then the real offline city map as a separate measured step (Q6) | Place sheets and cross-links work offline |
| 5 | Visit: service grid, guide pages, link-out interstitial; Emergency & help, reachable from the header on every screen | Emergency page works with no network |
| 6 | Learn, glossary, explainers; search with Ge'ez folding across the whole content model; "Ask" retrieval view | Tree-test tasks T1–T12 resolve |
| 7 | Settings sheet (language, appearance, text size, motion, data saver, notifications, privacy, delete my data), About, photo credits, Sources & status | Every route in the inventory exists |
| 8 | Quality gates in full (section 6), release APK, device checklist, demo script, one-pager, design system v1.0, record updated | Section 6 table filled with real results |

## 6. Quality gates and how each will be reported

| Gate | How | Where it can run |
|---|---|---|
| TypeScript strict, lint, unit tests (data layer, language files, Ge'ez folding) | Automated | Here, and on every pull request |
| Colour contrast (WCAG 2.2 AA) | Computed from the tokens by the existing generator; fails the build on any miss | Here |
| Accessibility, automated | Checks on every screen in the browser render, light and dark, English and Amharic | Here — browser only |
| Accessibility, manual | A screen-reader checklist for the founder (TalkBack) | **Phone only** |
| 200% text without clipping or sideways scrolling; 48 px targets | Browser render at 200%, plus the phone checklist | Here (browser) and phone |
| Tree test T1–T12 | Scripted walk through the app's routes | Here |
| Size | APK size and bundle size measured at each batch against the 30 MB budget | Here |
| Cold start, first meaningful render | Measured on a phone | **Phone only** |
| **Offline** — the gate that matters most | The seven-point target in the teardown (§5.3): cold start with no network, every tab, every detail page, search, save and remind, honest status, quiet refresh on reconnect | Browser render with the network cut, here; **airplane-mode run on a phone is the real test** |

Results will be reported in two columns — "sandbox / browser" and "real device" — and the second column stays empty until the founder has run the checklist.

## 7. Deliverables at the end of the phase

- `app/` — the application
- A release APK for sideloading, with the build command, how signing keys are handled (never committed) and how to rebuild it — in `docs/operations/` as a short runbook
- `docs/design/design-system.md` at v1.0, with component usage rules and the motion spec
- `docs/demo/demo-script.md` (7–10 minutes; six screens; the offline moment; the brand swap; the honest answer to "is this official?"; the three asks) and `docs/demo/one-pager.md`
- `docs/operations/device-checklist.md` for the founder's phone run
- Updated `docs/decisions/log.md` and `docs/roadmap/phase-status.md`

## 8. Risks specific to this phase

| Risk | Response |
|---|---|
| The demo is shown before anyone knows who owns COP32 digital delivery, or to a team that has already chosen a vendor | Track 0 options 1–2; the demo script carries the "here is what is possible and what we can contribute" framing as an alternative opening |
| An app that looks finished is taken for the official one | D65 name and mark; the Q2 statement; no official marks anywhere; Sources & status screen |
| Amharic renders badly on some Android phones | Bundled fonts; real-phone check before any claim (ADR-007) |
| The APK cannot be built in the cloud session | Fallback to Expo's build service with the founder's account |
| Size budget missed once the real map is added | The map is a separate measured step and is dropped to schematic if it breaks the budget |
| Scope drifts toward matching COP31 feature-for-feature | The must-match / beat / skip table in the teardown is the scope fence |
| Amharic strings are not native-reviewed | Stated on the Sources & status screen and in the demo script; review remains an open item |
| Intellectual-property assignments unsigned (D39, D41) | Founder to confirm before any showing (Q9) |

## 9. Open items this phase does not close

Real-user testing of the information architecture · real-device spikes S1 and S6 · hosting-provider outreach (S5) · native-speaker Amharic review · the legal foundation (company registration, IP assignments, profit-participation agreement) · official data access and alert authorisation · a direct search of the procurement portal · who owns COP32 digital delivery.
