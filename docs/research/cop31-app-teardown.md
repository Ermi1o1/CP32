# COP31 Türkiye host-country app — teardown (Phase 22, Track A)

**Written:** 2026-11-14. **Subject:** the official COP31 host-country app ("COP31 Türkiye"), as it looked on 14 November 2026, day 6 of the conference.
**Evidence:** only the founder's own captures in `docs/research/cop31-captures/` — 20 screenshots (1080×2400) and three contact sheets of 62 frames from a 3-minute screen recording (low resolution: good for structure, not for type or spacing). Guest mode, English interface, one Android phone. Read that folder's README for provenance and the rule that these images are never published.
**Method limits (D67):** no decompiling, no network inspection, no store-listing analysis by us. **Nothing about their code, data model, backend or vendor is observable, and nothing here infers it.**

**Tags used on every line or table row**
- **[O]** observed in the captures (the file or sheet is named where it matters)
- **[R]** publicly reported, not verified by us
- **[A]** our analysis or recommendation

File references use the time in the file name: `180915` means `Screenshot_20261114_180915.jpg`; `CS1`–`CS3` are the contact sheets.

---

## 1. Summary

- [O] It is a large, live, content-heavy visitor and venue app: five-tab bar, a drawer menu, a programme with day and zone filters, 157–160 pavilions, hubs, a venue map with stand-level floor plans, shuttle route planning, 111 food venues with open/closed status, weather, news and press releases, an AI chat, and a QR entry pass behind sign-in.
- [O] Its weak point is exactly where an Addis app must be strongest: without a connection, lists fail with "Something went wrong / Retry".
- [A] We should not try to match it feature-for-feature. Its best features (floor-plan wayfinding, shuttle routing, live food status) run on venue and operator data that only a host can supply. Our case is: **works offline, works in Amharic, works on a cheap phone, is small, is honest about its sources, and is ready a year early.** Their venue-data features become the "three asks" conversation, not a to-do list.
- [R] The app is reported at about 187 MB, Android 7.0+, published under the Ministry of Environment, Urbanisation and Climate Change.

## 2. Information architecture and navigation map

### 2.1 Bottom bar — five items, Home in the centre [O: every still]
`Zones · Venue · Home · Programme · My Pass`. The selected item becomes a raised blue disc (`180915`, CS1).

### 2.2 Header — on almost every screen [O]
Back arrow · screen title · search · notifications bell · menu (☰). Home shows the UN Climate Change emblem and the COP31 Türkiye logo instead of a title (CS1).

### 2.3 Drawer menu [O: CS2, last row]
```
TR | EN language toggle                                  ✕ close
Guest — "Sign in to your account"      [Sign in] [Register]
  My Agenda
  My Reservations
EVENT
  Visitor Services · Pavilions · Partners · Action Agenda
COP31
  News · Press Releases · About COP31
[Meet Caretta — "Your COP31 assistant"]   (pinned at the bottom)
```
The Turkish drawer is the same structure (Misafir, Giriş Yap / Kayıt Ol, Ajandam, Rezervasyonlarım, Ziyaretçi Hizmetleri, Pavilyonlar, Paydaşlar, Aksiyon Ajandası, Haberler, Basın Bültenleri, COP31 Hakkında).

### 2.4 Tree, as far as the captures show
```
Home [O: CS1, CS3]
 ├─ Weather strip (21°, Antalya, 3-day) → weather sheet with 6-day forecast, source named
 ├─ "Green Zone today · 09:00–22:00 · Open now" status card with a notice line
 ├─ Thematic Days carousel (day picker "Day 6 · Nov 14") → Thematic Day page
 ├─ Quick Actions (scrolling tiles): My Agenda · Transport · Food & Drink · Hubs · Share Photo ·
 │     Visitor Services · two sponsor/branded tiles (one a game)
 ├─ Featured carousel (LIVE badge, View) → session
 ├─ Upcoming Sessions list (See all) → Programme
 └─ News carousel (See all) → article
Zones [O: CS1, CS2]
 ├─ Blue Zone — "Official negotiation area (UNFCCC)", "Accreditation required"
 │    ├─ Featured: Delegation Pavilions (157) · Meeting Rooms (27 halls) · Side Event Rooms (11 halls) ·
 │    │            Area C2 Special Events Area (4 areas)
 │    ├─ Quick access: WC (61 points) · Water stations (31) · First aid (2) · ATM (1) · Site Map
 │    └─ Other areas: Restaurants (44 branches) · Area C3 Delegation Offices · Area C1 UNFCCC/Türkiye Offices ·
 │                    Area D4 Media Center · Zero Waste Museum · a visitor area (10 areas)
 └─ Green Zone — "Public events & exhibition area", "Open to all"
Venue [O: 180915, CS2]
 ├─ Illustrated site map, search, filter chips with counts (All 78 · Blue 18 · Green 57 · Buggy · Acc…)
 ├─ Place sheet: zone pill, area, [Go here] [View on floor plan] [View details]
 └─ Floor plan: stand outlines with stand numbers; stand sheet "A325 · Ethiopia Pavilion · 300 m²"
        [Pavilion details] [Go here] [Start here]
Programme [O: CS2]
 ├─ Zone switch: Green Zone | All | Blue Zone
 ├─ Scrolling date strip (9–20 Nov) · Filter
 └─ Session cards → Programme Detail
My Pass [O: CS2]
 └─ "Your entry pass, in your pocket — Sign in to view your pass" [Sign in] [Register];
    note that the QR code is for Green Zone entry
Menu → My Agenda [O: 180940] · My Reservations (not captured) · Visitor Services [O: 181339] ·
       Pavilions [O: 181303] · Partners [O: 181404] · Action Agenda (not captured) ·
       News [O: 181229] · Press Releases [O: 181516] · About COP31 [O: 181541] · Caretta [O: 181021]
Reached from tiles: Transport [O: 181051] · Food & Drink [O: 181101] · Hubs [O: 181113, 181121] ·
       COP31 Vision [O: 181445] · Thematic Days [O: 181708, 181756] · Search [O: 180955]
```

### 2.5 What the structure tells us [A]
- The primary bar is **place-first** (Zones, Venue) and **pass-first** (My Pass). That is right for an app whose host controls the gates and the venue data. Ours is **task-first** (Home, Programme, Map, Visit, Updates) because we have neither. Keep ours.
- Roughly half of their destinations live in the drawer or behind Home tiles. News, Visitor Services (including emergency) and Pavilions are two taps from anywhere, behind ☰. Our IA rule against hiding priority content (D16 v2) and the header Emergency button (D44) are a real, demonstrable difference.
- Their search hint is the best single description of the content model: "programme, speakers, areas, stands, restaurants, COP-ART, news, partners, pavilions and FAQs" [O: `180955`].

## 3. Screen inventory

| # | Screen | Source | What is on it | Tag |
|---|---|---|---|---|
| 1 | Home (top) | CS1, CS3 | Weather, Green Zone hours + "open now", Thematic Days carousel, Quick Actions | O |
| 2 | Home (lower) | CS1, CS3 | Featured carousel with LIVE badge, Upcoming Sessions, News carousel | O |
| 3 | Weather sheet | CS1 | 21 °C, wind, humidity, pressure, 6-day forecast, named source | O |
| 4 | Zones | CS1, CS2 | Two large image cards: Blue (accreditation required), Green (open to all) | O |
| 5 | Blue Zone detail | CS1, CS2 | Featured areas with counts, Quick access grid (WC, water, first aid, ATM, site map), Other areas | O |
| 6 | Pavilions list | `181303`, CS1 | Search, All/Green/Blue chips, count (157 in the recording, 160 in the later still), sort A–Z, flag or generic logo, location pill | O |
| 7 | Pavilion detail | `181311`, CS2 | Cover, bookmark and share, Get directions, View on floor plan, Today / Total / Up next stats, date strip, events with ENDED state. The Ethiopia Pavilion showed "No events at this pavilion yet" | O |
| 8 | Floor plan | CS2 | Stand outlines and numbers, search "stands or pavilions on the plan", stand sheet with size and area, Go here / Start here | O |
| 9 | Venue map | `180915`, CS2 | Illustrated site plan with pins, filter chips with counts, a filter button with a badge, locate and full-screen buttons, location-off prompt | O |
| 10 | Place sheet | `180915` | Name, zone pill, area, three stacked actions | O |
| 11 | Programme | CS2 | Zone switch, date strip, Filter, cards with time, LIVE, zone, type tag (#Panel, #Talk…), title, location pill, bookmark and bell | O |
| 12 | Programme Detail — thin | `180909` | LIVE badge, title, date and time, Add to agenda, Remind me, share, one location card | O |
| 13 | Programme Detail — full | `181816` | Adds organiser, hub card, "Featuring" speakers with initials avatars and roles, tags, long description | O |
| 14 | My Agenda | `180940` | Month calendar, chips All / Today / Reminder On / Saved / My registrations, empty state with "Go to Programme" | O |
| 15 | My Pass (guest) | CS2 | Lanyard illustration with QR, Sign in / Register | O |
| 16 | Search (empty) | `180955` | One field and the content-model hint | O |
| 17 | Caretta chat | `181021` | Dark screen, greeting, four suggested prompts, input, "Caretta answers with AI; responses may be inaccurate." | O |
| 18 | Transport | `181051` | Map with two coloured lines and stops, From/To "hotel or stop", swap, tabs Route / Lines / Stops / Places | O |
| 19 | Food & Drink | `181101` | Category tiles, region chips, "111 Venues (78 brands) • 68 open now", cards with zone, branches, Open/Closed | O |
| 20 | Hubs list | `181113` | Six-plus thematic hubs, photo, zone, area count | O |
| 21 | Hub detail | `181121` | Cover with "View on map", overview, View floor plan, "19 Areas", "24 Upcoming Sessions", Featured events | O |
| 22 | News article | `181229` | Title, date, #Press tag, image, long bulleted body, share | O |
| 23 | Press Releases | `181516` | Two-column grid of near-identical branded tiles | O |
| 24 | Visitor Services | `181339` | "Security & Emergency" card with 112 call button; Food & Drink, Transport, Health, Emergency Numbers; View Points on Map | O |
| 25 | Partners | `181404` | Tabs Sponsorship / Climate Supporters / Partnerships; tiered cards with logo, role and stand number | O |
| 26 | COP31 Vision | `181445` | Photo tiles for themes | O |
| 27 | About | `181541` | "What is COP? What is COP31?" long text | O |
| 28 | Thematic Day (offline) | `181708`, `181756` | Offline banner, cached hero and description, Events → "Something went wrong / Retry" | O |
| 29 | Drawer menu EN and TR | CS2 | See §2.3 | O |
| 30 | Coach mark | CS1 | Dark overlay on Pavilions: "Search and filter by zone", step 1/2, Skip / Next, "Turn off guide" | O |

Not captured, so not described: Action Agenda, My Reservations, Health, Emergency Numbers, Share Photo, the game, the Programme Filter sheet, speaker profile, notifications inbox, any signed-in screen.

## 4. Feature table — must-match, beat, or deliberately skip

"Must-match" means an official would notice its absence in a demo. "Beat" means we can show something visibly better. "Skip" is a decision, with the reason.

| Feature (theirs) | Tag | Verdict | Reason [A] |
|---|---|---|---|
| Programme by day with zone switch, LIVE and ENDED states | O | **Must-match** | The core of any event app. We already have day picker and "Open to public"; add live/ended state and a zone/venue switch. |
| Session detail with speakers, organiser, location, tags | O | **Beat** | Theirs is uneven (compare `180909` and `181816`). Ours: one template, every field present or visibly "TBC", plus glossary terms and both time zones. |
| Add to agenda + Remind me, My Agenda with calendar | O | **Must-match** | Ours stays on the device with no account (D21). Their filter includes "My registrations", which implies sign-in. |
| Global search across the content model | O | **Beat** | Ours works offline and folds Ge'ez homophones (D47). Theirs was not tested offline. |
| Pavilions directory with zone filter and counts | O | **Must-match (as sample)** | Exhibitors & pavilions are in our IA under Programme. Fictional entries only (D66). |
| Pavilion page with today/total/up-next and per-day events | O | **Must-match** | Cheap once sessions link to a host organisation. |
| Hubs (thematic areas with counts and featured events) | O | **Skip for now** | It is a venue concept. COP32's zone plan is unknown (IA open question 2). Our Themes facet covers discovery. |
| Zones (Blue/Green, accreditation vs open) | O | **Beat, differently** | We cannot draw their zones, but "Can I attend?" and an access label on every session answer the visitor's real question more directly. |
| Illustrated venue map with filter chips and place sheets | O | **Must-match the pattern, not the content** | Map + chips + place sheet is in our IA. Content is the city (real, from OpenStreetMap) plus a clearly schematic venue. |
| Stand-level floor plan with Go here / Start here | O | **Deliberately skip** | Needs surveyed floor plans and stand allocations from the host. In our catalogue indoor wayfinding (NAV-10) is already "not recommended" for MVP. It is one of the three asks, not a feature we fake. |
| Shuttle route planner (Route / Lines / Stops / Places) | O | **Skip the planner, keep the guide** | Needs the host's shuttle network. For Addis, open transit data exists (F-06a, Pilot). In the demo: an offline "Getting around" guide and transport places on the map. |
| Food & Drink with live open/closed | O | **Skip** | Needs concession data and live status. A neutral "Food" and "Buna" guide is in Visit; a business directory raises the neutrality problem already noted in the catalogue. |
| Weather strip and 6-day forecast | O | **Skip in the demo** | Needs a live feed and a named source; invented weather would break D66. Altitude and season advice belongs in the arrival checklist (NAV-08). |
| Visitor Services with one-tap 112 | O | **Beat** | Theirs sits behind ☰. Ours is a red button in the header of every screen (D44) and the whole Emergency guide is offline. Numbers must be real and sourced. |
| News and press releases | O | **Beat** | Ours carries a source label and last-updated time on every item (INF-10). Their press grid is a wall of identical tiles. |
| About / What is COP | O | **Beat** | We have a Learn section and a glossary, linked from session pages. |
| Partners with sponsorship tiers | O | **Skip** | We have no partners. Inventing them would be a fabricated partnership (D66). Our sponsorship policy (D36) is strict in any case. |
| My Pass — QR entry pass behind sign-in | O | **Deliberately skip** | Accreditation belongs to the host and UNFCCC (D8). No account is required in ours (D21). It is the clearest example of what only an adopted app can do. |
| Sign in / Register, My Reservations | O | **Skip** | Guest-first (D21). |
| Caretta generative AI chat | O | **Replace** | See §6. |
| TR/EN language toggle | O | **Beat** | Ours is EN/Amharic with its own line heights and a bundled font, and the switch sits in the header rather than inside the drawer. |
| First-run coach marks with Skip and "Turn off guide" | O | **Match lightly** | A short, skippable first run (flow F1). No tour overlays on every screen. |
| Share Photo, game, branded tiles on Home | O | **Skip** | Gamification is low priority in our catalogue (ENG-06); sponsor tiles on Home conflict with our "no ad-like banners" principle. |
| Dark mode | O (absent, except chat) | **Beat** | Real light and dark themes, already checked for contrast. |
| Offline | O | **Beat — the headline** | §5. |

## 5. Interaction, motion and offline behaviour

### 5.1 Interaction and motion
- [O] Carousels with page dots on Home (Thematic Days, Featured, News). One frame shows a carousel card blank with a spinner while its image loads (CS1, row 1).
- [O] Bottom sheets for the place card, the stand card, the weather forecast and the transport planner.
- [O] Counts are everywhere: on chips, areas, pavilions, hubs. It makes the app feel inhabited.
- [O] Live status: "LIVE" pills on sessions, "ENDED" on past ones, "Open now" on the Green Zone card, Open/Closed on food venues.
- [O] The floating round "go" arrow on cards, and the raised blue disc for the selected tab.
- [A] The recording is 3-second samples at 480 px; **transition timing, easing and scroll performance cannot be judged from it** and are not claimed here.

### 5.2 Offline — what was actually observed
| Observation | Source | Tag |
|---|---|---|
| In airplane mode a pink "Offline" banner appears at the top. | `181708`, `181756`, `181816` | O |
| Thematic Day pages show their cached hero image, title and description. | `181708`, `181756` | O |
| The "Events" list on those pages fails: "Something went wrong" with a "Retry" link. No cached list, no explanation that the cause is the connection. | `181708`, `181756` | O |
| A Programme Detail page opened earlier renders completely offline, speakers and long description included. | `181816` | O |
| Reading: content appears to be kept after it has been viewed, rather than downloaded in advance. | — | A |

**Unverified [A]:** the behaviour on Home, Programme, Pavilions, Venue map, floor plan, Transport, Food & Drink, Search and My Agenda offline; a cold start with no connection; what happens to saved sessions and reminders offline; whether a never-visited session opens offline; behaviour on a slow rather than absent connection. Three screens were tested. **We may say "on the screens we tested"; we may not say "their app does not work offline".**

### 5.3 Our offline target — concrete and testable [A]
The gate for Phase 22, to be run in airplane mode on a real phone:
1. **Cold start with no network, first launch after install:** Home renders with content. No spinner that never ends, no error.
2. **Every tab and every list** (Home, Programme, Map, Visit, Updates, Search, My agenda, Settings and its sub-pages) renders fully from the bundled content. **Zero** occurrences of a generic error.
3. **Every detail page opens, whether or not it was visited before**: every session, speaker, exhibitor, guide, place, explainer, glossary term.
4. **Search returns results offline**, in English and Amharic.
5. **Save, unsave and set a reminder offline**; the change survives an app restart.
6. **Honest status:** a quiet line says the content is saved on the phone and when it was last updated. Things that genuinely need the network (live streams, link-outs) say so on the control itself, before the tap.
7. **On reconnect** the app checks for newer content without blocking the screen.
The seeded content ships inside the app, so points 1–5 hold from the first launch. Photos are bundled too (about 2.2 MB today).

## 6. Caretta — the AI chat, and what we do instead

- [O] A chat screen with a turtle avatar, "COP31 ocean ambassador · online", suggested prompts ("When is COP31?", "What is the Green Zone?"), free-text input and the footer "Caretta answers with AI; responses may be inaccurate." (`181021`). It is pinned at the bottom of the drawer as "Meet Caretta — Your COP31 assistant".
- [A] **Risk on an event app.** The same app carries the emergency number, first-aid points, gate hours and accreditation rules. A free-text assistant will be asked "which gate is open", "where is first aid", "can I enter with this badge", and its own label says the answer may be wrong. A wrong answer here has a physical cost, the disclaimer does not travel with a screenshot of the answer, and an official app that says something wrong about entry or safety is a news story. It also needs a connection, which is the moment people most need help. Whether Caretta is restricted to vetted content cannot be seen from outside and is not assumed either way.
- [A] **Our alternative: "Ask" as retrieval only.** A question box that searches the vetted content already in the app (FAQ, guides, glossary, programme, places) and shows the matching *entries themselves* — title, the relevant passage, source label, last-updated time, and a link to the full page. It never composes a sentence that an editor did not write. If nothing matches it says so and offers Emergency & help and the FAQ list. It works offline, in Amharic and English, with the same Ge'ez folding as search. In practice this is our search screen with FAQ-first ranking and suggested questions; it costs little and cannot say something untrue.
- [A] We do not copy the mascot, the character idea or the name (D67). Our catalogue already lists an AI assistant among the things not recommended for now.

## 7. Visual critique — specific weaknesses we can beat

All [O] for what is seen, [A] for the judgement.

1. **Offline error state** (`181708`): a bare "Something went wrong / Retry" under a section heading, in grey, with no icon and no cause. Ours: no error at all for bundled content; where the network is truly needed, a named state with what still works.
2. **Uneven session pages** (`180909` vs `181816`): one page is a title and a location card on an otherwise empty screen; another is dense with speakers and prose. Ours: one template, fixed order, "TBC" where a field is unknown.
3. **Press Releases grid** (`181516`): twelve tiles with the same artwork; titles are small, wrap over the artwork and two pairs are duplicates. Scanning by date is impossible. Ours: a dated list with source labels.
4. **Truncation**: "Restaurant s" breaks across lines in a category tile (`181101`); "Antalya Governorship, Me…", "Local, Green and Emerging Technologies: Where Do They F…" (`181121`); filter chips cut at the screen edge ("Acc", "My regi"). English is short. Amharic and Turkish are longer. Ours: labels wrap, chips scroll with a visible edge fade, nothing essential is cut — tested at 200% text.
5. **Text over photographs**: Home's Thematic Day and Featured cards set white text on busy images; the LIVE title on the Featured card is partly unreadable in the frames (CS1). Ours: a fixed dark scrim with a measured contrast ratio, or text below the image.
6. **Small secondary text**: location pills and tag text are small and mid-grey on a pale blue gradient background (`181303`, `181311`). Not measured — screenshots are not a contrast test — but it is the kind of thing a computed check catches. Ours has one in the build.
7. **One dark screen in a light app** (`181021`): the chat is navy; everything else is pale. It reads as a different product. Ours: one theme system, light and dark throughout.
8. **Header weight**: three round buttons plus back and title on nearly every screen, and the same five-item bar below; on a 6-inch phone a list shows three to four cards (`181113`, `181303`). Ours: large title that collapses, more rows per screen while keeping 48 px targets.
9. **Sponsor and game tiles in Quick Actions** (CS1): commercial tiles sit in the same row and style as My Agenda and Transport. Ours: no promotional tiles in task areas.
10. **Emergency is two levels down** (☰ → Visitor Services). Ours is on every screen.
11. **Location prompt covers the map** (`180915`): a banner over the top of the map with a link to system settings. Ours: explain once, allow "Not now", and never cover the content.
12. **Language switch hidden in the drawer** (CS2). Ours: in the header.

What they do well and we should respect [A]: counts and live states make the app feel real; the place sheet's three clear actions; the Blue Zone "Quick access" grid (toilets, water, first aid, ATM) is exactly what a tired visitor wants; "open now" on the home screen; a consistent, rounded, friendly component style; the lanyard-pass metaphor.

## 8. Gap table against our feature catalogue and IA

IDs are from `docs/product/feature-catalog.md`.

| Area | COP31 app | Ours (catalogue / IA) | Gap and action [A] |
|---|---|---|---|
| Programme | Day strip, zone switch, live/ended, filter [O] | Schedule, side events, filters (IA §7) | Add live/ended state and a venue-area switch to the session card. |
| Session page | Uneven depth [O] | Session entity with full field list (IA §4.2) | None; enforce the template. |
| Personal agenda | Calendar, reminders, saved, registrations [O] | My agenda, reminders, calendar export, device-first | Consider a compact month view. No "registrations". |
| Speakers | Listed in search scope; initials avatars on session pages [O] | Speakers directory under Programme | None. |
| Pavilions / exhibitors | 160, zone filter, per-pavilion schedule [O] | INF-06, EXH-01, EXH-05 | Add today / total / up-next summary to the exhibitor page. |
| Venue map | Illustrated plan, chips with counts, place sheet [O] | NAV-01, Map tab | Our venue is schematic until the host supplies plans. Say so on the map. |
| Indoor wayfinding | Stand-level floor plan, go here / start here [O] | NAV-10 — not recommended for MVP | Keep out. Ask item. |
| Amenities | WC, water, first aid, ATM with counts [O] | POI categories; NAV-09 accessibility; NAV-14 safety | Add a "Quick access" row on Map for toilets, water, first aid, ATM. Cheap and valuable. |
| Transport | Shuttle planner with lines and stops [O] | F-06a trip planner (Pilot, open data); Getting around guide | Guide in the demo; planner later, on open data, labelled as scheduled not live. |
| Food | 111 venues, live status [O] | Visit → Food, Buna | No directory. Neutrality rule stands. |
| Weather | Strip + 6-day sheet [O] | In the arrival checklist only (NAV-08) | Not in the demo. Candidate for Pilot with a named source. |
| City companion | None seen beyond transport and food [O] | Visit tab: visa, stay, getting around, explore, money and SIM, health, emergency | **Ours is far broader.** A main differentiator for visitors to Addis. |
| Public explanation | About page, Vision tiles [O] | Learn, glossary, explainers, "Can I attend?" | Ours is deeper. |
| News | Articles, press grid [O] | Updates with source labels, alerts history, digest | Ours is better structured. |
| Alerts | Bell icon; inbox not captured | NOT-01/03, alert items on Home, Updates, My agenda | Unknown on their side. Ours is wired but not live until authorised (D30). |
| Emergency | Behind ☰; 112 call [O] | NAV-14; header button (D44) | Ours is closer to hand. |
| Search | One box, full content model [O] | INF-16, Ge'ez-aware, offline | Ours stronger on language and offline; match their breadth of scope. |
| Assistant | Generative chat [O] | Not recommended | Retrieval-only "Ask" (§6). |
| Entry pass | QR pass behind sign-in [O] | Out of scope (D8) | Ask item, only on adoption. |
| Accounts | Sign in / Register; guest mode [O] | Guest-first; optional later | Keep. |
| Languages | TR / EN [O] | EN / AM, more later (D26) | Ours must be visibly native in Amharic. |
| Dark mode | Absent except chat [O] | Light and dark | Ours. |
| Offline | Cache-on-read on three screens [O] | Offline tiers; NAV-13 | Ours is the headline (§5.3). |
| Accessibility | Not testable from images | WCAG 2.2 AA target, 200% text, screen-reader checklist | Unknown on their side; we publish ours. |
| Size | ~187 MB [R] | ≤ 30 MB (D27) | A quotable difference if we hold it. |
| Gamification, photo sharing | Present [O] | ENG-06 low priority | Skip. |
| Partners / sponsors | Tiered, with stands [O] | INF-08, strict policy (D36) | Skip in the demo. |
| Post-event | Not observable during the event | Archive, outcomes (PST-*) | Check what their app becomes after 20 November — a cheap, useful observation for the "after COP32" argument. |

## 9. How we win — tied to Ethiopian conditions

All [A]; each point names how it will be shown.

1. **It works with no signal.** Addis venues will be congested and visitors arrive on roaming or a new SIM. Demonstrate: airplane mode, cold start, open three tabs, open a session never visited, search in Amharic. Then show the COP31 behaviour described in words only — never their screenshots.
2. **Amharic is first-class.** Bundled Ethiopic font so it renders on phones whose system fonts lack Ge'ez; taller line height for Amharic; search that treats ሀ/ሐ/ኀ as the same; one-tap switch in the header. Their second language is an option in a drawer.
3. **It is small and runs on modest phones.** Target ≤ 30 MB against a reported ~187 MB. On mobile data priced per megabyte and phones with little free storage, that decides whether a local resident installs it at all.
4. **It is honest about what it knows.** Source label and last-updated on changing content, "TBC" as a real state, a sources screen, no AI that may be wrong. For a government that will own the app, credibility is the product.
5. **No account, no tracking.** Nothing leaves the phone; no advertising or analytics kits. After the World Cup 2022 app criticism this is a reputational shield for the host.
6. **It serves the city, not only the venue.** Visa link-out, airport to hotel, getting around, money and SIM, health and altitude, coffee culture, emergency — the things a first-time visitor to Addis actually needs. The COP31 app shows little of this.
7. **Emergency is one tap from anywhere and works offline.**
8. **It exists a year early and can wear the host's identity.** The brand layer swaps in one configuration change (D65) — shown live in the demo.

**What we cannot do without the host, and say so plainly:** the real programme, real venue plans and stand wayfinding, shuttle routes, entry passes, live open/closed status, and authorised alerts. Those are the three asks (programme data, alert authorisation, logo permission) plus venue data.

## 10. Open gaps in this teardown

Carried from the captures README, plus what this pass could not settle:
- Cold start and the full first-run sequence (only one coach mark was caught).
- Whether dark mode exists as a setting.
- Turkish layout under long strings (only the drawer was captured in Turkish).
- Any signed-in state: My Pass with a pass, My Agenda with content, My Reservations.
- Push notification and alert appearance; the notifications inbox.
- The Programme Filter sheet.
- Offline behaviour beyond the three screens tested (§5.2).
- Accessibility: screen-reader labels, text scaling, contrast — none can be judged from images.
- Performance: start time, scrolling, memory, battery, data use.
- Actual installed size on the founder's phone (the 187 MB figure is reported, not measured by us).
- What the app shows after the conference closes on 20 November.

**If the founder can capture more before 20 November, in priority order:** (1) airplane-mode cold start and each of the five tabs offline; (2) the Programme Filter sheet; (3) Programme and Home in Turkish; (4) the app's size under Settings → Apps; (5) the notifications inbox; (6) the phone's large-text setting applied to Home and Programme.
