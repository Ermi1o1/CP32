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

export function useT() {
  const { prefs } = usePrefs();
  return {
    lang: prefs.lang,
    t: (key: StringKey) => translate(prefs.lang, key),
  };
}
