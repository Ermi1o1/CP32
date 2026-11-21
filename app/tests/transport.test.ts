import { describe, expect, it } from 'vitest';
import { BundledTransportRepository, NOTES, LINES } from '../src/data/transport/bundled';

describe('transport data (Stage E)', () => {
  const repo = new BundledTransportRepository();
  it('every record carries a certainty, and nothing claims to be official', () => {
    for (const r of [...NOTES, ...LINES]) {
      expect(['reported', 'illustrative', 'unknown']).toContain(r.certainty);
    }
  });
  it('anything marked reported cites a source, or is general advice', async () => {
    for (const n of await repo.listNotes()) {
      if (n.certainty === 'reported' && n.kind !== 'taxi') expect(n.source?.url).toMatch(/^https:\/\//);
    }
  });
  it('the venue route is explicitly unknown until the host publishes it', async () => {
    expect((await repo.listNotes()).find((n) => n.kind === 'venue')?.certainty).toBe('unknown');
  });
  it('ships no invented geometry or stops, and no live data without a provider', async () => {
    expect(await repo.listStops()).toEqual([]);
    expect(await repo.getArrivals('any')).toBeNull();
    expect(repo.liveProvider()).toEqual({ name: 'BusTrack', state: 'placeholder' });
  });
});
