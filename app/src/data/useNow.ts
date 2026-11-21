import { usePrefs } from '@/theme/ThemeProvider';
import { DEMO_MODE, nowFor, type DemoMoment } from '@/config/demo';

/**
 * The "current moment" of the conference, or null.
 *
 * By default the app is a general, pre-event guide and there is no "now"
 * (D76). A demonstration build (EXPO_PUBLIC_DEMO_MODE=1) pins it to day 2,
 * 10:45; otherwise the "Conference-day preview" switch turns the same moment
 * on, which enables "next", "live", "ended" and the now-line.
 */
export function useNow(): DemoMoment | null {
  const { prefs } = usePrefs();
  return nowFor(DEMO_MODE, prefs.livePreview);
}
