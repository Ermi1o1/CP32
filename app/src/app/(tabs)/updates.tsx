import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Page } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Tap } from '@/ui/Pressable';
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
        <View style={{ paddingTop: 8 }}><StateBlock icon="info" title={t('updates.noAlerts')} body={t('updates.noAlertsSub')} /></View>
      ) : tab === 'press' ? (
        <View style={{ paddingTop: 8 }}><StateBlock icon="book-open" title={t('updates.noPress')} body={t('updates.noPressSub')} /></View>
      ) : tab === 'live' ? (
        <View style={{ paddingTop: 8 }}><StateBlock icon="map" title={t('updates.noLive')} body={t('updates.noLiveSub')} /></View>
      ) : (
        <View style={{ gap: 12 }}>
          <Group style={{ marginBottom: 4 }}>
            <Row icon="book-open" title={t('glossary.title')} subtitle={t('glossary.count', { n: GLOSSARY.length })} onPress={() => router.push('/glossary')} />
          </Group>
          {UPDATES.map((u) => (
            <Tap key={u.id} onPress={() => router.push(`/explainer/${u.id}`)} minTarget={false} accessibilityRole="link" accessibilityLabel={`${u.kind}. ${u.title}. ${u.summary}`} 
              style={{ flexDirection: 'row', gap: 14, padding: 12, backgroundColor: c.surface, borderRadius: 16, borderWidth: 1, borderColor: c.border, ...lift(dark, 1) }}>
              <View style={{ width: 90, height: 90, borderRadius: 12, overflow: 'hidden' }}>
                <Photo name={UPDATE_PHOTO[u.id] ?? 'highland'} height={90} />
              </View>
              <View style={{ flex: 1, gap: 4, paddingVertical: 2 }}>
                <Text variant="label" weight={600} color="primary">{`${u.kind} · ${t('updates.editorial')}`}</Text>
                <Text variant="headline" weight={700} numberOfLines={2} style={{ fontSize: 15 }}>{u.title}</Text>
                <Text variant="footnote" color="textSecondary" numberOfLines={2}>{u.summary}</Text>
              </View>
            </Tap>
          ))}
        </View>
      )}
    </Page>
  );
}