import React from 'react';
import { View } from 'react-native';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';
import { Tap } from './Pressable';
import { useTheme } from '@/theme/ThemeProvider';

const CHIP_TONES = {
  teal: ['primarySoft', 'onPrimarySoft'],
  green: ['successBg', 'success'],
  red: ['dangerBg', 'danger'],
  orange: ['warningBg', 'warning'],
  blue: ['infoBg', 'info'],
} as const;
export type Tone = keyof typeof CHIP_TONES;

/** Section heading above a group. */
export function SectionTitle({ children }: { children: string }) {
  return (
    <Text variant="title3" accessibilityRole="header" style={{ marginTop: 8 }}>
      {children}
    </Text>
  );
}

/** Grouped inset list: a rounded surface holding rows separated by hairlines. */
export function Group({ children }: { children: React.ReactNode }) {
  const { c, radius } = useTheme();
  const items = React.Children.toArray(children);
  return (
    <View style={{ backgroundColor: c.surface, borderRadius: radius.md, overflow: 'hidden' }}>
      {items.map((child, i) => (
        <View key={i}>
          {i > 0 ? <View style={{ height: 1, backgroundColor: c.divider, marginLeft: 60 }} /> : null}
          {child}
        </View>
      ))}
    </View>
  );
}

/**
 * List row: icon chip, title, optional second line, optional value, chevron when it navigates.
 * Text wraps; a row grows with large text instead of truncating.
 */
export function Row({ icon, tone = 'teal', title, subtitle, value, onPress, right }: { icon?: IconName; tone?: Tone; title: string; subtitle?: string; value?: string; onPress?: () => void; right?: React.ReactNode }) {
  const { c, layout } = useTheme();
  const [bg, fg] = CHIP_TONES[tone];
  const body = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 10, minHeight: layout.listRowMin + 8 }}>
      {icon ? (
        <View style={{ width: 34, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: c[bg] }}>
          <Icon name={icon} size={20} color={fg} />
        </View>
      ) : null}
      <View style={{ flex: 1, gap: 1 }}>
        <Text variant="headline">{title}</Text>
        {subtitle ? <Text variant="subhead" color="textSecondary">{subtitle}</Text> : null}
      </View>
      {value ? <Text variant="subhead" color="textSecondary">{value}</Text> : null}
      {right}
      {onPress && !right ? <Icon name="chevron-right" size={20} color="textTertiary" /> : null}
    </View>
  );
  if (!onPress) return body;
  return (
    <Tap onPress={onPress} minTarget={false} accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}>
      {body}
    </Tap>
  );
}

/** Plain card surface for featured content. */
export function Card({ children, onPress, label }: { children: React.ReactNode; onPress?: () => void; label?: string }) {
  const { c, radius } = useTheme();
  const style = { backgroundColor: c.surface, borderRadius: radius.md, padding: 16, gap: 6 } as const;
  if (!onPress) return <View style={style}>{children}</View>;
  return (
    <Tap onPress={onPress} minTarget={false} accessibilityLabel={label} style={style}>
      {children}
    </Tap>
  );
}
