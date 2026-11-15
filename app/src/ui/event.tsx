import React from 'react';
import { View, Platform, Image as RNImage } from 'react-native';
import { Image } from 'expo-image';
import { tick } from './haptic';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { Text } from './Text';
import { Icon } from './Icon';
import { Tap } from './Pressable';
import { PHOTOS, type PhotoName } from './photos';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { useAgenda } from '@/state/agenda';
import type { Session } from '@/data/types';
import { phaseOf, type Phase } from '@/data/time';

/** A bundled photograph. Decorative by default: the words beside it carry the meaning. */
export function Photo({ name, height, radius = 0, dim, hero }: { name: PhotoName; height: number; radius?: number; dim?: boolean; hero?: boolean }) {
  // A hero photograph runs edge to edge and curves away at the bottom; an inline one is rounded all round.
  const style = { width: '100%', height, borderRadius: hero ? 0 : radius, borderBottomLeftRadius: hero ? 32 : radius, borderBottomRightRadius: hero ? 32 : radius, opacity: dim ? 0.45 : 1 } as const;
  // On the web render the framework's own image element is used, because it marks a decorative
  // image correctly for assistive technology; on phones expo-image gives caching and a soft fade-in.
  if (Platform.OS === 'web') {
    return <RNImage source={PHOTOS[name]} resizeMode="cover" accessible={false} aria-hidden style={style} />;
  }
  return (
    <Image source={PHOTOS[name]} contentFit="cover" transition={180} accessible={false} accessibilityElementsHidden importantForAccessibility="no" style={style} />
  );
}

/**
 * Status row under a hero photograph: a short label on the left and the
 * "saved offline" mark on the right. (Up to version 0.5.0 an amber line sat
 * above it; rules and lines were removed in v1.2, D77.)
 */
export function HorizonLine({ left, right }: { left?: string; right?: React.ReactNode; progress?: number; muted?: boolean }) {
  const { prefs } = usePrefs();
  // With enlarged text the two labels stack instead of squeezing each other off the screen.
  const stacked = prefs.textScale >= 1.3;
  if (!left && !right) return null;
  return (
    <View style={{ flexDirection: stacked ? 'column' : 'row', justifyContent: 'space-between', alignItems: stacked ? 'flex-start' : 'center', gap: stacked ? 6 : 10, paddingHorizontal: 20, paddingTop: 16 }}>
      {left ? <Text variant="label" upper color="textSecondary" style={stacked ? undefined : { flex: 1 }}>{left}</Text> : <View style={{ flex: 1 }} />}
      {right}
    </View>
  );
}

/** "Saved offline" — offline shown as a mark of quality, not an apology. A small soft-green pill. */
export function SavedMark({ compact }: { compact?: boolean }) {
  const { c } = useTheme();
  const { t } = useT();
  return (
    <View accessible accessibilityLabel={t('offline.savedLong')} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flexShrink: 0, backgroundColor: c.successBg, borderRadius: 999, paddingHorizontal: compact ? 8 : 10, paddingVertical: 5 }}>
      <Icon name="circle-check" size={14} color="success" stroke={2.4} />
      <Text variant="label" color="success" numberOfLines={1} style={{ letterSpacing: 0 }}>{t('offline.saved')}</Text>
    </View>
  );
}

/**
 * Save / unsave a session. The one rewarding animation in the app: the
 * bookmark fills and overshoots slightly, with a single haptic tick.
 */
export function SaveToggle({ id, title, size = 24 }: { id: string; title: string; size?: number }) {
  const { isSaved, toggle } = useAgenda();
  const { prefs } = usePrefs();
  const { t } = useT();
  const { c } = useTheme();
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  const on = isSaved(id);
  return (
    <Tap
      onPress={() => {
        const nowSaved = toggle(id);
        tick(nowSaved ? 'confirm' : 'undo');
        if (!prefs.reduceMotion && nowSaved) scale.set(withSequence(withTiming(0.8, { duration: 80 }), withSpring(1, { damping: 7, stiffness: 260 })));
      }}
      accessibilityLabel={`${t(on ? 'session.unsave' : 'session.save')}: ${title}`}
      accessibilityState={{ selected: on }}
      aria-pressed={on}
      style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={style}>
        <Icon name="bookmark" size={size} color={on ? 'line' : 'textTertiary'} stroke={on ? 2.4 : 1.8} fill={on ? c.line : undefined} />
      </Animated.View>
    </Tap>
  );
}

/** Small capsule for live / access states. Icon plus words; colour is never the only signal. */
export function Tag({ kind, label }: { kind: 'live' | 'next' | 'public' | 'restricted' | 'ended'; label: string }) {
  const { c } = useTheme();
  const map = {
    live: { bg: c.dangerBg, fg: 'danger', icon: 'radio' },
    next: { bg: c.accent, fg: 'onAccent', icon: 'clock' },
    public: { bg: c.successBg, fg: 'success', icon: 'check' },
    restricted: { bg: c.surface, fg: 'textSecondary', icon: 'ticket' },
    ended: { bg: c.surface, fg: 'textSecondary', icon: 'circle-check' },
  } as const;
  const m = map[kind];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: m.bg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start' }}>
      <Icon name={m.icon} size={13} color={m.fg} stroke={2.4} />
      <Text variant="label" color={m.fg} style={{ letterSpacing: 0 }}>{label}</Text>
    </View>
  );
}

export function accessKey(a: Session['access']) {
  return ({ public: 'access.public', accredited: 'access.accredited', registration: 'access.registration', unknown: 'access.unknown' } as const)[a];
}

/**
 * Timetable row: the time is the strongest element, then the title, then one
 * line of meta. Rows are separated by hairlines, not boxed — a programme, not
 * a stack of cards. `index` staggers the entrance (40 ms apart, capped).
 */
export function SessionRow({ session, now, onPress, index = 0, showDay }: { session: Session; now: { day: number; time: string } | null; onPress: () => void; index?: number; showDay?: boolean }) {
  const { c, motion } = useTheme();
  const { prefs } = usePrefs();
  const { t } = useT();
  // Without a live clock (the default, pre-event view) every session is simply listed.
  const phase: Phase = now ? phaseOf(session, now) : 'upcoming';
  const ended = phase === 'ended';
  const meta = [session.format, session.room, t(accessKey(session.access))].join(' · ');
  // At large text sizes the time moves above the title instead of squeezing beside it.
  const stacked = prefs.textScale >= 1.5;
  const row = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
     <View style={{ flex: 1, flexDirection: stacked ? 'column' : 'row', alignItems: stacked ? 'flex-start' : 'center', gap: stacked ? 6 : 14 }}>
      <View style={{ width: stacked ? undefined : Math.round(70 * Math.min(prefs.textScale, 1.3)), alignItems: stacked ? 'flex-start' : 'stretch', gap: 4 }}>
        {/* The time sits on a soft pill: it gives the list its rhythm without any dividing line. */}
        <View style={{ backgroundColor: phase === 'live' ? c.dangerBg : c.surface, borderRadius: 14, paddingVertical: 8, paddingHorizontal: 8, alignItems: 'center' }}>
          {showDay ? <Text variant="label" color="textSecondary" style={{ letterSpacing: 0 }}>{t('programme.day', { d: session.day })}</Text> : null}
          <Text variant="headline" weight={700} tabular color={ended ? 'textTertiary' : phase === 'live' ? 'danger' : 'text'}>{session.start}</Text>
          {phase === 'live' ? <Text variant="label" color="danger" style={{ letterSpacing: 0 }}>{t('phase.live')}</Text> : null}
        </View>
      </View>
      <Tap onPress={onPress} minTarget={false} accessibilityLabel={`${session.start}. ${session.title.en}. ${meta}${ended ? `. ${t('phase.ended')}` : ''}`} style={{ flex: 1, gap: 3, minHeight: 48, justifyContent: 'center' }}>
        <Text variant="headline" weight={ended ? 400 : 600} color={ended ? 'textSecondary' : 'text'}>{session.title.en}</Text>
        <Text variant="footnote" color={ended ? 'textTertiary' : 'textSecondary'}>{ended ? `${meta} · ${t('phase.ended')}` : meta}</Text>
      </Tap>
     </View>
      <View style={{ marginRight: -12 }}>
        <SaveToggle id={session.id} title={session.title.en} />
      </View>
    </View>
  );
  const delay = Math.min(index * motion.stagger, motion.staggerMax);
  return (
    <View>
      {prefs.reduceMotion ? row : <Animated.View entering={FadeInDown.duration(motion.base).delay(delay)}>{row}</Animated.View>}
    </View>
  );
}

/**
 * Venue plan — an ORIGINAL schematic, not a real venue (the venue is not announced).
 * Nearly monochrome; the selected place is the only filled shape.
 */
export function venuePlanSvg(c: Record<string, string>, selected: string | null): string {
  const fill = (id: string) => (selected === id ? c.ink : c.bg);
  const text = (id: string) => (selected === id ? c.onInk : c.text);
  const shape = (id: string, x: number, y: number, w: number, h: number) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${fill(id)}"/>`;
  const label = (id: string, x: number, y: number, t: string) => `<text x="${x}" y="${y}" font-family="Instrument-600, sans-serif" font-weight="600" font-size="13" text-anchor="middle" fill="${text(id)}">${t}</text>`;
  const gate = (id: string, x: number, y: number, t: string) => `<circle cx="${x}" cy="${y}" r="10" fill="${selected === id ? c.accent : c.primarySoft}"/><circle cx="${x}" cy="${y}" r="4" fill="${c.ink}"/><text x="${x + 17}" y="${y + 4}" font-family="Instrument-600, sans-serif" font-weight="600" font-size="12" fill="${c.textSecondary}">${t}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 290">
<rect width="350" height="290" fill="${c.surface}"/>
<g stroke="${c.surfaceAlt}" stroke-width="18" stroke-linecap="round" fill="none"><path d="M-10 40 L360 40"/><path d="M-10 262 L360 262"/><path d="M30 -10 L30 300"/><path d="M320 -10 L320 300"/></g>
${shape('hallA', 58, 62, 112, 84)}${label('hallA', 114, 109, 'Hall A')}
${shape('hallB', 180, 62, 112, 84)}${label('hallB', 236, 109, 'Hall B')}
${shape('rooms', 58, 156, 92, 76)}${label('rooms', 104, 199, 'Rooms 1–3')}
${shape('court', 160, 156, 132, 46)}${label('court', 226, 184, 'Courtyard')}
${shape('reg', 160, 210, 96, 26)}${label('reg', 208, 228, 'Registration')}
${gate('gate1', 150, 40, 'Gate 1')}${gate('gate2', 262, 262, 'Gate 2')}
</svg>`;
}

/** The "now" marker between sessions: a small amber pill with the time. */
export function NowLine({ time }: { time: string }) {
  const { c } = useTheme();
  const { t } = useT();
  return (
    <View accessible accessibilityLabel={`${t('phase.now')} ${time}`} style={{ flexDirection: 'row', paddingVertical: 6 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: c.accent, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 }}>
        <Icon name="clock" size={14} color="onAccent" stroke={2.4} />
        <Text variant="footnote" weight={700} color="onAccent" tabular>{`${t('phase.now')} · ${time}`}</Text>
      </View>
    </View>
  );
}
