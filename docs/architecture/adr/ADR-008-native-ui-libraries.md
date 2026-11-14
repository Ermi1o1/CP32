# ADR-008 — Native UI libraries for motion, haptics and images
Status: **Accepted** · Date: 2026-11-14 · Decision log: D73 · Evidence basis: builds and browser renders in a cloud session; **not yet run on a device with these libraries**

## Context
Design Pass v2 asks for designed motion (staggered list entrance, a rewarding save animation, press feedback, haptics), photographs, bottom-sheet filters and a shared-element transition from a session card to its page. Plain React Native can do little of this well. The prompt allows a named list of libraries and asks that each be justified, and that APK size and the offline gate be re-checked afterwards. Privacy rule D21 applies to every dependency: no analytics, advertising or tracking code.

## Decision
| Library | Added | Why | Network or data behaviour |
|---|---|---|---|
| `react-native-reanimated` (+ `react-native-worklets`, its required runtime) | **Yes** | Entrance animations and the save "pop" run off the main JavaScript thread, so they stay smooth on modest phones. Honours the system reduce-motion setting; the app's own setting switches animations off as well. | None |
| `expo-haptics` | **Yes** | One tick when a session is saved or removed. | None. **The vibrate permission stays removed**, so the app uses only the system haptic-feedback call, which needs no permission (wrapped in `app/src/ui/haptic.ts`). The library's older vibration calls would silently fail without the permission and must not be used. The confirm tick exists from Android 11; older phones get none |
| `expo-image` | **Yes** | Bundled photographs with memory and disk caching and a soft fade-in. | Loads only files shipped inside the app. No remote URL is used anywhere |
| `react-native-svg` | Already present | Icons and the brand mark. | None |
| `react-native-gesture-handler` | **Not yet** | Needed only for the bottom sheet. | — |
| `@gorhom/bottom-sheet` | **Not yet** | Programme filters fit in two chip rows today. It will be added with the full filter sheet and the Map place sheet. | — |
| `@shopify/flash-list` | **Not yet** | The longest list is 24 rows; the built-in list is sufficient. Revisit for the real programme (hundreds of sessions). | — |
| A gradient library | **No** | No gradient is used. Controls over photographs get solid backings instead of a scrim. | — |
| A ready-made UI kit | **No** | Every component is our own, on our tokens. | — |

## Not done, and why
- **Shared-element transition (session row → session page).** Reanimated 4 ships a shared-transition API, but it could not be exercised here: the cloud session has no Android device, and this is exactly the kind of feature that works in a demo and misbehaves on a specific phone. The session page currently opens with a staggered entrance instead. It will be attempted once a device is in the loop and kept only if it is reliable.
- **Bottom-sheet filters** — see above.

## Consequences
- Measured after adding the three libraries: see the Phase 22 status table for the APK size and the offline result of this build.
- Three more native modules to keep in step with Expo upgrades.
- Animations are written so that the same screens render without them: with reduce-motion on, every animated wrapper is a plain view.

## Revisit when
A device test shows dropped frames or a crash attributable to any of these; the programme grows beyond a few hundred rows; the filter sheet or Map sheet is built.
