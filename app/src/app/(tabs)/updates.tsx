import React, { useState } from 'react';
import { View } from 'react-native';
import { Page } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Icon } from '@/ui/Icon';
import { FilterTabs, StateBlock } from '@/ui/controls';
import { SavedMark } from '@/ui/event';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { UPDATES } from '@/data/guides';

type Tab = 'read' | 'alerts';

/**
 * Updates (v1.1). Editorial explainers written for this guide, each labelled
 * with what it is and who wrote it; and an Alerts tab that says plainly that
 * alerts are not live — no invented news, no invented alerts.
 */
export default function Updates() {
  const { c } = useTheme();
  const { t } = useT();
  const [tab, setTab] = useState<Tab>('read');
  return (
    <Page title={t('tab.updates')} right={<SavedMark />}>
      <FilterTabs<Tab> value={tab} onChange={setTab} options={[{ value: 'read', label: t('updates.read'), count: UPDATES.length }, { value: 'alerts', label: t('updates.alerts'), count: 0 }]} />
      <View style={{ height: 1.5, backgroundColor: c.text, marginTop: -6 }} />
      {tab === 'alerts' ? (
        <View style={{ paddingTop: 8 }}>
          <StateBlock icon="bell" title={t('updates.noAlerts')} body={t('updates.noAlertsSub')} />
        </View>
      ) : (
        <View>
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
