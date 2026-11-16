import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { tokens } from './tokens.generated';
import { BRANDS, paletteFor, type Brand, type Palette } from './brand';
import { DEFAULT_PREFS, loadPrefs, savePrefs, type Prefs } from '@/state/prefs';

export interface Theme {
  dark: boolean;
  c: Palette;
  brand: Brand;
  space: typeof tokens.space;
  radius: typeof tokens.radius;
  motion: typeof tokens.motion;
  layout: typeof tokens.layout;
}

interface Ctx {
  theme: Theme;
  prefs: Prefs;
  ready: boolean;
  setPrefs: (patch: Partial<Prefs>) => void;
}

const ThemeCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [prefs, setState] = useState<Prefs>(DEFAULT_PREFS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    loadPrefs().then((p) => {
      if (alive) {
        setState(p);
        setReady(true);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  const setPrefs = useCallback((patch: Partial<Prefs>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      void savePrefs(next);
      return next;
    });
  }, []);

  const dark = prefs.mode === 'system' ? system === 'dark' : prefs.mode === 'dark';

  const theme = useMemo<Theme>(
    () => ({
      dark,
      c: paletteFor(prefs.brand, dark ? 'dark' : 'light'),
      brand: BRANDS[prefs.brand],
      space: tokens.space,
      radius: tokens.radius,
      motion: tokens.motion,
      layout: tokens.layout,
    }),
    [dark, prefs.brand],
  );

  const value = useMemo(() => ({ theme, prefs, ready, setPrefs }), [theme, prefs, ready, setPrefs]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

function useCtx(): Ctx {
  const v = useContext(ThemeCtx);
  if (!v) throw new Error('AppProvider is missing');
  return v;
}
export const useTheme = (): Theme => useCtx().theme;
export const usePrefs = () => {
  const { prefs, setPrefs, ready } = useCtx();
  return { prefs, setPrefs, ready };
};
