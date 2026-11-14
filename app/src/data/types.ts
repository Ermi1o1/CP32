/**
 * Content model, following docs/ux/information-architecture.md §4.
 * Event is the root entity; every record carries its event id (D5).
 * Bilingual fields hold both languages; `am` may be missing and then falls
 * back to English visibly.
 */
export interface Bilingual { en: string; am?: string }

/** How sure the app is about a fact (D66). Drives the Sources screen and "TBC" labels. */
export type Certainty = 'official' | 'reported' | 'illustrative' | 'unknown';

export type EditionState = 'pre' | 'during' | 'post';

export interface EventRecord {
  id: string;
  name: Bilingual;
  city: Bilingual;
  state: EditionState;
  /** Month and year only. No day-level dates exist until the host confirms them. */
  when: { label: Bilingual; certainty: Certainty };
  /** Programme days are numbered, never dated, in this build (D66). */
  dayCount: number;
  timeZone: 'Africa/Addis_Ababa';
}

export type Access = 'public' | 'accredited' | 'registration' | 'unknown';

export interface Session {
  id: string;
  eventId: string;
  /** 1-based programme day. */
  day: number;
  /** Local event time, 24h "HH:MM". */
  start: string;
  end: string;
  title: Bilingual;
  body: Bilingual;
  room: string;
  theme: string;
  format: string;
  access: Access;
  speakerIds: string[];
  certainty: Certainty;
}

/**
 * The only door between screens and content. Today one implementation reads
 * content bundled inside the app; a CMS-backed one can replace it later
 * without a single screen changing.
 */
export interface ContentRepository {
  getEvent(): Promise<EventRecord>;
  listSessions(filter?: { day?: number; access?: Access }): Promise<Session[]>;
  getSession(id: string): Promise<Session | undefined>;
}
