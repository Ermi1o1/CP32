import { describe, expect, it, vi } from 'vitest';

vi.mock('../src/ui/Icon', () => ({}));
import { FEATURED, GUIDES, PLACES, UPDATES } from '../src/data/guides';
import { SESSIONS } from '../src/data/seed';

const allText = JSON.stringify({ GUIDES, UPDATES });

describe('guides and updates state no official fact (D66)', () => {
  it('contain no phone numbers, dates, prices or years', () => {
    expect(allText).not.toMatch(/\d{3,}/);                       // no 3+ digit runs: phone numbers, years, amounts
    expect(allText).not.toMatch(/\b\d{1,2}\s*(am|pm|birr|usd|\$|€)/i);
  });
  it('do not claim to be official', () => {
    expect(allText).not.toMatch(/\bofficial (app|guide) of\b/i);
    expect(allText).not.toMatch(/endorsed by|approved by/i);
  });
  it('the emergency guide exists and promises confirmed numbers rather than inventing them', () => {
    const e = GUIDES.find((g) => g.emergency);
    expect(e?.id).toBe('emergency');
    expect(e?.covers.join(' ')).toMatch(/confirmed with the host/);
  });
  it('ids are unique and every guide has text', () => {
    expect(new Set(GUIDES.map((g) => g.id)).size).toBe(GUIDES.length);
    for (const g of GUIDES) { expect(g.body.length, g.id).toBeGreaterThan(0); expect(g.covers.length, g.id).toBeGreaterThan(0); }
  });
});

describe('cross-references resolve', () => {
  it('featured sessions exist', () => {
    const ids = new Set(SESSIONS.map((s) => s.id));
    for (const id of FEATURED) expect(ids.has(id), id).toBe(true);
  });
  it('every room in the programme belongs to a place on the plan', () => {
    const rooms = new Set(PLACES.flatMap((p) => p.rooms));
    for (const s of SESSIONS) expect(rooms.has(s.room), `${s.id}: ${s.room}`).toBe(true);
  });
});
