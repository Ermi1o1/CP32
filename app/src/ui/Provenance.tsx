import React from 'react';
import { View } from 'react-native';
import * as Linking from 'expo-linking';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';
import { Tap } from './Pressable';
import type { Certainty } from '@/data/types';
import type { ColorRole } from '@/theme/brand';
import { useT, type StringKey } from '@/i18n';

const LOOK: Record<Certainty, { icon: IconName; color: ColorRole; key: StringKey }> = {
  official: { icon: 'circle-check', color: 'success', key: 'prov.official' },
  reported: { icon: 'file-text', color: 'textSecondary', key: 'prov.reported' },
  illustrative: { icon: 'layers', color: 'textTertiary', key: 'prov.illustrative' },
  unknown: { icon: 'circle-help', color: 'warning', key: 'prov.unknown' },
};

/**
 * Where a piece of content comes from (D66 certainty), as one quiet line:
 * an icon and a short label, with the source as a link when there is one.
 */
export function Provenance({ certainty, source }: { certainty: Certainty; source?: { label: string; url?: string } }) {
  const { t } = useT();
  const l = LOOK[certainty];
  const label = t(l.key);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      <Icon name={l.icon} size={13} color={l.color} stroke={2.2} />
      <Text variant="footnote" weight={600} color={l.color}>{label}</Text>
      {source?.url ? (
        <Tap onPress={() => { void Linking.openURL(source.url!).catch(() => undefined); }} accessibilityRole="link" accessibilityLabel={`${label}: ${source.label}`} style={{ justifyContent: 'center' }}>
          <Text variant="footnote" color="link" style={{ textDecorationLine: 'underline' }}>{source.label}</Text>
        </Tap>
      ) : source ? <Text variant="footnote" color="textTertiary">{source.label}</Text> : null}
    </View>
  );
}
