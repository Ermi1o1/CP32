import type { EventRecord, Session, Speaker } from './types';

/**
 * Bundled content. Ships inside the app, so it is available on the first
 * launch with no network.
 *
 * EVERYTHING BELOW IS ILLUSTRATIVE (D66): session titles, people, their
 * organisations, and rooms. Names were chosen to be plausible but not to refer
 * to any real person or body, and no invented person is placed in a role at a
 * real institution. Negotiation bodies and work programmes named in session
 * titles are the real UNFCCC structures the sessions would discuss.
 * Days are numbered, never dated. The demonstration clock is not content: it
 * is build configuration (src/config/demo.ts).
 */
export const EVENT: EventRecord = {
  id: 'cop32',
  name: { en: 'COP32', am: 'COP32' },
  city: { en: 'Addis Ababa', am: 'አዲስ አበባ' },
  state: 'during',
  when: { label: { en: 'November 2027', am: 'ኖቬምበር 2027' }, certainty: 'reported' },
  dayCount: 5,
  timeZone: 'Africa/Addis_Ababa',
};

export const SPEAKERS: Speaker[] = [
  {
    "id": "p01",
    "name": "Dr. Hanna Worku",
    "org": "Rift Lakes Water Lab",
    "role": "Senior Hydrologist",
    "bio": "Hanna leads the lab's long-term monitoring of shallow lakes in the Rift Valley, linking falling water levels to irrigation demand and rising evaporation. She has spent fifteen years building open hydrological datasets that basin authorities can use without a licence."
  },
  {
    "id": "p02",
    "name": "Dawit Alemu",
    "org": "Open Rivers Fund",
    "role": "Programme Director",
    "bio": "Dawit runs the Fund's first-mile water portfolio: small piped schemes, kiosks and catchment works in towns that large utilities do not reach. Before joining the Fund he structured blended-finance deals for municipal water operators across East Africa."
  },
  {
    "id": "p03",
    "name": "Leila Osman",
    "org": "Horn Cities Forum",
    "role": "Lead Urban Planner",
    "bio": "Leila leads the Forum's heat-mapping programme in six secondary cities in the Horn of Africa, turning street-level temperature surveys into shade, planting and building-code proposals that city councils can adopt."
  },
  {
    "id": "p04",
    "name": "Marcus Lindqvist",
    "org": "Northern Grid Cooperative",
    "role": "Chief Engineer",
    "bio": "Marcus is a power-systems engineer who specialises in integrating variable renewables and storage into weak grids. He has designed and commissioned community mini-grids on three continents."
  },
  {
    "id": "p05",
    "name": "Dr. Priya Nambiar",
    "org": "Second Monsoon Institute",
    "role": "Chief Economist",
    "bio": "Priya's research follows how climate shocks cascade through household budgets, local credit and public finances. She works on how loss and damage funding can reach households quickly and with less paperwork."
  },
  {
    "id": "p06",
    "name": "Tomás Herrera",
    "org": "Andes to Highlands Network",
    "role": "Director of Adaptation",
    "bio": "Tomás works with highland farming communities on soil restoration, terracing and native seed systems, and brokers farmer-to-farmer exchanges between mountain regions facing similar climate pressures."
  },
  {
    "id": "p07",
    "name": "Selam Tesfaye",
    "org": "Green Belt Schools",
    "role": "Education Lead",
    "bio": "Selam develops climate-literacy curricula for primary schools and runs teacher-training programmes that pair classroom lessons with school-ground tree nurseries."
  },
  {
    "id": "p08",
    "name": "Amina Yusuf",
    "org": "Clear Skies Collective",
    "role": "Youth Delegation Coordinator",
    "bio": "Amina coordinates the Collective's delegation of young observers, its daily negotiation briefings and its mentoring scheme that pairs first-time attendees with experienced observers."
  },
  {
    "id": "p09",
    "name": "Jonas Weber",
    "org": "Ledger for Climate",
    "role": "Senior Climate Auditor",
    "bio": "Jonas compares climate-finance pledges with disbursements, project by project, and publishes methods so that others can reproduce the numbers. His team trains journalists and parliamentary staff to read finance reports."
  },
  {
    "id": "p10",
    "name": "Mei Tanaka",
    "org": "Quiet Streets Studio",
    "role": "Principal Architect",
    "bio": "Mei designs low-carbon, people-first streets: shade structures, permeable paving and safe crossings that can be built quickly and cheaply by municipal crews."
  },
  {
    "id": "p11",
    "name": "Kofi Mensah",
    "org": "Coastline Mutual",
    "role": "Risk Analyst",
    "bio": "Kofi designs parametric insurance that pays out automatically when rainfall or vegetation indices cross agreed thresholds, and works on keeping premiums affordable for smallholder farmers."
  },
  {
    "id": "p12",
    "name": "Yared Bekele",
    "org": "Highland Seed Library",
    "role": "Head Seed Keeper",
    "bio": "Yared manages a living seed collection of drought- and heat-tolerant highland crop varieties, and runs community seed fairs where farmers trade and register their own seed."
  },
  {
    "id": "p13",
    "name": "Dr. Abebe Girma",
    "org": "Kestrel Policy Institute",
    "role": "Senior Fellow, Adaptation",
    "bio": "Abebe works on national adaptation planning and on how the Global Goal on Adaptation could be measured with indicators that countries already collect."
  },
  {
    "id": "p14",
    "name": "Nadia Rahman",
    "org": "Lowland Resilience Alliance",
    "role": "Head of Loss and Damage Programmes",
    "bio": "Nadia leads the Alliance's work on slow-onset losses — salinisation, sea-level rise and desertification — and on how communities can document losses for future funding requests."
  },
  {
    "id": "p15",
    "name": "Samuel Okafor",
    "org": "Carbon Integrity Desk",
    "role": "Director, Carbon Markets",
    "bio": "Samuel reviews carbon-credit methodologies for environmental integrity and community benefit-sharing, with a focus on how cooperative approaches and the new crediting mechanism are being put into practice."
  },
  {
    "id": "p16",
    "name": "Hiwot Desta",
    "org": "Meridian Climate Law Clinic",
    "role": "Lead Counsel",
    "bio": "Hiwot advises community organisations on climate law, from environmental impact assessments to access-to-information requests, and teaches negotiation procedure to first-time observers."
  },
  {
    "id": "p17",
    "name": "Elena Varga",
    "org": "Coalfield Transition Observatory",
    "role": "Just Transition Analyst",
    "bio": "Elena studies how coal-dependent regions retrain workers and replace lost local revenue, and what those experiences mean for countries planning their own transitions."
  },
  {
    "id": "p18",
    "name": "Rahel Mekonnen",
    "org": "Highland Women's Climate Cooperative",
    "role": "Chair",
    "bio": "Rahel chairs a cooperative of women farmers running watershed restoration, fuel-efficient stoves and small-scale irrigation, and speaks on gender-responsive climate finance."
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
      "en": "Opening Plenary: From the Global Stocktake to NDC implementation"
    },
    "body": {
      "en": "Opening statements, followed by a review of what the first Global Stocktake asked of Parties and how the new round of nationally determined contributions measures up."
    },
    "room": "Hall A",
    "theme": "plenary",
    "format": "Plenary",
    "delivery": "hybrid",
    "access": "public",
    "speakerIds": [
      "p05",
      "p13"
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
      "en": "Transparency in practice: what the first Biennial Transparency Reports show"
    },
    "body": {
      "en": "Under the Enhanced Transparency Framework, countries now report emissions and support in a common format. Auditors and analysts read the first reports and explain what they reveal — and what they still leave out."
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
    "start": "11:00",
    "end": "12:00",
    "title": {
      "en": "SBSTA briefing for observers: the science–policy agenda"
    },
    "body": {
      "en": "A plain-language walk through the Subsidiary Body for Scientific and Technological Advice agenda for the session, and where observers can follow it."
    },
    "room": "Room 1",
    "theme": "plenary",
    "format": "Briefing",
    "access": "accredited",
    "speakerIds": [
      "p16"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s04",
    "eventId": "cop32",
    "day": 1,
    "start": "13:30",
    "end": "14:30",
    "title": {
      "en": "Energy access: powering the last mile"
    },
    "body": {
      "en": "Mini-grids, pay-as-you-go solar and grid extension: what has reached households without power, and what it costs per connection."
    },
    "room": "Hall B",
    "theme": "energy",
    "format": "Talk",
    "access": "public",
    "speakerIds": [
      "p04"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s05",
    "eventId": "cop32",
    "day": 1,
    "start": "14:00",
    "end": "15:30",
    "title": {
      "en": "Climate-smart agriculture: resilient seed systems"
    },
    "body": {
      "en": "A hands-on workshop on community seed banks, participatory variety selection and registering farmer-saved seed."
    },
    "room": "Room 2",
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
    "id": "s06",
    "eventId": "cop32",
    "day": 1,
    "start": "16:00",
    "end": "17:00",
    "title": {
      "en": "Gender Action Plan: is finance reaching women-led adaptation?"
    },
    "body": {
      "en": "Speakers review progress under the Gender Action Plan and look at how much adaptation finance reaches women's cooperatives directly."
    },
    "room": "Hall B",
    "theme": "finance",
    "format": "Panel",
    "access": "public",
    "speakerIds": [
      "p18",
      "p05"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s07",
    "eventId": "cop32",
    "day": 1,
    "start": "17:30",
    "end": "18:30",
    "title": {
      "en": "Welcome evening: Ethiopian coffee ceremony"
    },
    "body": {
      "en": "An informal evening for all participants, with a traditional coffee ceremony and music in the courtyard."
    },
    "room": "Courtyard",
    "theme": "culture",
    "format": "Culture",
    "access": "public",
    "speakerIds": [],
    "certainty": "illustrative"
  },
  {
    "id": "s08",
    "eventId": "cop32",
    "day": 2,
    "start": "09:00",
    "end": "09:45",
    "title": {
      "en": "Morning Plenary: Operationalising the Fund for responding to Loss and Damage"
    },
    "body": {
      "en": "How the new fund will decide what to finance first, how quickly money can move, and how affected communities can apply."
    },
    "room": "Hall A",
    "theme": "plenary",
    "format": "Plenary",
    "delivery": "hybrid",
    "access": "public",
    "speakerIds": [
      "p14",
      "p05"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s09",
    "eventId": "cop32",
    "day": 2,
    "start": "10:30",
    "end": "11:45",
    "title": {
      "en": "Water security: financing the first mile in drylands"
    },
    "body": {
      "en": "Small towns in arid regions fall between rural schemes and city utilities. Financiers and hydrologists discuss what bankable first-mile water looks like."
    },
    "room": "Hall B",
    "theme": "water",
    "format": "Panel",
    "delivery": "hybrid",
    "access": "public",
    "speakerIds": [
      "p01",
      "p02"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s10",
    "eventId": "cop32",
    "day": 2,
    "start": "11:00",
    "end": "12:00",
    "title": {
      "en": "Santiago Network clinic: requesting technical assistance"
    },
    "body": {
      "en": "How countries and communities can request technical assistance for averting, minimising and addressing loss and damage, with worked examples."
    },
    "room": "Room 1",
    "theme": "finance",
    "format": "Clinic",
    "access": "accredited",
    "speakerIds": [
      "p14",
      "p16"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s11",
    "eventId": "cop32",
    "day": 2,
    "start": "11:45",
    "end": "12:45",
    "title": {
      "en": "Urban resilience: designing cool cities"
    },
    "body": {
      "en": "Mapping urban heat islands street by street, and the cheap interventions — shade, trees, reflective roofs — that bring temperatures down fastest."
    },
    "room": "Room 2",
    "theme": "cities",
    "format": "Workshop",
    "access": "registration",
    "speakerIds": [
      "p03",
      "p10"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s12",
    "eventId": "cop32",
    "day": 2,
    "start": "13:30",
    "end": "14:45",
    "title": {
      "en": "High-Level Segment: Land restoration in the drylands"
    },
    "body": {
      "en": "Lessons from large-scale restoration across the Sahel and the Horn of Africa: what grew back, what did not, and why ownership by local communities decides the outcome."
    },
    "room": "Hall A",
    "theme": "land",
    "format": "Plenary",
    "delivery": "hybrid",
    "access": "unknown",
    "speakerIds": [
      "p06",
      "p12"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s13",
    "eventId": "cop32",
    "day": 2,
    "start": "15:00",
    "end": "16:00",
    "title": {
      "en": "Negotiation training: a guide for first-time delegates"
    },
    "body": {
      "en": "Agenda items, contact groups, informal consultations and square brackets: how a text moves from a draft to a decision."
    },
    "room": "Room 3",
    "theme": "youth",
    "format": "Training",
    "access": "registration",
    "speakerIds": [
      "p16",
      "p08"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s14",
    "eventId": "cop32",
    "day": 2,
    "start": "16:30",
    "end": "18:00",
    "title": {
      "en": "Evening walk: highland ecology"
    },
    "body": {
      "en": "A guided walk on the hills above the city looking at eucalyptus, native forest remnants and restoration plots."
    },
    "room": "Gate 1",
    "theme": "culture",
    "format": "Culture",
    "access": "registration",
    "speakerIds": [
      "p06"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s15",
    "eventId": "cop32",
    "day": 2,
    "start": "18:30",
    "end": "19:30",
    "title": {
      "en": "Climate insurance for smallholder farmers"
    },
    "body": {
      "en": "Parametric products, premium support and basis risk: making insurance pay out fast and fairly after drought."
    },
    "room": "Hall B",
    "theme": "finance",
    "format": "Talk",
    "access": "public",
    "speakerIds": [
      "p11"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s16",
    "eventId": "cop32",
    "day": 3,
    "start": "09:00",
    "end": "09:45",
    "title": {
      "en": "Morning Plenary: The Just Transition Work Programme"
    },
    "body": {
      "en": "What a fair transition means for workers, communities and countries that depend on fossil fuels — and what the Work Programme is expected to deliver."
    },
    "room": "Hall A",
    "theme": "plenary",
    "format": "Plenary",
    "delivery": "hybrid",
    "access": "public",
    "speakerIds": [
      "p17"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s17",
    "eventId": "cop32",
    "day": 3,
    "start": "10:00",
    "end": "11:15",
    "title": {
      "en": "Integrating renewables: wind, solar and grid stability"
    },
    "body": {
      "en": "Engineers on balancing variable power on weak grids: storage, forecasting and the rules that make it possible."
    },
    "room": "Hall B",
    "theme": "energy",
    "format": "Panel",
    "access": "public",
    "speakerIds": [
      "p04",
      "p17"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s18",
    "eventId": "cop32",
    "day": 3,
    "start": "10:00",
    "end": "11:30",
    "title": {
      "en": "Article 6 explained: carbon markets and integrity"
    },
    "body": {
      "en": "A clear explanation of cooperative approaches under Article 6.2 and the Paris Agreement Crediting Mechanism under Article 6.4, and the safeguards for communities and the environment."
    },
    "room": "Room 1",
    "theme": "finance",
    "format": "Briefing",
    "access": "public",
    "speakerIds": [
      "p15",
      "p09"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s19",
    "eventId": "cop32",
    "day": 3,
    "start": "11:30",
    "end": "12:30",
    "title": {
      "en": "People-first urban mobility"
    },
    "body": {
      "en": "Walking, cycling and minibus networks carry most trips in African cities. Designers show how to make them safer and cooler."
    },
    "room": "Hall B",
    "theme": "cities",
    "format": "Talk",
    "access": "public",
    "speakerIds": [
      "p10",
      "p03"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s20",
    "eventId": "cop32",
    "day": 3,
    "start": "13:00",
    "end": "14:00",
    "title": {
      "en": "The Mitigation Work Programme: from dialogue to delivery"
    },
    "body": {
      "en": "What the annual global dialogues have produced so far, and how they could help countries unlock investment in emission cuts."
    },
    "room": "Room 2",
    "theme": "energy",
    "format": "Panel",
    "access": "accredited",
    "speakerIds": [
      "p17",
      "p04"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s21",
    "eventId": "cop32",
    "day": 3,
    "start": "14:00",
    "end": "15:30",
    "title": {
      "en": "Youth engagement: climate education in schools"
    },
    "body": {
      "en": "Teachers and young organisers on climate literacy, school nurseries and Action for Climate Empowerment."
    },
    "room": "Room 3",
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
    "id": "s22",
    "eventId": "cop32",
    "day": 3,
    "start": "16:00",
    "end": "17:00",
    "title": {
      "en": "Reading climate fund reports: a masterclass"
    },
    "body": {
      "en": "How to read a fund's annual report and project documents: commitments, approvals and disbursements are not the same number."
    },
    "room": "Room 1",
    "theme": "finance",
    "format": "Training",
    "delivery": "virtual",
    "access": "public",
    "speakerIds": [
      "p09"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s23",
    "eventId": "cop32",
    "day": 3,
    "start": "17:30",
    "end": "18:30",
    "title": {
      "en": "Coffee origins: from forest to cup"
    },
    "body": {
      "en": "A tasting and talk on wild and forest coffee, climate pressure on growing areas, and the farmers adapting to it."
    },
    "room": "Courtyard",
    "theme": "culture",
    "format": "Culture",
    "access": "public",
    "speakerIds": [
      "p18"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s24",
    "eventId": "cop32",
    "day": 4,
    "start": "09:00",
    "end": "09:45",
    "title": {
      "en": "Morning Plenary: The Global Goal on Adaptation"
    },
    "body": {
      "en": "Indicators, targets and finance: how countries could measure progress on adaptation, and what that means for national adaptation plans."
    },
    "room": "Hall A",
    "theme": "plenary",
    "format": "Plenary",
    "delivery": "hybrid",
    "access": "public",
    "speakerIds": [
      "p13",
      "p01"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s25",
    "eventId": "cop32",
    "day": 4,
    "start": "10:00",
    "end": "11:30",
    "title": {
      "en": "Food systems: supply chains in a hotter decade"
    },
    "body": {
      "en": "Heat, drought and price spikes along food supply chains, and the storage, insurance and trade measures that soften them."
    },
    "room": "Hall B",
    "theme": "food",
    "format": "Panel",
    "access": "public",
    "speakerIds": [
      "p12",
      "p11",
      "p18"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s26",
    "eventId": "cop32",
    "day": 4,
    "start": "11:00",
    "end": "12:00",
    "title": {
      "en": "New Collective Quantified Goal: tracking delivery"
    },
    "body": {
      "en": "How the new climate-finance goal will be counted, which flows qualify, and how observers can check progress year by year."
    },
    "room": "Room 1",
    "theme": "finance",
    "format": "Panel",
    "access": "accredited",
    "speakerIds": [
      "p05",
      "p09"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s27",
    "eventId": "cop32",
    "day": 4,
    "start": "13:00",
    "end": "14:00",
    "title": {
      "en": "Transboundary lake and river basins under drought"
    },
    "body": {
      "en": "Sharing data and water between neighbouring countries when rainfall becomes less predictable."
    },
    "room": "Hall B",
    "theme": "water",
    "format": "Talk",
    "access": "public",
    "speakerIds": [
      "p01",
      "p13"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s28",
    "eventId": "cop32",
    "day": 4,
    "start": "14:00",
    "end": "15:00",
    "title": {
      "en": "National adaptation plans: from document to budget line"
    },
    "body": {
      "en": "Planners on moving adaptation priorities into national budgets and municipal spending."
    },
    "room": "Room 2",
    "theme": "land",
    "format": "Workshop",
    "access": "registration",
    "speakerIds": [
      "p13",
      "p03"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s29",
    "eventId": "cop32",
    "day": 4,
    "start": "15:00",
    "end": "16:30",
    "title": {
      "en": "High-Level Plenary: Meaningful youth participation"
    },
    "body": {
      "en": "Young negotiators and observers on what it takes to move from a seat in the room to influence on the text."
    },
    "room": "Hall A",
    "theme": "youth",
    "format": "Plenary",
    "delivery": "hybrid",
    "access": "public",
    "speakerIds": [
      "p08",
      "p07"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s30",
    "eventId": "cop32",
    "day": 4,
    "start": "17:00",
    "end": "18:00",
    "title": {
      "en": "Women-led watershed restoration"
    },
    "body": {
      "en": "Members of a farmer cooperative describe terracing, gully repair and spring protection, and how they financed it."
    },
    "room": "Courtyard",
    "theme": "land",
    "format": "Talk",
    "access": "public",
    "speakerIds": [
      "p18",
      "p06"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s31",
    "eventId": "cop32",
    "day": 5,
    "start": "09:00",
    "end": "10:30",
    "title": {
      "en": "Final Plenary: The outcomes of COP32 in plain language"
    },
    "body": {
      "en": "What was agreed, what was postponed and what it means for people outside the negotiating rooms."
    },
    "room": "Hall A",
    "theme": "plenary",
    "format": "Plenary",
    "delivery": "hybrid",
    "access": "public",
    "speakerIds": [
      "p05",
      "p14"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s32",
    "eventId": "cop32",
    "day": 5,
    "start": "11:00",
    "end": "12:00",
    "title": {
      "en": "Next steps: implementing the decisions of COP32"
    },
    "body": {
      "en": "Who does what, and by when, after the gavel comes down."
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
    "id": "s33",
    "eventId": "cop32",
    "day": 5,
    "start": "11:00",
    "end": "12:00",
    "title": {
      "en": "Observer debrief: reading the final texts"
    },
    "body": {
      "en": "A guided read of the final decisions: where to find them, how they are structured and what the operative paragraphs commit Parties to."
    },
    "room": "Room 1",
    "theme": "plenary",
    "format": "Briefing",
    "delivery": "virtual",
    "access": "public",
    "speakerIds": [
      "p16",
      "p09"
    ],
    "certainty": "illustrative"
  },
  {
    "id": "s34",
    "eventId": "cop32",
    "day": 5,
    "start": "14:00",
    "end": "15:00",
    "title": {
      "en": "Closing ceremony and handover to COP33"
    },
    "body": {
      "en": "Closing statements and the formal handover to the incoming Presidency."
    },
    "room": "Hall A",
    "theme": "plenary",
    "format": "Plenary",
    "delivery": "hybrid",
    "access": "public",
    "speakerIds": [],
    "certainty": "illustrative"
  }
];
