/**
 * My agenda: the ids of saved sessions, kept on this phone only (D21).
 * No account, no sync. Saving works with no network because nothing leaves the device.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'agenda.v1';

export function sanitizeAgenda(raw: unknown): string[] {
  return Array.isArray(raw) ? [...new Set(raw.filter((x): x is string => typeof x === 'string'))] : [];
}

interface Ctx { saved: ReadonlySet<string>; toggle: (id: string) => boolean; isSaved: (id: string) => boolean }
const AgendaCtx = createContext<Ctx | null>(null);

export function AgendaProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(KEY)
      .then((s) => { if (alive && s) setIds(sanitizeAgenda(JSON.parse(s))); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const saved = useMemo(() => new Set(ids), [ids]);

  /** Returns true when the session is saved after the call. */
  const toggle = useCallback((id: string): boolean => {
    const willSave = !saved.has(id);
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
    return willSave;
  }, [saved]);

  const value = useMemo(() => ({ saved, toggle, isSaved: (id: string) => saved.has(id) }), [saved, toggle]);
  return <AgendaCtx.Provider value={value}>{children}</AgendaCtx.Provider>;
}

export function useAgenda(): Ctx {
  const v = useContext(AgendaCtx);
  if (!v) throw new Error('AgendaProvider is missing');
  return v;
}
