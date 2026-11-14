import { describe, expect, it } from 'vitest';
import { BRANDS, BRAND_CONTRAST_PAIRS, paletteFor, type BrandId } from '../src/theme/brand';
import { contrast } from '../src/theme/contrast';

describe('brand palettes keep WCAG 2.2 AA contrast', () => {
  for (const id of Object.keys(BRANDS) as BrandId[]) {
    for (const mode of ['light', 'dark'] as const) {
      const p = paletteFor(id, mode);
      for (const [fg, bg, min] of BRAND_CONTRAST_PAIRS) {
        it(`${id} ${mode}: ${fg} on ${bg} ≥ ${min}`, () => {
          expect(contrast(p[fg], p[bg])).toBeGreaterThanOrEqual(min);
        });
      }
    }
  }
});

describe('brand rules (D65, D65a)', () => {
  it('no brand claims to be official', () => {
    for (const b of Object.values(BRANDS)) expect(b.official).toBe(false);
  });
  it('contrast helper matches known values', () => {
    expect(contrast('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrast('#155E63', '#FFFFFF')).toBeCloseTo(7.46, 1);
  });
});
