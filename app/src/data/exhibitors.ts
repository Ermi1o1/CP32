import type { Theme } from './types';

export interface Exhibitor {
  id: string;
  name: string;
  kind: 'Research' | 'Civil society' | 'Finance' | 'Education' | 'Design';
  theme: Theme;
  about: string;
  /** Place id on the schematic plan. */
  placeId: string;
  stand: string;
}

export const EXHIBITORS: Exhibitor[] = [
  { id: 'e01', name: 'Andes to Highlands Network', kind: 'Civil society', theme: 'food', about: 'Farmer-to-farmer exchange between mountain regions. See terracing models, soil-health test kits and a seed-swap table, and book a short session with field agronomists from both continents.', placeId: 'court', stand: 'C4' },
  { id: 'e02', name: 'Carbon Integrity Desk', kind: 'Research', theme: 'finance', about: 'An independent review desk for carbon-credit methodologies. Walk through a real-format project design document with a reviewer and learn the questions to ask about additionality, permanence and benefit-sharing.', placeId: 'hallB', stand: 'B8' },
  { id: 'e03', name: 'Clear Skies Collective', kind: 'Civil society', theme: 'youth', about: 'Youth delegation hub. Daily 08:15 negotiation briefings, a mentoring desk for first-time observers, and an evening space for young professionals to meet delegates.', placeId: 'rooms', stand: 'R2' },
  { id: 'e04', name: 'Coalfield Transition Observatory', kind: 'Research', theme: 'energy', about: 'Data stories from coal regions that have already changed: jobs, local tax bases and retraining outcomes, with an interactive comparison tool for planners.', placeId: 'hallA', stand: 'A6' },
  { id: 'e05', name: 'Coastline Mutual', kind: 'Finance', theme: 'finance', about: 'Member-owned parametric insurance for smallholder farms. Try the payout simulator to see how a rainfall index triggers a claim, and how premium support changes who can afford cover.', placeId: 'hallB', stand: 'B7' },
  { id: 'e06', name: 'Green Belt Schools', kind: 'Education', theme: 'youth', about: 'A term-long climate curriculum built around a school tree nursery. Teachers can take printed lesson packs; students can pot a seedling to take home.', placeId: 'court', stand: 'C1' },
  { id: 'e07', name: 'Highland Seed Library', kind: 'Research', theme: 'food', about: 'A living collection of drought- and heat-tolerant highland varieties. Hands-on seed-cleaning and germination demonstrations every two hours.', placeId: 'court', stand: 'C2' },
  { id: 'e08', name: "Highland Women's Climate Cooperative", kind: 'Civil society', theme: 'land', about: 'Watershed restoration run by women farmers. Photographs, maps and a scale model of a restored hillside, with members on the stand each afternoon.', placeId: 'court', stand: 'C5' },
  { id: 'e09', name: 'Horn Cities Forum', kind: 'Civil society', theme: 'cities', about: 'Street-level heat maps from six cities and the shade, planting and building-code measures they led to. Bring a city name and the team will show comparable data.', placeId: 'hallB', stand: 'B3' },
  { id: 'e10', name: 'Kestrel Policy Institute', kind: 'Research', theme: 'land', about: 'Adaptation metrics in practice: a working dashboard that maps national data already collected onto possible Global Goal on Adaptation indicators.', placeId: 'hallA', stand: 'A7' },
  { id: 'e11', name: 'Ledger for Climate', kind: 'Finance', theme: 'finance', about: 'Pledges versus disbursements, project by project. Open methods, downloadable datasets and short trainings for journalists and parliamentary staff.', placeId: 'hallB', stand: 'B5' },
  { id: 'e12', name: 'Lowland Resilience Alliance', kind: 'Civil society', theme: 'water', about: 'Documenting slow-onset losses: salinised fields, retreating shorelines and abandoned grazing land. Learn the community loss-register method the Alliance uses.', placeId: 'hallB', stand: 'B9' },
  { id: 'e13', name: 'Meridian Climate Law Clinic', kind: 'Civil society', theme: 'youth', about: 'Free short consultations on climate-related legal questions, and a quick guide to negotiation procedure for observers: agenda items, contact groups and how to make an intervention.', placeId: 'rooms', stand: 'R3' },
  { id: 'e14', name: 'Northern Grid Cooperative', kind: 'Research', theme: 'energy', about: 'A live tabletop model balancing wind, solar and batteries on a weak grid. Watch frequency hold as clouds pass, and see what changes when storage is added.', placeId: 'hallA', stand: 'A2' },
  { id: 'e15', name: 'Open Rivers Fund', kind: 'Finance', theme: 'water', about: 'Financing the first mile of water in small towns. See three funded schemes from feasibility to first tap, with their real cost per connection.', placeId: 'hallB', stand: 'B1' },
  { id: 'e16', name: 'Quiet Streets Studio', kind: 'Design', theme: 'cities', about: 'Ten low-cost street interventions — shade sails, permeable paving, raised crossings — shown at full scale in the hall.', placeId: 'hallA', stand: 'A5' },
  { id: 'e17', name: 'Rift Lakes Water Lab', kind: 'Research', theme: 'water', about: 'Thirty years of lake-level data in an interactive 3D model, and the irrigation and evaporation trends behind it.', placeId: 'hallA', stand: 'A1' },
  { id: 'e18', name: 'Second Monsoon Institute', kind: 'Research', theme: 'finance', about: 'How climate shocks travel through household budgets, local credit and public finances, with a policy brief on fast-disbursing loss and damage support.', placeId: 'hallA', stand: 'A3' },
];
