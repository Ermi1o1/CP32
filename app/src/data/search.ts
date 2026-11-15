import { fold } from './fold';
import { GLOSSARY } from './glossary';
import { GUIDES, PLACES, UPDATES } from './guides';
import { SESSIONS, SPEAKERS } from './seed';

export type HitKind = 'session' | 'person' | 'place' | 'guide' | 'term';

export interface Hit {
  kind: HitKind;
  id: string;
  title: string;
  sub: string;
  /** Where tapping the result goes. */
  href: string;
  score: number;
}

interface Doc { kind: HitKind; id: string; title: string; sub: string; href: string; strong: string; weak: string }

/**
 * Everything searchable, built once from the content bundled in the app.
 * Search therefore works with no network (IA §6). Results are the app's own
 * vetted entries — it never composes an answer (teardown §6).
 */
function buildIndex(): Doc[] {
  const docs: Doc[] = [];
  for (const s of SESSIONS) {
    const people = s.speakerIds.map((id) => SPEAKERS.find((p) => p.id === id)?.name ?? '').join(' ');
    docs.push({ kind: 'session', id: s.id, title: s.title.en, sub: `Day ${s.day} · ${s.start} · ${s.room}`, href: `/session/${s.id}`, strong: fold(s.title.en), weak: fold(`${s.body.en} ${s.room} ${s.format} ${s.theme} ${people}`) });
  }
  for (const p of SPEAKERS) docs.push({ kind: 'person', id: p.id, title: p.name, sub: `${p.role} · ${p.org}`, href: `/speaker/${p.id}`, strong: fold(p.name), weak: fold(`${p.org} ${p.role}`) });
  for (const p of PLACES) docs.push({ kind: 'place', id: p.id, title: p.name, sub: p.note, href: '/map', strong: fold(`${p.name} ${p.rooms.join(' ')}`), weak: fold(p.note) });
  for (const g of GUIDES) docs.push({ kind: 'guide', id: g.id, title: g.title, sub: g.summary, href: `/guide/${g.id}`, strong: fold(g.title), weak: fold(`${g.summary} ${g.body.join(' ')} ${g.covers.join(' ')}`) });
  for (const u of UPDATES) docs.push({ kind: 'guide', id: u.id, title: u.title, sub: u.summary, href: '/updates', strong: fold(u.title), weak: fold(u.summary) });
  for (const t of GLOSSARY) docs.push({ kind: 'term', id: t.term, title: t.term, sub: t.def, href: '/glossary', strong: fold(t.term), weak: fold(t.def) });
  return docs;
}

let INDEX: Doc[] | undefined;

/**
 * Ranked search. Every word of the query must appear somewhere in an entry.
 * Title matches outrank body matches; a title that starts with the query ranks first.
 */
export function search(query: string, limit = 40): Hit[] {
  const q = fold(query);
  if (q.length < 2) return [];
  INDEX ??= buildIndex();
  const words = q.split(' ');
  const hits: Hit[] = [];
  for (const d of INDEX) {
    let score = 0;
    let all = true;
    for (const w of words) {
      const inStrong = d.strong.includes(w);
      const inWeak = d.weak.includes(w);
      if (!inStrong && !inWeak) { all = false; break; }
      score += inStrong ? (new RegExp(`(^| )${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(d.strong) ? 6 : 4) : 1;
    }
    if (!all) continue;
    if (d.strong === q) score += 20;
    else if (d.strong.startsWith(q)) score += 10;
    hits.push({ kind: d.kind, id: d.id, title: d.title, sub: d.sub, href: d.href, score });
  }
  return hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, limit);
}
