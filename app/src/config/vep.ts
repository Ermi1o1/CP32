/**
 * Virtual Event Platform (VEP) configuration.
 *
 * The VEP is a separate web product; the app only opens it. Its address is
 * build configuration, never written into a screen, so that pointing the app
 * at a public demo lobby (or a custom domain) is a change to the environment,
 * not to code. See app/.env.example.
 *
 *   EXPO_PUBLIC_VEP_URL            Lobby address (https only). Unset = the
 *                                  "Join virtually" entry points explain that
 *                                  virtual attendance is not configured.
 *   EXPO_PUBLIC_VEP_SESSION_URL    Optional per-session address containing
 *                                  "{id}", e.g. https://vep.example/s/{id}.
 *                                  Unset = every session opens the lobby.
 *
 * Expo inlines EXPO_PUBLIC_* at build time, so each variable must be read by
 * its literal name below.
 */

export interface VepConfig {
  /** Lobby URL, or null when VEP is not configured for this build. */
  lobby: string | null;
  /** Per-session URL template containing "{id}", or null. */
  sessionTemplate: string | null;
}

function httpsOrNull(raw: string | undefined): string | null {
  const v = raw?.trim();
  if (!v) return null;
  try {
    const u = new URL(v);
    return u.protocol === 'https:' ? u.toString() : null;
  } catch {
    return null;
  }
}

export function resolveVep(env: { url?: string; session?: string }): VepConfig {
  const lobby = httpsOrNull(env.url);
  const tmpl = env.session?.trim();
  const sessionTemplate = tmpl && tmpl.includes('{id}') && httpsOrNull(tmpl.replace('{id}', 'x')) ? tmpl : null;
  return { lobby, sessionTemplate };
}

/** The address to open: a session's own room if a template is set, else the lobby. */
export function vepUrlFor(cfg: VepConfig, sessionId?: string): string | null {
  if (sessionId && cfg.sessionTemplate) return cfg.sessionTemplate.replace('{id}', encodeURIComponent(sessionId));
  return cfg.lobby;
}

export const VEP: VepConfig = resolveVep({
  url: process.env.EXPO_PUBLIC_VEP_URL,
  session: process.env.EXPO_PUBLIC_VEP_SESSION_URL,
});
