import React, { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { View, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from './Text';
import { Icon, Mark, type IconName } from './Icon';
import { Tap } from './Pressable';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import type { ColorRole } from '@/theme/brand';
import { lift } from './lift';
import { tick } from './haptic';

/** Page margin used by every screen. */
export const GUTTER = 20;

function RoundButton({ icon, label, onPress, tone = 'plain' }: { icon: IconName; label: string; onPress: () => void; tone?: 'plain' | 'danger'; onPhoto?: boolean }) {
  const { c, dark } = useTheme();
  // A raised white disc (v1.4): it stands off the tinted page and off a photograph alike.
  const bg = tone === 'danger' ? c.danger : c.surface;
  const fg: ColorRole = tone === 'danger' ? 'onDanger' : 'text';
  return (
    <Tap onPress={onPress} accessibilityLabel={label} style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: bg, ...lift(dark, 1) }}>
        <Icon name={icon} size={21} color={fg} stroke={2} />
      </View>
    </Tap>
  );
}

/**
 * Header for the five tab roots. Brand on the left; search, Emergency (always
 * one tap away, D44) and profile on the right. Identical on every tab; on Home
 * it floats over the photograph with solid-backed controls.
 */
export function AppHeader({ onPhoto }: { onPhoto?: boolean }) {
  const { c, brand } = useTheme();
  const { prefs } = usePrefs();
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  // The header name is a label for the mark and stops growing at 130%; the page title carries full size.
  const k = Math.min(prefs.textScale, 1.3);
  return (
    <View style={{ paddingTop: insets.top + 8, paddingBottom: 8, paddingLeft: GUTTER - 6, paddingRight: GUTTER - 14, backgroundColor: onPhoto ? 'transparent' : c.bg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <View accessible accessibilityRole="header" accessibilityLabel={brand.name}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 9, flexShrink: 1, paddingLeft: 6, paddingRight: 14, height: 44, borderRadius: 22, backgroundColor: onPhoto ? c.surface : 'transparent' }}>
        <View style={{ flexShrink: 0 }}><Mark size={28} /></View>
        <Text variant="title3" numberOfLines={1} maxFontSizeMultiplier={1.3} style={{ flexShrink: 1, fontSize: Math.round(18 * k), lineHeight: Math.round(24 * k) }}>{brand.name}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <RoundButton icon="search" label={t('a11y.search')} onPress={() => router.push('/search')} onPhoto={onPhoto} />
        <RoundButton icon="siren" label={t('a11y.emergency')} onPress={() => router.push('/guide/emergency')} tone="danger" />
        <RoundButton icon="circle-user-round" label={t('a11y.settings')} onPress={() => router.push('/settings')} onPhoto={onPhoto} />
      </View>
    </View>
  );
}

/** Header for pushed screens and sheets: back or close, then the title. `onPhoto` floats it over a hero image. */
export function SubHeader({ title, close, onPhoto, right }: { title?: string; close?: boolean; onPhoto?: boolean; right?: React.ReactNode }) {
  const { c } = useTheme();
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View style={{ paddingTop: insets.top + 8, paddingBottom: 8, paddingHorizontal: GUTTER - 14, backgroundColor: onPhoto ? 'transparent' : c.bg, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <RoundButton icon={close ? 'x' : 'chevron-left'} label={t(close ? 'a11y.close' : 'a11y.back')} onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} onPhoto={onPhoto} />
      {title ? <Text variant="headline" weight={700} accessibilityRole="header" numberOfLines={1} style={{ flex: 1 }}>{title}</Text> : <View style={{ flex: 1 }} />}
      {right}
    </View>
  );
}

/**
 * Screen title (v1.1): the ONE title style for every screen — display face,
 * same size, same position — with an optional line of supporting text and an
 * optional status on the right (the "saved offline" mark on the tab roots).
 */
export function ScreenTitle({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <View style={{ gap: 4, paddingTop: 2, paddingBottom: 6 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', columnGap: 12, rowGap: 2 }}>
        <Text variant="display" accessibilityRole="header" style={{ flexShrink: 1 }}>{title}</Text>
        {right ? <View style={{ paddingBottom: 7 }}>{right}</View> : null}
      </View>
      {sub ? <Text variant="subhead" color="textSecondary">{sub}</Text> : null}
    </View>
  );
}

/**
 * Scrolling page body with the standard gutter and the standard screen title.
 * Content is capped at the tablet reading width and centred.
 */
export function Page({ title, sub, right, children }: { title?: string; sub?: string; right?: React.ReactNode; children: React.ReactNode }) {
  const { c, layout } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      // Keyboard users must be able to scroll pages that hold no focusable control (WCAG 2.1.1).
      {...(Platform.OS === 'web' ? { tabIndex: 0 as const } : null)}
      style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ paddingHorizontal: GUTTER, paddingTop: 2, paddingBottom: 28 + insets.bottom, alignItems: 'center' }}>
      <View style={{ width: '100%', maxWidth: layout.maxContentWidth, gap: 12 }}>
        {title ? <ScreenTitle title={title} sub={sub} right={right} /> : null}
        {children}
      </View>
    </ScrollView>
  );
}

export interface TabItem { key: string; label: string; icon: IconName; focused: boolean; onPress: () => void }

const DISC = 54;
const BAR_H = 66;

/** One tab's icon. When its tab is selected it rises onto the green disc with a small spring. */
function TabIcon({ icon, focused, still }: { icon: IconName; focused: boolean; still: boolean }) {
  const y = useSharedValue(focused ? -15 : 0);
  useEffect(() => {
    const to = focused ? -15 : 0;
    y.set(still ? to : withSpring(to, { damping: 13, stiffness: 210, mass: 0.7 }));
  }, [focused, still, y]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.get() }, { scale: 1 + (y.get() / -15) * 0.08 }] }));
  return (
    <Animated.View style={[{ position: 'absolute', top: 14, height: 24, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Icon name={icon} size={23} color={focused ? 'onInk' : 'textSecondary'} stroke={focused ? 2.2 : 1.8} />
    </Animated.View>
  );
}

/**
 * Bottom navigation (v1.4, D79): a floating white bar with a raised disc.
 * The bar is a rounded white block lifted off the tinted page by a shadow and
 * inset from the screen edges. ONE deep-green disc marks the selected tab: it
 * stands proud of the bar's top edge, slides to the tab you tap with a
 * spring, and stretches sideways for a moment as it travels. The selected
 * icon rises onto the disc; its label turns green and bold. Labels sit below
 * the icons, never inside a shape, and take their size from the column, so
 * they cannot clip (the fault of versions 0.2.0 to 0.5.0). All movement is
 * removed when "Reduce motion" is on.
 */
export function TabBar({ items }: { items: TabItem[] }) {
  const { c, dark } = useTheme();
  const { prefs } = usePrefs();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const barW = Math.min(width, 640) - 24;
  const col = barW / Math.max(items.length, 1);
  // Sized from the column so the longest label ("Programme") always fits; never from the system font scale.
  const size = Math.min(12, col / 6.4);
  const active = Math.max(0, items.findIndex((it) => it.focused));
  const target = col * active + (col - DISC) / 2;
  const still = prefs.reduceMotion;
  const x = useSharedValue(target);
  const stretch = useSharedValue(1);
  useEffect(() => {
    if (still) { x.set(target); return; }
    x.set(withSpring(target, { damping: 15, stiffness: 180, mass: 0.8 }));
    stretch.set(withSequence(withTiming(1.28, { duration: 110 }), withSpring(1, { damping: 9, stiffness: 220 })));
  }, [target, still, x, stretch]);
  const disc = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }, { scaleX: stretch.get() }, { scaleY: 1 - (stretch.get() - 1) * 0.45 }] }));
  return (
    <View style={{ width, backgroundColor: c.bg, alignItems: 'center', paddingTop: 20, paddingBottom: Math.max(insets.bottom, 10) }}>
      <View style={{ width: barW, height: BAR_H, borderRadius: BAR_H / 2, backgroundColor: c.surface, ...lift(dark, 3) }}>
        <Animated.View style={[{ position: 'absolute', left: 0, top: -16, width: DISC, height: DISC, borderRadius: DISC / 2, backgroundColor: c.ink, ...lift(dark, 2) }, disc]} />
        <View accessibilityRole="tablist" style={{ flexDirection: 'row', height: BAR_H }}>
          {items.map((it) => (
            <Tap key={it.key} onPress={() => { if (!it.focused) tick('select'); it.onPress(); }} minTarget={false} accessibilityRole="tab" accessibilityState={{ selected: it.focused }} accessibilityLabel={it.label}
              style={{ width: col, height: BAR_H, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9 }}>
              <TabIcon icon={it.icon} focused={it.focused} still={still} />
              <Text variant="caption" weight={it.focused ? 700 : 500} color={it.focused ? 'primary' : 'textSecondary'} numberOfLines={1} allowFontScaling={false} style={{ fontSize: size, lineHeight: Math.round(size * 1.3), width: col - 2, textAlign: 'center' }}>{it.label}</Text>
            </Tap>
          ))}
        </View>
      </View>
    </View>
  );
}
