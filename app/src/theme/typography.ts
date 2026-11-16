import { tokens } from './tokens.generated';
import type { Lang } from '@/state/prefs';

export type TypeStyle = keyof typeof tokens.type;

/** Ethiopic, Ethiopic Supplement, Ethiopic Extended and Extended-A blocks. */
const ETHIOPIC = /[\u1200-\u139F\u2D80-\u2DDF\uAB00-\uAB2F]/;
export const hasEthiopic = (s: string): boolean => ETHIOPIC.test(s);

/** Styles set in the display face (Bricolage Grotesque). Everything else is Instrument Sans (D75). */
export const DISPLAY_STYLES: readonly TypeStyle[] = ['display', 'displaySmall', 'clock', 'largeTitle', 'title1', 'title2', 'title3'];

/**
 * Bundled font file for a weight, script and role (D11, D49, D75).
 *
 * React Native does not fall back between custom fonts glyph by glyph, so a
 * Latin font given Ge'ez text would hand the job to the phone's system font,
 * which on some Android phones has no Ge'ez glyphs at all. Any text that
 * contains Ethiopic characters is therefore set entirely in Noto Sans
 * Ethiopic, which also carries basic Latin letters and digits.
 */
export function fontFor(weight: number, ethiopic: boolean, display = false): string {
  if (ethiopic) {
    return weight >= 700 ? 'NotoEthiopic-700' : weight >= 600 ? 'NotoEthiopic-600' : 'NotoEthiopic-400';
  }
  if (display) return weight >= 800 ? 'Bricolage-800' : weight >= 700 ? 'Bricolage-700' : 'Bricolage-600';
  return weight >= 700 ? 'Instrument-700' : weight >= 600 ? 'Instrument-600' : weight >= 500 ? 'Instrument-500' : 'Instrument-400';
}

export function textStyle(variant: TypeStyle, opts: { ethiopic: boolean; lang: Lang; scale: number; weight?: number; display?: boolean }) {
  const t = tokens.type[variant];
  const weight = opts.weight ?? t.weight;
  const tall = opts.ethiopic || opts.lang === 'am';
  const size = Math.round(t.size * opts.scale);
  const display = opts.display ?? DISPLAY_STYLES.includes(variant);
  return {
    fontFamily: fontFor(weight, opts.ethiopic, display),
    fontSize: size,
    lineHeight: Math.round(size * (tall ? t.lhAm : t.lhEn)),
    // Tracking is for Latin only; Ge'ez is always 0.
    letterSpacing: opts.ethiopic ? 0 : variant === 'label' ? 0.9 : t.size >= 30 ? -0.9 : t.size >= 22 ? -0.4 : t.size >= 19 ? -0.2 : 0,
  } as const;
}
