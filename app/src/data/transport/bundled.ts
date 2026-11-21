import type { TransitLine, TransitStop, TransportNote, TransportRepository, LiveProvider, Arrival, SourceRef } from './types';

const WIKI_LRT: SourceRef = { label: 'Addis Ababa Light Rail — Wikipedia', url: 'https://en.wikipedia.org/wiki/Addis_Ababa_Light_Rail', accessed: '2026-11-21' };
const WIKIVOYAGE_ADD: SourceRef = { label: 'Bole International Airport — Wikivoyage', url: 'https://en.wikivoyage.org/wiki/Bole_International_Airport', accessed: '2026-11-21' };

/**
 * Real, public, slow-changing information about getting around Addis Ababa.
 * Nothing here is drawn on a map and no station list is shipped: neither has
 * been sourced to a standard this app is willing to put in front of a visitor.
 */
export const LINES: TransitLine[] = [
  { id: 'lrt-ew', mode: 'light-rail', name: { en: 'Light rail — East–West (Green) line' }, termini: ['Ayat', 'Tor Hailoch'], certainty: 'reported', source: WIKI_LRT },
  { id: 'lrt-ns', mode: 'light-rail', name: { en: 'Light rail — North–South (Blue) line' }, termini: ['Menelik II Square', 'Kaliti'], certainty: 'reported', source: WIKI_LRT },
];

export const NOTES: TransportNote[] = [
  {
    id: 'lrt', kind: 'corridor', certainty: 'reported', source: WIKI_LRT,
    title: { en: 'Light rail' },
    body: [
      { en: 'Addis Ababa has two light rail lines, about 32 km and 39 stations in all, opened in 2015. The East–West line runs between Ayat and Tor Hailoch; the North–South line between Menelik II Square (Piazza) and Kaliti. They share a short central section with five common stations.' },
      { en: 'Trains are often crowded at peak hours. Buy a ticket at the station before boarding and keep it until you leave.' },
    ],
  },
  {
    id: 'airport', kind: 'airport', certainty: 'reported', source: WIKIVOYAGE_ADD,
    title: { en: 'From Bole International Airport' },
    body: [
      { en: 'The airport is about 6 km south-east of the city centre — usually 15 to 30 minutes by car, longer at rush hour.' },
      { en: 'Taxis wait outside arrivals. Agree the fare before you set off; fixed fares of 150–300 birr to most central areas were reported in 2024. Many hotels run their own airport pick-up if you ask in advance.' },
    ],
  },
  {
    id: 'taxi', kind: 'taxi', certainty: 'reported',
    title: { en: 'Taxis, ride-hailing and minibuses' },
    body: [
      { en: 'Metered or negotiated taxis and locally run ride-hailing apps operate across the city. Ride-hailing shows the price before you book, which avoids haggling.' },
      { en: 'Blue-and-white minibus taxis run fixed routes for a few birr and are how most residents travel; routes are called out by the conductor rather than signed.' },
    ],
  },
  {
    id: 'fares', kind: 'fares', certainty: 'unknown', source: WIKI_LRT,
    title: { en: 'Fares' },
    body: [
      { en: 'Light rail fares were set by distance at 2–6 birr when the system opened. Current fares have not been verified for this guide; check the price at the station.' },
    ],
  },
  {
    id: 'venue', kind: 'venue', certainty: 'unknown',
    title: { en: 'To the conference venue' },
    body: [
      { en: 'The venue, shuttle routes and drop-off points for COP32 have not been announced. They will appear here once the host publishes them.' },
    ],
  },
];

export class BundledTransportRepository implements TransportRepository {
  constructor(
    private readonly notes: readonly TransportNote[] = NOTES,
    private readonly lines: readonly TransitLine[] = LINES,
    private readonly stops: readonly TransitStop[] = [],
  ) {}
  async listNotes() { return [...this.notes]; }
  async listLines() { return [...this.lines]; }
  async listStops(lineId?: string) { return this.stops.filter((s) => !lineId || s.lineIds.includes(lineId)); }
  async getArrivals(_stopId: string): Promise<Arrival[] | null> { return null; }
  liveProvider(): LiveProvider { return { name: 'BusTrack', state: 'placeholder' }; }
}
