import type { Theme } from './types';

/**
 * Exhibitors for the demonstration build. EVERY organisation is invented
 * (D66): the names match the invented organisations of the invented speakers
 * and refer to no real body. No countries, no real institutions, no sponsors.
 */
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
  { id: 'e01', name: 'Andes to Highlands Network', kind: 'Civil society', theme: 'food', about: 'Farmers and agronomists from two mountain regions comparing crops that cope with heat and thin soils.', placeId: 'court', stand: 'C4' },
  { id: 'e02', name: 'Clear Skies Collective', kind: 'Civil society', theme: 'youth', about: 'A youth-led group that trains first-time delegates and runs evening briefings.', placeId: 'rooms', stand: 'R2' },
  { id: 'e03', name: 'Coastline Mutual', kind: 'Finance', theme: 'finance', about: 'A member-owned insurer piloting drought cover priced for small farms.', placeId: 'hallB', stand: 'B7' },
  { id: 'e04', name: 'Green Belt Schools', kind: 'Education', theme: 'youth', about: 'Teachers sharing a term-long tree-planting curriculum, with classroom materials to take away.', placeId: 'court', stand: 'C1' },
  { id: 'e05', name: 'Highland Seed Library', kind: 'Research', theme: 'food', about: 'A living collection of seeds that survive bad years, with a hands-on table.', placeId: 'court', stand: 'C2' },
  { id: 'e06', name: 'Horn Cities Forum', kind: 'Civil society', theme: 'cities', about: 'City planners showing what shade, water and building rules can change in five years.', placeId: 'hallB', stand: 'B3' },
  { id: 'e07', name: 'Ledger for Climate', kind: 'Finance', theme: 'finance', about: 'Auditors who explain how climate pledges are counted, and where the numbers go soft.', placeId: 'hallB', stand: 'B5' },
  { id: 'e08', name: 'Northern Grid Cooperative', kind: 'Research', theme: 'energy', about: 'Engineers demonstrating how wind and solar are balanced on a small grid.', placeId: 'hallA', stand: 'A2' },
  { id: 'e09', name: 'Open Rivers Fund', kind: 'Finance', theme: 'water', about: 'A fund for the first mile of water systems in small towns.', placeId: 'hallB', stand: 'B1' },
  { id: 'e10', name: 'Quiet Streets Studio', kind: 'Design', theme: 'cities', about: 'A design studio with ten small changes that make a street cooler and safer.', placeId: 'hallA', stand: 'A5' },
  { id: 'e11', name: 'Rift Lakes Water Lab', kind: 'Research', theme: 'water', about: 'Hydrologists tracking shallow lakes under pressure, with live models to try.', placeId: 'hallA', stand: 'A1' },
  { id: 'e12', name: 'Second Monsoon Institute', kind: 'Research', theme: 'finance', about: 'Economists studying how rainfall shocks move through household budgets.', placeId: 'hallA', stand: 'A3' },
];
