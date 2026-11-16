import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Page, SubHeader } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Button, Banner, StateBlock } from '@/ui/controls';
import { Card, Group, Row, SectionTitle } from '@/ui/lists';
import { Photo } from '@/ui/event';
import { GUIDE_PHOTO } from '@/ui/photos';
import { lift } from '@/ui/lift';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { GUIDES } from '@/data/guides';

/** A Visit guide. General advice now; a clear list of what official sources will add. */
export default function GuidePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c, radius, dark } = useTheme();
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
          {GUIDE_PHOTO[g.id] ? (
            <View style={{ borderRadius: radius.lg, backgroundColor: c.surfaceAlt, ...lift(dark) }}>
              <Photo name={GUIDE_PHOTO[g.id]!} height={170} radius={radius.lg} />
            </View>
          ) : null}
          <Card>
            <View style={{ gap: 12 }}>
              {g.body.map((p, i) => <Text key={i} variant="body">{p}</Text>)}
            </View>
          </Card>
          <SectionTitle>{t('guide.covers')}</SectionTitle>
          <Group>
            {g.covers.map((x) => <Row key={x} icon="clock" title={x} value={t('guide.pending')} />)}
          </Group>
          <Text variant="footnote" color="textTertiary">{t('guide.note')}</Text>
        </Page>
      )}
    </View>
  );
}
