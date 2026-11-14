# ADR-007 — Mobile framework: Expo + React Native (TypeScript)
Status: **Accepted by founder decision** · Date: 2026-11-14 · Decision log: D64 · Supersedes: ADR-006 · Evidence basis: sandbox and desk evidence plus a founder decision — **not** the real-device test that D18 and spike S1 called for

## Context
D18 said the mobile framework (Flutter or React Native) would be chosen by spike S1 on real phones, with any Amharic rendering defect on a target device disqualifying an option. S1 could only be run as web builds in a sandbox (`../spike-results/S1-mobile-framework.md`), so ADR-006 recorded "no decision". On 2026-11-14 the founder decided to build the native app now, ahead of the demo conversation with the host, rather than wait for devices.

## Options considered
- **Expo + React Native (TypeScript)** — chosen
- Flutter
- Kotlin Multiplatform with native screens
- Keep waiting for the S1 device test

## Evidence
- Architecture comparison (technical-architecture §3.2): React Native 48, Flutter 47 of 54 — a tie on judgement scores.
- S1 sandbox: both rendered the Amharic test set correctly with a bundled font. React Native's web renderer loaded about 1.5 MB against about 8.9 MB for Flutter's web build.
- S1 finding F1: Flutter showed an empty box for "✓" and tried to fetch a fallback font from a Google server. **This was observed on Flutter's web build only**, and ADR-004 / D49 (bundle every glyph) removes the problem for any framework. It is a point against Flutter, not a decisive one.
- Not measured for either: native app size, start time, memory, screen-reader behaviour with Amharic, rendering on low-end Android phones from different manufacturers.

## Decision
Expo + React Native with TypeScript. Android APK first; iOS later from the same code. Reasons, in order of weight: one language across mobile, web and backend for a small team; native text and accessibility views (screen readers); lighter web footprint where code is shared; maturity of the offline storage, maps and build tooling we need; the founder's decision to proceed now.

## Consequences
- **Accepted risk:** React Native draws text with each phone's own engine. Flutter draws its own and so renders Amharic identically everywhere — the reason it scored higher on that criterion. Our mitigation is to bundle both fonts inside the app, load nothing at run time, and check Amharic on real phones.
- **Still owed (not done by this decision):** Amharic rendering and the ✓ glyph on at least three Android phones from different manufacturers plus one low-end device; TalkBack with Amharic; measured app size and cold start. Until then every result is labelled sandbox.
- The build can be produced by Expo's cloud service (EAS; needs an Expo account) or locally with Gradle. Signing keys are never committed.
- D18 remains in force for the web framework, CMS and search choices.
- Nothing else in the stack is locked by this ADR.

## Revisit when
A real-device check finds an Amharic rendering or screen-reader defect that bundling cannot fix, or measured app size or start time misses the D27 budgets by a wide margin.
