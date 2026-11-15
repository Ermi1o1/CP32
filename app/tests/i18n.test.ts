import { describe, expect, it } from 'vitest';
import { en } from '../src/i18n/en';
import { am } from '../src/i18n/am';
import { hasEthiopic, fontFor, textStyle } from '../src/theme/typography';

describe('language files', () => {
  it('Amharic has exactly the English keys', () => {
    expect(Object.keys(am).sort()).toEqual(Object.keys(en).sort());
  });
  it('no string is empty', () => {
    for (const [k, v] of Object.entries({ ...en })) expect(v.trim(), k).not.toBe('');
    for (const [k, v] of Object.entries(am)) expect(v.trim(), k).not.toBe('');
  });
  it('every Amharic string contains Ethiopic script', () => {
    for (const [k, v] of Object.entries(am)) expect(hasEthiopic(v), k).toBe(true);
  });
  it('both languages carry the independence statement (D66, D65a)', () => {
    expect(en['brand.descriptor']).toMatch(/not an official/i);
    expect(am['brand.descriptor']).toContain('ይፋዊ');
    expect(am['brand.descriptor']).toContain('አይደለም');
  });
  it('no invented calendar dates in UI strings (D66)', () => {
    const dated = /\b\d{1,2}\s*[–-]\s*\d{1,2}\b/;
    for (const [k, v] of Object.entries(en)) if (dated.test(v)) expect(k).toBe('sources.r2s');
  });
});

describe('script-aware typography (D11, D49)', () => {
  it('detects Ethiopic text', () => {
    expect(hasEthiopic('ሰላም')).toBe(true);
    expect(hasEthiopic('COP32 መመሪያ')).toBe(true);
    expect(hasEthiopic('Hello 123')).toBe(false);
  });
  it('never gives Ge\'ez text a Latin-only font', () => {
    for (const w of [400, 600, 700, 800]) expect(fontFor(w, true)).toMatch(/^NotoEthiopic-/);
    expect(fontFor(800, false, true)).toBe('Bricolage-800');
    expect(fontFor(800, false)).toBe('Instrument-700');
    expect(fontFor(400, false)).toBe('Instrument-400');
  });
  it('Amharic lines are taller, and never tracked', () => {
    const e = textStyle('body', { ethiopic: false, lang: 'en', scale: 1 });
    const a = textStyle('body', { ethiopic: true, lang: 'am', scale: 1 });
    expect(a.lineHeight).toBeGreaterThan(e.lineHeight);
    expect(a.letterSpacing).toBe(0);
  });
  it('text scale reaches 200%', () => {
    expect(textStyle('body', { ethiopic: false, lang: 'en', scale: 2 }).fontSize).toBe(34);
    expect(textStyle('display', { ethiopic: false, lang: 'en', scale: 1 }).fontFamily).toBe('Bricolage-700');
    expect(textStyle('body', { ethiopic: false, lang: 'en', scale: 1 }).fontFamily).toBe('Instrument-400');
  });
});
