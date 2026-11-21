/**
 * Getting-around content model. Shaped for a live provider (BusTrack) now, so
 * that connecting one is a new TransportRepository implementation, not a
 * screen rewrite. Every record carries a certainty (D66).
 */
import type { Bilingual, Certainty } from '../types';

export type TransitMode = 'light-rail' | 'city-bus' | 'minibus' | 'taxi' | 'ride-hail' | 'shuttle';

export interface SourceRef {
  label: string;
  url?: string;
  /** ISO date the source was read. */
  accessed: string;
}

/** A line the operator runs. Geometry is deliberately absent until a provider supplies it. */
export interface TransitLine {
  id: string;
  mode: TransitMode;
  name: Bilingual;
  /** End points, as the operator names them. */
  termini: [string, string];
  certainty: Certainty;
  source?: SourceRef;
}

export interface TransitStop {
  id: string;
  name: string;
  lineIds: string[];
  /** WGS84, only when supplied by the operator or provider. */
  location?: { lat: number; lng: number };
  certainty: Certainty;
}

export type GuideKind = 'corridor' | 'airport' | 'fares' | 'taxi' | 'venue';

/** One block of plain-language advice on the Getting around screen. */
export interface TransportNote {
  id: string;
  kind: GuideKind;
  title: Bilingual;
  body: Bilingual[];
  certainty: Certainty;
  source?: SourceRef;
}

/** A predicted arrival from a live provider. */
export interface Arrival {
  lineId: string;
  stopId: string;
  /** Minutes from `at`. */
  etaMin: number;
  /** ISO timestamp of the prediction. */
  at: string;
}

/** Whether live tracking is connected, and by whom. */
export interface LiveProvider {
  name: string;
  state: 'placeholder' | 'connected' | 'unavailable';
}

/** The only door between the transport screen and its data. */
export interface TransportRepository {
  listNotes(): Promise<TransportNote[]>;
  listLines(): Promise<TransitLine[]>;
  listStops(lineId?: string): Promise<TransitStop[]>;
  /** Live arrivals at a stop, or null when no live provider is connected. */
  getArrivals(stopId: string): Promise<Arrival[] | null>;
  liveProvider(): LiveProvider;
}
