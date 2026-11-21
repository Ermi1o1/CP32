import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';
import { Tap } from './Pressable';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';
import { lift } from './lift';

/** Two letters for a person or organisation: the first letters of the first two words. */
export function initialsOf(name: string): string {
  return name.split(/\s+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

/** `red` marks an emergency row; every other row uses the one green icon disc. */
export type Tone = 'teal' | 'green' | 'red' | 'orange' | 'blue';

/**
 * Section heading (v1.2): a title in the display face with an optional link
 * on the right. No rule under it — space does the separating.
 */
export function SectionTitle({ children, action, onAction }: { children: string; action?: string; onAction?: () => void }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', columnGap: 12, rowGap: 2, marginTop: 18, marginBottom: 2 }}>
      <Text variant="title2" accessibilityRole="header" style={{ flexShrink: 1 }}>{children}</Text>
      {action ? (
        <Tap onPress={onAction} minTarget={false} accessibilityRole="link" accessibilityLabel={action} hitSlop={12}>
          <Text variant="subhead" weight={600} color="primary">{action}</Text>
        </Tap>
      ) : null}
    </View>
  );
}

/** A run of rows in one raised white block (v1.4, D79). No dividers: rows are separated by their own spacing. */
export function Group({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const { c, radius, dark } = useTheme();
  return <View style={[{ gap: 2, backgroundColor: c.surface, borderRadius: radius.lg, paddingHorizontal: 14, paddingVertical: 6, ...lift(dark) }, style]}>{children}</View>;
}

/**
 * List row (v1.2): a line icon on a soft green disc, title, optional second
 * line, optional value, and a chevron when it navigates. One style on every
 * screen. Text wraps; the row grows with large text.
 */
export function Row({ icon, initials, tone, title, subtitle, value, onPress, right }: { icon?: IconName; initials?: string; tone?: Tone; title: string; subtitle?: string; value?: string; onPress?: () => void; right?: React.ReactNode }) {
  const { c } = useTheme();
  const { prefs } = usePrefs();
  const red = tone === 'red';
  // With enlarged text a trailing value moves under the title rather than squeezing it into a one-letter column.
  const stackValue = !!value && prefs.textScale >= 1.3;
  const body = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 9, minHeight: 62 }}>
      {initials ? (
        // A person or organisation gets its own initials, so a list of names is not a column of one repeated icon.
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
          <Text variant="subhead" weight={700} color="onPrimarySoft" maxFontSizeMultiplier={1.2}>{initials}</Text>
        </View>
      ) : icon ? (
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: red ? c.dangerBg : c.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={21} color={red ? 'danger' : 'onPrimarySoft'} stroke={1.9} />
        </View>
      ) : null}
      <View style={{ flex: 1, gap: 1 }}>
        <Text variant="headline">{title}</Text>
        {subtitle ? <Text variant="footnote" color="textSecondary">{subtitle}</Text> : null}
        {stackValue ? <Text variant="footnote" weight={600} color="primary">{value}</Text> : null}
      </View>
      {value && !stackValue ? <Text variant="footnote" weight={600} color="primary" style={{ flexShrink: 1, textAlign: 'right' }}>{value}</Text> : null}
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

/** A raised white panel for grouped controls or featured content. Rounded, no border, soft shadow. */
export function Card({ children, onPress, label }: { children: React.ReactNode; onPress?: () => void; label?: string }) {
  const { c, radius, dark } = useTheme();
  const style = { backgroundColor: c.surface, borderRadius: radius.lg, padding: 18, gap: 8, ...lift(dark) } as const;
  if (!onPress) return <View style={style}>{children}</View>;
  return (
    <Tap onPress={onPress} minTarget={false} accessibilityLabel={label} style={style}>
      {children}
    </Tap>
  );
}
