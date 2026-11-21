/**
 * Demonstration clock. Build configuration, not content.
 *
 * The conference is in the future, so a live day can only be shown by
 * pretending. EXPO_PUBLIC_DEMO_MODE=1 pins "now" to day 2, 10:45 for the
 * whole build (Home opens on a live session). Default off: the app opens as a
 * general, pre-event guide (D76), and the same moment is available only
 * through the "Conference-day preview" switch in Settings.
 */
export interface DemoMoment { day: number; time: string }

export const DEMO_MOMENT: DemoMoment = { day: 2, time: '10:45' };

export function demoModeFrom(raw: string | undefined): boolean {
  const v = raw?.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'on';
}

/** The build flag pins the clock; otherwise the D76 switch decides. */
export function nowFor(demoMode: boolean, livePreview: boolean): DemoMoment | null {
  return demoMode || livePreview ? DEMO_MOMENT : null;
}

export const DEMO_MODE: boolean = demoModeFrom(process.env.EXPO_PUBLIC_DEMO_MODE);
