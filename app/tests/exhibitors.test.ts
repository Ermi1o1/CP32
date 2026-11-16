import { describe, expect, it, vi } from 'vitest';

vi.mock('../src/ui/Icon', () => ({}));
import { EXHIBITORS } from '../src/data/exhibitors';
import { PLACES } from '../src/data/guides';
import { SPEAKERS } from '../src/data/seed';
import { inViewerTime } from '../src/data/localTime';

describe('exhibitors (D66)', () => {
  it('are only the invented organisations of the invented speakers', () => {
    const orgs = new Set(SPEAKERS.map((p) => p.org));
    for (const e of EXHIBITORS) expect(orgs.has(e.name), e.name).toBe(true);
  });
  it('sit on a place that exists on the plan, with unique ids and stands', () => {
    const places = new Set(PLACES.map((p) => p.id));
    for (const e of EXHIBITORS) expect(places.has(e.placeId), e.name).toBe(true);
    expect(new Set(EXHIBITORS.map((e) => e.id)).size).toBe(EXHIBITORS.length);
    expect(new Set(EXHIBITORS.map((e) => e.stand)).size).toBe(EXHIBITORS.length);
  });
  it('are listed A to Z', () => {
    const names = EXHIBITORS.map((e) => e.name);
    expect([...names].sort((a, b) => a.localeCompare(b))).toEqual(names);
  });
});

describe('viewer-local time', () => {
  it('returns null for someone already on Addis Ababa time', () => {
    expect(inViewerTime('10:30', 180)).toBeNull();
  });
  it('converts to zones west and east of Addis', () => {
    expect(inViewerTime('10:30', 0)).toEqual({ time: '07:30', dayShift: 0 });      // UTC
    expect(inViewerTime('10:30', 60)).toEqual({ time: '08:30', dayShift: 0 });     // UTC+1
    expect(inViewerTime('10:30', 330)).toEqual({ time: '13:00', dayShift: 0 });    // UTC+5:30
    expect(inViewerTime('10:30', -300)).toEqual({ time: '02:30', dayShift: 0 });   // UTC-5
  });
  it('flags the previous or next day', () => {
    expect(inViewerTime('01:00', -480)).toEqual({ time: '14:00', dayShift: -1 });  // UTC-8
    expect(inViewerTime('18:30', 540)).toEqual({ time: '00:30', dayShift: 1 });    // UTC+9
  });
});
