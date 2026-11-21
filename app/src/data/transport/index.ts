import { useEffect, useState } from 'react';
import type { TransportRepository } from './types';
import { BundledTransportRepository } from './bundled';

export * from './types';

/**
 * The transport data source. Bundled today; when BusTrack's endpoint exists,
 * swap in an implementation of TransportRepository here (it will also need
 * network access, which D80 currently blocks).
 */
export const transportRepository: TransportRepository = new BundledTransportRepository();

export function useTransport<T>(load: (r: TransportRepository) => Promise<T>): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    load(transportRepository).then((d) => { if (alive) setData(d); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return data;
}
