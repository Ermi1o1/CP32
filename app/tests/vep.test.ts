import { describe, expect, it } from 'vitest';
import { resolveVep, vepUrlFor } from '../src/config/vep';

describe('VEP configuration', () => {
  it('is unconfigured when no URL is set', () => {
    const cfg = resolveVep({});
    expect(cfg.lobby).toBeNull();
    expect(vepUrlFor(cfg, 's01')).toBeNull();
  });
  it('accepts only https lobby addresses', () => {
    expect(resolveVep({ url: 'http://vep.example/lobby' }).lobby).toBeNull();
    expect(resolveVep({ url: 'not a url' }).lobby).toBeNull();
    expect(resolveVep({ url: ' https://vep.example/lobby ' }).lobby).toBe('https://vep.example/lobby');
  });
  it('opens the lobby for a session when no per-session template is set', () => {
    const cfg = resolveVep({ url: 'https://vep.example/lobby' });
    expect(vepUrlFor(cfg, 's07')).toBe('https://vep.example/lobby');
  });
  it('fills a per-session template, encoded', () => {
    const cfg = resolveVep({ url: 'https://vep.example/lobby', session: 'https://vep.example/s/{id}' });
    expect(vepUrlFor(cfg, 's07')).toBe('https://vep.example/s/s07');
    expect(vepUrlFor(cfg, 'a b')).toBe('https://vep.example/s/a%20b');
    expect(vepUrlFor(cfg)).toBe('https://vep.example/lobby');
  });
  it('ignores a template without {id} or not https', () => {
    expect(resolveVep({ session: 'https://vep.example/s/' }).sessionTemplate).toBeNull();
    expect(resolveVep({ session: 'http://vep.example/s/{id}' }).sessionTemplate).toBeNull();
  });
});
