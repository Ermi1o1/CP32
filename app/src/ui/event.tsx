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
  const color = muted ? c.border : c.line;
  return (
    <View>
      <View style={{ height: 3, backgroundColor: color }}>
        {progress !== undefined ? (
          <View style={{ position: 'absolute', left: `${Math.round(progress * 100)}%`, top: -5, marginLeft: -7, width: 14, height: 14, borderRadius: 7, backgroundColor: c.bg, borderWidth: 3, borderColor: color }} />
        ) : null}
      </View>
      {left || right ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6, paddingHorizontal: 20, paddingTop: 10 }}>
          {left ? <Text variant="label" upper color="text" style={{ flexShrink: 1 }}>{left}</Text> : <View />}
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
    <View accessible accessibilityLabel={t('offline.saved')} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flexShrink: 1, maxWidth: '100%' }}>
      <Icon name="circle-check" size={compact ? 14 : 16} color="success" stroke={2.4} />
      <Text variant="label" upper color="success" style={{ flexShrink: 1 }}>{t('offline.saved')}</Text>
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
export function SessionRow({ session, now, onPress, index = 0 }: { session: Session; now: { day: number; time: string }; onPress: () => void; index?: number }) {
  const { c, motion } = useTheme();
  const { prefs } = usePrefs();
  const { t } = useT();
  const phase: Phase = phaseOf(session, now);
  const ended = phase === 'ended';
  const meta = [session.format, session.room, t(accessKey(session.access))].join(' · ');
  // At large text sizes the time moves above the title instead of squeezing beside it.
  const stacked = prefs.textScale >= 1.5;
  const row = (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14, paddingVertical: 14, paddingLeft: 20 }}>
     <View style={{ flex: 1, flexDirection: stacked ? 'column' : 'row', gap: stacked ? 4 : 14 }}>
      <View style={{ width: stacked ? undefined : Math.round(58 * prefs.textScale), paddingTop: 2, flexDirection: stacked ? 'row' : 'column', alignItems: stacked ? 'center' : 'flex-start', gap: stacked ? 8 : 0 }}>
        {/* Ended sessions step back through colour roles that still pass AA — never through opacity. */}
        <Text variant="headline" weight={800} tabular color={ended ? 'textTertiary' : 'text'}>{session.start}</Text>
        {phase === 'live' ? <View style={{ marginTop: stacked ? 0 : 5 }}><Tag kind="live" label={t('phase.live')} /></View> : null}
      </View>
      <Tap onPress={onPress} minTarget={false} accessibilityLabel={`${session.start}. ${session.title.en}. ${meta}${ended ? `. ${t('phase.ended')}` : ''}`} style={{ flex: 1, gap: 3, minHeight: 48, justifyContent: 'center' }}>
        <Text variant="headline" weight={ended ? 400 : 700} color={ended ? 'textSecondary' : 'text'}>{session.title.en}</Text>
        <Text variant="footnote" color={ended ? 'textTertiary' : 'textSecondary'}>{ended ? `${meta} · ${t('phase.ended')}` : meta}</Text>
      </Tap>
     </View>
      <View style={{ paddingRight: 8 }}>
        <SaveToggle id={session.id} title={session.title.en} />
      </View>
    </View>
  );
  const delay = Math.min(index * motion.stagger, motion.staggerMax);
  return (
    <View>
      {prefs.reduceMotion ? row : <Animated.View entering={FadeInDown.duration(motion.base).delay(delay)}>{row}</Animated.View>}
      <View style={{ height: 1, backgroundColor: c.divider, marginLeft: 20 }} />
    </View>
  );
}

/** The "now" marker between sessions: the same line as everywhere else, with the time. */
export function NowLine({ time }: { time: string }) {
  const { c } = useTheme();
  const { t } = useT();
  return (
    <View accessible accessibilityLabel={`${t('phase.now')} ${time}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingLeft: 20, paddingRight: 20, paddingVertical: 6 }}>
      <Text variant="label" upper style={{ minWidth: 58 }}>{t('phase.now')}</Text>
      <View style={{ flex: 1, height: 3, backgroundColor: c.line }} />
      <Text variant="footnote" weight={800} tabular>{time}</Text>
    </View>
  );
}
