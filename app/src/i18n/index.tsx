import { en, type StringKey } from './en';
import { am } from './am';
import { usePrefs } from '@/theme/ThemeProvider';
import type { Lang } from '@/state/prefs';

export const STRINGS: Record<Lang, Record<StringKey, string>> = { en, am };
export type { StringKey };

export function translate(lang: Lang, key: StringKey): string {
  // A missing Amharic string falls back to English visibly rather than showing nothing (IA rule 5).
  return STRINGS[lang][key] || en[key];
}

export function fill(s: string, vars?: Record<string, string | number>): string {
  return vars ? s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : s;
}

export function useT() {
  const { prefs } = usePrefs();
  return {
    lang: prefs.lang,
    /** `vars` fills {name} placeholders, e.g. t('home.dayOf', { d: 2, n: 5 }). */
    t: (key: StringKey, vars?: Record<string, string | number>) => fill(translate(prefs.lang, key), vars),
  };
}
