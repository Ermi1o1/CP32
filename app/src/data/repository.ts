import type { Access, ContentRepository, EventRecord, Session, Speaker } from './types';
import { EVENT, SESSIONS, SPEAKERS } from './seed';

/** Reads the content bundled in the app. Makes no network request, ever. */
export class BundledRepository implements ContentRepository {
  constructor(
    private readonly event: EventRecord = EVENT,
    private readonly sessions: readonly Session[] = SESSIONS,
    private readonly speakers: readonly Speaker[] = SPEAKERS,
  ) {}

  async getEvent(): Promise<EventRecord> {
    return this.event;
  }

  async listSessions(filter: { day?: number; access?: Access } = {}): Promise<Session[]> {
    return this.sessions
      .filter((s) => (filter.day === undefined || s.day === filter.day) && (filter.access === undefined || s.access === filter.access))
      .sort((a, b) => a.day - b.day || a.start.localeCompare(b.start) || a.id.localeCompare(b.id));
  }

  async getSession(id: string): Promise<Session | undefined> {
    return this.sessions.find((s) => s.id === id);
  }

  async getSpeakers(ids: readonly string[]): Promise<Speaker[]> {
    return ids.map((id) => this.speakers.find((p) => p.id === id)).filter((p): p is Speaker => p !== undefined);
  }

  async listSpeakers(): Promise<Speaker[]> {
    return [...this.speakers].sort((a, b) => a.name.localeCompare(b.name));
  }
}

export const repository: ContentRepository = new BundledRepository();

/**
 * The same content as it would look after a sync from the official source:
 * every illustrative record is presented as official. Demonstration of the
 * CMS pipeline (D66 certainty as provenance); screens do not change.
 */
export class SyncedView implements ContentRepository {
  constructor(private readonly base: ContentRepository) {}
  private mark = (s: Session): Session => (s.certainty === 'illustrative' ? { ...s, certainty: 'official' } : s);
  getEvent() { return this.base.getEvent(); }
  async listSessions(filter?: { day?: number; access?: Access }) { return (await this.base.listSessions(filter)).map(this.mark); }
  async getSession(id: string) { const s = await this.base.getSession(id); return s && this.mark(s); }
  getSpeakers(ids: readonly string[]) { return this.base.getSpeakers(ids); }
  listSpeakers() { return this.base.listSpeakers(); }
}

export const syncedRepository: ContentRepository = new SyncedView(repository);
