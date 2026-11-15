import { usePrefs } from '@/theme/ThemeProvider';
import type { EventRecord } from './types';

/**
 * The "current moment" of the conference, or null.
 *
 * By default the app is a general, pre-event guide and there is no "now"
 * (D76). Only when the demonstration switch "Conference-day preview" is on
 * does it return the event's illustrative clock, which turns on "next",
 * "live", "ended" and the now-line.
 */
export function useNow(event: EventRecord | undefined): { day: number; time: string } | null {
  const { prefs } = usePrefs();
  return prefs.livePreview && event ? event.demoNow : null;
}
