import type { EventRecord, Session, Speaker } from './types';

/**
 * Bundled content. Ships inside the app, so it is available on the first
 * launch with no network.
 *
 * EVERYTHING BELOW IS INVENTED FOR DEMONSTRATION (D66): session titles,
 * people, organisations and rooms. Names were chosen to be plausible but not
 * to refer to any real person or body. Days are numbered, never dated.
 */
export const EVENT: EventRecord = {
  id: 'cop32',
  name: { en: 'COP32', am: 'COP32' },
  city: { en: 'Addis Ababa', am: 'አዲስ አበባ' },
  state: 'during',
  when: { label: { en: 'November 2027', am: 'ኖቬምበር 2027' }, certainty: 'reported' },
  dayCount: 5,
  timeZone: 'Africa/Addis_Ababa',
  demoNow: { day: 2, time: '10:12' },
};

export const SPEAKERS: Speaker[] = [
  {
    "id": "p01",
    "name": "Hanna Worku",
    "org": "Rift Lakes Water Lab",
    "role": "Hydrologist"
  },
  {
    "id": "p02",
    "name": "Dawit Alemu",
    "org": "Open Rivers Fund",
    "role": "Programme lead"
  },
  {
    "id": "p03",
    "name": "Leila Osman",
    "org": "Horn Cities Forum",
    "role": "Urban planner"
  },
  {
    "id": "p04",
    "name": "Marcus Lindqvist",
    "org": "Northern Grid Cooperative",
    "role": "Engineer"
  },
  {
    "id": "p05",
    "name": "Priya Nambiar",
    "org": "Second Monsoon Institute",
    "role": "Economist"
  },
  {
    "id": "p06",
    "name": "Tomás Herrera",
    "org": "Andes to Highlands Network",
    "role": "Agronomist"
  },
  {
    "id": "p07",
    "name": "Selam Tesfaye",
    "org": "Green Belt Schools",
    "role": "Teacher"
  },
  {
    "id": "p08",
    "name": "Amina Yusuf",
    "org": "Clear Skies Collective",
    "role": "Youth organiser"
  },
  {
    "id": "p09",
    "name": "Jonas Weber",
    "org": "Ledger for Climate",
    "role": "Auditor"
  },
  {
    "id": "p10",
    "name": "Mei Tanaka",
    "org": "Quiet Streets Studio",
    "role": "Designer"
  },
  {
    "id": "p11",
    "name": "Kofi Mensah",
    "org": "Coastline Mutual",
    "role": "Insurer"
  },
  {
    "id": "p12",
    "name": "Yared Bekele",
    "org": "Highland Seed Library",
    "role": "Seed keeper"
  }
];

export const SESSIONS: Session[] = [
  {
    "id": "s01",
    "eventId": "cop32",
    "day": 1,
    "start": "09:00",
    "end": "10:00",
    "title": {
      "en": "Opening of the conference"
    },
    "body": {
      "en": "How the two weeks are organised, and what to watch for on day one."
    },
    "room": "Hall A",
    "theme": "plenary",
    "format": "Plenary",
    "access": "public",
    "speakerIds": [
      "p05"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s02",
    "eventId": "cop32",
    "day": 1,
    "start": "10:30",
    "end": "11:45",
    "title": {
      "en": "Counting what counts: honest climate numbers"
    },
    "body": {
      "en": "Three auditors on how pledges are measured, and where the numbers go soft."
    },
    "room": "Hall B",
    "theme": "finance",
    "format": "Panel",
    "access": "public",
    "speakerIds": [
      "p09",
      "p05"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s03",
    "eventId": "cop32",
    "day": 1,
    "start": "13:30",
    "end": "14:30",
    "title": {
      "en": "Power for the last village"
    },
    "body": {
      "en": "What it takes to connect the hardest places, from someone who has done it."
    },
    "room": "Room 2",
    "theme": "energy",
    "format": "Talk",
    "access": "public",
    "speakerIds": [
      "p04"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s04",
    "eventId": "cop32",
    "day": 1,
    "start": "15:00",
    "end": "16:30",
    "title": {
      "en": "Seeds that survive a bad year"
    },
    "body": {
      "en": "A hands-on session with seed keepers. Bring questions."
    },
    "room": "Room 3",
    "theme": "food",
    "format": "Workshop",
    "access": "registration",
    "speakerIds": [
      "p12",
      "p06"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s05",
    "eventId": "cop32",
    "day": 1,
    "start": "17:30",
    "end": "18:30",
    "title": {
      "en": "Welcome evening: music and coffee"
    },
    "body": {
      "en": "An informal start. Meet at Gate 1."
    },
    "room": "Courtyard",
    "theme": "culture",
    "format": "Culture",
    "access": "public",
    "speakerIds": [],
    "certainty": "illustrative"
  },
  {
    "id": "s06",
    "eventId": "cop32",
    "day": 2,
    "start": "09:00",
    "end": "09:45",
    "title": {
      "en": "Opening of day two"
    },
    "body": {
      "en": "A short review of day one and the shape of the day ahead."
    },
    "room": "Hall A",
    "theme": "plenary",
    "format": "Plenary",
    "access": "public",
    "speakerIds": [
      "p05"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s07",
    "eventId": "cop32",
    "day": 2,
    "start": "10:30",
    "end": "11:45",
    "title": {
      "en": "Water for dryland towns: financing the first mile"
    },
    "body": {
      "en": "The first mile of a water system is the hardest to pay for. Three practitioners compare what has worked in small dryland towns, and what a lender needs to see before saying yes."
    },
    "room": "Hall B",
    "theme": "water",
    "format": "Panel",
    "access": "public",
    "speakerIds": [
      "p01",
      "p02",
      "p11"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s08",
    "eventId": "cop32",
    "day": 2,
    "start": "11:45",
    "end": "12:45",
    "title": {
      "en": "Cities that stay cool"
    },
    "body": {
      "en": "Shade, water and building rules: what a city can change in five years."
    },
    "room": "Room 3",
    "theme": "cities",
    "format": "Workshop",
    "access": "public",
    "speakerIds": [
      "p03",
      "p10"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s09",
    "eventId": "cop32",
    "day": 2,
    "start": "13:30",
    "end": "14:45",
    "title": {
      "en": "Restoring land, one watershed at a time"
    },
    "body": {
      "en": "Lessons from people who have brought hillsides back, and what did not work."
    },
    "room": "Hall A",
    "theme": "land",
    "format": "Plenary",
    "access": "unknown",
    "speakerIds": [
      "p06",
      "p12"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s10",
    "eventId": "cop32",
    "day": 2,
    "start": "15:00",
    "end": "16:00",
    "title": {
      "en": "A briefing for first-time negotiators"
    },
    "body": {
      "en": "How the rooms work, who speaks when, and how to read a draft text."
    },
    "room": "Room 1",
    "theme": "youth",
    "format": "Training",
    "access": "accredited",
    "speakerIds": [
      "p08"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s11",
    "eventId": "cop32",
    "day": 2,
    "start": "16:30",
    "end": "18:00",
    "title": {
      "en": "Evening light: a walk in the hills"
    },
    "body": {
      "en": "A guided walk above the city. Meets at Gate 1; wear good shoes."
    },
    "room": "Gate 1",
    "theme": "culture",
    "format": "Culture",
    "access": "registration",
    "speakerIds": [],
    "certainty": "illustrative"
  },
  {
    "id": "s12",
    "eventId": "cop32",
    "day": 2,
    "start": "18:30",
    "end": "19:30",
    "title": {
      "en": "Insurance when the rains fail"
    },
    "body": {
      "en": "Can a small farmer be insured against drought at a price that makes sense?"
    },
    "room": "Room 2",
    "theme": "finance",
    "format": "Talk",
    "access": "public",
    "speakerIds": [
      "p11"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s13",
    "eventId": "cop32",
    "day": 3,
    "start": "09:00",
    "end": "09:45",
    "title": {
      "en": "Opening of day three"
    },
    "body": {
      "en": ""
    },
    "room": "Hall A",
    "theme": "plenary",
    "format": "Plenary",
    "access": "public",
    "speakerIds": [
      "p05"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s14",
    "eventId": "cop32",
    "day": 3,
    "start": "10:00",
    "end": "11:15",
    "title": {
      "en": "Wind, sun and the grid between them"
    },
    "body": {
      "en": "Engineers on keeping the lights on when the weather is the power station."
    },
    "room": "Hall B",
    "theme": "energy",
    "format": "Panel",
    "access": "public",
    "speakerIds": [
      "p04",
      "p05"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s15",
    "eventId": "cop32",
    "day": 3,
    "start": "11:30",
    "end": "12:30",
    "title": {
      "en": "Streets for people"
    },
    "body": {
      "en": "A designer shows ten small changes that make a street cooler and safer."
    },
    "room": "Room 3",
    "theme": "cities",
    "format": "Talk",
    "access": "public",
    "speakerIds": [
      "p10"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s16",
    "eventId": "cop32",
    "day": 3,
    "start": "14:00",
    "end": "15:30",
    "title": {
      "en": "Schools that plant: a classroom session"
    },
    "body": {
      "en": "Teachers share a term-long tree-planting curriculum."
    },
    "room": "Room 1",
    "theme": "youth",
    "format": "Workshop",
    "access": "public",
    "speakerIds": [
      "p07",
      "p08"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s17",
    "eventId": "cop32",
    "day": 3,
    "start": "16:00",
    "end": "17:00",
    "title": {
      "en": "Following the money"
    },
    "body": {
      "en": "How to read a climate fund report without being an accountant."
    },
    "room": "Room 2",
    "theme": "finance",
    "format": "Training",
    "access": "public",
    "speakerIds": [
      "p09"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s18",
    "eventId": "cop32",
    "day": 4,
    "start": "09:00",
    "end": "09:45",
    "title": {
      "en": "Opening of day four"
    },
    "body": {
      "en": ""
    },
    "room": "Hall A",
    "theme": "plenary",
    "format": "Plenary",
    "access": "public",
    "speakerIds": [
      "p05"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s19",
    "eventId": "cop32",
    "day": 4,
    "start": "10:00",
    "end": "11:30",
    "title": {
      "en": "Food that can take the heat"
    },
    "body": {
      "en": "Crops, kitchens and markets in a hotter decade."
    },
    "room": "Hall B",
    "theme": "food",
    "format": "Panel",
    "access": "public",
    "speakerIds": [
      "p06",
      "p12"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s20",
    "eventId": "cop32",
    "day": 4,
    "start": "13:00",
    "end": "14:00",
    "title": {
      "en": "Lakes under pressure"
    },
    "body": {
      "en": "What is happening to shallow lakes, and what has helped."
    },
    "room": "Room 2",
    "theme": "water",
    "format": "Talk",
    "access": "public",
    "speakerIds": [
      "p01"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s21",
    "eventId": "cop32",
    "day": 4,
    "start": "15:00",
    "end": "16:30",
    "title": {
      "en": "Young voices, real seats"
    },
    "body": {
      "en": "Youth delegates on what changed when they were given a vote."
    },
    "room": "Hall A",
    "theme": "youth",
    "format": "Plenary",
    "access": "public",
    "speakerIds": [
      "p08",
      "p07"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s22",
    "eventId": "cop32",
    "day": 5,
    "start": "09:00",
    "end": "10:30",
    "title": {
      "en": "What was agreed, in plain words"
    },
    "body": {
      "en": "A first reading of the outcomes, without the jargon."
    },
    "room": "Hall A",
    "theme": "plenary",
    "format": "Plenary",
    "access": "public",
    "speakerIds": [
      "p05",
      "p09"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s23",
    "eventId": "cop32",
    "day": 5,
    "start": "11:00",
    "end": "12:00",
    "title": {
      "en": "After the conference: what happens next"
    },
    "body": {
      "en": "Who does what, and by when."
    },
    "room": "Hall B",
    "theme": "plenary",
    "format": "Panel",
    "access": "public",
    "speakerIds": [
      "p02",
      "p03"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s24",
    "eventId": "cop32",
    "day": 5,
    "start": "14:00",
    "end": "15:00",
    "title": {
      "en": "Closing"
    },
    "body": {
      "en": ""
    },
    "room": "Hall A",
    "theme": "plenary",
    "format": "Plenary",
    "access": "public",
    "speakerIds": [],
    "certainty": "illustrative"
  }
];
