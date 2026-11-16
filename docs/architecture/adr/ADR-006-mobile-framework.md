# ADR-006 — Mobile framework: decision deferred
Status: **Superseded by ADR-007 (2026-11-14, D64)** — was: No decision (open) · Date: 2026-10-03 · Decision log: — · Evidence basis: sandbox/desk, **not** real devices or providers

## Context
Flutter or React Native (S1)?

## Options considered
- Flutter (+ Next.js web)
- React Native (+ Next.js web)
- Flutter for all three
- Kotlin Multiplatform + native + web

## Evidence
Source: `docs/architecture/spike-results/S1-mobile-framework.md`.
Only web builds could run: both rendered the Amharic test set correctly with a bundled font; React Native Web shipped about 1.5 MB cold versus about 8.9 MB for Flutter web (CanvasKit) in an unthrottled headless run. No native builds, devices, TalkBack/VoiceOver, memory or start-up measurements.

## Decision
**No decision.** The brief's decision rule (fail any option with an Amharic defect on a target device) cannot be applied without devices. The prototype (Track D) and design system do not depend on it. Native spike on real devices remains the gate for starting Phase 22.

## Consequences
- Scored table in technical-architecture §3.2 is unchanged except for an evidence overlay.
- Phase 22 (native apps) stays blocked on this.

## Revisit when
Real-device or real-provider results for the spike arrive, or the assumptions above change.

## Superseded 2026-11-14
The founder decided the framework without waiting for the real-device test (D64). See ADR-007. The statements above that Phase 22 is blocked on that test no longer apply; the test itself is still owed and is listed in ADR-007.
