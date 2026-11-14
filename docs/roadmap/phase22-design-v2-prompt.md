# Phase 22 — Design Pass v2 (execution prompt)

**Status:** ready to run. Written 2026-11-14 after the founder installed the first APK
and judged the design dated and "adapting the prototype style".

**How this relates to `phase22-execution-prompt.md`:** that file stays the master
plan for Phase 22 and is not replaced. This prompt is a follow-on pass. It
**overrides only the visual parts of Track B (design system) and Track C
(screen layouts, motion, imagery)**. Everything else in the master prompt still
applies unchanged: the offline store and sync, repository layer, i18n (EN +
Amharic), navigation, brand swap slot (D65), demo-content rules (D66), COP31
benchmark rules (D67), quality gates, and "branch, never main". If the two
conflict on anything visual, this file wins.

**Run it in the same Claude Code session that built the app** (it knows the
code). If the file is missing from that session's checkout, fetch it from
`origin/main` first.

---

## Prompt

```
Phase 22 — Design Pass v2.

Before anything else: you are on branch phase-22-native-build. Create branch
phase-22-design-v2 off it. Report the highest D-number and the phase-status
date. Do not push to main.

1. PROBLEM
The APK works, but it looks dated and reads as the web prototype ported to
native. Next to the COP31 host app (docs/research/cop31-captures/) it does not
look professional. Fix the design, not the features. This is a redesign of the
native visual language, not a restyle. Do not reuse prototype layouts unless
they survive the audit.

2. DESIGN BRIEF (what we are aiming for)
- Demo audience: senior Ethiopian officials and international delegates who
  will hold the phone for 2-3 minutes and judge it in the first 30 seconds.
  Real users: delegates, media, public, volunteers.
- Feeling: calm authority, warm, confident, unmistakably Ethiopian without
  being a tourism poster or a government form. Closer to a premium editorial
  magazine or travel/wallet app than a corporate dashboard.
- Signature idea: propose ONE memorable visual idea the whole app hangs on
  (for example a Latin + Ethiopic type treatment, a pattern system, an image
  language, or a motion motif). Justify it. It must appear on the splash,
  Home and Session detail at minimum.
- Demo path gets the most polish: launch > Home > open a session > save to
  agenda > Map > airplane-mode offline. Every screen on that path must be the
  best-looking screens in the app.
- Culture: take inspiration from Ethiopian craft, script, landscape and light.
  No national flag or emblem, no COP/UNFCCC/government marks (D1, D65). Avoid
  clichés (generic "African pattern", safari imagery). Anything culturally
  specific must be accurate and credited.
- Brand: Highland Mist (D53) is the starting point. You may evolve palette or
  type if the audit justifies it; record it as a decision.

3. STEP 1: AUDIT (no code changes)
Compare every shipped screen with the closest COP31 capture and with at least
six native apps from DIFFERENT categories chosen for craft, not subject: a
premium wallet or travel app, an editorial/news app, a major sports or
Olympics official app, a conference app, a maps/transit app, a calm utility
app. Public sources only (D67). For each, write what to LEARN (hierarchy,
motion, density, imagery use), never what to copy. Write
docs/design/design-audit-v2.md with concrete per-screen weaknesses and where
COP31 is weak so we can beat it. Use docs/design/founder-feedback/ if present.
Report findings, then continue to Step 2 without waiting.

4. STEP 2: DIRECTION (stop and wait for me)
Make three rough sketches of Home, discard one, and present TWO final
directions that differ on real axes: image-led vs type-led, dense vs spacious,
and motion character. If they look like the same app in two colours, redo them.
Show each on Home, Programme, Session detail, Map, plus one state screen
(empty, loading or offline). For each give: type scale (sizes, weights, line
heights), spacing grid, corner-radius logic, elevation, icon approach, motion
principles. Stop and ask me to choose.

5. IMAGERY
First test what the sandbox can actually download. If the network is blocked,
say so plainly and list exactly which photos I should supply (shot list), and
meanwhile build with original SVG illustration and pattern plus clearly marked
image slots. I may supply photos from my own library; ask me to confirm rights.
Never use COP31, UNFCCC or government imagery. No identifiable people unless
the licence allows it. Keep docs/design/image-credits.md (source, licence,
attribution) for every asset. No gradients as a substitute for imagery.

6. MOTION AND STATES
Designed transitions between screens; shared-element hero from session card to
detail; staggered list entrance (under 300ms total); press feedback plus
haptics on primary actions; skeleton loaders, not spinners; bottom-sheet
filters; respect reduce-motion. Every screen needs designed empty, loading,
error and offline states. Offline is a feature: show "saved on this phone"
status in a way that looks deliberate.

7. BUILD
Rebuild the foundation (tokens, type, components, motion), then screens, in
batches. Stop after Home + Programme for my on-device screenshot review.

8. SELF-CRITIQUE LOOP
Before showing me any screen, review it against this rubric: clear focal
point; no more than three visible hierarchy levels; consistent spacing; type
scale followed; contrast; tap targets; imagery quality; motion; "does this
look like a template?". Fix failures and note the result beside the
screenshot. This is self-assessment, not validation.

9. LIBRARIES (justify in ADR-008; check APK size and the offline gate after)
Allowed: react-native-reanimated, gesture-handler, expo-image,
@shopify/flash-list, @gorhom/bottom-sheet, react-native-svg, expo-haptics.
Gradients only with a stated reason. No default UI kit (Paper, gluestack etc.)
unless fully re-themed to our tokens.

10. BANNED GENERIC-AI TELLS
Purple/blue gradient backgrounds; emoji as icons; one icon weight everywhere;
grids of identical rounded cards with soft shadows; centred hero text on flat
colour; one typeface at one weight; placeholder-looking illustration;
decorative blobs.

11. QUALITY GATES (unchanged, plus)
Offline airplane-mode gate; dark mode; 200% text scale; Amharic strings;
WCAG 2.2 AA contrast check in CI; 48px targets. Emulator or sandbox
screenshots are heuristic checks, not real-device validation. Label them and
ask me for on-device screenshots at each checkpoint.

12. STOP POINTS
After the audit (report), after the direction (wait for my choice), after
Home + Programme (my phone screenshots), after all screens.

Record decisions with the next free D-number on your branch. D64-D67 belong to
the Phase 22 master prompt and D68 is already drafted in
docs/intel/proposals/2026-11-14-review.md, so check the log and avoid
collisions.
```
