import { useEffect, useState } from 'react';
import { repository } from './repository';

/**
 * Reads from the repository. `data` is undefined only for the instant before
 * the bundled content resolves, during which screens show skeletons — never a spinner.
 */
export function useContent<T>(load: (r: typeof repository) => Promise<T>, deps: readonly unknown[] = []): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    load(repository).then((d) => { if (alive) setData(d); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return data;
}
