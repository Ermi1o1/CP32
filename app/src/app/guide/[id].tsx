import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Page, SubHeader } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Icon } from '@/ui/Icon';
import { Button, Banner, StateBlock } from '@/ui/controls';
import { Group, SectionTitle } from '@/ui/lists';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { GUIDES } from '@/data/guides';

/** A Visit guide. General advice now; a clear list of what official sources will add. */
export default function GuidePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const g = GUIDES.find((x) => x.id === String(id));
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <SubHeader title={t('tab.visit')} />
      {!g ? (
        <Page>
          <StateBlock icon="circle-help" title={t('guide.notFound')} body={t('guide.notFoundSub')} action={<Button kind="dark" label={t('tab.visit')} onPress={() => router.replace('/visit')} />} />
        </Page>
      ) : (
        <Page title={g.title} sub={g.summary}>
          {g.emergency ? <Banner tone="danger" title={t('guide.emergencyNote')} body={t('guide.emergencyNoteSub')} /> : null}
          <View style={{ gap: 12, paddingTop: 4 }}>
            {g.body.map((p, i) => <Text key={i} variant="body">{p}</Text>)}
          </View>
          <SectionTitle>{t('guide.covers')}</SectionTitle>
          <Group>
            {g.covers.map((x) => (
              <View key={x} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 }}>
                <Icon name="clock" size={20} color="textTertiary" stroke={1.8} />
                <Text variant="subhead" style={{ flex: 1 }}>{x}</Text>
                <Text variant="label" upper color="textSecondary">{t('guide.pending')}</Text>
              </View>
            ))}
          </Group>
          <Text variant="footnote" color="textTertiary">{t('guide.note')}</Text>
        </Page>
      )}
    </View>
  );
}
