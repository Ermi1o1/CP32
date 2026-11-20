export interface Bilingual { en: string; am?: string }
export type Certainty = 'official' | 'reported' | 'illustrative' | 'unknown';
export type EditionState = 'pre' | 'during' | 'post';

export interface EventRecord {
  id: string;
  name: Bilingual;
  city: Bilingual;
  state: EditionState;
  when: { label: Bilingual; certainty: Certainty };
  dayCount: number;
  timeZone: 'Africa/Addis_Ababa';
  demoNow: { day: number; time: string };
}

export type Access = 'public' | 'accredited' | 'registration' | 'unknown';
export type Theme = 'water' | 'energy' | 'land' | 'cities' | 'food' | 'finance' | 'youth' | 'culture' | 'plenary';

export interface Speaker {
  id: string;
  name: string;
  org: string;
  role: string;
  bio: string; // NEW: Deep profile text
}

export interface Session {
  id: string;
  eventId: string;
  day: number;
  start: string;
  end: string;
  title: Bilingual;
  body: Bilingual;
  room: string;
  theme: Theme;
  format: string;
  access: Access;
  speakerIds: string[];
  certainty: Certainty;
}

export interface ContentRepository {
  getEvent(): Promise<EventRecord>;
  listSessions(filter?: { day?: number; access?: Access }): Promise<Session[]>;
  getSession(id: string): Promise<Session | undefined>;
  getSpeakers(ids: readonly string[]): Promise<Speaker[]>;
  listSpeakers(): Promise<Speaker[]>;
}