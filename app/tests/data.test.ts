import { describe, expect, it } from 'vitest';
import { BundledRepository } from '../src/data/repository';
import { EVENT } from '../src/data/seed';
import type { Session } from '../src/data/types';

const mk = (id: string, day: number, start: string, access: Session['access'] = 'public'): Session => ({
  id, eventId: 'cop32', day, start, end: '23:59', title: { en: id }, body: { en: '' }, room: 'A', theme: 't', format: 'Panel', access, speakerIds: [], certainty: 'illustrative',
});

describe('bundled repository', () => {
  const repo = new BundledRepository(EVENT, [mk('b', 2, '09:00'), mk('a', 1, '14:00', 'accredited'), mk('c', 1, '09:00')]);
  it('sorts by day then time', async () => {
    expect((await repo.listSessions()).map((s) => s.id)).toEqual(['c', 'a', 'b']);
  });
  it('filters by day and access', async () => {
    expect((await repo.listSessions({ day: 1 })).map((s) => s.id)).toEqual(['c', 'a']);
    expect((await repo.listSessions({ access: 'public' })).map((s) => s.id)).toEqual(['c', 'b']);
  });
  it('finds one session, and returns undefined for an unknown id', async () => {
    expect((await repo.getSession('a'))?.day).toBe(1);
    expect(await repo.getSession('zzz')).toBeUndefined();
  });
});

describe('event record honesty (D66)', () => {
  it('carries no day-level date and marks the month as reported', () => {
    expect(JSON.stringify(EVENT)).not.toMatch(/\d{4}-\d{2}-\d{2}/);
    expect(EVENT.when.certainty).toBe('reported');
  });
});
