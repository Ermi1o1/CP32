/**
 * Demonstration of the content pipeline: "official sync" on means the app
 * presents its bundled content as if it had just been synced from the
 * official programme (certainty illustrative -> official).
 *
 * Deliberately held in memory only, never persisted: a restart always returns
 * the app to honest "Preview content" labels, so a phone cannot be left
 * showing invented sessions marked Official.
 */
import { useSyncExternalStore } from 'react';

let on = false;
let syncedAt: string | null = null;
const listeners = new Set<() => void>();

export function setOfficialSync(v: boolean, now: Date = new Date()): void {
  on = v;
  syncedAt = v ? `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}` : null;
  listeners.forEach((l) => l());
}

export function getOfficialSync(): { on: boolean; syncedAt: string | null } {
  return { on, syncedAt };
}

let snapshot = getOfficialSync();
function subscribe(l: () => void) {
  const wrapped = () => { snapshot = getOfficialSync(); l(); };
  listeners.add(wrapped);
  return () => { listeners.delete(wrapped); };
}

export function useOfficialSync(): { on: boolean; syncedAt: string | null } {
  return useSyncExternalStore(subscribe, () => snapshot, () => snapshot);
}
