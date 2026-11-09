# Decision text to paste into `docs/decisions/log.md`

Append these two rows to the table in `docs/decisions/log.md`, after D61.
Then update `docs/roadmap/phase-status.md` using the snippet at the bottom.

---

```markdown
| D62 | Adopt a continuous intel pipeline in `docs/intel/`: a daily GitHub Actions collector (03:23 UTC / 06:23 EAT) over RSS, Google News RSS (EN + AM), YouTube channel feeds, public Telegram channel pages, watched web pages (`cop32ethiopia.org`, UNFCCC COP32, MinT) and the public Apple app-search endpoint. Deterministic keyword tiering (T1 project-critical → T4 benchmark) and **automatic provenance-based evidence grading that may only set a conservative floor and may never assign grade A**. Delivery: Telegram message daily, plus a GitHub issue whenever a Tier-1 alert fires. Evidence grading, archival summaries (written in our own words) and any change to a planning document are performed only by a human-invoked `/intel-review` session the founder approves. `docs/intel/index.csv` becomes the canonical news register; `docs/sources/source-register.md` points to it rather than duplicating rows. **Supersedes the quarterly manual re-check cadence in D1**, which is retained as a backstop. | R1 (official platform overlap) and R2 (official data access) are information risks, and a quarterly manual check is too slow now that COP31 is live (9–20 Nov 2026) and Ethiopian COP32 preparation is visibly accelerating. An unattended summariser would erode the A–F evidence discipline the project's credibility rests on, so collection is automated and grading is not. | Keep quarterly manual re-checks; paid media-monitoring service (breaks R4 zero budget); LLM summarisation in CI (deferred — cost, and evidence-grade integrity); Netlify scheduled functions (would consume the free build allowance). | New folder `docs/intel/` and workflow `.github/workflows/intel.yml`. ~60 GitHub Actions minutes/month of the 2,000 free private-repo allowance. **Zero** Netlify impact: automated commits carry `[skip netlify]` and the workflow stages only `docs/intel`, so `prototype/`, D60 and D61 are untouched. Founder cost ≈ 5–10 min/day reading, ≈ 30 min/week reviewing. | Approved by founder 2026-11-09 |

| D62a | Scope D19 explicitly: D19 ("no scraping without written permission") governs **product** data pipelines — what the application ingests and shows users — and does not govern internal research tooling. The intel pipeline is internal research tooling and may read public RSS, Google News RSS, YouTube channel feeds and public Telegram channel preview pages (`t.me/s/<handle>`). It may **not** scrape X/Twitter, Facebook, Instagram or TikTok, and may never bypass bot detection, a CAPTCHA, `robots.txt` or a rate limit. Those four platforms remain a documented 15-minute manual weekly sweep. | Founder asked whether social media could be automated. D19 was the wrong objection; the real reasons are that no free or permitted route exists (X ≈ $100/month minimum, Meta requires page tokens we do not own, TikTok's Research API is academic-only and blocks datacenter IPs), and that a scraper in the git history is a liability under the government-handover and DPG-readiness path (D35). | Automate everything the founder asked for (rejected: no free route, and the DPG/handover risk); leave D19 ambiguous (rejected: a future contributor would read it either way). | Telegram and YouTube are in scope and are the highest-value additions for Ethiopian coverage. Revisit after ~6 weeks of real data if the manual sweep is catching things the pipeline misses. | Approved by founder 2026-11-09 |
```

---

## Also update `docs/roadmap/phase-status.md`

Add this section, and change the header date to `2026-11-09`:

```markdown
## Continuous intel watch (2026-11-09)
`docs/intel/` is live: a daily GitHub Actions collector over RSS, Google News (EN+AM),
YouTube, public Telegram channels, watched pages (`cop32ethiopia.org`, UNFCCC COP32,
MinT) and the Apple app-search endpoint, delivered to Telegram with a GitHub issue on
Tier-1 alerts (D62). Grading is automatic-floor only; `/intel-review` does the real
grading and proposes document changes (D62a scopes D19 to product pipelines).
This supersedes the quarterly re-check cadence in D1, which stays as a backstop.
Zero Netlify impact — commits carry `[skip netlify]`.

**Open:** feed URLs in `sources.yml` were authored unverified; run
`collect.py --verify` and record the result. YouTube channel ids and Telegram
handles are placeholders and those sources are disabled until filled in.
```

---

## Also update the re-check schedule at the bottom of `log.md`

Replace:

```markdown
## Re-check schedule
- Re-check #1 done 2026-10-03 (no change; see research/reality-check.md)
- Quarterly re-check of official COP32 digital announcements (next: 2027-01).
```

with:

```markdown
## Re-check schedule
- Re-check #1 done 2026-10-03 (no change; see research/reality-check.md)
- Re-check #2 done 2026-11-09 — verdict unchanged (no official COP32 app, portal or
  tender), but R1 sharpened: Türkiye shipped a host-country "COP31 Türkiye Super APP"
  (Ministry of Environment, Urbanisation and Climate Change) covering events, venue
  navigation, transport and announcements, and the UNFCCC observer briefing separately
  documents a "COP31 Host Country App" plus a pavilion-discovery platform. That is
  broader than the COP28 host app D1 was based on, and it covers ground equivalent to
  our Programme, Map and Updates tabs. Ethiopia has an equivalent Digital, ICT and
  Utilities Task Force. Treat a host-country app as likely, not speculative.
- Continuous automated watch from 2026-11-09 (D62) replaces the quarterly cadence.
  Quarterly manual review retained as a backstop (next: 2027-01).
```
