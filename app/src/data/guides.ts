import type { IconName } from '@/ui/Icon';

/**
 * Visit guides and editorial updates for the demonstration build.
 *
 * These are GENERAL, illustrative texts (D66). They state no official fact
 * about COP32 — no dates, fees, phone numbers, entry rules or addresses — and
 * each guide says what will be filled in from official sources. English only
 * for now (D74).
 */
export interface Guide {
  id: string;
  icon: IconName;
  title: string;
  summary: string;
  body: string[];
  covers: string[];
  emergency?: boolean;
}

export const GUIDES: Guide[] = [
  {
    id: 'emergency', icon: 'siren', emergency: true,
    title: 'Emergency and help',
    summary: 'Where to turn if something goes wrong',
    body: [
      'If you are in immediate danger, speak to the nearest security or medical staff, or ask any venue volunteer to call for help.',
      'Emergency phone numbers, medical points and the lost-and-found desk will be listed here once they are confirmed with the host. This page is saved on your phone and will work without signal.',
    ],
    covers: ['Emergency phone numbers, confirmed with the host', 'Medical points and first aid, on the map', 'Lost and found', 'Embassy and consular contacts'],
  },
  {
    id: 'attend', icon: 'ticket',
    title: 'Can I attend?',
    summary: 'Who can enter which areas, in plain language',
    body: [
      'Climate conferences usually have two kinds of space: an area for accredited delegates, media and observers, and public areas that are open more widely.',
      'How this will work at COP32, and what you need to bring, has not been announced. This guide will explain it in plain language as soon as it is.',
    ],
    covers: ['Which areas are open to the public', 'How accreditation works and who issues it', 'What to bring on the day', 'Accessibility arrangements'],
  },
  {
    id: 'before', icon: 'plane',
    title: 'Before you travel',
    summary: 'Visa, health and what to pack',
    body: [
      'Check entry and visa requirements with official government sources well before you book. Requirements depend on your nationality and can change.',
      'Addis Ababa sits at high altitude. Many visitors take the first day gently, drink plenty of water and bring layers for cool evenings.',
    ],
    covers: ['A link to the official visa service', 'Health advice from official sources', 'A packing checklist for the season', 'Power sockets and connectivity'],
  },
  {
    id: 'around', icon: 'train-front',
    title: 'Getting around',
    summary: 'Airport, light rail and rides',
    body: [
      'The city has a light rail line, buses, minibuses and ride-hailing services. Conference shuttles, if any, will be listed here when they are announced.',
      'Allow extra time on conference days: roads near the venue are likely to be busy.',
    ],
    covers: ['From the airport to the city', 'Light rail and bus routes near the venue', 'Ride-hailing and taxis', 'Step-free routes'],
  },
  {
    id: 'stay', icon: 'bed',
    title: 'Where to stay',
    summary: 'Areas and official booking links',
    body: [
      'Rooms fill early around large conferences. If an official accommodation service is set up for COP32, this guide will link to it.',
      'This app does not take bookings and earns nothing from any link.',
    ],
    covers: ['Neighbourhoods and travel times to the venue', 'The official accommodation service, if there is one', 'What to check before you book'],
  },
  {
    id: 'explore', icon: 'coffee',
    title: 'Explore Addis',
    summary: 'Sights, food and coffee',
    body: [
      'Between sessions there is a city to see: museums, markets, hill walks and some of the best coffee anywhere.',
      'Suggestions with opening times and how to get there will be added with local partners.',
    ],
    covers: ['Two-hour and half-day ideas', 'Food and coffee', 'Getting there and back'],
  },
  {
    id: 'money', icon: 'wallet',
    title: 'Money, SIM and connectivity',
    summary: 'Cash, cards and mobile data',
    body: [
      'Carry some local currency for small purchases; card acceptance varies. A local SIM is the simplest way to stay connected.',
      'Everything in this app that matters on the day — programme, maps and guides — works without a connection.',
    ],
    covers: ['Where to exchange money and find cash machines', 'Getting a SIM card', 'Wi-Fi at the venue'],
  },
];

export interface Update {
  id: string;
  kind: 'Explainer' | 'Guide note';
  title: string;
  summary: string;
  icon: IconName;
}

/** Editorial pieces written for this guide. Not news, and not from any official body. */
export const UPDATES: Update[] = [
  { id: 'u1', kind: 'Explainer', icon: 'book-open', title: 'What is a COP, in two minutes', summary: 'The yearly meeting where countries negotiate how to respond to climate change — who is in the room, and what "a decision" means.' },
  { id: 'u2', kind: 'Explainer', icon: 'users', title: 'Blue zone, green zone, side events', summary: 'The three kinds of space at a climate conference and what happens in each.' },
  { id: 'u3', kind: 'Explainer', icon: 'banknote', title: 'Climate finance without the jargon', summary: 'Who pays, who receives, and why the numbers are argued over every year.' },
  { id: 'u4', kind: 'Guide note', icon: 'wifi-off', title: 'How this guide works offline', summary: 'The programme, maps and guides are stored on your phone when you install the app. Saving a session needs no account and no signal.' },
  { id: 'u5', kind: 'Guide note', icon: 'shield', title: 'What this guide knows, and what it does not', summary: 'Sessions shown are examples until an official programme exists. See Sources and status for the full list.' },
];

export interface Place {
  id: string;
  name: string;
  kind: 'hall' | 'room' | 'service' | 'gate';
  note: string;
  /** Room names in the programme that belong to this place. */
  rooms: string[];
}

/** Places on the schematic venue plan. The plan is invented: the real venue has not been announced. */
export const PLACES: Place[] = [
  { id: 'hallA', name: 'Hall A', kind: 'hall', note: 'Main plenary hall · step-free', rooms: ['Hall A'] },
  { id: 'hallB', name: 'Hall B', kind: 'hall', note: 'Panels and talks · step-free', rooms: ['Hall B'] },
  { id: 'rooms', name: 'Rooms 1–3', kind: 'room', note: 'Workshops and training', rooms: ['Room 1', 'Room 2', 'Room 3'] },
  { id: 'court', name: 'Courtyard', kind: 'service', note: 'Open air · food and coffee', rooms: ['Courtyard'] },
  { id: 'reg', name: 'Registration', kind: 'service', note: 'Badges and information', rooms: [] },
  { id: 'gate1', name: 'Gate 1', kind: 'gate', note: 'North entrance · meeting point', rooms: ['Gate 1'] },
  { id: 'gate2', name: 'Gate 2', kind: 'gate', note: 'South entrance · step-free', rooms: [] },
];

/** Sessions shown as highlights on Home. */
export const FEATURED: string[] = ['s07', 's14', 's19', 's22'];
