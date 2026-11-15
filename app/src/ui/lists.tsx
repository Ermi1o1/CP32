import React from 'react';
import { View } from 'react-native';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';
import { Tap } from './Pressable';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';
import type { ColorRole } from '@/theme/brand';

/** Kept for callers; rows no longer use coloured tiles. `red` marks an emergency row. */
export type Tone = 'teal' | 'green' | 'red' | 'orange' | 'blue';

/**
 * Section heading (v1.1): a title in the display face on a full ink rule,
 * with an optional link on the right. The ONE way a section starts, on every screen.
 */
export function SectionTitle({ children, action, onAction }: { children: string; action?: string; onAction?: () => void }) {
  const { c } = useTheme();
  return (
    <View style={{ marginTop: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, paddingBottom: 8 }}>
        <Text variant="title3" accessibilityRole="header" style={{ flexShrink: 1 }}>{children}</Text>
        {action ? (
          <Tap onPress={onAction} minTarget={false} accessibilityRole="link" accessibilityLabel={action} hitSlop={12}>
            <Text variant="subhead" weight={600} color="primary">{action} ›</Text>
          </Tap>
        ) : null}
      </View>
      <View style={{ height: 1.5, backgroundColor: c.text }} />
    </View>
  );
}

/** A run of rows separated by hairlines. No box, no background: content sits on the page. */
export function Group({ children }: { children: React.ReactNode }) {
  const { c } = useTheme();
  const items = React.Children.toArray(children);
  return (
    <View>
      {items.map((child, i) => (
        <View key={i}>
          {child}
          <View style={{ height: 1, backgroundColor: c.divider }} />
        </View>
      ))}
    </View>
  );
}

/**
 * List row (v1.1): a plain line icon, title, optional second line, optional
 * value, and a chevron when it navigates. One style everywhere — no coloured
 * tiles. Text wraps; the row grows with large text.
 */
export function Row({ icon, tone, title, subtitle, value, onPress, right }: { icon?: IconName; tone?: Tone; title: string; subtitle?: string; value?: string; onPress?: () => void; right?: React.ReactNode }) {
  const { prefs } = usePrefs();
  const iconColor: ColorRole = tone === 'red' ? 'danger' : 'text';
  // With enlarged text a trailing value moves under the title rather than squeezing it into a one-letter column.
  const stackValue = !!value && prefs.textScale >= 1.3;
  const body = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, minHeight: 60 }}>
      {icon ? <Icon name={icon} size={22} color={iconColor} stroke={1.8} /> : null}
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="headline">{title}</Text>
        {subtitle ? <Text variant="footnote" color="textSecondary">{subtitle}</Text> : null}
        {stackValue ? <Text variant="footnote" weight={600} color="textSecondary">{value}</Text> : null}
      </View>
      {value && !stackValue ? <Text variant="footnote" weight={600} color="textSecondary" style={{ flexShrink: 1, textAlign: 'right' }}>{value}</Text> : null}
      {right}
      {onPress && !right ? <Icon name="chevron-right" size={18} color="textTertiary" stroke={2} /> : null}
    </View>
  );
  if (!onPress) return body;
  return (
    <Tap onPress={onPress} minTarget={false} accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}>
      {body}
    </Tap>
  );
}

/** A bordered panel for grouped controls or featured content. Square-ish (14 px), hairline border, no shadow. */
export function Card({ children, onPress, label }: { children: React.ReactNode; onPress?: () => void; label?: string }) {
  const { c, radius } = useTheme();
  const style = { backgroundColor: c.surface, borderRadius: radius.md, borderWidth: 1, borderColor: c.divider, padding: 16, gap: 8 } as const;
  if (!onPress) return <View style={style}>{children}</View>;
  return (
    <Tap onPress={onPress} minTarget={false} accessibilityLabel={label} style={style}>
      {children}
    </Tap>
  );
}
