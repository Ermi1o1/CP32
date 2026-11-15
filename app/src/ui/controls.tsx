import React from 'react';
import { View, ScrollView, type ViewStyle, type StyleProp } from 'react-native';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';
import { Tap } from './Pressable';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';
import type { ColorRole } from '@/theme/brand';

/**
 * Button (v1.2, D77). A pill, 54 px tall, no border.
 * `primary` = amber, the save action, at most once per screen.
 * `dark` = deep green, the main way forward. `outline`/`tinted` = soft green,
 * secondary. `plain` = text only. `danger` = red.
 */
export function Button({ label, onPress, kind = 'tinted', icon, wide, flex, accessibilityHint }: { label: string; onPress?: () => void; kind?: 'primary' | 'dark' | 'outline' | 'tinted' | 'plain' | 'danger'; icon?: IconName; wide?: boolean; flex?: number; accessibilityHint?: string }) {
  const { c, radius } = useTheme();
  const { prefs } = usePrefs();
  const map: Record<string, { bg: string; fg: ColorRole }> = {
    primary: { bg: c.accent, fg: 'onAccent' },
    dark: { bg: c.ink, fg: 'onInk' },
    outline: { bg: c.primarySoft, fg: 'onPrimarySoft' },
    tinted: { bg: c.primarySoft, fg: 'onPrimarySoft' },
    plain: { bg: 'transparent', fg: 'primary' },
    danger: { bg: c.danger, fg: 'onDanger' },
  };
  const s = map[kind]!;
  return (
    <Tap onPress={onPress} accessibilityLabel={label} accessibilityHint={accessibilityHint}
      style={{ backgroundColor: s.bg, borderRadius: radius.pill, minHeight: 54, paddingHorizontal: 22, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, alignSelf: wide || flex ? 'stretch' : 'flex-start', flex }}>
      {icon ? <Icon name={icon} size={Math.round(20 * Math.min(prefs.textScale, 1.5))} color={s.fg} stroke={2.2} /> : null}
      <Text variant="callout" weight={700} color={s.fg} style={{ flexShrink: 1 }}>{label}</Text>
    </Tap>
  );
}

/**
 * Chip: a small pill for filters and suggestions. Unselected = soft fill;
 * selected = deep green with reversed text, plus the accessibility state.
 * The visible pill is 40 px tall inside a 48 px target.
 */
export function Chip({ label, selected, onPress, count }: { label: string; selected?: boolean; onPress?: () => void; count?: number }) {
  const { c, radius } = useTheme();
  return (
    <Tap onPress={onPress} accessibilityState={{ selected: !!selected }} aria-pressed={!!selected} accessibilityLabel={count !== undefined ? `${label}, ${count}` : label}
      style={{ justifyContent: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, minHeight: 40, borderRadius: radius.pill, backgroundColor: selected ? c.ink : c.surface }}>
        <Text variant="subhead" weight={600} color={selected ? 'onInk' : 'text'}>{label}</Text>
        {count !== undefined ? <Text variant="footnote" weight={600} color={selected ? 'onInk' : 'textSecondary'} tabular>{String(count)}</Text> : null}
      </View>
    </Tap>
  );
}

/** A horizontally scrolling row of chips. Chips scroll; they are never cut off mid-word. */
export function ChipRow({ children }: { children: React.ReactNode }) {
  const { space } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: space[5] }} style={{ marginHorizontal: -space[5] }}>
      {children}
    </ScrollView>
  );
}

const TONES = {
  info: { fg: 'info', bg: 'infoBg', icon: 'info' },
  success: { fg: 'success', bg: 'successBg', icon: 'circle-check' },
  warning: { fg: 'warning', bg: 'warningBg', icon: 'triangle-alert' },
  danger: { fg: 'danger', bg: 'dangerBg', icon: 'siren' },
} as const;

/** Notice: a soft tinted panel with an icon, a title and text. No border. `danger` is announced assertively. */
export function Banner({ tone, title, body }: { tone: keyof typeof TONES; title: string; body?: string }) {
  const { c, radius } = useTheme();
  const t = TONES[tone];
  return (
    <View accessibilityRole="alert" accessibilityLiveRegion={tone === 'danger' ? 'assertive' : 'polite'}
      style={{ flexDirection: 'row', gap: 12, padding: 16, backgroundColor: c[t.bg], borderRadius: radius.md }}>
      <Icon name={t.icon} size={22} color={t.fg} stroke={2} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="headline" color={t.fg}>{title}</Text>
        {body ? <Text variant="footnote" color="text">{body}</Text> : null}
      </View>
    </View>
  );
}

/**
 * Segmented control for 2–5 mutually exclusive options (appearance, text
 * size, the programme's day). Equal soft pills with small gaps — no frame
 * around them. Selected = deep green.
 */
export function Segmented<T extends string>({ options, value, onChange }: { options: readonly { value: T; label: string; sub?: string }[]; value: T; onChange: (v: T) => void }) {
  const { c, radius } = useTheme();
  return (
    <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', gap: 6 }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Tap key={o.value} onPress={() => onChange(o.value)} accessibilityRole="radio" accessibilityState={{ checked: on }} aria-checked={on} accessibilityLabel={o.sub ? `${o.sub} ${o.label}` : o.label}
            style={{ flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center', paddingVertical: o.sub ? 8 : 6, paddingHorizontal: 2, borderRadius: o.sub ? radius.md : radius.pill, backgroundColor: on ? c.ink : c.surface }}>
            {/* The small caption above a segment stops growing early; the value below it carries the size. */}
            {o.sub ? <Text variant="label" upper color={on ? 'onInk' : 'textSecondary'} center numberOfLines={1} maxFontSizeMultiplier={1.1} style={{ fontSize: 11, lineHeight: 15 }}>{o.sub}</Text> : null}
            <Text variant={o.sub ? 'title3' : 'subhead'} weight={o.sub ? 700 : 600} color={on ? 'onInk' : 'text'} center>{o.label}</Text>
          </Tap>
        );
      })}
    </View>
  );
}

/**
 * Filter tabs: a wrapping row of chips with counts, one selected. Smaller and
 * flatter than Segmented, so "which day" and "which sessions" stay visibly
 * different controls.
 */
export function FilterTabs<T extends string>({ options, value, onChange }: { options: readonly { value: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void }) {
  return (
    // A group of toggle buttons (each chip announces "selected"), not a tab list.
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 8 }}>
      {options.map((o) => <Chip key={o.value} label={o.label} count={o.count} selected={o.value === value} onPress={() => onChange(o.value)} />)}
    </View>
  );
}

/** Soft block shown while content is being read from the phone's store. Never an endless spinner. */
export function Skeleton({ height = 16, width = '100%', style }: { height?: number; width?: number | `${number}%`; style?: StyleProp<ViewStyle> }) {
  const { c, radius } = useTheme();
  return <View accessibilityElementsHidden importantForAccessibility="no" style={[{ height, width, borderRadius: radius.sm, backgroundColor: c.surface }, style]} />;
}

/** Empty and "needs a connection" states. Each names the situation and what still works; neither says "something went wrong". */
export function StateBlock({ icon, title, body, action }: { icon: IconName; title: string; body: string; action?: React.ReactNode }) {
  const { c, radius } = useTheme();
  return (
    <View style={{ alignItems: 'center', gap: 8, paddingVertical: 28, paddingHorizontal: 24, borderRadius: radius.lg, backgroundColor: c.surface }}>
      <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
        <Icon name={icon} size={28} color="onPrimarySoft" stroke={1.8} />
      </View>
      <Text variant="title3" center>{title}</Text>
      <Text variant="subhead" color="textSecondary" center>{body}</Text>
      {action ? <View style={{ marginTop: 8 }}>{action}</View> : null}
    </View>
  );
}
