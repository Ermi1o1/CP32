import React from 'react';
import { View, ScrollView, type ViewStyle, type StyleProp } from 'react-native';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';
import { Tap } from './Pressable';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';
import type { ColorRole } from '@/theme/brand';

/**
 * Button. `primary` is the lime action and is used at most once per screen
 * (design system §2). `tinted` is the everyday button; `plain` is a text button.
 */
export function Button({ label, onPress, kind = 'tinted', icon, wide, accessibilityHint }: { label: string; onPress?: () => void; kind?: 'primary' | 'tinted' | 'plain' | 'danger'; icon?: IconName; wide?: boolean; accessibilityHint?: string }) {
  const { c, radius } = useTheme();
  const { prefs } = usePrefs();
  const map: Record<string, { bg: string; fg: ColorRole }> = {
    primary: { bg: c.accent, fg: 'onAccent' },
    tinted: { bg: c.primarySoft, fg: 'onPrimarySoft' },
    plain: { bg: 'transparent', fg: 'primary' },
    danger: { bg: c.danger, fg: 'onDanger' },
  };
  const s = map[kind]!;
  return (
    <Tap onPress={onPress} accessibilityLabel={label} accessibilityHint={accessibilityHint}
      style={{ backgroundColor: s.bg, borderRadius: radius.pill, paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, alignSelf: wide ? 'stretch' : 'flex-start' }}>
      {icon ? <Icon name={icon} size={Math.round(20 * Math.min(prefs.textScale, 1.5))} color={s.fg} /> : null}
      <Text variant="callout" weight={700} color={s.fg} style={{ flexShrink: 1 }}>{label}</Text>
    </Tap>
  );
}

/** Filter chip. Selected state is carried by fill, a check icon and the accessibility state — never colour alone. */
export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress?: () => void }) {
  const { c, radius } = useTheme();
  return (
    <Tap onPress={onPress} accessibilityState={{ selected: !!selected }} aria-pressed={!!selected} accessibilityLabel={label}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1, borderColor: selected ? c.primary : c.border, backgroundColor: selected ? c.primarySoft : c.surface }}>
      {selected ? <Icon name="check" size={16} color="onPrimarySoft" stroke={2.4} /> : null}
      <Text variant="subhead" weight={selected ? 700 : 400} color={selected ? 'onPrimarySoft' : 'text'}>{label}</Text>
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

/** Banner / notice. Always icon + title + text. `danger` is announced assertively to screen readers. */
export function Banner({ tone, title, body }: { tone: keyof typeof TONES; title: string; body?: string }) {
  const { c, radius } = useTheme();
  const t = TONES[tone];
  return (
    <View accessibilityRole="alert" accessibilityLiveRegion={tone === 'danger' ? 'assertive' : 'polite'}
      style={{ flexDirection: 'row', gap: 12, padding: 14, borderRadius: radius.md, backgroundColor: c[t.bg] }}>
      <Icon name={t.icon} size={22} color={t.fg} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="headline" color={t.fg}>{title}</Text>
        {body ? <Text variant="subhead" color="text">{body}</Text> : null}
      </View>
    </View>
  );
}

/** Segmented control for 2–3 mutually exclusive options (appearance, language). */
export function Segmented<T extends string>({ options, value, onChange }: { options: readonly { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  const { c, radius } = useTheme();
  return (
    <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', backgroundColor: c.fill, borderRadius: radius.sm + 2, padding: 3, gap: 3 }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Tap key={o.value} onPress={() => onChange(o.value)} accessibilityRole="radio" accessibilityState={{ checked: on }} aria-checked={on} accessibilityLabel={o.label}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: 6, borderRadius: radius.sm, backgroundColor: on ? c.surface : 'transparent', borderWidth: on ? 1 : 0, borderColor: c.divider }}>
            <Text variant="subhead" weight={on ? 700 : 400} center>{o.label}</Text>
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
    <View style={{ alignItems: 'center', gap: 10, padding: 24, borderRadius: radius.md, backgroundColor: c.surface }}>
      <View style={{ width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: c.primarySoft }}>
        <Icon name={icon} size={26} color="onPrimarySoft" />
      </View>
      <Text variant="headline" center>{title}</Text>
      <Text variant="subhead" color="textSecondary" center>{body}</Text>
      {action}
    </View>
  );
}
