import React from 'react';
import { View } from 'react-native';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';
import { Tap } from './Pressable';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';

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

/** A run of rows. No dividers and no box: rows are separated by their own spacing. */
export function Group({ children }: { children: React.ReactNode }) {
  return <View style={{ gap: 2 }}>{children}</View>;
}

/**
 * List row (v1.2): a line icon on a soft green disc, title, optional second
 * line, optional value, and a chevron when it navigates. One style on every
 * screen. Text wraps; the row grows with large text.
 */
export function Row({ icon, tone, title, subtitle, value, onPress, right }: { icon?: IconName; tone?: Tone; title: string; subtitle?: string; value?: string; onPress?: () => void; right?: React.ReactNode }) {
  const { c } = useTheme();
  const { prefs } = usePrefs();
  const red = tone === 'red';
  // With enlarged text a trailing value moves under the title rather than squeezing it into a one-letter column.
  const stackValue = !!value && prefs.textScale >= 1.3;
  const body = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 9, minHeight: 62 }}>
      {icon ? (
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

/** A soft filled panel for grouped controls or featured content. Rounded, no border, no shadow. */
export function Card({ children, onPress, label }: { children: React.ReactNode; onPress?: () => void; label?: string }) {
  const { c, radius } = useTheme();
  const style = { backgroundColor: c.surface, borderRadius: radius.lg, padding: 18, gap: 8 } as const;
  if (!onPress) return <View style={style}>{children}</View>;
  return (
    <Tap onPress={onPress} minTarget={false} accessibilityLabel={label} style={style}>
      {children}
    </Tap>
  );
}
