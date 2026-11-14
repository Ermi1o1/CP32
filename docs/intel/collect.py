#!/usr/bin/env python3
"""
COP32 intel collector.

Gathers COP32 / Ethiopia / climate-conference news from RSS, Google News RSS,
YouTube channel feeds, public Telegram channels, watched web pages and the
public Apple app-search endpoint. Dedupes, tiers, applies a conservative
provenance-based evidence grade, writes a dated queue + digest, and delivers
to Telegram and/or a GitHub issue.

Design rules (see docs/intel/build-spec.md):
  * Never stores full article text. Feed-supplied excerpt only, capped.
  * Never bypasses a block. A 403 is recorded, not worked around.
  * Never assigns grade A. Grade A is a human judgement.
  * Never writes outside docs/intel/.

Usage:
    python3 docs/intel/collect.py --verify     # test every source, deliver nothing
    python3 docs/intel/collect.py --dry-run    # collect + write files, deliver nothing
    python3 docs/intel/collect.py              # full run
"""

from __future__ import annotations

import argparse
import datetime as dt
import difflib
import hashlib
import html
import json
import os
import re
import sys
import time
import urllib.parse as up
from dataclasses import dataclass, field, asdict
from pathlib import Path

import feedparser
import requests
import yaml

# --------------------------------------------------------------------------
# Paths
# --------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parent          # docs/intel/
QUEUE = ROOT / "queue"
DAILY = ROOT / "daily"
WATCH = ROOT / "watch"
STATE_PATH = ROOT / "state.json"
ALERTS_PATH = ROOT / "ALERTS.md"
SOURCES_PATH = ROOT / "sources.yml"
KEYWORDS_PATH = ROOT / "keywords.yml"

USER_AGENT = (
    "COP32-Intel/1.0 (research watcher for an independent, unofficial COP32 "
    "information project; +https://github.com/Ermi1o1/COP32)"
)
TIMEOUT = 20
POLITE_DELAY = 2.0          # seconds between requests to the same host
EXCERPT_CAP = 300           # hard cap on stored excerpt length (copyright rule C5)
FAIL_LIMIT = 5              # consecutive failures before auto-disable

GEEZ = re.compile(r"[ሀ-፿]")

# --------------------------------------------------------------------------
# Small helpers
# --------------------------------------------------------------------------


def now_utc() -> dt.datetime:
    return dt.datetime.now(dt.timezone.utc)


def today_str() -> str:
    return now_utc().strftime("%Y-%m-%d")


def log(msg: str) -> None:
    print(f"[{now_utc():%H:%M:%S}] {msg}", flush=True)


def strip_tags(s: str) -> str:
    s = re.sub(r"<script.*?</script>", " ", s, flags=re.S | re.I)
    s = re.sub(r"<style.*?</style>", " ", s, flags=re.S | re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", html.unescape(s)).strip()


def canonical_url(url: str) -> str:
    """Strip tracking junk so the same article from two feeds dedupes."""
    try:
        p = up.urlsplit(url)
    except ValueError:
        return url
    q = [
        (k, v)
        for k, v in up.parse_qsl(p.query, keep_blank_values=False)
        if not k.lower().startswith(("utm_", "fbclid", "gclid", "mc_", "ref"))
    ]
    path = p.path.rstrip("/") or "/"
    for suffix in ("/amp", "/amp.html", ".amp"):
        if path.endswith(suffix):
            path = path[: -len(suffix)]
    netloc = p.netloc.lower().removeprefix("www.")
    return up.urlunsplit((p.scheme or "https", netloc, path, up.urlencode(q), ""))


def hash_str(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8", "replace")).hexdigest()[:16]


def detect_lang(text: str) -> str:
    """Crude but sufficient: any Ge'ez block means Amharic/Tigrinya content."""
    return "am" if GEEZ.search(text or "") else "en"


def slugify(text: str, maxlen: int = 60) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", (text or "").lower()).strip("-")
    return (s[:maxlen].rstrip("-")) or "item"


def parse_date(entry) -> str:
    for key in ("published_parsed", "updated_parsed"):
        tm = entry.get(key)
        if tm:
            try:
                return time.strftime("%Y-%m-%d", tm)
            except Exception:
                pass
    return today_str()


def extractive_summary(text: str, max_sentences: int = 2) -> str:
    """
    Free, no-API 'auto summary': the first sentences of the feed's OWN
    description. It is explicitly NOT a paraphrase and never becomes the
    archived summary -- /intel-review writes that in our own words.
    """
    text = strip_tags(text or "")
    if not text:
        return ""
    parts = re.split(r"(?<=[.!?])\s+", text)
    out = " ".join(parts[:max_sentences]).strip()
    return out[:EXCERPT_CAP].rstrip()


# --------------------------------------------------------------------------
# Item model
# --------------------------------------------------------------------------


@dataclass
class Item:
    id: str = ""
    url: str = ""
    url_canonical: str = ""
    title: str = ""
    outlet: str = ""
    source_key: str = ""
    kind: str = "article"          # article | video | telegram | page_change | app_listing
    published: str = ""
    retrieved: str = ""
    lang: str = "en"
    trust: str = "unknown"
    tier: int = 3
    grade: str = "C"
    grade_reason: str = ""
    flags: list = field(default_factory=list)
    matched: list = field(default_factory=list)
    excerpt_auto: str = ""
    also_seen: list = field(default_factory=list)
    note: str = ""


# --------------------------------------------------------------------------
# Fetching
# --------------------------------------------------------------------------


class Fetcher:
    """Polite HTTP. Records blocks; never circumvents them."""

    def __init__(self) -> None:
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": USER_AGENT, "Accept-Language": "en,am;q=0.8"})
        self._last_hit: dict[str, float] = {}

    def get(self, url: str) -> tuple[bytes | None, str]:
        host = up.urlsplit(url).netloc
        wait = POLITE_DELAY - (time.monotonic() - self._last_hit.get(host, 0))
        if wait > 0:
            time.sleep(wait)
        try:
            r = self.session.get(url, timeout=TIMEOUT, allow_redirects=True)
        except requests.RequestException as e:
            self._last_hit[host] = time.monotonic()
            return None, f"error:{type(e).__name__}"
        finally:
            self._last_hit[host] = time.monotonic()

        if r.status_code in (401, 403, 429, 451):
            # Bot detection / rate limit / legal block. Record and move on.
            return None, f"blocked:{r.status_code}"
        if r.status_code >= 400:
            return None, f"http:{r.status_code}"
        return r.content, "ok"


# --------------------------------------------------------------------------
# Source adapters
# --------------------------------------------------------------------------


def from_feed(src: dict, raw: bytes) -> list[Item]:
    d = feedparser.parse(raw)
    out: list[Item] = []
    for e in d.entries[: src.get("max_items", 25)]:
        link = e.get("link") or ""
        if not link:
            continue
        title = strip_tags(e.get("title") or "")
        desc = e.get("summary") or e.get("description") or ""
        it = Item(
            url=link,
            title=title,
            outlet=src.get("name", src["key"]),
            source_key=src["key"],
            kind="video" if src["type"] == "youtube_channel" else "article",
            published=parse_date(e),
            excerpt_auto=extractive_summary(desc),
        )
        # Google News wraps the real outlet in the title: "Headline - Outlet"
        if src["type"] == "gnews" and " - " in title:
            head, _, outlet = title.rpartition(" - ")
            if 2 < len(outlet) < 40:
                it.title, it.outlet = head.strip(), outlet.strip()
                it.flags.append("via_google_news")
        out.append(it)
    return out


# Parsed one message block at a time. A single regex with an OPTIONAL text
# group never captured the text (the optional group matched empty right after
# data-post), so every post was dropped as text-less. Fixed 2026-11-09.
TG_SPLIT = re.compile(r'<div class="tgme_widget_message_wrap')
TG_POST = re.compile(r'data-post="([^"]+)"')
TG_TEXT = re.compile(r'<div class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>', re.S)
TG_TS = re.compile(r'<time datetime="([^"]+)"')


def from_telegram(src: dict, raw: bytes) -> list[Item]:
    """
    Reads a PUBLIC Telegram channel preview page (t.me/s/<channel>).
    No login, no API key, no private data. Public channels only.
    """
    page = raw.decode("utf-8", "replace")
    out: list[Item] = []
    blocks = TG_SPLIT.split(page)[1:]
    for block in blocks[-src.get("max_items", 20):]:
        post, tm, ts = TG_POST.search(block), TG_TEXT.search(block), TG_TS.search(block)
        if not post or not tm:
            continue            # media-only post or unexpected markup
        text = strip_tags(tm.group(1))
        if not text:
            continue
        out.append(
            Item(
                url=f"https://t.me/{post.group(1)}",
                title=text[:140],
                outlet=src.get("name", src["key"]),
                source_key=src["key"],
                kind="telegram",
                published=(ts.group(1) if ts else "")[:10] or today_str(),
                excerpt_auto=text[:EXCERPT_CAP],
            )
        )
    return out


def from_page_watch(src: dict, raw: bytes, state: dict) -> list[Item]:
    """Detect that a watched page changed. Stores extracted text, not markup."""
    text = strip_tags(raw.decode("utf-8", "replace"))
    # Remove volatile noise so we don't alert on a clock or a nonce.
    text = re.sub(r"\b\d{1,2}:\d{2}(:\d{2})?\b", "", text)
    text = re.sub(r"\b[0-9a-f]{16,}\b", "", text)
    text = re.sub(r"\s+", " ", text).strip()

    key = src["key"]
    folder = WATCH / key
    folder.mkdir(parents=True, exist_ok=True)
    latest = folder / "latest.txt"

    if not latest.exists():
        latest.write_text(text, encoding="utf-8")
        return []

    old = latest.read_text(encoding="utf-8")
    if hash_str(old) == hash_str(text):
        return []

    diff = list(
        difflib.unified_diff(
            old.split(". "), text.split(". "), lineterm="", n=1
        )
    )[:60]
    stamp = now_utc().strftime("%Y-%m-%d %H:%M UTC")
    with (folder / "history.md").open("a", encoding="utf-8") as fh:
        fh.write(f"\n## {stamp}\n\n```diff\n" + "\n".join(diff) + "\n```\n")
    latest.write_text(text, encoding="utf-8")

    return [
        Item(
            url=src["url"],
            title=f"PAGE CHANGED: {src.get('name', key)}",
            outlet=src.get("name", key),
            source_key=key,
            kind="page_change",
            published=today_str(),
            excerpt_auto=f"Watched page content changed. Diff: docs/intel/watch/{key}/history.md",
            flags=["page_change"],
        )
    ]


def from_apple_search(src: dict, raw: bytes, state: dict) -> list[Item]:
    """
    Apple's public search endpoint. Documented, free, no key.

    IMPORTANT: iTunes search ORs the query terms and matches loosely, so
    "COP32 Ethiopia" returns every Ethiopian app in the store. The first live
    run (2026-11-09) produced 34 "NEW APP LISTING" Tier-1 alerts of which 31
    were things like dating apps and radio players.

    So a match regex is MANDATORY and is applied to the app's name and
    publisher only -- never to its description, or any app whose blurb says
    "climate" would alert. An app that does not match is still recorded as
    seen, so it can never alert later either.
    """
    try:
        data = json.loads(raw.decode("utf-8", "replace"))
    except json.JSONDecodeError:
        return []

    pattern = src.get("match") or r"\bCOP[\s\-_]?3[0-9]\b"
    try:
        rx = re.compile(pattern, re.I)
    except re.error:
        log(f"  !! bad match regex on {src['key']}: {pattern!r} — source skipped")
        return []

    seen = set(state.get("app_ids", {}).get(src["key"], []))
    fresh, out, filtered = [], [], 0
    for app in data.get("results", [])[:50]:
        aid = str(app.get("trackId"))
        fresh.append(aid)
        name = app.get("trackName", "") or ""
        seller = app.get("sellerName", "") or ""
        if not rx.search(f"{name} {seller}"):
            filtered += 1
            continue
        if aid in seen:
            continue
        out.append(
            Item(
                url=app.get("trackViewUrl", ""),
                # No "NEW APP LISTING:" prefix -- it ate 19 characters of every
                # alert title and truncated the inline buttons mid-word. The
                # kind is carried by the 📱 marker the renderers add and by the
                # "Apple App Store" outlet line.
                title=f"{app.get('trackName','?')} — {app.get('sellerName','?')}",
                outlet="Apple App Store",
                source_key=src["key"],
                kind="app_listing",
                published=(app.get("releaseDate") or "")[:10] or today_str(),
                excerpt_auto=extractive_summary(app.get("description", "")),
                flags=["app_listing"],
            )
        )
    state.setdefault("app_ids", {})[src["key"]] = fresh
    if filtered:
        log(f"       {src['key']}: {filtered} store results ignored (name did not match {pattern})")
    return out


# --------------------------------------------------------------------------
# Tiering and grading
# --------------------------------------------------------------------------


class Classifier:
    def __init__(self, cfg: dict) -> None:
        self.cfg = cfg
        self.subject = self._rx(cfg["subject_terms"])
        self.t1 = self._rx(cfg["tier1_terms"])
        self.t2 = self._rx(cfg["tier2_terms"])
        self.t3 = self._rx(cfg["tier3_terms"])
        self.t4 = self._rx(cfg["tier4_terms"])
        self.opinion = self._rx(cfg["opinion_markers"])
        self.hard_claim = [re.compile(p, re.I) for p in cfg["hard_claim_patterns"]]

    @staticmethod
    def _rx(terms: list[str]) -> re.Pattern:
        """
        Boundaries are ASCII-only on purpose. Python's \\w includes Ge'ez, so
        a normal \\b would refuse to match "COP32" inside "ለCOP32" (the Amharic
        prefix ለ counts as a word character) and every Amharic COP32 story
        would be silently dropped. Caught in testing 2026-11-09 — do not
        "simplify" this back to \\b.
        """
        esc = sorted((re.escape(t) for t in terms), key=len, reverse=True)
        return re.compile(
            r"(?<![A-Za-z0-9_])(" + "|".join(esc) + r")(?![A-Za-z0-9_])", re.I
        )

    def classify(self, it: Item, src: dict) -> Item | None:
        blob = f"{it.title} {it.excerpt_auto}"
        it.lang = detect_lang(blob)

        hits_subject = bool(self.subject.search(blob))
        m1 = {m.group(0).lower() for m in self.t1.finditer(blob)}
        m2 = {m.group(0).lower() for m in self.t2.finditer(blob)}
        m3 = {m.group(0).lower() for m in self.t3.finditer(blob)}
        m4 = {m.group(0).lower() for m in self.t4.finditer(blob)}

        # D69: an app listing is Tier 1 only when its NAME or PUBLISHER says
        # COP32. Listings for other COPs (COP16, COP27, COP31...) pass the
        # source's match regex but are benchmark material, not alerts, and
        # used to be forced to Tier 1 by the source's tier_floor.
        if it.kind == "app_listing":
            forced = hits_subject
        else:
            forced = src.get("tier_floor") == 1

        if forced or (hits_subject and m1):
            it.tier = 1
        elif it.kind == "app_listing":
            it.tier = 4
        elif it.kind == "page_change":
            # A watched page without a tier floor changed: context, not an alert.
            it.tier = 2
        elif hits_subject:
            # Any COP32 mention is at least preparation-relevant.
            it.tier = 2
        elif m3:
            it.tier = 3
        elif m4:
            it.tier = 4
        else:
            return None                      # dropped, not stored

        it.matched = sorted(m1 | m2 | m3 | m4)[:8]
        it.trust = src.get("trust", "unknown")
        it.grade, it.grade_reason, extra = self._grade(it, blob)
        it.flags.extend(extra)
        return it

    def _grade(self, it: Item, blob: str) -> tuple[str, str, list[str]]:
        """
        Deterministic, provenance-based, conservative. NEVER returns 'A'.
        The machine may only set a FLOOR; /intel-review can promote with a reason.
        """
        flags: list[str] = []

        if self.opinion.search(blob):
            return "D", "opinion/analysis markers in title or excerpt", flags

        if it.trust == "official":
            grade, reason = "B", "published on an official domain"
        elif it.trust == "state_media":
            grade, reason = "C", "state media; promote to B only for direct official statements"
            flags.append("official_adjacent")
        elif it.trust in ("aggregator", "unknown"):
            grade, reason = "C", "aggregator or unverified source"
            flags.append("low_trust")
        else:
            grade, reason = "C", "independent press report"

        # Override: a hard factual claim from a non-official source is never
        # better than F. This is the rule that stops "COP32 is 8-19 November"
        # entering the archive on the strength of an SEO blog.
        if it.trust != "official":
            for pat in self.hard_claim:
                if pat.search(blob):
                    flags.append("hard_claim")
                    return "F", f"hard factual claim ({pat.pattern[:28]}...) from a non-official source", flags

        return grade, reason, flags


# --------------------------------------------------------------------------
# Dedupe
# --------------------------------------------------------------------------


def dedupe(items: list[Item], state: dict) -> tuple[list[Item], int]:
    seen_urls: dict = state.setdefault("seen", {})
    cutoff = (now_utc() - dt.timedelta(days=14)).strftime("%Y-%m-%d")
    state["seen"] = {k: v for k, v in seen_urls.items() if v >= cutoff}
    seen_urls = state["seen"]

    recent_titles = state.setdefault("recent_titles", [])
    recent_titles[:] = [t for t in recent_titles if t[1] >= cutoff]

    trust_rank = {"official": 0, "state_media": 1, "independent": 2, "aggregator": 3, "unknown": 4}
    items.sort(key=lambda i: (trust_rank.get(i.trust, 9), i.published))

    kept: list[Item] = []
    dropped = 0
    for it in items:
        it.url_canonical = canonical_url(it.url)
        it.id = hash_str(it.url_canonical)
        if it.id in seen_urls:
            dropped += 1
            continue

        norm = re.sub(r"\W+", " ", it.title.lower()).strip()
        twin = None
        for prev in kept:
            if difflib.SequenceMatcher(None, norm, re.sub(r"\W+", " ", prev.title.lower())).ratio() > 0.90:
                twin = prev
                break
        if twin is None:
            for old_title, _d in recent_titles:
                if difflib.SequenceMatcher(None, norm, old_title).ratio() > 0.90:
                    twin = "old"
                    break

        if twin == "old":
            seen_urls[it.id] = today_str()
            dropped += 1
            continue
        if twin is not None:
            twin.also_seen.append({"outlet": it.outlet, "url": it.url_canonical})
            seen_urls[it.id] = today_str()
            dropped += 1
            continue

        it.retrieved = today_str()
        seen_urls[it.id] = today_str()
        recent_titles.append([norm, today_str()])
        kept.append(it)

    return kept, dropped


# --------------------------------------------------------------------------
# Rendering and delivery
# --------------------------------------------------------------------------


GRADE_ICON = {"A": "✅", "B": "🏛", "C": "📰", "D": "💭", "F": "❓"}
TIER_HEAD = {
    1: ("🔴", "ALERTS — needs a decision"),
    2: ("🇪🇹", "COP32 preparation"),
    3: ("🌍", "Climate context"),
    4: ("🔎", "Benchmark watch"),
}


def esc(s: str) -> str:
    return html.escape(s or "", quote=False)


def clip(text: str, limit: int) -> str:
    """Trim on a word boundary so titles and buttons never cut mid-word."""
    text = (text or "").strip()
    if len(text) <= limit:
        return text
    cut = text[:limit]
    space = cut.rfind(" ")
    if space > limit * 0.6:
        cut = cut[:space]
    return cut.rstrip(" ,.;:—-") + "…"


def kind_marker(it: "Item") -> str:
    return {"app_listing": "📱 ", "page_change": "🔔 ", "telegram": "💬 ", "video": "▶️ "}.get(it.kind, "")


def short_date(iso: str) -> str:
    try:
        return dt.date.fromisoformat(iso).strftime("%d %b")
    except ValueError:
        return iso


def render_telegram(items: list[Item], counts: dict, problems: list[str]) -> tuple[str, list]:
    """
    Compact HTML for the phone. Titles are tappable links, so no raw URLs.
    Tiers 1 and 2 are listed; 3 and 4 are summarised with a count and live in
    the day's file. Returns (html_text, inline_keyboard_buttons).
    """
    d = now_utc()
    by = {t: [i for i in items if i.tier == t] for t in (1, 2, 3, 4)}
    out = [f"<b>COP32 INTEL</b> · {d:%a %d %b}"]

    if by[1]:
        icon, label = TIER_HEAD[1]
        out += ["", f"{icon} <b>{label} ({len(by[1])})</b>"]
        for n, it in enumerate(by[1], 1):
            warn = " ⚑" if "hard_claim" in it.flags else ""
            out.append(
                f"{n}. {kind_marker(it)}<a href=\"{esc(it.url)}\">{esc(clip(it.title, 105))}</a>{warn}\n"
                f"    <i>{esc(it.outlet)} · {short_date(it.published)} · "
                f"{GRADE_ICON.get(it.grade,'')}{it.grade}</i>"
            )

    if by[2]:
        icon, label = TIER_HEAD[2]
        out += ["", f"{icon} <b>{label} ({len(by[2])})</b>"]
        for it in by[2]:
            warn = " ⚑" if "hard_claim" in it.flags else ""
            am = " 🇪🇹አማ" if it.lang == "am" else ""
            out.append(
                f"• {kind_marker(it)}<a href=\"{esc(it.url)}\">{esc(clip(it.title, 92))}</a>{warn}{am}\n"
                f"    <i>{esc(it.outlet)} · {short_date(it.published)} · "
                f"{GRADE_ICON.get(it.grade,'')}{it.grade}</i>"
            )

    tail = []
    if by[3]:
        tail.append(f"🌍 {len(by[3])} context")
    if by[4]:
        tail.append(f"🔎 {len(by[4])} benchmark")
    if tail:
        out += ["", "· ".join(tail) + f" — in <code>docs/intel/daily/{today_str()}.md</code>"]

    if not items:
        out += ["", "Nothing new today."]

    if problems:
        out += ["", f"⚠️ <b>{len(problems)} source(s) need attention</b>"]
        out += [f"  <i>{esc(p)}</i>" for p in problems[:4]]
        if len(problems) > 4:
            out.append(f"  <i>…and {len(problems) - 4} more</i>")

    skipped = counts["duplicates"] + counts["irrelevant"] + counts["stale"] + counts["trimmed"]
    out += [
        "",
        f"<i>{skipped} filtered out "
        f"({counts['irrelevant']} off-topic, {counts['duplicates']} seen, "
        f"{counts['stale']} stale, {counts['trimmed']} trimmed).</i>",
        "<i>Letters are provenance floors, not verified facts. "
        "⚑ = unverified hard claim. Run /intel-review to file.</i>",
    ]

    buttons = [
        [{"text": f"{kind_marker(it) or '🔴 '}{clip(it.title, 36)}", "url": it.url}]
        for it in by[1][:6]
        if it.url.startswith("http")
    ]
    return "\n".join(out), buttons


def render_file(items: list[Item], counts: dict, problems: list[str]) -> str:
    """The full record for the repo. Everything, including tiers 3 and 4."""
    d = now_utc()
    out = [f"# COP32 intel — {d:%A %d %B %Y}", ""]
    out.append(
        f"{counts['kept']} kept · {counts['irrelevant']} off-topic · "
        f"{counts['duplicates']} already seen · {counts['stale']} older than the age limit · "
        f"{counts['trimmed']} trimmed from tiers 3-4."
    )
    out.append("")
    out.append("Grades below are **automatic provenance floors**, not verified facts. "
               "Only `/intel-review` assigns grade A. ⚑ marks an unverified hard claim.")

    for tier in (1, 2, 3, 4):
        group = [i for i in items if i.tier == tier]
        if not group:
            continue
        icon, label = TIER_HEAD[tier]
        out += ["", f"## {icon} {label} ({len(group)})", ""]
        for it in group:
            warn = " ⚑" if "hard_claim" in it.flags else ""
            am = " `አማ`" if it.lang == "am" else ""
            out.append(f"### [{it.grade}] {kind_marker(it)}{it.title}{warn}{am}")
            out.append(f"*{it.outlet} · {it.published} · {it.source_key} · trust: {it.trust}*")
            out.append("")
            if it.excerpt_auto:
                out.append(f"> {it.excerpt_auto}")
                out.append("")
            out.append(f"<{it.url}>")
            if it.also_seen:
                out.append("")
                out.append("Also carried by: " + ", ".join(a["outlet"] for a in it.also_seen[:5]))
            out.append(f"\n*Grade reason: {it.grade_reason}*")
            out.append("")

    if problems:
        out += ["", "## ⚠️ Sources needing attention", ""]
        out += [f"- {p}" for p in problems]

    return "\n".join(out) + "\n"


def send_telegram(text: str, buttons: list | None = None) -> str:
    token, chat = os.environ.get("TELEGRAM_BOT_TOKEN"), os.environ.get("TELEGRAM_CHAT_ID")
    if not token or not chat:
        return "telegram: secrets not set, skipped"
    api = f"https://api.telegram.org/bot{token}/sendMessage"

    # Split on blank lines so an entity is never cut in half -- a severed
    # <a href> tag makes Telegram reject the whole message.
    chunks, buf = [], ""
    for para in text.split("\n\n"):
        if len(buf) + len(para) > 3500 and buf:
            chunks.append(buf.rstrip())
            buf = ""
        buf += para + "\n\n"
    if buf.strip():
        chunks.append(buf.rstrip())

    for n, part in enumerate(chunks):
        payload = {
            "chat_id": chat,
            "text": part,
            "parse_mode": "HTML",
            "disable_web_page_preview": True,
        }
        if buttons and n == len(chunks) - 1:
            payload["reply_markup"] = json.dumps({"inline_keyboard": buttons})
        try:
            r = requests.post(api, data=payload, timeout=TIMEOUT)
            if r.status_code != 200:
                # Fall back to plain text rather than losing the digest.
                requests.post(
                    api,
                    data={"chat_id": chat, "text": re.sub(r"<[^>]+>", "", part),
                          "disable_web_page_preview": True},
                    timeout=TIMEOUT,
                )
                return f"telegram: HTML rejected (HTTP {r.status_code}), sent as plain text"
        except requests.RequestException as e:
            return f"telegram: {type(e).__name__}"
    return f"telegram: sent {len(chunks)} message(s)"


def open_github_issue(text: str) -> str:
    token = os.environ.get("GITHUB_TOKEN")
    repo = os.environ.get("GITHUB_REPOSITORY")
    if not token or not repo:
        return "github issue: not configured, skipped"
    try:
        r = requests.post(
            f"https://api.github.com/repos/{repo}/issues",
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/vnd.github+json",
            },
            json={
                "title": f"Intel digest {today_str()}",
                "body": "```\n" + text + "\n```",
                "labels": ["intel"],
            },
            timeout=TIMEOUT,
        )
        return f"github issue: {'created' if r.status_code == 201 else f'HTTP {r.status_code}'}"
    except requests.RequestException as e:
        return f"github issue: {type(e).__name__}"


def stale_alert_count(days: int = 7) -> int:
    """
    D69: how many open Tier-1 lines in ALERTS.md are older than `days`.

    An alert sat unread for 131 days in 2026 because ALERTS.md only ever grew
    and nothing reported its age. Counts lines of the form
    "- [ ] YYYY-MM-DD ..."; open items without a leading date are counted too,
    since they have no date to excuse them.
    """
    if not ALERTS_PATH.exists():
        return 0
    cutoff = (now_utc() - dt.timedelta(days=days)).strftime("%Y-%m-%d")
    n = 0
    for line in ALERTS_PATH.read_text(encoding="utf-8").splitlines():
        m = re.match(r"\s*- \[ \]\s*(\d{4}-\d{2}-\d{2})?", line)
        if not m:
            continue
        if m.group(1) is None or m.group(1) < cutoff:
            n += 1
    return n


def update_alerts_file(tier1: list[Item]) -> None:
    if not tier1:
        return
    header = "# Open Tier-1 alerts\n\nItems the collector flagged as project-critical. Clear a line once it is filed or dismissed.\n"
    existing = ALERTS_PATH.read_text(encoding="utf-8") if ALERTS_PATH.exists() else header
    with ALERTS_PATH.open("w", encoding="utf-8") as fh:
        fh.write(existing.rstrip() + "\n")
        for it in tier1:
            fh.write(f"- [ ] {it.published} · **{it.outlet}** · [{it.grade}] {it.title} — {it.url}\n")


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------


FETCHERS = {
    "rss": from_feed,
    "gnews": from_feed,
    "youtube_channel": from_feed,
    "telegram": from_telegram,
    "page_watch": from_page_watch,
    "apple_search": from_apple_search,
}


def build_url(src: dict) -> str:
    t = src["type"]
    if t == "youtube_channel":
        return f"https://www.youtube.com/feeds/videos.xml?channel_id={src['url']}"
    if t == "gnews":
        q = up.quote(src["url"])
        loc = src.get("gnews_locale", "hl=en-US&gl=US&ceid=US:en")
        return f"https://news.google.com/rss/search?q={q}&{loc}"
    if t == "telegram":
        return f"https://t.me/s/{src['url'].lstrip('@')}"
    if t == "apple_search":
        return f"https://itunes.apple.com/search?term={up.quote(src['url'])}&entity=software&limit=25"
    return src["url"]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--verify", action="store_true", help="probe every source, deliver nothing")
    ap.add_argument("--dry-run", action="store_true", help="collect and write files, deliver nothing")
    args = ap.parse_args()

    for d in (QUEUE, DAILY, WATCH):
        d.mkdir(parents=True, exist_ok=True)

    sources = yaml.safe_load(SOURCES_PATH.read_text(encoding="utf-8"))["sources"]
    keywords = yaml.safe_load(KEYWORDS_PATH.read_text(encoding="utf-8"))
    state = json.loads(STATE_PATH.read_text(encoding="utf-8")) if STATE_PATH.exists() else {}
    clf = Classifier(keywords)
    fetcher = Fetcher()

    raw_items: list[Item] = []
    problems: list[str] = []
    verify_rows: list[str] = []
    fails = state.setdefault("fail_counts", {})

    for src in sources:
        enabled = src.get("enabled", True)
        if not enabled and not args.verify:
            continue
        # In --verify, disabled sources are still probed (so they can be
        # re-checked) but tagged, so their FAILs aren't mistaken for live ones.
        off = "" if enabled else "  [disabled]"
        url = build_url(src)
        if "REPLACE_WITH" in str(src.get("url", "")):
            # Unfilled placeholder: probing it proves nothing.
            verify_rows.append(f"TODO  {src['key']:22} {'placeholder':16} fill in url in sources.yml{off}")
            continue
        body, status = fetcher.get(url)

        if status != "ok":
            fails[src["key"]] = fails.get(src["key"], 0) + 1
            note = f"{src['key']} — {status} ({fails[src['key']]} consecutive)"
            if fails[src["key"]] >= FAIL_LIMIT:
                note += " — AUTO-DISABLED, set enabled:false or fix the URL"
            problems.append(note)
            verify_rows.append(f"FAIL  {src['key']:22} {status:16} {url[:70]}{off}")
            log(f"  fail {src['key']}: {status}")
            continue

        fails[src["key"]] = 0
        try:
            fn = FETCHERS[src["type"]]
            found = fn(src, body, state) if src["type"] in ("page_watch", "apple_search") else fn(src, body)
        except Exception as e:                                  # noqa: BLE001
            problems.append(f"{src['key']} — parse error {type(e).__name__}")
            verify_rows.append(f"ERR   {src['key']:22} parse:{type(e).__name__}{off}")
            continue

        # A feed that answers but yields nothing is not a working feed (e.g. an
        # HTML page served at a feed URL, or an empty channel). Page watches
        # legitimately report 0 items when nothing changed, so they stay OK.
        verdict = "OK  " if found or src["type"] == "page_watch" else "EMPTY"
        verify_rows.append(f"{verdict:5} {src['key']:22} items={len(found):<4} {url[:70]}{off}")
        log(f"  ok   {src['key']}: {len(found)} raw")
        raw_items.extend(found)

    if args.verify:
        report = "\n".join(
            ["COP32 intel — source verification", f"run {now_utc():%Y-%m-%d %H:%M UTC}", ""] + sorted(verify_rows)
        )
        (ROOT / "source-verification.txt").write_text(report + "\n", encoding="utf-8")
        print("\n" + report)
        print("\nWritten to docs/intel/source-verification.txt")
        print("Fix or set enabled:false for any FAIL or EMPTY not tagged [disabled]; fill in TODO placeholders.")
        return 0

    limits = keywords.get("limits", {})
    max_age = int(limits.get("max_age_days", 14))
    cutoff = (now_utc() - dt.timedelta(days=max_age)).strftime("%Y-%m-%d")

    # classify -> drop irrelevant and stale
    classified: list[Item] = []
    stale = 0
    for it in raw_items:
        src = next(s for s in sources if s["key"] == it.source_key)

        # Age gate. Feeds and search endpoints happily serve items from years
        # ago; the first live run surfaced an app released in 2005. Page
        # changes are always "now", and an app listing is gated by its name
        # match rather than its release date (a COP32 app could be listed
        # quietly weeks before anyone writes about it).
        if it.kind not in ("page_change", "app_listing") and it.published < cutoff:
            stale += 1
            continue

        kept = clf.classify(it, src)
        if kept:
            classified.append(kept)
    irrelevant = len(raw_items) - len(classified) - stale

    items, dup = dedupe(classified, state)

    # Volume caps. Tiers 1 and 2 are never trimmed -- those are the whole
    # point. Tiers 3 and 4 are background and are capped at the newest few,
    # because a digest nobody finishes reading is a digest nobody reads.
    trimmed = 0
    capped: list[Item] = []
    for tier, cap in ((1, None), (2, None), (3, limits.get("tier3_max", 8)), (4, limits.get("tier4_max", 6))):
        group = sorted([i for i in items if i.tier == tier], key=lambda i: i.published, reverse=True)
        if cap is not None and len(group) > cap:
            trimmed += len(group) - cap
            group = group[:cap]
        capped.extend(group)
    items = capped
    items.sort(key=lambda i: (i.tier, i.published))

    counts = {
        "kept": len(items),
        "duplicates": dup,
        "irrelevant": irrelevant,
        "stale": stale,
        "trimmed": trimmed,
    }
    stale = stale_alert_count()
    if stale:
        problems.insert(
            0,
            f"{stale} open Tier-1 alert(s) in ALERTS.md older than 7 days — run /intel-review",
        )

    tg_text, tg_buttons = render_telegram(items, counts, problems)
    file_md = render_file(items, counts, problems)

    (QUEUE / f"{today_str()}.json").write_text(
        json.dumps(
            {
                "run": now_utc().isoformat(),
                "reviewed": False,
                "counts": counts,
                "problems": problems,
                "items": [asdict(i) for i in items],
            },
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )
    (DAILY / f"{today_str()}.md").write_text(file_md, encoding="utf-8")
    update_alerts_file([i for i in items if i.tier == 1])
    STATE_PATH.write_text(json.dumps(state, indent=1, ensure_ascii=False), encoding="utf-8")

    # Plain-text echo for the Actions log (strip the HTML tags).
    print("\n" + re.sub(r"<[^>]+>", "", tg_text) + "\n")

    if args.dry_run:
        log("dry run: nothing delivered")
        return 0

    log(send_telegram(tg_text, tg_buttons))
    if any(i.tier == 1 for i in items) or os.environ.get("INTEL_ALWAYS_ISSUE") == "1":
        log(open_github_issue(re.sub(r"<[^>]+>", "", tg_text)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
