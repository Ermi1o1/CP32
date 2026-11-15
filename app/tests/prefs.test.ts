import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-native-async-storage/async-storage', () => ({ default: { getItem: async () => null, setItem: async () => {} } }));
import { DEFAULT_PREFS, sanitizePrefs } from '../src/state/prefs';

describe('stored preferences are sanitised', () => {
  it('garbage becomes defaults', () => {
    expect(sanitizePrefs(null)).toEqual(DEFAULT_PREFS);
    expect(sanitizePrefs({ lang: 'xx', mode: 7, textScale: 9, brand: 'evil', welcomed: 'yes' })).toEqual(DEFAULT_PREFS);
  });
  it('valid values survive', () => {
    expect(sanitizePrefs({ lang: 'am', mode: 'dark', textScale: 2, brand: 'example', reduceMotion: true, welcomed: true, livePreview: true }))
      .toEqual({ lang: 'am', mode: 'dark', textScale: 2, brand: 'example', reduceMotion: true, welcomed: true, livePreview: true });
  });
  it('the first-run statement is shown until acknowledged', () => {
    expect(DEFAULT_PREFS.welcomed).toBe(false);
  });
});
