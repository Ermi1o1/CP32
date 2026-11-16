import { minutes } from './time';

/** Addis Ababa is UTC+3 all year: Ethiopia has no daylight-saving time. */
export const EVENT_UTC_OFFSET_MIN = 180;

/**
 * A clock time in Addis Ababa shown in the viewer's own time zone.
 *
 * Sessions carry no calendar date in this build (D66), so the viewer's
 * CURRENT offset from UTC is used. That is exact for anyone whose zone has no
 * clock change, and can be an hour out for someone whose clocks change
 * between today and the conference — which is why the label says "today".
 * Returns null when the viewer is already on Addis time.
 */
export function inViewerTime(hhmm: string, viewerOffsetMin: number): { time: string; dayShift: -1 | 0 | 1 } | null {
  if (viewerOffsetMin === EVENT_UTC_OFFSET_MIN) return null;
  let m = minutes(hhmm) - EVENT_UTC_OFFSET_MIN + viewerOffsetMin;
  let dayShift: -1 | 0 | 1 = 0;
  if (m < 0) { m += 1440; dayShift = -1; }
  else if (m >= 1440) { m -= 1440; dayShift = 1; }
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return { time: `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`, dayShift };
}

/** The device's current offset from UTC in minutes east (JavaScript reports it west-positive). */
export function deviceOffsetMin(): number {
  return -new Date().getTimezoneOffset();
}
