import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, SubHeader } from '@/ui/chrome';
import { Skeleton } from '@/ui/controls';
import { Group, Row } from '@/ui/lists';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { useContent } from '@/data/useContent';

/** Speakers: everyone in the programme, A to Z. All invented for the demonstration. */
export default function Speakers() {
  const { c } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const people = useContent((r) => r.listSpeakers());
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <SubHeader />
      <Page title={t('programme.speakers')} sub={t('speakers.lead')}>
        {!people ? <View style={{ gap: 14 }}><Skeleton height={56} /><Skeleton height={56} /><Skeleton height={56} /></View> : (
          <Group>
            {people.map((p) => <Row key={p.id} icon="user-round" title={p.name} subtitle={`${p.role} · ${p.org}`} onPress={() => router.push(`/speaker/${p.id}`)} />)}
          </Group>
        )}
      </Page>
    </View>
  );
}
