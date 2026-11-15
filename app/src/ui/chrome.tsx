import React from 'react';
import { View, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from './Text';
import { Icon, Mark, type IconName } from './Icon';
import { Tap } from './Pressable';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import type { ColorRole } from '@/theme/brand';

/** Page margin used by every screen. */
export const GUTTER = 20;

function RoundButton({ icon, label, onPress, tone = 'plain', onPhoto }: { icon: IconName; label: string; onPress: () => void; tone?: 'plain' | 'danger'; onPhoto?: boolean }) {
  const { c } = useTheme();
  // Over a photograph every control gets a solid backing, so it never depends on the image for contrast.
  const bg = tone === 'danger' ? c.danger : onPhoto ? c.bg : c.surface;
  const fg: ColorRole = tone === 'danger' ? 'onDanger' : 'text';
  return (
    <Tap onPress={onPress} accessibilityLabel={label} style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: bg }}>
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
        style={{ flexDirection: 'row', alignItems: 'center', gap: 9, flexShrink: 1, paddingLeft: 6, paddingRight: 14, height: 44, borderRadius: 22, backgroundColor: onPhoto ? c.bg : 'transparent' }}>
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

/**
 * Bottom navigation (v1.2, D77). The standard pattern people know from every
 * major app: a full-width bar fixed to the bottom, five equal columns, an
 * icon above a label. The selected tab is shown by a soft green pill BEHIND
 * THE ICON ONLY and by its label turning green and bold. The label is never
 * inside a tile, so its width can never clip it — the fault in both earlier
 * versions. No border: the bar is lifted from the page by a soft shadow.
 */
export function TabBar({ items }: { items: TabItem[] }) {
  const { c, dark } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const col = Math.min(width, 640) / Math.max(items.length, 1);
  // Sized from the column so the longest label ("Programme") always fits; never from the system font scale.
  const size = Math.min(12.5, col / 6.4);
  return (
    <View style={{ width, backgroundColor: c.bg, alignItems: 'center', paddingTop: 8, paddingBottom: Math.max(insets.bottom, 8),
      shadowColor: '#0B4F47', shadowOpacity: dark ? 0.4 : 0.1, shadowRadius: 14, shadowOffset: { width: 0, height: -4 }, elevation: 12 }}>
      <View accessibilityRole="tablist" style={{ flexDirection: 'row', width: col * items.length }}>
        {items.map((it) => (
          <Tap key={it.key} onPress={it.onPress} minTarget={false} accessibilityRole="tab" accessibilityState={{ selected: it.focused }} accessibilityLabel={it.label}
            style={{ width: col, minHeight: 58, alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <View style={{ width: 60, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: it.focused ? c.primarySoft : 'transparent' }}>
              <Icon name={it.icon} size={22} color={it.focused ? 'onPrimarySoft' : 'textSecondary'} stroke={it.focused ? 2.2 : 1.8} />
            </View>
            <Text variant="caption" weight={it.focused ? 700 : 500} color={it.focused ? 'primary' : 'textSecondary'} numberOfLines={1} allowFontScaling={false} style={{ fontSize: size, lineHeight: Math.round(size * 1.3), width: col - 4, textAlign: 'center' }}>{it.label}</Text>
          </Tap>
        ))}
      </View>
    </View>
  );
}
