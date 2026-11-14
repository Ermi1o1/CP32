import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-native-async-storage/async-storage', () => ({ default: { getItem: async () => null, setItem: async () => {} } }));
import { dayProgress, durationMin, minutes, minutesUntil, nextUp, phaseOf } from '../src/data/time';
import { SESSIONS, SPEAKERS, EVENT } from '../src/data/seed';
import { BundledRepository } from '../src/data/repository';
import { fill } from '../src/i18n';
import { sanitizeAgenda } from '../src/state/agenda';
import { THEME_PHOTO, PHOTOS } from '../src/ui/photos';

vi.mock('../src/ui/photos', async () => {
  // The real module requires image files; the mapping is what matters here.
  const names = ['highland', 'terraces', 'dusk', 'heath', 'teff', 'lake', 'wind', 'nursery', 'hall'];
  return {
    PHOTOS: Object.fromEntries(names.map((n) => [n, n])),
    THEME_PHOTO: { water: 'lake', energy: 'wind', land: 'terraces', cities: 'dusk', food: 'teff', finance: 'highland', youth: 'nursery', culture: 'heath', plenary: 'hall' },
  };
});
vi.mock('../src/theme/ThemeProvider', () => ({ usePrefs: () => ({ prefs: { lang: 'en' } }) }));

const now = { day: 2, time: '10:12' };

describe('time helpers', () => {
  it('converts clock times', () => {
    expect(minutes('00:00')).toBe(0);
    expect(minutes('10:30')).toBe(630);
    expect(durationMin({ start: '10:30', end: '11:45' })).toBe(75);
  });
  it('classifies sessions against the demonstration clock', () => {
    expect(phaseOf({ day: 1, start: '09:00', end: '10:00' }, now)).toBe('ended');
    expect(phaseOf({ day: 2, start: '09:00', end: '09:45' }, now)).toBe('ended');
    expect(phaseOf({ day: 2, start: '10:00', end: '11:00' }, now)).toBe('live');
    expect(phaseOf({ day: 2, start: '10:30', end: '11:45' }, now)).toBe('upcoming');
    expect(phaseOf({ day: 3, start: '09:00', end: '09:45' }, now)).toBe('upcoming');
  });
  it('finds the next session of the day', () => {
    const today = SESSIONS.filter((s) => s.day === 2);
    expect(nextUp(today, now)?.start).toBe('10:30');
    expect(nextUp(today, { day: 2, time: '23:00' })).toBeUndefined();
    expect(minutesUntil('10:30', '10:12')).toBe(18);
    expect(minutesUntil('09:00', '10:12')).toBe(0);
  });
  it('keeps the day line between 0 and 1', () => {
    expect(dayProgress('06:00')).toBe(0);
    expect(dayProgress('14:00')).toBeCloseTo(0.5, 5);
    expect(dayProgress('23:00')).toBe(1);
  });
});

describe('demonstration content (D66)', () => {
  it('every session is marked illustrative, has a valid day and a start before its end', () => {
    for (const s of SESSIONS) {
      expect(s.certainty, s.id).toBe('illustrative');
      expect(s.day).toBeGreaterThanOrEqual(1);
      expect(s.day).toBeLessThanOrEqual(EVENT.dayCount);
      expect(minutes(s.start), s.id).toBeLessThan(minutes(s.end));
    }
  });
  it('carries no calendar dates anywhere', () => {
    expect(JSON.stringify({ SESSIONS, EVENT })).not.toMatch(/\d{4}-\d{2}-\d{2}/);
    expect(JSON.stringify(SESSIONS)).not.toMatch(/\b(Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d/);
  });
  it('every speaker reference resolves, and every theme has a bundled photo', async () => {
    const repo = new BundledRepository();
    const ids = new Set(SPEAKERS.map((p) => p.id));
    for (const s of SESSIONS) {
      for (const id of s.speakerIds) expect(ids.has(id), `${s.id} → ${id}`).toBe(true);
      expect(Object.keys(PHOTOS)).toContain(THEME_PHOTO[s.theme]);
    }
    expect((await repo.getSpeakers(['p01', 'nope', 'p02'])).map((p) => p.id)).toEqual(['p01', 'p02']);
  });
  it('session ids are unique', () => {
    expect(new Set(SESSIONS.map((s) => s.id)).size).toBe(SESSIONS.length);
  });
});

describe('small utilities', () => {
  it('fills placeholders and leaves unknown ones visible', () => {
    expect(fill('Day {d} of {n}', { d: 2, n: 5 })).toBe('Day 2 of 5');
    expect(fill('in {m} min', {})).toBe('in {m} min');
    expect(fill('plain')).toBe('plain');
  });
  it('sanitises a stored agenda', () => {
    expect(sanitizeAgenda(null)).toEqual([]);
    expect(sanitizeAgenda(['s01', 's01', 3, 's02'])).toEqual(['s01', 's02']);
  });
});
