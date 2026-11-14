import React from 'react';
import { View, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from './Text';
import { Icon, Mark, type IconName } from './Icon';
import { Tap } from './Pressable';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import type { ColorRole } from '@/theme/brand';

function RoundButton({ icon, label, onPress, bg, fg = 'primary' }: { icon: IconName; label: string; onPress: () => void; bg?: string; fg?: ColorRole }) {
  const { c } = useTheme();
  return (
    <Tap onPress={onPress} accessibilityLabel={label} style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: bg ?? c.fill }}>
        <Icon name={icon} size={21} color={fg} />
      </View>
    </Tap>
  );
}

/**
 * Header for the five tab roots: brand lockup on the left; language switch,
 * search, Emergency (always one tap away, D44) and profile on the right.
 */
export function AppHeader() {
  const { c, brand } = useTheme();
  const { prefs, setPrefs } = usePrefs();
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  // At large text sizes the brand takes its own line so the name is never cut to "C…".
  const stacked = prefs.textScale >= 1.5;
  const lockup = (
    <View accessible accessibilityRole="header" accessibilityLabel={brand.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: stacked ? undefined : 1, paddingLeft: 4 }}>
      <View style={{ flexShrink: 0 }}><Mark size={32} /></View>
      <Text variant="title3" numberOfLines={stacked ? 2 : 1} style={{ flexShrink: 1 }}>{brand.name}</Text>
    </View>
  );
  const actions = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
      <Tap onPress={() => setPrefs({ lang: prefs.lang === 'en' ? 'am' : 'en' })} accessibilityLabel={t('a11y.language')} style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }}>
        <View style={{ height: 40, minWidth: 48, paddingHorizontal: 10, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: c.fill }}>
          {/* The switch shows the language you would switch TO, in its own script. */}
          <Text variant="subhead" weight={700} color="primary" maxFontSizeMultiplier={1.3} style={{ fontSize: 15, lineHeight: 22 }}>{prefs.lang === 'en' ? 'አማ' : 'EN'}</Text>
        </View>
      </Tap>
      <RoundButton icon="search" label={t('a11y.search')} onPress={() => router.push('/search')} />
      <RoundButton icon="siren" label={t('a11y.emergency')} onPress={() => router.push('/visit')} bg={c.dangerBg} fg="danger" />
      <RoundButton icon="circle-user-round" label={t('a11y.settings')} onPress={() => router.push('/settings')} />
    </View>
  );
  return (
    <View style={{ paddingTop: insets.top + 6, paddingBottom: 6, paddingHorizontal: 12, backgroundColor: c.bg, flexDirection: stacked ? 'column' : 'row', alignItems: stacked ? 'stretch' : 'center', gap: stacked ? 6 : 2 }}>
      {lockup}
      {actions}
    </View>
  );
}

/** Header for pushed screens and sheets: back or close, then the title. */
export function SubHeader({ title, close }: { title: string; close?: boolean }) {
  const { c } = useTheme();
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View style={{ paddingTop: insets.top + 6, paddingBottom: 6, paddingHorizontal: 8, backgroundColor: c.bg, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <RoundButton icon={close ? 'x' : 'chevron-left'} label={t(close ? 'a11y.close' : 'a11y.back')} onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
      <Text variant="headline" accessibilityRole="header" style={{ flex: 1 }}>{title}</Text>
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
 * Bottom tab bar: five labelled destinations (D16 v2). Labels wrap to two
 * lines rather than truncate; the selected tab is marked by a filled pill,
 * a heavier icon stroke and the accessibility state.
 */
export function TabBar({ items }: { items: TabItem[] }) {
  const { c } = useTheme();
  const { prefs } = usePrefs();
  const insets = useSafeAreaInsets();
  // Tab labels stop growing at 130%. Beyond that, five labels cannot sit side by side and
  // words break mid-syllable (seen in Amharic at 200%). Icon and accessibility label remain.
  const k = Math.min(prefs.textScale, 1.3);
  const capped = { fontSize: Math.round(12 * k), lineHeight: Math.round(12 * k * 1.5) };
  return (
    <View accessibilityRole="tablist" style={{ flexDirection: 'row', backgroundColor: c.surface, borderTopWidth: 1, borderTopColor: c.divider, paddingBottom: Math.max(insets.bottom, Platform.OS === 'web' ? 6 : 0), paddingTop: 6, paddingHorizontal: 4 }}>
      {items.map((it) => (
        <Tap key={it.key} onPress={it.onPress} accessibilityRole="tab" accessibilityState={{ selected: it.focused }} accessibilityLabel={it.label}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', gap: 2, paddingVertical: 2 }}>
          <View style={{ paddingHorizontal: 16, paddingVertical: 4, borderRadius: 16, backgroundColor: it.focused ? c.primarySoft : 'transparent' }}>
            <Icon name={it.icon} size={23} color={it.focused ? 'onPrimarySoft' : 'textSecondary'} stroke={it.focused ? 2.15 : 1.75} />
          </View>
          <Text variant="caption" weight={it.focused ? 700 : 600} color={it.focused ? 'primary' : 'textSecondary'} center numberOfLines={2} maxFontSizeMultiplier={1.3} style={capped}>{it.label}</Text>
        </Tap>
      ))}
    </View>
  );
}
