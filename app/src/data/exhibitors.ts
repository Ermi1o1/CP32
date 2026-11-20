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
  { id: 'e01', name: 'Andes to Highlands Network', kind: 'Civil society', theme: 'food', about: 'Showcasing regenerative agriculture techniques adapted for high-altitude climates and thin soils.', placeId: 'court', stand: 'C4' },
  { id: 'e02', name: 'Clear Skies Collective', kind: 'Civil society', theme: 'youth', about: 'A youth-led delegation offering daily briefings on the negotiation track and networking events for young professionals.', placeId: 'rooms', stand: 'R2' },
  { id: 'e03', name: 'Coastline Mutual', kind: 'Finance', theme: 'finance', about: 'Presenting innovative, member-owned insurance models designed to provide drought cover for smallholder farms.', placeId: 'hallB', stand: 'B7' },
  { id: 'e04', name: 'Green Belt Schools', kind: 'Education', theme: 'youth', about: 'Sharing a term-long tree-planting curriculum and educational materials for integrating climate literacy into classrooms.', placeId: 'court', stand: 'C1' },
  { id: 'e05', name: 'Highland Seed Library', kind: 'Research', theme: 'food', about: 'A living collection of climate-resilient seeds. Stop by for a hands-on demonstration of seed preservation.', placeId: 'court', stand: 'C2' },
  { id: 'e06', name: 'Horn Cities Forum', kind: 'Civil society', theme: 'cities', about: 'Urban planners showcasing how sustainable building rules and green infrastructure can cool cities.', placeId: 'hallB', stand: 'B3' },
  { id: 'e07', name: 'Ledger for Climate', kind: 'Finance', theme: 'finance', about: 'Independent auditors explaining how to track climate pledges and identify where financial accounting lacks transparency.', placeId: 'hallB', stand: 'B5' },
  { id: 'e08', name: 'Northern Grid Cooperative', kind: 'Research', theme: 'energy', about: 'Engineers demonstrating live models of how wind and solar power are balanced on decentralized micro-grids.', placeId: 'hallA', stand: 'A2' },
  { id: 'e09', name: 'Open Rivers Fund', kind: 'Finance', theme: 'water', about: 'A specialized fund dedicated to financing the "first mile" of water infrastructure in underserved towns.', placeId: 'hallB', stand: 'B1' },
  { id: 'e10', name: 'Quiet Streets Studio', kind: 'Design', theme: 'cities', about: 'An urban design studio exhibiting ten low-cost interventions to make city streets cooler and more pedestrian-friendly.', placeId: 'hallA', stand: 'A5' },
  { id: 'e11', name: 'Rift Lakes Water Lab', kind: 'Research', theme: 'water', about: 'Hydrologists presenting data on the pressures facing shallow lake ecosystems, featuring interactive 3D models.', placeId: 'hallA', stand: 'A1' },
  { id: 'e12', name: 'Second Monsoon Institute', kind: 'Research', theme: 'finance', about: 'Economists sharing research on how extreme weather shocks cascade through household budgets in developing nations.', placeId: 'hallA', stand: 'A3' },
];