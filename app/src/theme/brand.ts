/**
 * Brand layer (D65, D65a).
 *
 * Everything that makes the app "this brand" lives in one object: name,
 * descriptor, mark, and palette overrides on top of the generated design
 * tokens. Swapping the brand is a configuration change, never a code change.
 *
 * Rules that hold for every brand shipped in this repository:
 *  - no UNFCCC, official COP32 or Ethiopian-government logo, emblem or wordmark;
 *  - no wording that implies endorsement;
 *  - every palette override must pass the contrast test in brand.test.ts.
 */
import { tokens } from './tokens.generated';
import { COP32_MARK_SVG, EXAMPLE_MARK_SVG } from './marks';

export type ColorRole = keyof typeof tokens.color.light;
export type Palette = Record<ColorRole, string>;

export interface Brand {
  id: string;
  /** Shown in the header lockup and About. */
  name: string;
  /** One line under the name on Home and in About. Carries the independence statement. */
  descriptorKey: 'brand.descriptor' | 'brand.descriptorExample';
  markSvg: string;
  light: Partial<Palette>;
  dark: Partial<Palette>;
  /** True only for brands the host has approved in writing. None exist. */
  official: false;
}

export const BRANDS = {
  cop32: {
    id: 'cop32',
    name: 'COP32',
    descriptorKey: 'brand.descriptor',
    markSvg: COP32_MARK_SVG,
    light: {},
    dark: {},
    official: false,
  },
  /**
   * An invented second brand that exists only to prove the swap works.
   * It imitates no real organisation. Colours: deep indigo tint, warm amber action.
   */
  example: {
    id: 'example',
    name: 'Your Event',
    descriptorKey: 'brand.descriptorExample',
    markSvg: EXAMPLE_MARK_SVG,
    light: {
      primary: '#2F3A8F', onPrimary: '#FFFFFF', primarySoft: '#E3E6F8', onPrimarySoft: '#1E2663',
      accent: '#F2B441', onAccent: '#2A1B00', link: '#2F3A8F', focus: '#2F3A8F',
      heroFrom: '#2B3585', heroTo: '#1B2260', heroKicker: '#F6C766', line: '#2F3A8F', ink: '#1B2260', onInk: '#FFFFFF',
    },
    dark: {
      primary: '#A9B4FF', onPrimary: '#0B1140', primarySoft: '#1C2250', onPrimarySoft: '#D5DAFF',
      accent: '#F2B441', onAccent: '#2A1B00', link: '#B9C2FF', focus: '#B9C2FF',
      heroFrom: '#2B3585', heroTo: '#151A4D', heroKicker: '#F6C766', line: '#F2B441', ink: '#D5DAFF', onInk: '#0B1140',
    },
    official: false,
  },
} as const satisfies Record<string, Brand>;

export type BrandId = keyof typeof BRANDS;
export const DEFAULT_BRAND: BrandId = 'cop32';

export function paletteFor(brand: BrandId, mode: 'light' | 'dark'): Palette {
  return { ...tokens.color[mode], ...BRANDS[brand][mode] } as Palette;
}

/** Foreground/background pairs every brand must keep at WCAG 2.2 AA. [fg, bg, minimum ratio] */
export const BRAND_CONTRAST_PAIRS: readonly (readonly [ColorRole, ColorRole, number])[] = [
  ['onPrimary', 'primary', 4.5],
  ['onPrimarySoft', 'primarySoft', 4.5],
  ['onAccent', 'accent', 4.5],
  ['primary', 'bg', 4.5],
  ['primary', 'surface', 4.5],
  ['link', 'bg', 4.5],
  ['link', 'surface', 4.5],
  ['primary', 'primarySoft', 3],
  ['focus', 'bg', 3],
  ['focus', 'surface', 3],
  ['onHero', 'heroFrom', 4.5],
  ['onHero', 'heroTo', 4.5],
  ['heroKicker', 'heroFrom', 4.5],
  ['heroKicker', 'heroTo', 4.5],
  ['onInk', 'ink', 4.5],
  ['line', 'bg', 3],
  ['line', 'surface', 3],
];
