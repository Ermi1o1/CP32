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

function RoundButton({ icon, label, onPress, tone = 'plain', onPhoto }: { icon: IconName; label: string; onPress: () => void; tone?: 'plain' | 'danger'; onPhoto?: boolean }) {
  const { c } = useTheme();
  // Over a photograph every control gets a solid backing, so it never depends on the image for contrast.
  const bg = tone === 'danger' ? c.danger : onPhoto ? c.surface : c.fill;
  const fg: ColorRole = tone === 'danger' ? 'onDanger' : 'text';
  return (
    <Tap onPress={onPress} accessibilityLabel={label} style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: bg }}>
        <Icon name={icon} size={21} color={fg} stroke={2} />
      </View>
    </Tap>
  );
}

/**
 * Header for the five tab roots (v1.0). Brand on the left; search, Emergency
 * (always one tap away, D44) and profile on the right. `onPhoto` floats it
 * over a hero image with solid-backed controls. The language switch lives in
 * Settings (D74: English first).
 */
export function AppHeader({ onPhoto, title }: { onPhoto?: boolean; title?: string }) {
  const { c, brand } = useTheme();
  const { prefs } = usePrefs();
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  // At large text the header name stops growing at 130%: it is a label for the mark, and the
  // page's own title carries the full size. This keeps "COP32" whole beside three 42 px controls.
  const k = Math.min(prefs.textScale, 1.3);
  return (
    <View style={{ paddingTop: insets.top + 8, paddingBottom: 8, paddingHorizontal: 12, backgroundColor: onPhoto ? 'transparent' : c.bg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <View accessible accessibilityRole="header" accessibilityLabel={title ?? brand.name}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1, paddingLeft: onPhoto ? 6 : 8, paddingRight: onPhoto ? 14 : 0, height: 42, borderRadius: 21, backgroundColor: onPhoto ? c.surface : 'transparent' }}>
        <View style={{ flexShrink: 0 }}><Mark size={28} /></View>
        <Text variant="headline" weight={800} numberOfLines={1} maxFontSizeMultiplier={1.3} style={{ flexShrink: 1, fontSize: Math.round(17 * k), lineHeight: Math.round(22 * k) }}>{brand.name}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <RoundButton icon="search" label={t('a11y.search')} onPress={() => router.push('/search')} onPhoto={onPhoto} />
        <RoundButton icon="siren" label={t('a11y.emergency')} onPress={() => router.push('/visit')} tone="danger" />
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
    <View style={{ paddingTop: insets.top + 8, paddingBottom: 8, paddingHorizontal: 12, backgroundColor: onPhoto ? 'transparent' : c.bg, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <RoundButton icon={close ? 'x' : 'chevron-left'} label={t(close ? 'a11y.close' : 'a11y.back')} onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} onPhoto={onPhoto} />
      {title ? <Text variant="headline" weight={800} accessibilityRole="header" style={{ flex: 1 }}>{title}</Text> : <View style={{ flex: 1 }} />}
      {right}
    </View>
  );
}

/**
 * Scrolling page body with the standard gutter and an optional large title.
 * Content is capped at the tablet reading width and centred.
 */
export function Page({ title, children, footerSpace = true }: { title?: string; children: React.ReactNode; footerSpace?: boolean }) {
  const { c, space, layout } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      // Keyboard users must be able to scroll pages that hold no focusable control (WCAG 2.1.1).
      {...(Platform.OS === 'web' ? { tabIndex: 0 as const } : null)}
      style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ paddingHorizontal: space[5], paddingTop: 4, paddingBottom: (footerSpace ? 24 : 8) + insets.bottom, alignItems: 'center' }}>
      <View style={{ width: '100%', maxWidth: layout.maxContentWidth, gap: 14 }}>
        {title ? <Text variant="largeTitle" accessibilityRole="header">{title}</Text> : null}
        {children}
      </View>
    </ScrollView>
  );
}

export interface TabItem { key: string; label: string; icon: IconName; focused: boolean; onPress: () => void }

/**
 * Bottom tab bar (v1.0): a floating bar. The selected tab becomes a solid ink
 * capsule holding its icon and label; the others show an icon over a small
 * label. Five labelled destinations (D16 v2).
 */
export function TabBar({ items }: { items: TabItem[] }) {
  const { c, dark } = useTheme();
  const { prefs } = usePrefs();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  // On narrow phones, or with enlarged text, the selected capsule cannot also hold its label inline
  // without pushing the bar off-screen, so every tab becomes icon-over-label and only the capsule marks selection.
  const compact = width < 380 || prefs.textScale > 1.15;
  const k = Math.min(prefs.textScale, 1.3);
  const small = { fontSize: Math.round(11 * k), lineHeight: Math.round(11 * k * 1.4) };
  const big = { fontSize: Math.round(13.5 * k), lineHeight: Math.round(13.5 * k * 1.3) };
  return (
    <View style={{ backgroundColor: c.bg, paddingHorizontal: 12, paddingTop: 6, paddingBottom: Math.max(insets.bottom, 10) }}>
      <View accessibilityRole="tablist"
        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: c.surface, borderRadius: 32, padding: 6, minHeight: 64, borderWidth: 1, borderColor: c.divider,
          shadowColor: '#000', shadowOpacity: dark ? 0.5 : 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 8 }}>
        {items.map((it) => (
          <Tap key={it.key} onPress={it.onPress} accessibilityRole="tab" accessibilityState={{ selected: it.focused }} accessibilityLabel={it.label}
            style={it.focused && !compact
              ? { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: c.ink, borderRadius: 26, paddingHorizontal: 16, minHeight: 52 }
              : { flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center', gap: 2, minHeight: 52, borderRadius: 26, backgroundColor: it.focused ? c.ink : 'transparent' }}>
            <Icon name={it.icon} size={22} color={it.focused ? 'onInk' : 'textSecondary'} stroke={it.focused ? 2.3 : 1.8} />
            <Text variant="caption" weight={it.focused ? 800 : 600} color={it.focused ? 'onInk' : 'textSecondary'} numberOfLines={1} maxFontSizeMultiplier={1.3} style={it.focused && !compact ? big : small}>{it.label}</Text>
          </Tap>
        ))}
      </View>
    </View>
  );
}
