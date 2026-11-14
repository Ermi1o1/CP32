# Design Pass v2 — two directions for the founder to choose between

**Written:** 2026-11-14 (Phase 22 Design Pass v2, Step 2). **Status: decided the same day — the founder chose Direction B on a white theme with the best of A, English-first and without cultural motifs (D73, D74). The Ge'ez-numeral signature of Direction A described below was set aside. What was built is summarised in `docs/design/design-system.md` under "v1.0 Daylight".**
**Read first:** `docs/design/design-audit-v2.md` (why the first build looked dated).

**What these pictures are.** Static drawings made as web pages and photographed in a browser at phone size (390 × 844). They are **not the app** and not a device test. Session names, speakers and organisations are invented; the venue plan is a schematic. Their purpose is one decision: which visual language to build.

**Files in this folder**
- `sheet-three-home-sketches.jpg` — the three rough Home sketches side by side (A, B, and the discarded C)
- `sheet-A-fidel.jpg`, `sheet-B-birhan.jpg` — each direction on five screens
- `A1`–`A5`, `B1`–`B5`, `C1` — the single screens at full size

---

## The three sketches, and the one discarded

| Sketch | Idea | Verdict |
|---|---|---|
| **A — Fidel** | Type-led. Ge'ez numerals and bilingual titles as the graphic. | **Kept** |
| **B — Birhan** | Image-led. Highland photography cut by a "horizon line". | **Kept** |
| **C — Tibeb** | Pattern-led. A woven-border band as divider and frame. | **Discarded** |

**Why C was discarded.** (1) It is the cliché the brief warns about: a diamond band reads as "generic African pattern" unless it is a real, attributable weave, and I cannot credit a specific weaving tradition or maker accurately without a cultural reviewer. (2) It decorates the screen without organising it — underneath the bands it is the same boxed list as the first build. (3) The band competes with the content for attention on every screen. If the founder can bring a weaver's or designer's real pattern with permission, a restrained version could return as a secondary detail in either direction.

---

## Direction A — "Fidel" (ፊደል, the Ethiopic script)

**In one line:** a beautifully set printed programme that happens to be an app. Type-led, spacious, quiet.

**Signature idea: Ge'ez numerals and two scripts set together.**
The day you are in is a very large Ge'ez numeral (፪ for Day 2). The wordmark is "COP ፴፪" (፴፪ is 32). Every page title carries its Amharic or English partner beside it, whichever language is selected. No other conference app in the world can do this, it needs no photographs, it weighs nothing, and it works offline by nature.
- **Splash:** the numeral ፴፪ draws in, then "COP" sets beside it.
- **Home:** the day numeral is the focal point.
- **Session detail:** the day numeral sits behind the title as a faint watermark.
- **Accuracy:** ፩ ፪ ፫ ፬ ፭ are 1–5 and ፴፪ is 30 + 2 in the Ge'ez numeral system. Everyday Ethiopian life uses Western digits, and Ge'ez numerals are mostly seen in dates, church and formal contexts — so they are always paired with "Day 2" and never used alone for something a person must read quickly. **A native-speaking reviewer should confirm this use reads as dignified, not odd, before it ships.**
- **Brand swap (D65):** the signature is a typographic system, not a logo, so a host identity can replace the wordmark and colours and the system still stands.

| Aspect | Specification |
|---|---|
| Axes | Type-led · spacious · quiet motion · light-first (dark is a separate ink-on-night design) |
| Typefaces | Display: **Fraunces** (Latin) with **Noto Serif Ethiopic** (Ge'ez). Interface: **Atkinson Hyperlegible Next** with **Noto Sans Ethiopic**. All SIL Open Font Licence, all bundled. |
| Type scale (size / line / weight) | Numeral 172 / 160 / 600 · Page title 42 / 48 / 500 serif · Session title (detail) 35 / 39 / 500 serif · Clock time 40–42 / 42 / 800 sans, tabular · Lead title 23 / 27 / 500 serif · Row title 18.5 / 23 / 500 serif · Body 16.5 / 25 / 400 sans · Row time 17 / 22 / 800 · Meta 13.5 / 18 / 400 · Kicker 11.5 / 16 / 700, +1.5 tracking, capitals (Latin only) |
| Spacing | 4-px base. Side margin 24. Row padding 13. Section gaps 16 / 24. Content sits on full-width rules, like a timetable. |
| Corner radius | Two values only. **0** for anything that is "paper" (rows, day strip, monogram squares). **Full pill** for anything you press (buttons, chips). Sheets: 22 on the top corners. |
| Elevation | None. Structure comes from a 1-px ink rule (strong) and a hairline (weak). Only a bottom sheet casts a shadow. |
| Colour | Paper `#F5F0E6`, ink `#16201C`, deep green `#0F4A45` (numerals, selection), one accent yellow `#F2B705` (the single primary action, the "now" line, the saved bookmark), emergency red `#A3281C`. That is the whole palette. |
| Icons | Lucide outlines at 1.6 for inactive and inline, 2.1–2.2 for selected and inside buttons. The saved bookmark is the only filled icon. |
| Motion | Slow and exact. Screen change: 240 ms fade with an 8-px rise. **Shared element:** the time-and-title block of a session row travels to become the header of its page. **Reward:** saving fills the bookmark yellow with a small overshoot and one haptic tick. List entrance: rows fade in 30 ms apart, 240 ms in all. The "now" line slides to its place when the Programme opens. Everything is removed under reduce-motion. |
| Offline | A small circular "seal" — *Saved on this phone · works without signal* — used like a stamp of quality, plus one calm line on Home with the last-updated time. |
| Imagery | Optional. Photographs appear only in Visit guides and Updates, inside the text column, never behind type. |

**Self-critique against the rubric (my own assessment, not validation)**
| Check | A1 Home | A2 Programme | A3 Session | A4 Map | A5 State |
|---|---|---|---|---|---|
| Clear focal point | Yes — numeral, then 10:30 | Yes — the "now" line | Yes — title, then time | Yes — selected hall | Yes — the seal line |
| ≤ 3 hierarchy levels | Yes | Yes | Borderline (kicker, title, time, body, list) | Yes | Yes |
| Spacing consistent | Yes | Yes | Yes | Yes | Yes |
| Type scale followed | Yes | Yes | Yes | Yes | Yes |
| Contrast | Computed: ink on yellow 9.2:1, green on paper 8.9:1, red on paper 6.4:1, grey meta `#5C675F` on paper 5.2:1 — all pass AA; the grey has little margin and must not go below 13 px | same | The 9%-opacity watermark sits behind the title: **must be tested at 200% text and in Amharic** | Map labels fine | Outline numeral is decorative only |
| 48 px targets | Yes | Bookmark hit areas need padding | Yes | Chips are 36 high — **raise to 48 hit area** | Yes |
| Imagery | None by design | — | — | Schematic, labelled | — |
| Motion | Specified, not built | | | | |
| "Template?" | No | No | No | Mostly no; the sheet is conventional | No |

**Risks of A.** It depends on type quality: a Ge'ez display face at 172 px must render perfectly on real Android phones (ADR-007 risk, now on the main stage). It may feel austere to someone expecting photographs. The yellow must not drift toward the national flag's colours in combination with green and red — emergency red is kept small and separate for that reason, and this needs a second pair of eyes.

---

## Direction B — "Birhan" (ብርሃን, light)

**In one line:** highland light on a night-dark app. Image-led, denser, more kinetic.

**Signature idea: the horizon line.**
Every key screen opens on a full-width photograph of Ethiopian landscape or city, cut off cleanly by a thin amber line. Status lives on that line (day, time, "saved on this phone"); content rises from below it. Type never sits on the photograph.
- **Splash:** the amber line draws across a dark screen and the image opens above it.
- **Home:** hero photograph, horizon line, then "next".
- **Session detail:** the session's image, horizon line with its time, then the page.
- **Brand swap (D65):** the line colour and the image set are configuration.

| Aspect | Specification |
|---|---|
| Axes | Image-led · dense · kinetic motion · dark-first (light mode is a warm-paper variant) |
| Typefaces | **Atkinson Hyperlegible Next** only, at 400 / 700 / 800, with **Noto Sans Ethiopic**. Hierarchy from weight and size. |
| Type scale (size / line / weight) | Title 29 / 32 / 800, −0.9 tracking · Sheet title 24 / 28 / 800 · Section 17 / 22 / 800 · Row title 15.5 / 19 / 700 · Body 15.5 / 23 / 400 · Time 15 / 20 / 800 tabular · Meta 13 / 18 / 400 · Line label 11 / 14 / 800, +1.3 tracking, capitals (Latin only) |
| Spacing | 4-px base. Side margin 16. Card padding 10–12. 8 between cards. Roughly a third more content per screen than A. |
| Corner radius | By size: 12 thumbnails, 14 buttons, 16 cards, 24 sheets, full pill for chips and the tab bar. |
| Elevation | Layers, not shadows on cards: photograph → night surface → raised card `#15211D` → floating tab bar and sheets (the only things with a shadow). |
| Colour | Night `#0C1512`, raised `#15211D`, text `#F1EEE6`, one accent amber `#F29F3D` (line, primary action, saved, next), emergency red, a green only for "open to public / saved" confirmations. |
| Icons | Lucide at 2.0–2.4 (heavier, to hold on dark). Inactive tabs lighter. Saved bookmark filled. |
| Motion | Lively. **Shared element:** a session's thumbnail grows into the hero of its page. Hero image drifts slower than the content on scroll (parallax). Sheets arrive with a spring. Rows enter 40 ms apart, under 300 ms in all. Save: the button flashes amber and the bookmark fills, with a haptic tick. All removed under reduce-motion. |
| Offline | Printed on the horizon line of every key screen: "✓ SAVED ON THIS PHONE". When something truly needs the network, the image goes grey, the line goes grey, and a checklist shows what still works. |
| Imagery | Essential. About 12–20 strong photographs, each credited. |

**Self-critique against the rubric (my own assessment, not validation)**
| Check | B1 Home | B2 Programme | B3 Session | B4 Map | B5 State |
|---|---|---|---|---|---|
| Clear focal point | Yes — the photograph, then the title | Weaker — five similar cards | Yes | Yes | Yes |
| ≤ 3 hierarchy levels | Borderline — label, title, buttons, list | Yes | Yes | Yes | Yes |
| Spacing consistent | Yes | Yes | Yes | Yes | Yes |
| Type scale followed | Yes | Yes | Yes | Yes | Yes |
| Contrast | Computed: amber on night 8.7:1, grey meta on night 8.6:1, ink on amber 8.7:1 — all pass AA. Glass buttons over photos depend on the photo — **needs a guaranteed dark backing** | Title over the header photo relies on a dark wash — **acceptable only with a fixed overlay value** | Same glass-button caveat | Fine | Fine |
| 48 px targets | Glass buttons are 40 — **raise to 48** | Chips 34 high — **raise hit area** | same | same | Yes |
| Imagery | The Simien photo carries the screen. At 1024 px source it is **soft on a modern phone** | Thumbnails are decorative, loosely tied to the session | A teff field for a water panel is a stretch | Thumbnail is arbitrary | Dusk photo works |
| Motion | Specified, not built | | | | |
| "Template?" | Partly — hero image over dark cards is a familiar streaming-app pattern | **Yes, somewhat** — a column of identical rounded cards is one of the brief's banned tells | No | Partly | No |

**Risks of B.** It lives or dies on photographs we do not yet have at sufficient quality (see below). Thumbnails that do not truly relate to a session are decoration, and decoration ages fastest. It is closest to what COP31 already does (photos and cards), so it competes on their ground. More images mean a bigger app and more work to stay inside the size budget. The Programme screen fails the "identical cards" test as drawn and would need a second design round.

---

## Side by side

| | A — Fidel | B — Birhan |
|---|---|---|
| Led by | Type | Photography |
| Density | Spacious (3 sessions on Home) | Dense (4–5) |
| Motion | Slow, exact, almost silent | Lively, layered |
| Default theme | Light paper | Dark night |
| Feels like | A fine printed programme; an editorial magazine | A premium travel or streaming app |
| Unmistakably Ethiopian through | The script and numerals | The landscape and light |
| Looks like COP31? | Not at all | Somewhat (photos and cards) |
| Depends on | Flawless Ge'ez rendering on real phones | 12–20 excellent, licensed photographs |
| Added app size | About 1.5 MB (two display fonts) | Several MB of images |
| Biggest risk | Austere to some eyes | Template feel; photo quality |

## My recommendation

**Direction A, with one thing borrowed from B:** real photographs inside Visit guides and Updates, where they inform rather than decorate.

Reasons: it is the direction nobody else can make; it turns Amharic — the thing we already claim as a strength — into the face of the product; it does not depend on assets we lack; it is the furthest from the COP31 app; it is light, which protects the size and offline advantages; and it passed more of the rubric as drawn. B is the safer crowd-pleaser, and if the audience is expected to judge mainly on "does it look like a modern consumer app in five seconds", B answers that faster.

This is the founder's choice. A hybrid is possible but should be chosen deliberately (which signature leads), not by averaging.

---

## Imagery — what the sandbox can and cannot do

- **Downloads work.** Openly licensed photographs can be found through Openverse and downloaded from Flickr in this session. Wikimedia Commons refused the automated requests (rate-limited).
- **Quality is the limit.** The largest size available this way was about 1024 px wide. A phone hero needs roughly 1600–2400 px. Candidate quality was mixed: of 39 downloaded, 8 were usable for sketches.
- **Credits:** `docs/design/image-credits.md` lists the eight used in the mock-ups. None is in the app.

**Shot list — what would be needed from the founder's own library if B (or A's guide pages) goes ahead.** Landscape orientation, at least 2400 px wide, no recognisable faces, no logos, no flags or official emblems, taken by you or with written permission:
1. Addis Ababa skyline in clear morning or late-afternoon light
2. Entoto hills looking over the city
3. Highland landscape with a strong horizon (Simien, Bale or similar)
4. Terraced or farmed hillside (teff, if possible)
5. Addis light rail or a main avenue, daytime
6. Bole airport approach or terminal exterior
7. A coffee ceremony set-up — jebena, cups, incense — hands only, no faces
8. A market or street scene where no person is identifiable
9. A conference hall or plenary room, empty or with an anonymous crowd from behind
10. Meskel Square or another recognisable public space, without banners
11. A water scene (lake, river, well) for water-themed sessions
12. Tree seedlings or a nursery, for restoration themes
13. Dusk or night over the city
14. One detail texture: woven cloth, basketwork or stone — with a note of what it is and where from

For each photograph I will need you to confirm: you took it or hold the rights, and anyone visible agreed to its use.

---

## What happens after the choice

1. Record the choice as the next decision (D73), including the change to palette and type (lime is dropped in both directions; a display face is added in A).
2. Write ADR-008 for the added libraries (animation, gestures, image loading, lists, bottom sheet, haptics) and measure the APK size and the offline gate after adding them.
3. Rebuild tokens, type and components; then Home and Programme; then stop for the founder's screenshots from a phone.
