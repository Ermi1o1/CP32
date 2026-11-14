# Design audit v2 — the native app against COP31 and six reference apps

**Written:** 2026-11-14, Phase 22 Design Pass v2, Step 1. **No code was changed for this audit.**
**Trigger:** the founder installed the first APK (build step 1, the app shell) and judged it dated and "the prototype style, adapted". That judgement is correct, and this file says why in specifics.

**What was audited:** the eleven shipped screens of build step 1, as recorded in `docs/design/app-screens/` (browser renders) — Welcome, Home, the four other tab roots, Settings, About, Sources and status, Search, Component gallery.

**Evidence and its limits**
- **Our app:** our own screenshots. The founder has it on a phone; no written device notes or screenshots have reached the repository (`docs/design/founder-feedback/` does not exist), so this audit does not use any.
- **COP31 host app:** the founder's captures in `docs/research/cop31-captures/` only (D67). File names below are the capture times.
- **Six reference apps:** public material only — the makers' own pages, award citations, published design critiques — plus general design knowledge. **None of them was installed or used for this audit.** Each entry says what to *learn*, never what to copy, and anything specific that could not be confirmed from a public source is left out.
- Everything in the "weakness" columns is our analysis.

---

## 1. The short version

The shell is correct and accessible, and it looks like a settings screen. Five faults explain almost all of it:

1. **Every screen is the same screen.** Programme, Map, Visit and Updates are each a large title over one white rounded box of icon rows. Nothing tells you which tab you are in except the title.
2. **There is no image, illustration, pattern or texture anywhere.** The only non-text graphic is the app icon at 32 px.
3. **One typeface, used timidly.** Sizes cluster between 15 and 20 px. The only big type is the page title. Amharic is rendered correctly but never *used* — it is treated as a translation, not as a visual asset the Latin-script world does not have.
4. **Colour is spread thin and even.** Teal box, lime button, blue notice, four pastel icon tiles (orange, blue, red, green). Seven tints of similar weight; nothing dominates, so nothing is memorable.
5. **Nothing moves, and nothing has a place.** No transition was designed; no element carries from one screen to the next.

Against the COP31 app this reads as a prototype. Their app is visually busy and uneven, but it is *full*: photographs, counts, live states, a recognisable look. Ours is tidy and empty.

## 2. Per-screen weaknesses (ours)

| Screen | What is wrong, concretely | Closest COP31 screen | Where they are better | Where they are weak |
|---|---|---|---|---|
| **Splash** | Flat teal with the icon. No idea, no motion. | Not captured | Unknown | Unknown |
| **Welcome** | Three identical icon-and-paragraph rows read as a legal notice. The mark is small; the lime button is the only confident element. First impression is caution, not welcome. | Coach mark (contact sheet 1) | They drop the user straight into content | A dark overlay tutorial on top of a busy list |
| **Home** | (a) The hero is a flat teal rounded rectangle with left-aligned text and a pill button — a web card. (b) A pale-blue notice sits directly under it and competes. (c) "Start here" is three settings rows. (d) Five header controls of equal weight crowd the brand. (e) No sense of *now*: no day, no next session, no time. (f) Three levels of hierarchy exist but all three look like "card". | Home (contact sheets 1 and 3) | Photography; weather; "Green Zone today · open now"; a featured carousel with LIVE; upcoming sessions on the first screen | White text over busy photos is partly unreadable; sponsor and game tiles sit beside task tiles; carousels everywhere; a card showed a blank spinner; small grey text on a pale blue wash |
| **Programme** | A menu of five rows. No programme. (By design at step 1 — but the *container* it will be poured into is the same white box.) | Programme (contact sheet 2) | Date strip, zone switch, live and ended states, type tags | Cards are tall, so three fit on a screen; titles truncate; uneven detail between sessions (`180909` vs `181816`) |
| **Map** | Three rows. No map. | Venue map `180915` | An illustrated site plan, chips with counts, a three-action place sheet | The location prompt covers the map; chips cut at the screen edge ("Acc") |
| **Visit** | Six rows. Emergency is a row like any other, distinguished only by a pink tile. | Visitor Services `181339` | A strong emergency card with the number and a call button | It is two levels down behind the menu |
| **Updates** | Five rows. | News `181229`, Press `181516` | Real articles with images | The press grid is twelve identical tiles; long all-caps headings |
| **Settings** | Each control is its own white card with a title — six stacked boxes before anything else. Heavy for what it is. | Drawer menu (contact sheet 2) | — | Language switch hidden in the drawer |
| **Sources and status** | Nine rows in three boxes. The content is the most important honesty statement in the app and it looks like fine print. | About `181541` | — | A long plain text page |
| **About** | Icon, name, notice, three paragraphs. Adequate, forgettable. | About `181541` | A photograph | Text wall |
| **Component gallery** | The four notices are four pastel rectangles — the look of a web framework's default alerts. Buttons are three pills. | — | — | — |
| **Tab bar** | A stock pattern: icon in a soft pill, small label. Icons are all one stroke weight. | Their bar (all stills) | A raised centre "Home" disc gives it some character | Place-first tabs suit a host with venue data, not us |
| **Dark mode** | Correct, but it is the light theme inverted: same boxes, same tints. | None (they have no dark mode) | — | Absent, except one chat screen |
| **Amharic** | Renders well, line heights are right. But the Amharic screens are simply the English screens with other words. | Turkish drawer only | — | Their second language is a toggle in a drawer |
| **Motion** | None designed. Default platform slide. | Not judgeable from 3-second frames | Unknown | Unknown |

## 3. What the COP31 app teaches, and where we can beat it

**Learn from them**
- **Fullness is credibility.** Counts ("160 pavilions", "19 areas"), live and ended states, "open now". An event app must look inhabited. Our demo content has to be complete, not sparse.
- **A recognisable look.** Navy, white, a pale blue wash, rounded tiles. Not beautiful, but consistent enough that a single cropped screenshot is identifiable. Ours is not.
- **The place sheet with three clear actions** and the quick-access grid (toilets, water, first aid, ATM).

**Beat them on**
- **Legibility over imagery.** They set white text on busy photographs. We can use imagery *and* keep every word readable by never letting type sit on an uncontrolled part of a photo.
- **Hierarchy.** Their screens are a stack of same-sized cards. A clear focal point per screen is rare in their app and achievable in ours.
- **Type.** Theirs is one rounded sans at similar sizes. A real display face, and Ethiopic used as a design element, would separate us at a glance.
- **Dark mode**, done as its own design rather than an inversion.
- **Offline, shown as a feature.** Their offline state is a pink bar and "Something went wrong". Ours can be a designed, confident status.
- **Calm.** No sponsor tiles, no carousels, no game. The contrast in tone is itself a pitch to officials.
- **Motion with intent.** Unknown on their side; a shared-element transition from a session card to its page is the kind of detail people notice in thirty seconds.

## 4. Six reference apps — what to learn

Chosen for craft from different categories. Public sources only; none was used hands-on for this audit.

| # | App (category) | Public basis | What to LEARN | How it applies to us |
|---|---|---|---|---|
| 1 | **Flighty** (travel / wallet-like) | Apple Design Award 2023, Interaction; Apple's citation credits "key information where you need it most" and a look that "mirrors time-honored airport design conventions" | **Borrow the visual language of a physical thing people already trust** (theirs: the departure board). One glanceable state at the top of the screen, large numerals, everything else subordinate. | A conference has its own trusted artefacts: the printed programme, the timetable, the delegate pass. Session rows can read like a well-set timetable — time as the dominant element, not a card. Home should answer "what is next" in one glance. |
| 2 | **The Guardian** (editorial / news) | Coverage of the 2025 redesign: mobile-first; sections distinguished through type and layout variation; a modular "container" system that preserves story hierarchy; colour preferred to extra labels on small screens | **Hierarchy through type and layout, not boxes.** Different content types get visibly different treatments, so a screen has a lead item and supporting items. A display serif gives authority. | Kill the uniform white box. Home needs one lead item; Updates should look like journalism; a serif display face (with an Ethiopic counterpart) is the fastest route to "premium editorial". |
| 3 | **Olympics — Paris 2024** (major sports official app) | Published heuristic critique and store reviews: the schedule made users scroll to find the next event; "Live" filter blocked other filters; several paths to the same page; venue maps were the second most-used function | **A cautionary tale from the closest comparable.** At a mass event, "what is next for me" and the map are what people use. Filters must combine. One path to each thing. | Programme opens at *now*, not at the top of day one. Filters live in one bottom sheet and combine. The Map is on the demo path and deserves real design. |
| 4 | **Config (Figma's conference app)** (conference) | Store listing: agenda, speakers, venue maps, FAQs, accessibility resources; Figma's own write-ups on building a distinct identity for each year's conference | **A conference app can carry an identity, not just a schedule.** The event's visual idea runs through the app. | We need the "one memorable idea" the prompt asks for, visible on splash, Home and session pages — while staying swappable (D65). |
| 5 | **Citymapper** (maps / transit) | Design critiques (Pratt): clear signifiers, continuous feedback, effective constraints during live navigation; a single signature colour that carried from the app to a physical bus; per-city illustrations | **One signature colour used with discipline, and a warm, human voice on top of dense data.** The map is quiet; the route is loud. | Our map should be nearly monochrome with a single strong accent for "you" and "your destination". One accent colour app-wide, used sparingly, instead of seven tints. |
| 6 | **Things 3** (calm utility) | Two Apple Design Awards (2009, 2017); analyses describe purposeful animation, a completion animation that feels like a reward, a clean look that lets interactions lead, colour reserved for information | **Restraint, and one moment of delight.** Whitespace is a feature; colour means something; a single well-made animation on the key action does more than motion everywhere. | "Save to agenda" is our key action and is on the demo path. It should have the one rewarding animation in the app, with a haptic tick. Everything else moves quietly. |

## 5. What this means for the redesign — requirements carried into Step 2

1. **One signature idea**, present on splash, Home and session detail.
2. **A display typeface** alongside the UI typeface, each with an Ethiopic partner, and a type scale with real range (roughly 12 to 56 px rather than 15 to 34).
3. **Imagery with rules**: real photographs or original illustration, never type on an uncontrolled photo, credits recorded.
4. **One accent colour**; status colours only for status.
5. **No uniform card.** Timetable rows, a lead item, sheets — different content, different form.
6. **Home answers "what now".**
7. **Dark mode designed as itself.**
8. **Offline shown as a mark of quality**, not an apology.
9. **A motion system**: one shared-element transition (session card → page), one reward (save), a short staggered entrance, everything removable under reduce-motion.
10. **Icons in two weights or two families of use** (navigation versus inline), not one stroke everywhere.

## 6. What must survive from build step 1

Not everything is thrown away. The audit found these sound: the five-tab structure and labels (D16 v2); the header Emergency button (D44); the script-aware text component and bundled fonts; the brand layer and its contrast tests (D65); the first-run independence statement in substance (D66, D65a) — its *form* will be redesigned; English and Amharic parity; 48 px targets; the 200% text behaviour; the repository interface; the automated checks.

## 7. Open items from this audit

- No on-device notes from the founder are in the repository. Three or four screenshots from the phone, and a sentence on what felt most dated, would sharpen Step 2 more than any reference app.
- The COP31 splash, first run, and any motion remain unseen.
- The reference apps were studied from public material only.
