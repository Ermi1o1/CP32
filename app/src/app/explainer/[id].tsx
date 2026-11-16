import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Page, SubHeader } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Button, StateBlock } from '@/ui/controls';
import { Card, Group, Row } from '@/ui/lists';
import { Photo } from '@/ui/event';
import { UPDATE_PHOTO } from '@/ui/photos';
import { lift } from '@/ui/lift';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { UPDATES } from '@/data/guides';

/** One explainer or guide note, written for this guide. Editorial, never presented as an official text. */
export default function ExplainerPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c, radius, dark } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const u = UPDATES.find((x) => x.id === String(id));
  const others = UPDATES.filter((x) => x.id !== String(id)).slice(0, 3);
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <SubHeader title={t('tab.updates')} />
      {!u ? (
        <Page>
          <StateBlock icon="circle-help" title={t('guide.notFound')} body={t('guide.notFoundSub')} action={<Button kind="dark" label={t('tab.updates')} onPress={() => router.replace('/updates')} />} />
        </Page>
      ) : (
        <Page title={u.title} sub={`${u.kind} · ${t('updates.editorial')}`}>
          <View style={{ borderRadius: radius.lg, backgroundColor: c.surfaceAlt, ...lift(dark) }}>
            <Photo name={UPDATE_PHOTO[u.id] ?? 'highland'} height={170} radius={radius.lg} />
          </View>
          <Card>
            <View style={{ gap: 12 }}>
              <Text variant="body" weight={600}>{u.summary}</Text>
              {u.body.map((p, i) => <Text key={i} variant="body">{p}</Text>)}
            </View>
          </Card>
          <Text variant="footnote" color="textTertiary">{t('explainer.note')}</Text>
          <Text variant="title2" accessibilityRole="header" style={{ marginTop: 14 }}>{t('explainer.more')}</Text>
          <Group>
            {others.map((o) => <Row key={o.id} icon={o.icon} title={o.title} subtitle={o.kind} onPress={() => router.replace(`/explainer/${o.id}`)} />)}
            <Row icon="circle-help" title={t('glossary.title')} onPress={() => router.push('/glossary')} />
          </Group>
        </Page>
      )}
    </View>
  );
}
