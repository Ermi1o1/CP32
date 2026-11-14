import type { Access, ContentRepository, EventRecord, Session } from './types';
import { EVENT, SESSIONS } from './seed';

/** Reads the content bundled in the app. Makes no network request, ever. */
export class BundledRepository implements ContentRepository {
  constructor(private readonly event: EventRecord = EVENT, private readonly sessions: readonly Session[] = SESSIONS) {}

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
}

export const repository: ContentRepository = new BundledRepository();
