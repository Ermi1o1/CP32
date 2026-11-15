import React from 'react';
import { View, ScrollView, type ViewStyle, type StyleProp } from 'react-native';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';
import { Tap } from './Pressable';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';
import type { ColorRole } from '@/theme/brand';

/**
 * Button (v1.0, D73). Rectangular with a 14 px radius and 52 px tall.
 * `primary` is the amber action, used at most once per screen. `dark` is the
 * strong neutral. `outline` and `tinted` are secondary. `plain` is a text button.
 */
export function Button({ label, onPress, kind = 'tinted', icon, wide, flex, accessibilityHint }: { label: string; onPress?: () => void; kind?: 'primary' | 'dark' | 'outline' | 'tinted' | 'plain' | 'danger'; icon?: IconName; wide?: boolean; flex?: number; accessibilityHint?: string }) {
  const { c, radius } = useTheme();
  const { prefs } = usePrefs();
  const map: Record<string, { bg: string; fg: ColorRole; border?: string }> = {
    primary: { bg: c.accent, fg: 'onAccent' },
    dark: { bg: c.ink, fg: 'onInk' },
    outline: { bg: c.surface, fg: 'text', border: c.border },
    tinted: { bg: c.primarySoft, fg: 'onPrimarySoft' },
    plain: { bg: 'transparent', fg: 'primary' },
    danger: { bg: c.danger, fg: 'onDanger' },
  };
  const s = map[kind]!;
  return (
    <Tap onPress={onPress} accessibilityLabel={label} accessibilityHint={accessibilityHint}
      style={{ backgroundColor: s.bg, borderRadius: radius.md, borderWidth: s.border ? 1.5 : 0, borderColor: s.border, minHeight: 52, paddingHorizontal: 18, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, alignSelf: wide || flex ? 'stretch' : 'flex-start', flex }}>
      {icon ? <Icon name={icon} size={Math.round(20 * Math.min(prefs.textScale, 1.5))} color={s.fg} stroke={2.2} /> : null}
      <Text variant="callout" weight={700} color={s.fg} style={{ flexShrink: 1 }}>{label}</Text>
    </Tap>
  );
}

/**
 * Filter chip. Selected = solid ink with reversed text and the accessibility
 * state; never colour alone. The visible pill is 38 px tall inside a 48 px target.
 */
export function Chip({ label, selected, onPress, count }: { label: string; selected?: boolean; onPress?: () => void; count?: number }) {
  const { c, radius } = useTheme();
  return (
    <Tap onPress={onPress} accessibilityState={{ selected: !!selected }} aria-pressed={!!selected} accessibilityLabel={count !== undefined ? `${label}, ${count}` : label}
      style={{ justifyContent: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, minHeight: 38, borderRadius: radius.pill, borderWidth: 1.5, borderColor: selected ? c.ink : c.divider, backgroundColor: selected ? c.ink : c.surface }}>
        <Text variant="subhead" weight={700} color={selected ? 'onInk' : 'text'}>{label}</Text>
        {count !== undefined ? <Text variant="footnote" weight={700} color={selected ? 'onInk' : 'textSecondary'} tabular>{String(count)}</Text> : null}
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

/**
 * Notice (v1.1). A bordered panel with a coloured bar on its leading edge,
 * an icon, a title and text. `danger` is announced assertively to screen readers.
 */
export function Banner({ tone, title, body }: { tone: keyof typeof TONES; title: string; body?: string }) {
  const { c, radius } = useTheme();
  const t = TONES[tone];
  return (
    <View accessibilityRole="alert" accessibilityLiveRegion={tone === 'danger' ? 'assertive' : 'polite'}
      style={{ flexDirection: 'row', backgroundColor: c.surface, borderRadius: radius.md, borderWidth: 1, borderColor: c.divider, overflow: 'hidden' }}>
      <View style={{ width: 5, backgroundColor: c[t.fg] }} />
      <View style={{ flex: 1, flexDirection: 'row', gap: 12, padding: 14 }}>
        <Icon name={t.icon} size={22} color={t.fg} stroke={2} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="headline">{title}</Text>
          {body ? <Text variant="footnote" color="textSecondary">{body}</Text> : null}
        </View>
      </View>
    </View>
  );
}

/**
 * Segmented control for 2–5 mutually exclusive options (appearance, text size,
 * the programme's day). Equal columns inside one bordered frame; selected = solid ink.
 */
export function Segmented<T extends string>({ options, value, onChange }: { options: readonly { value: T; label: string; sub?: string }[]; value: T; onChange: (v: T) => void }) {
  const { c, radius } = useTheme();
  return (
    <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', backgroundColor: c.surface, borderRadius: radius.md, borderWidth: 1, borderColor: c.divider, padding: 4, gap: 4 }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Tap key={o.value} onPress={() => onChange(o.value)} accessibilityRole="radio" accessibilityState={{ checked: on }} aria-checked={on} accessibilityLabel={o.sub ? `${o.sub} ${o.label}` : o.label}
            style={{ flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center', paddingVertical: 6, paddingHorizontal: 2, borderRadius: radius.sm, backgroundColor: on ? c.ink : 'transparent' }}>
            {/* The small caption above a segment stops growing early; the value below it carries the size. */}
            {o.sub ? <Text variant="label" upper color={on ? 'onInk' : 'textSecondary'} center numberOfLines={1} maxFontSizeMultiplier={1.1} style={{ fontSize: 11, lineHeight: 15 }}>{o.sub}</Text> : null}
            <Text variant={o.sub ? 'title3' : 'subhead'} weight={o.sub ? 700 : on ? 700 : 500} color={on ? 'onInk' : 'text'} center>{o.label}</Text>
          </Tap>
        );
      })}
    </View>
  );
}

/**
 * Filter tabs: plain text with a count; the selected one is underlined in ink.
 * Deliberately different from Segmented, so "which day" and "which sessions"
 * never look like the same control.
 */
export function FilterTabs<T extends string>({ options, value, onChange }: { options: readonly { value: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void }) {
  const { c } = useTheme();
  return (
    <View accessibilityRole="tablist" style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 22 }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Tap key={o.value} onPress={() => onChange(o.value)} minTarget={false} accessibilityRole="tab" accessibilityState={{ selected: on }} accessibilityLabel={o.count !== undefined ? `${o.label}, ${o.count}` : o.label}
            style={{ minHeight: 48, justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 5, paddingVertical: 6, borderBottomWidth: 2.5, borderBottomColor: on ? c.text : 'transparent' }}>
              <Text variant="subhead" weight={on ? 700 : 500} color={on ? 'text' : 'textSecondary'}>{o.label}</Text>
              {o.count !== undefined ? <Text variant="footnote" weight={600} color="textSecondary" tabular>{String(o.count)}</Text> : null}
            </View>
          </Tap>
        );
      })}
    </View>
  );
}

/** Grey block shown while content is being read from the phone's store. Never an endless spinner. */
export function Skeleton({ height = 16, width = '100%', style }: { height?: number; width?: number | `${number}%`; style?: StyleProp<ViewStyle> }) {
  const { c, radius } = useTheme();
  return <View accessibilityElementsHidden importantForAccessibility="no" style={[{ height, width, borderRadius: radius.sm, backgroundColor: c.surfaceAlt }, style]} />;
}

/** Empty and "needs a connection" states. Each names the situation and what still works; neither says "something went wrong". */
export function StateBlock({ icon, title, body, action }: { icon: IconName; title: string; body: string; action?: React.ReactNode }) {
  const { c, radius } = useTheme();
  return (
    <View style={{ alignItems: 'flex-start', gap: 8, padding: 20, borderRadius: radius.md, borderWidth: 1, borderColor: c.divider, backgroundColor: c.surface }}>
      <Icon name={icon} size={28} color="text" stroke={1.6} />
      <Text variant="title3">{title}</Text>
      <Text variant="subhead" color="textSecondary">{body}</Text>
      {action ? <View style={{ marginTop: 6 }}>{action}</View> : null}
    </View>
  );
}
