import { describe, expect, it } from 'vitest';

import { SESSIONS, SPEAKERS, EVENT } from '../src/data/seed';
import { EXHIBITORS } from '../src/data/exhibitors';
import { BundledRepository, SyncedView } from '../src/data/repository';
import { DEMO_MOMENT, demoModeFrom, nowFor } from '../src/config/demo';
import { getOfficialSync, setOfficialSync } from '../src/state/provenance';

// Real institutions an invented person must never be attached to (Stage F).
const REAL = /African Union|\bAU\b|Ministry|UNFCCC|UNEP|UNDP|World Bank|IPCC|Green Climate Fund|Adaptation Fund|IRENA|\bFAO\b|\bWFP\b|IGAD|African Development Bank|Ethiopian Airlines|Government of|Presidency|United Nations|\bUN\b|YOUNGO|C40|ICLEI|WWF|Oxfam|CGIAR|Addis Ababa University|Green Corridor/;

describe('illustrative content audit (D66, Stage F)', () => {
  it('no speaker org, role or bio names a real institution', () => {
    for (const p of SPEAKERS) expect(`${p.org} ${p.role} ${p.bio}`, p.id).not.toMatch(REAL);
  });
  it('no exhibitor names a real institution', () => {
    for (const e of EXHIBITORS) expect(`${e.name} ${e.about}`, e.id).not.toMatch(REAL);
  });
  it('invents no named outcome of COP32', () => {
    expect(JSON.stringify(SESSIONS)).not.toMatch(/Declaration|Accord|Consensus of Addis/);
  });
  it('every session is marked illustrative in the bundle', () => {
    for (const s of SESSIONS) expect(s.certainty).toBe('illustrative');
  });
  it('the event record holds no demonstration clock', () => {
    expect(Object.keys(EVENT)).not.toContain('demoNow');
  });
});

describe('demonstration clock is build configuration', () => {
  it('reads the flag strictly, default off', () => {
    expect(demoModeFrom(undefined)).toBe(false);
    expect(demoModeFrom('')).toBe(false);
    expect(demoModeFrom('0')).toBe(false);
    expect(demoModeFrom('1')).toBe(true);
    expect(demoModeFrom(' TRUE ')).toBe(true);
  });
  it('pins day 2, 10:45 only when the flag or the D76 switch is on', () => {
    expect(nowFor(false, false)).toBeNull();
    expect(nowFor(true, false)).toEqual({ day: 2, time: '10:45' });
    expect(nowFor(false, true)).toBe(DEMO_MOMENT);
  });
  it('a hybrid session is live at the demo moment', () => {
    const live = SESSIONS.filter((s) => s.day === DEMO_MOMENT.day && s.start <= DEMO_MOMENT.time && s.end > DEMO_MOMENT.time);
    expect(live).toHaveLength(1);
    expect(live[0]!.delivery).toBe('hybrid');
  });
});

describe('content pipeline demonstration', () => {
  it('the synced view presents illustrative records as official, without changing the bundle', async () => {
    const base = new BundledRepository();
    const synced = new SyncedView(base);
    expect((await synced.listSessions()).every((s) => s.certainty === 'official')).toBe(true);
    expect((await synced.getSession('s01'))?.certainty).toBe('official');
    expect((await base.getSession('s01'))?.certainty).toBe('illustrative');
  });
  it('the sync switch starts off and records when it was turned on', () => {
    expect(getOfficialSync()).toEqual({ on: false, syncedAt: null });
    setOfficialSync(true, new Date(2026, 0, 1, 9, 5));
    expect(getOfficialSync()).toEqual({ on: true, syncedAt: '09:05' });
    setOfficialSync(false);
    expect(getOfficialSync().on).toBe(false);
  });
});
