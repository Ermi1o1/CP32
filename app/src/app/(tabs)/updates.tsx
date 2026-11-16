import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Page } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { FilterTabs, StateBlock } from '@/ui/controls';
import { Group, Row } from '@/ui/lists';
import { Photo, SavedMark } from '@/ui/event';
import { UPDATE_PHOTO } from '@/ui/photos';
import { lift } from '@/ui/lift';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { UPDATES } from '@/data/guides';
import { GLOSSARY } from '@/data/glossary';

type Tab = 'read' | 'alerts' | 'press' | 'live';

/**
 * Updates (v1.1). Explainers written for this guide (with the glossary), and
 * three tabs that are honest about being empty until official sources exist:
 * alerts, press releases, and live or recorded sessions. No invented news.
 */
export default function Updates() {
  const { c, dark } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('read');
  return (
    <Page title={t('tab.updates')} right={<SavedMark />}>
      <FilterTabs<Tab> value={tab} onChange={setTab}
        options={[{ value: 'read', label: t('updates.read') }, { value: 'alerts', label: t('updates.alerts') }, { value: 'press', label: t('updates.press') }, { value: 'live', label: t('updates.live') }]} />
      {tab === 'alerts' ? (
        <View style={{ paddingTop: 8 }}><StateBlock icon="bell" title={t('updates.noAlerts')} body={t('updates.noAlertsSub')} /></View>
      ) : tab === 'press' ? (
        <View style={{ paddingTop: 8 }}><StateBlock icon="file-text" title={t('updates.noPress')} body={t('updates.noPressSub')} /></View>
      ) : tab === 'live' ? (
        <View style={{ paddingTop: 8 }}><StateBlock icon="radio" title={t('updates.noLive')} body={t('updates.noLiveSub')} /></View>
      ) : (
        <View>
          <Group>
            <Row icon="circle-help" title={t('glossary.title')} subtitle={t('glossary.count', { n: GLOSSARY.length })} onPress={() => router.push('/glossary')} />
          </Group>
          {UPDATES.map((u) => (
            <View key={u.id} accessible style={{ flexDirection: 'row', gap: 14, padding: 12, marginTop: 12, backgroundColor: c.surface, borderRadius: 24, ...lift(dark) }}>
              <View style={{ width: 84, borderRadius: 16, overflow: 'hidden', alignSelf: 'flex-start' }}>
                <Photo name={UPDATE_PHOTO[u.id] ?? 'highland'} height={84} />
              </View>
              <View style={{ flex: 1, gap: 3, paddingRight: 4 }}>
                <Text variant="footnote" weight={600} color="primary">{`${u.kind} · ${t('updates.editorial')}`}</Text>
                <Text variant="headline">{u.title}</Text>
                <Text variant="footnote" color="textSecondary">{u.summary}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </Page>
  );
}
