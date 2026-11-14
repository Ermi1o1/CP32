# Phone checklist — COP32 guide app (Phase 22)

**Why this exists.** The app is built in a cloud session that has no phone and cannot run an Android emulator. Everything checked there is a browser render of the same code. The checks below can only be done on a real Android phone, and until someone does them they are reported as **not done**.

**Who:** the founder or any team member with an Android phone (Android 7.0 or newer). **Time:** about 30 minutes. **Write results** in the table at the bottom and tell the next Claude Code session, which records them in `docs/roadmap/phase-status.md`.

## Version 0.2.0 — design review first (Design Pass v2)
Before the sections below, please send **screenshots from your phone** of: Home (top, and scrolled down), Programme (Day 2, and one other day), one session page (top and scrolled), and Home in dark mode. Then answer four questions in a sentence each:
1. Does it open, and is it smooth when you scroll and when you open a session?
2. Tap a bookmark: do you see the small "pop", and feel a tick? (The tick needs Android 11 or newer.)
3. Are the photographs sharp enough, or soft?
4. Turn on airplane mode, close the app fully, open it again: does everything still show?

Note: from version 0.2.0 the design is English-first (D74). The Amharic checks in section B are now a secondary check of the draft translation, not a release gate.

## Before you start
1. Copy the APK to the phone and open it. Allow "install unknown apps" for the file manager when asked.
2. Note the phone model and Android version (Settings → About phone).

## A. Install and first run
| # | Do this | Pass if |
|---|---|---|
| A1 | Install the APK | It installs without an error |
| A2 | Open the app | The first screen is "Welcome" with three points (Independent, Illustrative content, Private by design) |
| A3 | Look at the installed size: Settings → Apps → COP32 → Storage | Write the "App size" number down |
| A4 | Settings → Apps → COP32 → Permissions | It lists **no** permissions |
| A5 | Time from tapping the icon to seeing the screen (close the app fully first) | Write it down; under about 3 seconds is the aim |

## B. Amharic — the check that matters most for this app
| # | Do this | Pass if |
|---|---|---|
| B1 | On Welcome choose አማርኛ, tap ቀጥል | Every word on Home is readable Amharic. **No empty boxes (□) anywhere** |
| B2 | Open each of the five tabs | No boxes; no letters cut off at the top or bottom of a line; no word chopped in the middle at the edge of the screen |
| B3 | Profile button (top right) → ምንጮች እና ሁኔታ | Long Amharic sentences wrap cleanly |
| B4 | Bold headings versus normal text | Bold looks bold, not smeared or doubled |
| B5 | If you read Amharic: note any wording that is wrong or unnatural | List them — none of the Amharic has been reviewed by a native-speaking editor |

If B1 fails on any phone, stop and report the phone model. That is the risk recorded in ADR-007.

## C. Offline — airplane mode
| # | Do this | Pass if |
|---|---|---|
| C1 | Close the app fully. Turn on airplane mode. Open the app | It opens normally with content. No spinner that never ends, no error |
| C2 | Visit all five tabs, Settings, About, Sources and status | Everything shows. The words "something went wrong" never appear |
| C3 | Change language and theme, close the app, reopen (still offline) | Your choices are remembered |

## D. Text size and appearance
| # | Do this | Pass if |
|---|---|---|
| D1 | Profile → Text size → 200% | Nothing is cut off; you never have to scroll sideways; the app name in the header is complete |
| D2 | Phone Settings → Display → Font size → largest, then reopen the app at 100% | Same as D1 |
| D3 | Profile → Appearance → Dark | Every screen is dark with readable text |
| D4 | Profile → Appearance → Match phone, then switch the phone's own dark mode on and off | The app follows the phone |
| D5 | Profile → Demonstration → Brand identity → "Your Event" | Name, mark and colours change everywhere at once; switch back to COP32 |

## E. Screen reader (TalkBack)
Turn on: phone Settings → Accessibility → TalkBack. Swipe right to move, double-tap to activate.
| # | Do this | Pass if |
|---|---|---|
| E1 | Swipe through the header on Home | You hear: the app name, the language switch, Search, Emergency and help, Profile and settings — each as a button |
| E2 | Swipe through the bottom bar | Each tab is announced with its name and whether it is selected |
| E3 | Swipe through the Home list | Each row is read as one item: title, then its second line |
| E4 | In Settings, move through Language and Appearance | Each option says whether it is selected |
| E5 | Switch to Amharic and repeat E1 | Note whether TalkBack reads the Amharic, spells it, or stays silent. **Any of these is a finding to record, not a failure of yours** — Amharic speech support varies by phone |

## F. Small screen (only if you have a small or old phone)
| # | Do this | Pass if |
|---|---|---|
| F1 | Repeat B2 and D1 on a phone about 5 inches or smaller | Nothing overlaps or is cut off |

## Results
| Date | Phone model | Android | Tester | A | B | C | D | E | F | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | |
