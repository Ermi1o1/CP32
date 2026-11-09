---
description: Review collected COP32 intel — grade items, file them, propose doc updates
---

# /intel-review

Turn the raw collector queue into graded, filed intelligence, and propose
(never apply) updates to the project's planning documents.

## Before you start

Read, in this order:

1. `docs/decisions/log.md` — every decision, especially D1, D8, D19, D60, D61, D62.
2. `docs/roadmap/phase-status.md` — where the project stands.
3. `docs/intel/README.md` — how grades and tiers work here.
4. `docs/research/reality-check.md` — the current R1 position.

State the highest D-number you can see and the phase-status "updated" date
before doing anything else.

## What to process

Every file in `docs/intel/queue/` whose JSON has `"reviewed": false`.
If `$ARGUMENTS` names a date or date range, limit to those files.

## Step 1 — Triage

For each item in the queue, decide: **file it** or **drop it**.

File it only if it would change, confirm or contradict something in the
project documents, or if it is evidence worth citing later. A news item that
merely restates what is already recorded is not worth a file. **A review that
files nothing is a valid and useful outcome — say so plainly rather than
filing filler.**

Drop silently: pure duplicates the collector missed, items that turned out to
be about a different COP, press releases with no new fact.

## Step 2 — Grade

The collector has already set an automatic **floor** grade from provenance.
Your job is to confirm or adjust it, with a written reason.

| Grade | Means | When |
|---|---|---|
| A | Confirmed fact | Primary document seen, or two independent reliable sources agreeing on a verifiable fact. **Only a human review assigns A.** |
| B | Officially announced | The announcing body itself said it, on its own channel |
| C | Reported, unconfirmed | Press reporting, including good press reporting |
| D | Analysis | Opinion, commentary, our own reasoning |
| E | Assumption | Our working assumption, not sourced |
| F | Needs verification | A hard claim (date, figure, venue, contract) not yet traced to a primary source |

Rules you must follow:

- **Never promote an item to A on the strength of a news report.** A requires
  a primary document or official page that you have actually read.
- An item the collector flagged `hard_claim` stays at **F** until someone
  traces it to the primary source. Write down what document would settle it.
- State media reporting a minister's own words is **B** for the fact that the
  minister said it, and **C** for whether what they said is true.
- When torn between two grades, take the lower one.
- If you downgrade or upgrade the collector's floor, say why in `grade_reason`.

## Step 3 — File

For each kept item write `docs/intel/items/YYYY/MM/YYYY-MM-DD-<slug>.md`:

```markdown
---
id: <the collector's id>
date: YYYY-MM-DD
retrieved: YYYY-MM-DD
outlet:
title: ""
url:
lang: en
trust:
grade: C
grade_reason: ""
tier: 2
tags: []
affects: []
supersedes: []
note: ""
---
Two to four sentences IN OUR OWN WORDS. At most one quote, under 15 words,
in quotation marks, attributed. Never reproduce the article. Never paste the
collector's `excerpt_auto` — that is the source's own wording and is for
triage only.

For an Amharic item, write the summary in English and note that it is translated.

**So what for us:** one or two sentences naming the decision, risk, document
or open question this touches. If you cannot write this line, do not file the item.
```

Append one row per item to `docs/intel/index.csv`:

`id,date,outlet,title,url,lang,trust,grade,tier,tags,affects,so_what_short`

Create the header row if the file does not exist. Quote fields containing commas.

## Step 4 — Propose document updates

Produce a **diff for the founder to approve**. Do not edit these files yourself.

Candidates:

| If the item is about | Propose a change to |
|---|---|
| An official COP32 app, portal, tender or platform | `docs/research/reality-check.md` (new re-check entry) **and** a decision-log entry — this is risk R1 |
| COP32 dates, venue, attendance, structure | `docs/research/cop32-context.md` |
| Another event's app or platform | `docs/research/benchmark-findings.md` |
| A named official, ministry or committee | `docs/product/project-definition.md` §9 stakeholder map |
| Any filed item | `docs/sources/source-register.md` — or a pointer to `index.csv` if D62 made that canonical |

Never write to `docs/decisions/log.md` yourself. Draft the decision text and
let the founder paste it.

## Step 5 — Flag contradictions

If a filed item contradicts something already recorded, say so explicitly and
quote the existing line. Do not silently overwrite. A contradiction between a
new report and an existing recorded fact is a finding, not an error to tidy.

## Step 6 — Close out

1. Set `"reviewed": true` in each processed queue file.
2. Clear resolved lines from `docs/intel/ALERTS.md`; leave open ones.
3. Report: how many items reviewed, filed, dropped; which grades; which
   proposed doc changes await approval; anything that needs the founder to
   chase a primary source.

## Things that would make this review wrong

- Filing an item because it is interesting rather than because it changes something.
- Promoting a grade to make a finding look stronger.
- Copying the source's wording into the summary.
- Treating a Google News aggregator hit as an independent second source — it
  is usually the same wire story.
- Letting an unreviewed queue file be cited anywhere as evidence.
