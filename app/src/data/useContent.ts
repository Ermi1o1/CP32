import { useEffect, useState } from 'react';
import { repository, syncedRepository } from './repository';
import { useOfficialSync } from '@/state/provenance';

/**
 * Reads from the repository. `data` is undefined only for the instant before
 * the bundled content resolves, during which screens show skeletons — never a spinner.
 * When the official-sync demonstration is on, reads go through the synced view.
 */
export function useContent<T>(load: (r: typeof repository) => Promise<T>, deps: readonly unknown[] = []): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined);
  const { on } = useOfficialSync();
  useEffect(() => {
    let alive = true;
    load(on ? syncedRepository : repository).then((d) => { if (alive) setData(d); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, ...deps]);
  return data;
}
