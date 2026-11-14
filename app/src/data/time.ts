import type { Session } from './types';

/** Minutes since midnight for "HH:MM". */
export function minutes(hhmm: string): number {
  const [h, m] = hhmm.split(':');
  return Number(h) * 60 + Number(m);
}

export type Phase = 'ended' | 'live' | 'upcoming';

/** Where a session stands relative to a moment in the programme. */
export function phaseOf(s: Pick<Session, 'day' | 'start' | 'end'>, now: { day: number; time: string }): Phase {
  if (s.day < now.day) return 'ended';
  if (s.day > now.day) return 'upcoming';
  const t = minutes(now.time);
  if (t >= minutes(s.end)) return 'ended';
  if (t >= minutes(s.start)) return 'live';
  return 'upcoming';
}

/** The next session that has not started yet on the current day, or undefined. */
export function nextUp<T extends Pick<Session, 'day' | 'start' | 'end'>>(sessions: readonly T[], now: { day: number; time: string }): T | undefined {
  return sessions
    .filter((s) => s.day === now.day && minutes(s.start) > minutes(now.time))
    .sort((a, b) => minutes(a.start) - minutes(b.start))[0];
}

/** "in 18 min", "in 2 h 5 min". Negative or zero returns 0 minutes. */
export function minutesUntil(start: string, nowTime: string): number {
  return Math.max(0, minutes(start) - minutes(nowTime));
}

/** Position of a moment along the conference day (08:00–20:00) as 0..1, for the day line on Home. */
export function dayProgress(nowTime: string, from = '08:00', to = '20:00'): number {
  const p = (minutes(nowTime) - minutes(from)) / (minutes(to) - minutes(from));
  return Math.min(1, Math.max(0, p));
}

export function durationMin(s: Pick<Session, 'start' | 'end'>): number {
  return minutes(s.end) - minutes(s.start);
}
