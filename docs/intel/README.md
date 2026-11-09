# COP32 intel — continuous news and announcement watch

This folder is the project's early-warning system. It replaces the manual
quarterly re-check in D1 with a daily automated sweep, because the project's
two largest risks are information risks:

- **R1** — an official COP32 app or platform is announced and overlaps this product.
- **R2** — official data or access becomes available (or is confirmed unavailable).

A quarterly check is too slow for both, now that COP31 is live and Ethiopian
COP32 preparations are accelerating.

---

## How it works

```
GitHub Actions, daily 06:23 EAT
   └─ collect.py
        ├─ reads sources.yml  (feeds, Telegram channels, watched pages, app search)
        ├─ fetches politely    (real user agent, rate limited, never bypasses a block)
        ├─ tiers each item     (keywords.yml — deterministic, no AI)
        ├─ grades each item    (provenance rules — a conservative FLOOR only)
        ├─ dedupes             (canonical URL + 90% title similarity, 14-day window)
        ├─ writes queue/ + daily/ + ALERTS.md
        └─ delivers Telegram message; opens a GitHub issue when there is a Tier-1 alert
   └─ commits to main with "[skip netlify]"

Weekly, you run /intel-review in Claude Code
   └─ reads the queue, writes graded items/, updates index.csv,
      proposes edits to reality-check.md and friends for you to approve
```

**The collector collects. The review grades.** That split is the point. An
unattended summariser would eventually write "COP32 runs 8–19 November" into a
planning document on the strength of an SEO blog, and the credibility of this
whole project rests on the A/B/C/D/E/F discipline holding.

---

## How to read a grade

The digest shows a letter next to every item. That letter is **automatic and
conservative** — it describes where the item came from, not whether it is true.

| Grade | Means | How the machine assigns it |
|---|---|---|
| **A** | Confirmed fact | **Never automatically.** Only `/intel-review`, from a primary document |
| **B** | Officially announced | The source domain is official (`unfccc.int`, `*.gov.et`, the app stores) |
| **C** | Reported, unconfirmed | Independent press, state media, or an aggregator |
| **D** | Analysis / opinion | The title or excerpt contains opinion markers |
| **F** | Needs verification | A hard claim — a date range, an attendance figure, a venue, a contract, a money figure — from a **non-official** source. Forced regardless of how reputable the outlet is |

A **⚑** in the digest means the hard-claim rule fired. Those are the items most
likely to end up repeated as fact, so they are the ones to trace to a primary
source first.

Two safety properties:

1. The machine can only set a **floor**. It never upgrades.
2. An auto-graded item is **never** promoted into a planning document without
   your approval during review.

**An unreviewed queue file is not evidence and must never be cited in any
project document.**

---

## Tiers

| Tier | What | Where it goes |
|---|---|---|
| 1 | Project-critical: a COP32 app, portal, tender, official dates, venue, accreditation | Telegram alert + a GitHub issue + `ALERTS.md` |
| 2 | COP32 host-country preparation | Daily digest |
| 3 | Climate / negotiation context (COP31, finance, AGN) | Daily digest, short list |
| 4 | Benchmark watch: other event apps and platforms | Daily digest, short list; feeds Phases 4/5 |

Anything matching nothing is dropped and never stored. The digest reports the
drop count — if it is near zero, the filters are too loose; if the digest is
empty for days while COP32 is in the news, they are too tight.

---

## What is automated, and what is deliberately not

**Automated:** RSS feeds, Google News RSS queries (English and Amharic),
YouTube channel feeds, public Telegram channel pages, watched web pages,
and the public Apple app-search endpoint.

**Not automated — by decision (D63a):**

| Platform | Why not |
|---|---|
| X / Twitter | No free API since 2023; the paid tier starts around $100/month, which breaks the zero-budget constraint (R4) |
| Facebook / Instagram | Needs page access tokens we do not own; Meta actively pursues scrapers |
| TikTok | No free or permitted route; the Research API is for academic institutions; GitHub Actions runs from datacenter IPs that are blocked within minutes |

The decisive reason is not the APIs, though. This repository is on a path to
**government handover and Digital Public Good readiness (D35)**. A scraper in
the git history is something a procurement or legal review will find and ask
about, and the honest answer would be bad. The upside is a few extra items a
week. Not worth it.

**If you are a future contributor reading this and thinking of adding one:
don't.** Raise it with the founder and amend D63a first.

### Manual watchlist — 15 minutes, Sundays

Open these and skim for anything the automated sweep missed. Record anything
worth keeping by running `/intel-review` and adding it by hand.

- [ ] X/Twitter: @UNFCCC, the COP32 Presidency account if one appears, the Foreign Minister, Ethio Telecom, Ministry of Innovation and Technology
- [ ] Facebook pages: ENA, Fana, Addis Ababa City Administration
- [ ] TikTok: search "COP32" — spot check only
- [ ] Google Play: search "COP32" (no reliable automated route)
- [ ] e-GP portal (`egp.gov.et`): search for climate / ICT / conference notices

---

## Files

| Path | What |
|---|---|
| `sources.yml` | Every source. Edit this to add or disable one |
| `keywords.yml` | Tier and grading rules. Edit to tune signal |
| `collect.py` | The collector |
| `queue/YYYY-MM-DD.json` | Raw machine output, unreviewed |
| `daily/YYYY-MM-DD.md` | The digest exactly as delivered |
| `items/YYYY/MM/*.md` | **Reviewed, graded items — the real archive** |
| `index.csv` | One row per reviewed item. Canonical news register (D63) |
| `watch/<key>/` | Watched-page text and a dated diff log |
| `ALERTS.md` | Open Tier-1 items awaiting a decision |
| `state.json` | Seen URLs, failure counters. Machine-managed; do not hand-edit |
| `source-verification.txt` | Output of the last `--verify` run |

---

## Running it by hand

```bash
pip install -r docs/intel/requirements.txt

python3 docs/intel/collect.py --verify     # test every source, deliver nothing
python3 docs/intel/collect.py --dry-run    # collect and write files, deliver nothing
python3 docs/intel/collect.py              # full run (needs the Telegram secrets)
```

On GitHub you can do the same from **Actions → COP32 intel collector → Run
workflow**, choosing `verify`, `dry-run` or `normal`.

---

## Adding a source

1. Add an entry to `sources.yml`. Set `trust` honestly — it drives the grade floor.
2. Run `--verify`. If it shows FAIL or EMPTY (a feed that answers but has no items), fix the URL or set `enabled: false`. Rows tagged `[disabled]` are informational; `TODO` means an unfilled placeholder.
3. Commit with `[skip netlify]` in the message.

Finding a **YouTube** channel id: open the channel page, View Source, search
for `channelId`. It looks like `UCxxxxxxxxxxxxxxxxxxxxxx`. A `@handle` will
not work in the feed URL.

Finding a **Telegram** handle: open `https://t.me/s/<handle>` in a browser. If
you see posts, it is a public channel and the collector can read it. If you
see a login wall, it is not public — leave it out.

---

## Constraints this system must never break

| # | Constraint | Why |
|---|---|---|
| C1 | Never touches `prototype/` | D55–D59; the workflow stages only `docs/intel` and has a guard step |
| C2 | Never changes `publish = "prototype"` in `netlify.toml` | D60; it is load-bearing |
| C3 | Every automated commit says `[skip netlify]` | Protects the Netlify free-tier build minutes |
| C4 | No scraping of TikTok, X, Facebook, Instagram; no bypassing any block | D63a; DPG readiness |
| C5 | No full article text stored, ever | Copyright; D35 |
| C6 | No images, PDFs or video committed | Repo size |
| C7 | No paid service and no API that bills | R4, zero budget |
| C8 | The collector proposes; it never edits a planning document | Brief evidence rules |
| C9 | The collector never assigns grade A | Brief research rules |

---

## Known failure modes

| Risk | What happens | What to do |
|---|---|---|
| GitHub disables the schedule after ~60 days of repo inactivity | The digests silently stop | Monthly check; the Run-workflow button still works |
| A source changes its feed URL | 5 consecutive failures auto-disable it, and the digest says so | Re-run `--verify`, fix the URL |
| Bot detection (already seen on Addis Standard, 2026-11-09) | Item degrades to title + link, or the source fails | Accept it. **Never** spoof a browser user agent |
| Digest becomes a firehose during COP32 | Too much to read | Tighten `keywords.yml`; move Tier 3 to weekly |
| Review skipped for weeks | Queue fills with ungraded noise | The archive is `items/`, not `queue/`. Ungraded is not evidence |
| Amharic matching breaks | Amharic items silently disappear | The ASCII-boundary regex in `collect.py` is why they match at all. Read the comment before changing it |

---

## Honest limits

This finds what is published on the open web and on public Telegram and
YouTube channels. It will not find a tender before it is published, a decision
taken in a committee room, or something that exists only in a closed Facebook
group or a WhatsApp thread. It is an early-warning net, not an intelligence
service, and it does not replace the outreach letters in `docs/outreach/`.
