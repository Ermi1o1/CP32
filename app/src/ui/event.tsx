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
export function Photo({ name, height, radius = 0, dim }: { name: PhotoName; height: number; radius?: number; dim?: boolean }) {
  const style = { width: '100%', height, borderRadius: radius, opacity: dim ? 0.45 : 1 } as const;
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
 * THE LINE — the app's signature (D73).
 *
 * One thin amber line means "time" everywhere: it is the horizon under every
 * hero photograph, the "now" marker in the programme, and on Home it carries a
 * dot showing how far through the day we are. Labels always sit BELOW the line
 * on the page colour, never on the photograph.
 */
export function HorizonLine({ left, right, progress, muted }: { left?: string; right?: React.ReactNode; progress?: number; muted?: boolean }) {
  const { c } = useTheme();
  const { prefs } = usePrefs();
  // With enlarged text the two labels stack instead of squeezing each other off the screen.
  const stacked = prefs.textScale >= 1.3;
  const color = muted ? c.border : c.line;
  return (
    <View>
      <View style={{ height: 3, backgroundColor: color }}>
        {progress !== undefined ? (
          <View style={{ position: 'absolute', left: `${Math.round(progress * 100)}%`, top: -5, marginLeft: -7, width: 14, height: 14, borderRadius: 7, backgroundColor: c.bg, borderWidth: 3, borderColor: color }} />
        ) : null}
      </View>
      {left || right ? (
        <View style={{ flexDirection: stacked ? 'column' : 'row', justifyContent: 'space-between', alignItems: stacked ? 'flex-start' : 'center', gap: stacked ? 4 : 10, paddingHorizontal: 20, paddingTop: 10 }}>
          {left ? <Text variant="label" upper color="text" style={stacked ? undefined : { flex: 1 }}>{left}</Text> : <View style={{ flex: 1 }} />}
          {right}
        </View>
      ) : null}
    </View>
  );
}

/** "Saved on this phone" — offline shown as a mark of quality, not an apology. */
export function SavedMark({ compact }: { compact?: boolean }) {
  const { t } = useT();
  return (
    <View accessible accessibilityLabel={t('offline.savedLong')} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flexShrink: 0 }}>
      <Icon name="circle-check" size={compact ? 14 : 15} color="success" stroke={2.4} />
      <Text variant="label" upper color="success" numberOfLines={1}>{t('offline.saved')}</Text>
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
    restricted: { bg: c.surfaceAlt, fg: 'textSecondary', icon: 'ticket' },
    ended: { bg: c.surfaceAlt, fg: 'textSecondary', icon: 'circle-check' },
  } as const;
  const m = map[kind];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: m.bg, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, alignSelf: 'flex-start' }}>
      <Icon name={m.icon} size={12} color={m.fg} stroke={2.6} />
      <Text variant="label" upper color={m.fg}>{label}</Text>
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
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 14 }}>
     <View style={{ flex: 1, flexDirection: stacked ? 'column' : 'row', gap: stacked ? 4 : 14 }}>
      <View style={{ width: stacked ? undefined : Math.round(58 * prefs.textScale), paddingTop: 2, flexDirection: stacked ? 'row' : 'column', alignItems: stacked ? 'center' : 'flex-start', gap: stacked ? 8 : 0 }}>
        {/* Ended sessions step back through colour roles that still pass AA — never through opacity. */}
        {showDay ? <Text variant="label" upper color="textSecondary">{t('programme.day', { d: session.day })}</Text> : null}
        <Text variant="title3" tabular color={ended ? 'textTertiary' : 'text'}>{session.start}</Text>
        {phase === 'live' ? <View style={{ marginTop: stacked ? 0 : 5 }}><Tag kind="live" label={t('phase.live')} /></View> : null}
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
      <View style={{ height: 1, backgroundColor: c.divider }} />
    </View>
  );
}

/**
 * Venue plan — an ORIGINAL schematic, not a real venue (the venue is not announced).
 * Nearly monochrome; the selected place is the only filled shape.
 */
export function venuePlanSvg(c: Record<string, string>, selected: string | null): string {
  const fill = (id: string) => (selected === id ? c.ink : c.surface);
  const text = (id: string) => (selected === id ? c.onInk : c.text);
  const shape = (id: string, d: string) => `<path d="${d}" fill="${fill(id)}" stroke="${c.text}" stroke-width="1.5" stroke-linejoin="round"/>`;
  const label = (id: string, x: number, y: number, t: string) => `<text x="${x}" y="${y}" font-family="Instrument-600, sans-serif" font-weight="600" font-size="13" text-anchor="middle" fill="${text(id)}">${t}</text>`;
  const gate = (id: string, x: number, y: number, t: string) => `<circle cx="${x}" cy="${y}" r="9" fill="${selected === id ? c.line : c.bg}" stroke="${c.text}" stroke-width="2"/><text x="${x + 16}" y="${y + 4}" font-family="Instrument-600, sans-serif" font-weight="600" font-size="12" fill="${c.text}">${t}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 300">
<rect width="350" height="300" fill="${c.surfaceAlt}"/>
<g stroke="${c.bg}" stroke-width="20" stroke-linecap="round" fill="none"><path d="M-10 46 L360 34"/><path d="M-10 268 L360 256"/><path d="M36 -10 L24 310"/><path d="M322 -10 L310 310"/></g>
${shape('hallA', 'M62 66 L170 62 L172 142 L64 146Z')}${label('hallA', 117, 109, 'Hall A')}
${shape('hallB', 'M186 61 L288 57 L290 138 L188 142Z')}${label('hallB', 238, 104, 'Hall B')}
${shape('rooms', 'M66 160 L150 157 L152 228 L68 231Z')}${label('rooms', 109, 199, 'Rooms 1–3')}
${shape('court', 'M166 156 L290 152 L292 204 L168 208Z')}${label('court', 229, 185, 'Courtyard')}
${shape('reg', 'M168 218 L250 215 L251 240 L169 243Z')}${label('reg', 210, 234, 'Registration')}
${gate('gate1', 150, 40, 'Gate 1')}${gate('gate2', 262, 258, 'Gate 2')}
</svg>`;
}

/** The "now" marker between sessions: the same line as everywhere else, with the time. */
export function NowLine({ time }: { time: string }) {
  const { c } = useTheme();
  const { t } = useT();
  return (
    <View accessible accessibilityLabel={`${t('phase.now')} ${time}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
      <Text variant="label" upper style={{ minWidth: 58 }}>{t('phase.now')}</Text>
      <View style={{ flex: 1, height: 3, backgroundColor: c.line }} />
      <Text variant="footnote" weight={700} tabular>{time}</Text>
    </View>
  );
}
