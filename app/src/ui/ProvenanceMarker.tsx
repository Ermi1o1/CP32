import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from './Text';
import { Icon } from './Icon';
import { Tap } from './Pressable';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { useOfficialSync } from '@/state/provenance';
import type { Certainty } from '@/data/types';

/**
 * The app's single provenance marker for programme content: one quiet line
 * saying where the programme comes from. "Preview content" by default;
 * "Official — synced HH:MM" when the content pipeline delivers official data
 * (demonstrated by the switch in Settings). Opens Sources and status.
 */
export function ProvenanceMarker({ center, certainty }: { center?: boolean; certainty?: Certainty }) {
  const { c, radius } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const sync = useOfficialSync();
  // A record's own certainty wins when given; otherwise the pipeline state.
  const on = certainty ? certainty === 'official' : sync.on;
  const syncedAt = sync.syncedAt;
  const label = on ? t('prov.synced', { t: syncedAt ?? '' }) : t('prov.preview');
  return (
    <Tap onPress={() => router.push('/sources')} accessibilityRole="link" accessibilityLabel={`${label}. ${t('sources.title')}`}
      style={{ alignSelf: center ? 'center' : 'flex-start', justifyContent: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, backgroundColor: on ? c.successBg : c.fill }}>
        <Icon name={on ? 'circle-check' : 'layers'} size={13} color={on ? 'success' : 'textSecondary'} stroke={2.2} />
        <Text variant="footnote" weight={600} color={on ? 'success' : 'textSecondary'}>{label}</Text>
      </View>
    </Tap>
  );
}
