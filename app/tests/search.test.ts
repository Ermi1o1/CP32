import { describe, expect, it, vi } from 'vitest';

vi.mock('../src/ui/Icon', () => ({}));
import { fold } from '../src/data/fold';
import { search } from '../src/data/search';
import { GLOSSARY } from '../src/data/glossary';

describe('search normaliser (D47)', () => {
  it('lower-cases, strips accents and punctuation', () => {
    expect(fold('  Tomás  HERRERA! ')).toBe('tomas herrera');
    expect(fold('Rooms 1–3')).toBe('rooms 1 3');
  });
  it('folds Ge\'ez homophone series so either spelling matches', () => {
    expect(fold('ሐይል')).toBe(fold('ሀይል'));
    expect(fold('ኀይል')).toBe(fold('ሀይል'));
    expect(fold('ሠላም')).toBe(fold('ሰላም'));
    expect(fold('ዐለም')).toBe(fold('አለም'));
    expect(fold('ፀሐይ')).toBe(fold('ጸሀይ'));
  });
  it('turns Ge\'ez numerals into digits', () => {
    expect(fold('፴፪')).toBe('32');
    expect(fold('፲')).toBe('10');
    expect(fold('፻')).toBe('100');
    expect(fold('COP ፴፪')).toBe('cop 32');
  });
});

describe('search over bundled content', () => {
  it('finds sessions by title word, and ranks title matches first', () => {
    const hits = search('water');
    expect(hits[0]?.kind).toBe('session');
    expect(hits[0]?.title).toMatch(/^Water/);
  });
  it('finds people, places, guides and glossary terms', () => {
    expect(search('Hanna')[0]).toMatchObject({ kind: 'person', title: 'Hanna Worku' });
    expect(search('hall b').some((h) => h.kind === 'place' && h.title === 'Hall B')).toBe(true);
    expect(search('visa').some((h) => h.kind === 'guide' && h.href === '/guide/before')).toBe(true);
    expect(search('loss and damage')[0]).toMatchObject({ kind: 'term', title: 'Loss and damage' });
  });
  it('finds a session through its speaker or room', () => {
    expect(search('worku').some((h) => h.kind === 'session')).toBe(true);
    expect(search('courtyard').some((h) => h.kind === 'session')).toBe(true);
  });
  it('requires every word, ignores case and accents', () => {
    expect(search('TOMAS herrera')[0]?.title).toBe('Tomás Herrera');
    expect(search('water zzzz')).toEqual([]);
  });
  it('returns nothing for empty or one-letter queries', () => {
    expect(search('')).toEqual([]);
    expect(search('a')).toEqual([]);
  });
});

describe('glossary', () => {
  it('is alphabetical and has no empty entries', () => {
    const terms = GLOSSARY.map((t) => t.term);
    expect([...terms].sort((a, b) => a.localeCompare(b))).toEqual(terms);
    for (const t of GLOSSARY) expect(t.def.length, t.term).toBeGreaterThan(20);
  });
});
