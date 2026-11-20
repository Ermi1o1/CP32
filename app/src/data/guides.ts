import type { IconName } from '@/ui/Icon';

/**
 * Visit guides and editorial updates for the preview build.
 * 
 * These provide high-level practical advice and context. English only
 * for now, with Amharic localization in progress.
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
      'Emergency phone numbers, medical points and the lost-and-found desk will be listed here once they are finalized with the host. This page is saved on your phone and will work without signal.',
    ],
    covers: ['Emergency phone numbers', 'Medical points and first aid', 'Lost and found', 'Embassy and consular contacts'],
  },
  {
    id: 'attend', icon: 'ticket',
    title: 'Can I attend?',
    summary: 'Who can enter which areas, in plain language',
    body: [
      'Climate conferences usually have two kinds of space: an area for accredited delegates, media and observers, and public areas that are open more widely.',
      'How this will work at COP32, and what you need to bring, will be updated in this guide as soon as it is announced.',
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
      'Everything in this app that matters on the day - programme, maps and guides - works without a connection.',
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
  /** The piece itself, a few short paragraphs. General background only; nothing here is an official COP32 statement. */
  body: string[];
}

/** Editorial pieces written for this guide. */
export const UPDATES: Update[] = [
  { 
    id: 'u1', 
    kind: 'Explainer', 
    icon: 'book-open', 
    title: 'What is a COP, in two minutes', 
    summary: `The yearly meeting where countries negotiate how to respond to climate change - who is in the room, and what "a decision" means.`, 
    body: [
      `COP stands for Conference of the Parties: the countries that have joined the United Nations climate convention, agreed in the early nineties. They meet once a year, usually for about two weeks, and each meeting takes its number in the series. COP32 is the thirty-second.`, 
      `Decisions are taken by consensus. In practice a text is adopted when no country formally objects, which is why a single sentence can be argued over for days and why the last night often runs long.`, 
      `Negotiators are only part of the picture. Observers attend too: civil society groups, researchers, businesses, youth organisations, Indigenous Peoples' organisations and the press.`, 
      `Around the negotiations sits a much larger programme of talks, exhibitions and cultural events. That public side is what this guide is for.`
    ] 
  },
  { 
    id: 'u2', 
    kind: 'Explainer', 
    icon: 'users', 
    title: 'Blue zone, green zone, side events', 
    summary: `The three kinds of space at a climate conference and what happens in each.`, 
    body: [
      `The Blue Zone is the area managed by the United Nations. Negotiations happen there, and entry needs accreditation: a badge issued through the UN climate secretariat to delegations, observer organisations and media.`, 
      `The Green Zone is organised by the host country. At recent conferences it has been open to the public, sometimes with free registration, with exhibitions, talks and cultural events.`, 
      `Side events are talks, panels and workshops held alongside the negotiations by governments, international bodies and observer organisations. Some are inside the Blue Zone and some are public.`, 
      `How these spaces will be arranged for COP32, and who may enter which, will be published by the host. This guide will show it when available.`
    ] 
  },
  { 
    id: 'u3', 
    kind: 'Explainer', 
    icon: 'banknote', 
    title: 'Climate finance without the jargon', 
    summary: `Who pays, who receives, and why the numbers are argued over every year.`, 
    body: [
      `Climate finance is money for three things: cutting emissions, adapting to the changes already under way, and responding to loss and damage that cannot be avoided.`, 
      `Under the climate convention, developed countries committed to provide finance to developing countries. Years ago they set a yearly goal counted in the hundreds of billions of dollars.`, 
      `More recently countries agreed a new, larger yearly goal for the decade ahead, with developed countries taking the lead, inside a wider call to raise far more from all sources, public and private. This guide does not quote the figures; the UN climate secretariat publishes them.`, 
      `The arguments return every year. Who should contribute. What counts, since a loan is not a grant. How much goes to adaptation. And how easily the money reaches the countries and communities that need it.`
    ] 
  },
  { 
    id: 'u4', 
    kind: 'Guide note', 
    icon: 'wifi-off', 
    title: 'How this guide works offline', 
    summary: `The programme, maps and guides are stored on your phone when you install the app. Saving a session needs no account and no signal.`, 
    body: [
      `When you install the app, the whole programme, the venue plan, the visitor guides and these explainers are stored on your phone. Nothing is downloaded when you open a page.`, 
      `Search works the same way: it looks through what is already on the phone.`, 
      `Saving a session to your agenda needs no account and no signal. Your saved sessions and your settings stay on this phone and are not sent anywhere.`, 
      `Around a busy venue the mobile network is often the first thing to slow down. The guide is built so that this does not matter.`
    ] 
  },
  { 
    id: 'u5', 
    kind: 'Guide note', 
    icon: 'compass', 
    title: 'Making the most of your visit', 
    summary: `Practical tips for navigating the venue, managing your schedule, and finding side events.`, 
    body: [
      `A COP is a marathon, not a sprint. The venue is often massive, and walking between halls takes time. Build buffer time into your schedule when moving between the Blue Zone and the Green Zone.`, 
      `Side events and pavilions are where a lot of the real networking happens. Check the programme daily, as room changes and last-minute additions are common.`, 
      `Keep your phone charged. While this app works entirely offline, taking photos, scanning badges, and coordinating with colleagues will drain your battery quickly. Bring a power bank.`
    ] 
  },
];

export interface Place {
  id: string;
  name: string;
  kind: 'hall' | 'room' | 'service' | 'gate';
  note: string;
  /** Room names in the programme that belong to this place. */
  rooms: string[];
  /** Reachable without steps, on this illustrative plan. */
  stepFree?: boolean;
  /** Overrides the icon that goes with the kind. */
  icon?: IconName;
}

/** Places on the schematic venue plan. The plan is a preview: the real venue has not been announced. */
export const PLACES: Place[] = [
  { id: 'hallA', name: 'Hall A', kind: 'hall', note: 'Main plenary hall - step-free', rooms: ['Hall A'], stepFree: true },
  { id: 'hallB', name: 'Hall B', kind: 'hall', note: 'Panels and talks - step-free', rooms: ['Hall B'], stepFree: true },
  { id: 'rooms', name: 'Rooms 1-3', kind: 'room', note: 'Workshops and training', rooms: ['Room 1', 'Room 2', 'Room 3'] },
  { id: 'court', name: 'Courtyard', kind: 'service', note: 'Open air - food and coffee', rooms: ['Courtyard'] },
  { id: 'reg', name: 'Registration', kind: 'service', icon: 'ticket', note: 'Badges and information - step-free', rooms: [], stepFree: true },
  { id: 'gate1', name: 'Gate 1', kind: 'gate', note: 'North entrance - meeting point', rooms: ['Gate 1'] },
  { id: 'gate2', name: 'Gate 2', kind: 'gate', note: 'South entrance - step-free', rooms: [], stepFree: true },
];

/** Sessions shown as highlights on Home. */
export const FEATURED: string[] = ['s07', 's14', 's19', 's22'];