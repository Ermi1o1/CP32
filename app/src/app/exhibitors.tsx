import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, SubHeader } from '@/ui/chrome';
import { FilterTabs } from '@/ui/controls';
import { Group, Row } from '@/ui/lists';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { EXHIBITORS } from '@/data/exhibitors';
import { PLACES } from '@/data/guides';

/** Exhibitors: who is showing what, and where. Filter by hall. All invented for the demonstration. */
export default function Exhibitors() {
  const { c } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const [place, setPlace] = useState<string>('all');
  const used = PLACES.filter((p) => EXHIBITORS.some((e) => e.placeId === p.id));
  const shown = EXHIBITORS.filter((e) => place === 'all' || e.placeId === place);
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <SubHeader />
      <Page title={t('exhibitors.title')} sub={t('exhibitors.lead')}>
        <FilterTabs<string> value={place} onChange={setPlace}
          options={[{ value: 'all', label: t('programme.all'), count: EXHIBITORS.length }, ...used.map((p) => ({ value: p.id, label: p.name, count: EXHIBITORS.filter((e) => e.placeId === p.id).length }))]} />
        <View style={{ height: 1.5, backgroundColor: c.text, marginTop: -6 }} />
        <Group>
          {shown.map((e) => (
            <Row key={e.id} icon="building-2" title={e.name} subtitle={`${e.kind} · ${PLACES.find((p) => p.id === e.placeId)?.name ?? ''} · ${t('exhibitors.stand', { s: e.stand })}`} onPress={() => router.push(`/exhibitor/${e.id}`)} />
          ))}
        </Group>
      </Page>
    </View>
  );
}
