# DRAFT: decision log amendments, Phase 23 (revamp port)

**Status: DRAFT for the founder's approval. NOT committed to `docs/decisions/log.md`.**
Written 2026-11-21 against log head **D80**, phase-status **2026-11-16**.
Branch: `claude/sharp-hamilton-t8f4xz` on CP32.

Each row below is in the log's column format: Decision / Reason / Alternatives considered / Impact / Status.
Amendment notes for existing rows are written in the same style the log already uses for D1
("[Amended … by Dnn — …]").

---

## New rows

| # | Decision | Reason | Alternatives considered | Impact | Status |
|---|---|---|---|---|---|
| D81 | **Positioning: an independent city-readiness package.** The COP32 app, the Virtual Event Platform (VEP) and BusTrack are offered to the host for adoption, under their own identity, and deliberately not made to look like the COP31 app. The revamp's content register (rich, dense, professional) is kept. Illustrative content is legitimate and wanted. Disclosure has three parts: said aloud at the presentation, swapped through the CMS when real requirements arrive, and **one** quiet in-app provenance marker. There are no disclaimers in the store description or in banners. | Founder decisions recorded in the Phase 23 execution prompt (section 1). A pitch to a host city needs a product that looks finished and does not imitate the previous host's app. | A COP31 look-alike (rejected: imitation, and the revamp's transport screen even carried Antalya place names); disclaimer banners on every screen (rejected: undermines the demo, and D66 already rules out watermarks) | **Narrows D70's positioning to a package (app + VEP + BusTrack).** The store description no longer says "illustrative" (the revamp already made that change in `app.json`). The provenance marker is `ProvenanceMarker`, shown on Home and the session page. | Proposed 2026-11-21 (decided by founder in the prompt; this records it) |
| D82 | **`tokens.json` is the single source of truth for colour; `app.json` follows it.** `primaryColor`, `backgroundColor`, splash (including the splash-screen plugin), the Android status bar and the Android navigation bar now take `color.light.primary` (#0B4F47) and `color.light.bg` (#EDF3F0). | The revamp introduced #0D474C (about 2% off the real primary) and #F6F3EC (a warm cream against a cool green-grey app background). These values only paint the native chrome, so the mismatch showed as a seam at the system bars. | Adopt the revamp's colours in `tokens.json` (rejected before a pitch: it reopens every contrast pairing in `build_tokens.py`) | If the warm-cream direction is wanted, that is a separate brand task: change `tokens.json`, rerun `build_tokens.py`, then fix whatever fails. The adaptive-icon background (#0B4247) was left alone and is a candidate for the same alignment. | Proposed 2026-11-21 |
| D83 | **Virtual attendance opens the VEP in the system's in-app browser, with the address held in build config.** Settings: `EXPO_PUBLIC_VEP_URL` (the lobby; https only) and optional `EXPO_PUBLIC_VEP_SESSION_URL` (a `{id}` template). `expo-web-browser` opens it (Custom Tabs or SFSafariViewController), with `expo-linking` as fallback. Loading and error states show in place. Entry points: the Live Now card, the session page (hybrid or virtual sessions only), and a Home tile leading to a new `/virtual` screen. A new `Session.delivery` field (`in-person` / `hybrid` / `virtual`) drives these. | The VEP is the centrepiece of the pitch. The browser makes the network requests, so the app keeps D80's no-network permission. Holding the address in config means a demo lobby or custom domain can be swapped in without touching code. | A WebView inside the app (rejected: it needs INTERNET, and the login wall would sit inside the app); a hard-coded URL (rejected) | **The demo is blocked on the VEP side:** it needs (1) an unauthenticated, read-only demo lobby for one sample event, and (2) a custom domain on the Netlify deploy. Do not plan to pre-authenticate a browser on stage. | Proposed 2026-11-21; app side built; the demo itself cannot be checked until the VEP has both |
| D84 | **Transport is "Getting around Addis": sourced static guidance plus a labelled BusTrack placeholder, behind a `TransportRepository`.** Contents: the two light-rail lines, the airport transfer, taxis and minibuses, fares (marked *not yet confirmed* because sources conflict) and venue access (*not yet confirmed*). Every record carries a certainty, and reported records cite a source (see the source register, 2026-11-21). No route geometry and no station list are drawn. The screen is a stacked route reached from a Home tile and from Map, not a sixth tab. | The revamp's screen had invented routes, Antalya (COP31) line names, and a keyless `static-maps.yandex.ru` image. That image would return 403, carried no attribution, and sent users' IP addresses to a third party, which breaks D21. | Keep the map with decorative lines (rejected: draws what cannot be sourced); build a sixth tab (rejected in the prompt) | BusTrack becomes a new `TransportRepository` implementation. **A live endpoint needs network access, so D80 must be revisited first (see the D80 amendment below).** | Proposed 2026-11-21 |

---

## Amendments to existing rows

**D66** — prepend:
> **[Amended 2026-11-21 by D81: `certainty` is kept and **repurposed as CMS provenance**. The bundle ships everything as `illustrative`. A synced official feed arrives as `official`, and `ProvenanceMarker` renders the difference ("Preview content" / "Official — synced HH:MM"). A Settings switch, "Official sync (demonstration)", routes reads through `SyncedView` so the pipeline can be shown live. That switch lives in memory only and never persists, so a restart always returns to honest labels. Illustrative speakers now have **invented organisations as well as invented names**: no invented person is ever placed in a real role at a real body, and `tests/content.test.ts` enforces this. No outcome of COP32 is ever given a name.]**

**D76** — prepend:
> **[Amended 2026-11-21: the demonstration clock is **build configuration, not seed data**. `EventRecord.demoNow` is removed. `EXPO_PUBLIC_DEMO_MODE=1` pins "now" to day 2, 10:45 for the whole build (default off). The Settings switch "Conference-day preview" still turns on the same moment in a normal build. The revamp's Home had made the demo clock permanent, ignoring both. That is reverted.]**

**D80** — append to Status:
> **[2026-11-21: the revamp (commit `54e8504`) silently deleted `android.permission.INTERNET` from `blockedPermissions`, which re-enabled network access. Phase 23 Stage C restored the block. The VEP (D83) works without it. **Open question for the founder:** BusTrack's live endpoint (D84) and any CMS sync will need the block removed. Decide when, and record it as its own row.]**

**D74** — append to Impact:
> **[2026-11-21: new Amharic strings added in Phase 23 (`transport.*`, `vep.*`, `prov.*`, `settings.sync*`, `map.gettingAroundSub`) are wrapped in `// DRAFT … // END DRAFT` markers in `app/src/i18n/am.ts` and need native-speaker review before any release.]**

---

## Process notes for the log or phase-status (not decisions)

- The revamp landed on CP32 `main` as two direct commits (`54e8504`, `51ef75c`), not as a branch, and left `tsc` with 9 errors, lint with 7 errors and 2 failing tests. Branch protection on CP32 `main` could not be checked or set from this session. It needs to be done in GitHub settings: require a PR, and require `app-check.yml` and `check.yml`.
- `prototype/`, `netlify.toml`, `.github/workflows/intel.yml` and COP32 were not touched.
