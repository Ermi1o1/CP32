import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Page } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Icon } from '@/ui/Icon';
import { FilterTabs, StateBlock } from '@/ui/controls';
import { Group, Row } from '@/ui/lists';
import { SavedMark } from '@/ui/event';
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
  const { c } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('read');
  return (
    <Page title={t('tab.updates')} right={<SavedMark />}>
      <FilterTabs<Tab> value={tab} onChange={setTab}
        options={[{ value: 'read', label: t('updates.read') }, { value: 'alerts', label: t('updates.alerts') }, { value: 'press', label: t('updates.press') }, { value: 'live', label: t('updates.live') }]} />
      <View style={{ height: 1.5, backgroundColor: c.text, marginTop: -6 }} />
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
            <View key={u.id}>
              <View accessible style={{ flexDirection: 'row', gap: 14, paddingVertical: 16 }}>
                <Icon name={u.icon} size={22} color="text" stroke={1.8} />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text variant="label" upper color="textSecondary">{`${u.kind} · ${t('updates.editorial')}`}</Text>
                  <Text variant="title3">{u.title}</Text>
                  <Text variant="subhead" color="textSecondary">{u.summary}</Text>
                </View>
              </View>
              <View style={{ height: 1, backgroundColor: c.divider }} />
            </View>
          ))}
        </View>
      )}
    </Page>
  );
}
