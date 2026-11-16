/**
 * Device-only preferences (D21). Nothing here ever leaves the phone:
 * there is no account, no sync and no analytics in this build.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BrandId } from '@/theme/brand';

export type ThemeMode = 'system' | 'light' | 'dark';
export type Lang = 'en' | 'am';
export const TEXT_SCALES = [1, 1.15, 1.3, 1.5, 2] as const;
export type TextScale = (typeof TEXT_SCALES)[number];

export interface Prefs {
  lang: Lang;
  mode: ThemeMode;
  textScale: TextScale;
  brand: BrandId;
  reduceMotion: boolean;
  /** Set once the first-run independence statement has been read (D66). */
  welcomed: boolean;
  /**
   * Demonstration only (D76): pretend it is mid-conference (the event's demo
   * clock), so Home shows "next" and the Programme shows a "now" line.
   * Off by default: the app opens as a general, pre-event guide.
   */
  livePreview: boolean;
}

export const DEFAULT_PREFS: Prefs = {
  lang: 'en',
  mode: 'system',
  textScale: 1,
  brand: 'cop32',
  reduceMotion: false,
  welcomed: false,
  livePreview: false,
};

const KEY = 'prefs.v1';

/** Accepts anything read from storage and returns a valid Prefs object. */
export function sanitizePrefs(raw: unknown): Prefs {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    lang: r.lang === 'am' ? 'am' : 'en',
    mode: r.mode === 'light' || r.mode === 'dark' ? r.mode : 'system',
    textScale: (TEXT_SCALES as readonly number[]).includes(r.textScale as number)
      ? (r.textScale as TextScale)
      : 1,
    brand: r.brand === 'example' ? 'example' : 'cop32',
    reduceMotion: r.reduceMotion === true,
    welcomed: r.welcomed === true,
    livePreview: r.livePreview === true,
  };
}

export async function loadPrefs(): Promise<Prefs> {
  try {
    const s = await AsyncStorage.getItem(KEY);
    return s ? sanitizePrefs(JSON.parse(s)) : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

/** Forgets every stored preference (Settings → Delete my data). */
export async function clearPrefs(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    // Nothing to do: the in-memory defaults already apply.
  }
}

export async function savePrefs(p: Prefs): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // Storage full or unavailable: the choice still applies for this session.
  }
}
