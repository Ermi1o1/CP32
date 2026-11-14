import { tokens } from './tokens.generated';
import type { Lang } from '@/state/prefs';

export type TypeStyle = keyof typeof tokens.type;

/** Ethiopic, Ethiopic Supplement, Ethiopic Extended and Extended-A blocks. */
const ETHIOPIC = /[ሀ-᎟ⶀ-⷟꬀-꬯]/;
export const hasEthiopic = (s: string): boolean => ETHIOPIC.test(s);

/**
 * Bundled font file for a weight and script (D11, D49).
 *
 * React Native does not fall back between custom fonts glyph by glyph, so a
 * Latin font given Ge'ez text would hand the job to the phone's system font,
 * which on some Android phones has no Ge'ez glyphs at all. Any text that
 * contains Ethiopic characters is therefore set entirely in Noto Sans
 * Ethiopic, which also carries basic Latin letters and digits.
 */
export function fontFor(weight: number, ethiopic: boolean): string {
  if (ethiopic) {
    return weight >= 700 ? 'NotoEthiopic-700' : weight >= 600 ? 'NotoEthiopic-600' : 'NotoEthiopic-400';
  }
  return weight >= 800 ? 'Atkinson-800' : weight >= 700 ? 'Atkinson-700' : weight >= 600 ? 'Atkinson-600' : 'Atkinson-400';
}

export function textStyle(variant: TypeStyle, opts: { ethiopic: boolean; lang: Lang; scale: number; weight?: number }) {
  const t = tokens.type[variant];
  const weight = opts.weight ?? t.weight;
  const tall = opts.ethiopic || opts.lang === 'am';
  const size = Math.round(t.size * opts.scale);
  return {
    fontFamily: fontFor(weight, opts.ethiopic),
    fontSize: size,
    lineHeight: Math.round(size * (tall ? t.lhAm : t.lhEn)),
    // Tracking is for Latin display sizes only; Ge'ez is always 0 (design system §3).
    letterSpacing: opts.ethiopic ? 0 : t.size >= 28 ? -0.6 : t.size >= 20 ? -0.3 : 0,
  } as const;
}
