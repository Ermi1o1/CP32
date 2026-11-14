import type { EventRecord, Session } from './types';

/** Bundled content. Ships inside the app, so it is available on the first launch with no network. */
export const EVENT: EventRecord = {
  id: 'cop32',
  name: { en: 'COP32', am: 'COP32' },
  city: { en: 'Addis Ababa', am: 'አዲስ አበባ' },
  state: 'pre',
  when: { label: { en: 'November 2027', am: 'ኖቬምበር 2027' }, certainty: 'reported' },
  dayCount: 5,
  timeZone: 'Africa/Addis_Ababa',
};

/** Filled in build step 3 (Programme). Every entry will be invented and marked illustrative. */
export const SESSIONS: Session[] = [];
