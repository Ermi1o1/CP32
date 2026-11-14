# Claude Project setup (claude.ai) — COP32

How to run a claude.ai **Project** alongside the Claude Code work on this repo,
without creating a second source of truth.

## How the pieces fit

| | Reads repo | Writes repo | Shares chat history |
|---|---|---|---|
| **Claude Code** | yes | **yes** | no |
| **Claude Project** (claude.ai) | yes, manual sync | **no** | no |

The **repo is the only shared state.** There is no direct Project ↔ Claude Code
link, and the two do not share conversation history. This matches the rule in
`CLAUDE.md`: the files, not the chat, are the source of truth.

Sync is **manual** — a Project keeps serving whatever it last pulled. Claude
Code can change `docs/` at any time, and the Project will not notice.
**Sync before every serious Project session.**

Source: https://support.claude.com/en/articles/10167454-using-the-github-integration

## Steps

1. claude.ai → **Projects** → **Create project**.
2. Name it `COP32 Platform`. Paste the description below.
3. Paste the custom instructions below into the project instructions.
4. Add knowledge → **GitHub** → authorise if prompted.
   The repo is **private**, so the Claude GitHub App must be granted access to
   `Ermi1o1/COP32` specifically. Reconnecting GitHub in settings does not fix a
   missing repo grant — the app needs access to that repo.
5. Choose repo `Ermi1o1/COP32`, branch `main`.
6. Select **only** the core files listed below. Do not select the whole repo.
7. Confirm, then **Sync now**.

## Project description

*(Updated 2026-11-14. The previous version said "expected in Ethiopia",
"21 phases" and "D1–D61" — all stale.)*

> Planning and build project for the COP32 digital platform — a complementary,
> unofficial public-information app for the UN Climate Change Conference in
> Addis Ababa, November 2027. Connected to the Ermi1o1/COP32 repo, which holds
> phases 0–21 of research, decisions D1–D63a, a live clickable prototype and a
> daily COP32 intel watch. Phase 22, the native Android/iOS build, is under way.
> The repo is the source of truth; this project reads it.

## Custom instructions

See `## Project instructions` block at the end of this file — kept verbatim so
it can be re-pasted after any edit.

## Which files to select

**Core set — select these (~24,600 words, ~33k tokens):**

```
CLAUDE.md
docs/decisions/log.md
docs/roadmap/phase-status.md
docs/product/final-blueprint.md
docs/product/project-definition.md
docs/research/reality-check.md
docs/ux/information-architecture.md
docs/design/design-system.md
docs/intel/ALERTS.md
```

`docs/intel/ALERTS.md` was added on 2026-11-14 and is **not optional**. Without
it the Project cannot see what the daily collector has flagged. A Tier-1 alert
reporting Ethiopia's official COP32 digital platforms sat unread for 131 days,
invisible to every Project conversation in that period, because nothing from
`docs/intel/` was selected. It is small — a triaged alert list, not a feed.

**Add only while working that topic, then remove again:**

| Topic | File | Words |
|---|---|---|
| MVP scope / prioritisation | `docs/product/mvp-prioritization.md` | 6,164 |
| Stack, hosting, scaling | `docs/architecture/technical-architecture.md` | 3,645 |
| Feature debates | `docs/product/feature-catalog.md` | ~3,600 |
| Funding, ownership, PPR | `docs/product/business-sustainability-model.md` | ~4,200 |
| Hiring, roles | `docs/roadmap/team-requirements.md` | ~4,100 |
| Timeline, gates | `docs/roadmap/development-roadmap.md` | ~3,500 |
| Personas, journeys | `docs/ux/personas.md`, `docs/ux/user-journeys.md` | — |
| Benchmarks, gaps | `docs/research/benchmark-findings.md`, `gap-analysis.md` | — |
| Source checking | `docs/sources/source-register.md` | ~4,700 |

**Never select:**

- `prototype/` — code and 46 images; nothing to reason about, large.
- `deliverables/` — 5.1 MB, mostly the generated `.docx`.
- `spikes/` — 5.1 MB of throwaway experiments.
- `docs/design/prototype-screens/` — 20 PNGs.

All 59 docs together are ~101,000 words (~135k tokens) and would fill most of a
context window before a question is asked. Selection is re-configurable at any
time via **Configure files**.

## Syncing — what is and isn't possible

- **There is no automatic or scheduled sync.** It is a manual UI action only.
- **No prompt or custom instruction can trigger a sync.** Instructions are text
  that shapes replies; Claude in a Project chat has no tool to re-sync its own
  knowledge. Do not expect an instruction to work around this.
- **Sync is per connection entry** (`...` → *Sync now*). So connect the repo
  **once** and tick all the wanted files inside that one connection via the file
  browser / *Configure files* — not one connection per file, which turns every
  sync into one tap per file. The fuller controls appear on desktop; the mobile
  `...` menu offers only *Sync now* and *Remove from project*.
- **The live configuration does not follow that advice** (observed 2026-11-14).
  The Context panel holds **seven** separate `Ermi1o1/COP32` entries, one per
  file or file pair, all displaying the same name. A full refresh therefore
  means tapping *Sync now* seven times, and there is no way to tell from the
  list which entry carries which file. Worth rebuilding as a single connection
  with all nine files ticked — but note that removing and re-adding loses
  nothing, since the repo is the source of truth either way.
- **What instructions CAN do is expose staleness.** The instruction block below
  makes every answer open with the highest D-number and the phase-status date it
  can see, so a stale copy announces itself instead of quietly misleading.

## Discipline

- **Sync first.** Before any session that matters.
- **Never upload file copies** as project knowledge — connect the repo only.
  Copies are how a second source of truth gets created.
- **Nothing in a Project chat is saved to the repo.** If a conclusion should
  persist, carry it to Claude Code and name the file it belongs in.

## Project instructions

```
COP32 digital platform — planning project. Ermias (Addis Ababa) is the founder.

The connected GitHub repo (Ermi1o1/COP32) is the source of truth, not this
chat. Read docs/decisions/log.md and docs/roadmap/phase-status.md before
answering anything substantive — they record every decision (D1–D63a) and where
the project stands. Phases 0–21 are complete. Phase 22, the native Android/iOS
build, is running from docs/roadmap/phase22-execution-prompt.md. Also check
docs/intel/ALERTS.md for project-critical alerts nobody has handled yet.

This repo is synced manually and can be stale. At the start of any substantive
answer, state the highest D-number you can see in docs/decisions/log.md and the
"updated" date at the top of docs/roadmap/phase-status.md. If I tell you
something newer exists, your copy is stale — say so and ask me to sync rather
than working around it or guessing which version is current.

The knowledge sync cannot write to the repo, but a Project session that
attaches the repo through its GitHub tooling can commit and push, exactly as a
Claude Code session can. Do not assume anything from this chat has been saved:
ask me before pushing, never commit to main unless I ask for that specific
change in this conversation, and if a conclusion should persist tell me
explicitly what to record and in which file.

Hard constraints:
- This is an UNOFFICIAL, complementary platform (D1). Never use real COP32,
  UNFCCC or Ethiopian-government branding, logos or official names, and never
  imply endorsement. D1's premise is re-dated: an official COP32 digital
  workstream (a website and communications channels) has existed since about
  July 2026, and no official COP32 application has been found. See
  docs/intel/proposals/2026-11-14-review.md before describing this as open
  ground.
- Never invent COP32 dates, attendance figures, APIs, partnerships or official
  decisions. If something is not yet public, say so and mark it as a gap.
- Distinguish confirmed fact / officially announced / reported but unconfirmed /
  analysis / assumption, as the brief requires.
- Heuristic or sandbox work is never presented as real-user or real-device
  validation. Label it and state what still needs real validation.

Act as a critical advisor, not an agreeable assistant. Challenge weak
assumptions, say when something is unnecessary or technically risky, and flag
anything that depends on official COP32 access we do not have.
```
