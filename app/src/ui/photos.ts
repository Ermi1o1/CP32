import type { Theme } from '@/data/types';

/**
 * Bundled photographs. Each has an entry in assets/photos/credits.json and in
 * docs/design/image-credits.md (source, author, licence). Nothing is fetched
 * at run time. These are theme images: they illustrate a subject and do not
 * claim to show COP32, its venue, or (in three cases) Ethiopia.
 */
export const PHOTOS = {
  highland: require('../../assets/photos/highland.jpg'),
  terraces: require('../../assets/photos/terraces.jpg'),
  dusk: require('../../assets/photos/dusk.jpg'),
  heath: require('../../assets/photos/heath.jpg'),
  teff: require('../../assets/photos/teff.jpg'),
  lake: require('../../assets/photos/lake.jpg'),
  wind: require('../../assets/photos/wind.jpg'),
  nursery: require('../../assets/photos/nursery.jpg'),
  hall: require('../../assets/photos/hall.jpg'),
} as const;
export type PhotoName = keyof typeof PHOTOS;

export const THEME_PHOTO: Record<Theme, PhotoName> = {
  water: 'lake',
  energy: 'wind',
  land: 'terraces',
  cities: 'dusk',
  food: 'teff',
  finance: 'highland',
  youth: 'nursery',
  culture: 'heath',
  plenary: 'hall',
};

/** Theme image for each practical guide and each explainer (v1.4). Illustrative only, like every bundled photograph. */
export const GUIDE_PHOTO: Record<string, PhotoName> = { attend: 'hall', before: 'highland', around: 'dusk', stay: 'lake', explore: 'heath', money: 'teff' };
export const UPDATE_PHOTO: Record<string, PhotoName> = { u1: 'hall', u2: 'nursery', u3: 'terraces', u4: 'wind', u5: 'lake' };
