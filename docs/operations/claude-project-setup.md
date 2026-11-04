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

> Planning and strategy project for the COP32 digital platform — an unofficial,
> complementary public-information app for the World Climate Conference expected
> in Ethiopia. Connected to the Ermi1o1/COP32 repo, which holds all 21 phases of
> research, decisions (D1–D61) and the clickable prototype. The repo is the
> source of truth; this project reads it.

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
```

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
answering anything substantive — they record every decision (D1–D61) and where
the project stands. Phases 0–21 are complete; what remains is real-world
validation, not more planning.

This repo is synced manually and can be stale. At the start of any substantive
answer, state the highest D-number you can see in docs/decisions/log.md and the
"updated" date at the top of docs/roadmap/phase-status.md. If I tell you
something newer exists, your copy is stale — say so and ask me to sync rather
than working around it or guessing which version is current.

You cannot write to the repo from here — only Claude Code can. If a conclusion
from this chat should persist, tell me explicitly what to record and in which
file. Never assume it has been saved.

Hard constraints:
- This is an UNOFFICIAL, complementary platform (D1). Never use real COP32,
  UNFCCC or Ethiopian-government branding, logos or official names, and never
  imply endorsement.
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
