import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import { Page } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Icon } from '@/ui/Icon';
import { Button, FilterTabs } from '@/ui/controls';
import { Group, Row, SectionTitle } from '@/ui/lists';
import { SavedMark, venuePlanSvg } from '@/ui/event';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { useContent } from '@/data/useContent';
import { PLACES } from '@/data/guides';

const ICON = { hall: 'landmark', room: 'users', service: 'coffee', gate: 'map-pin' } as const;

/**
 * Map (v1.1). A quiet, nearly monochrome schematic of the venue with one
 * selected place, a panel for that place, and the list of places below.
 * The plan is a schematic and says so: the real venue is not announced.
 */
export default function MapTab() {
  const { c, radius } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const sessions = useContent((r) => r.listSessions());
  const [sel, setSel] = useState<string>('hallA');
  const [only, setOnly] = useState<'all' | 'stepfree'>('all');
  const listed = PLACES.filter((p) => only === 'all' || p.stepFree);
  const place = PLACES.find((p) => p.id === sel) ?? PLACES[0]!;
  const count = (rooms: string[]) => (sessions ?? []).filter((s) => rooms.includes(s.room)).length;
  const n = count(place.rooms);

  return (
    <Page title={t('tab.map')} right={<SavedMark />}>
      <View accessible accessibilityRole="image" accessibilityLabel={t('map.planLabel', { p: place.name })}
        style={{ borderRadius: radius.lg, overflow: 'hidden' }}>
        <SvgXml xml={venuePlanSvg(c as unknown as Record<string, string>, sel)} width="100%" height={undefined} style={{ aspectRatio: 350 / 290 }} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Icon name="info" size={14} color="textTertiary" stroke={2} />
        <Text variant="footnote" color="textTertiary">{t('map.schematic')}</Text>
      </View>

      <View style={{ backgroundColor: c.surface, borderRadius: radius.lg, padding: 18, gap: 4 }}>
        <Text variant="footnote" weight={600} color="primary">{t(`map.kind.${place.kind}`)}</Text>
        <Text variant="title2" accessibilityRole="header">{place.name}</Text>
        <Text variant="subhead" color="textSecondary">{place.note}</Text>
        {n > 0 ? (
          <View style={{ marginTop: 10 }}>
            <Button kind="dark" wide icon="calendar" label={t('map.sessionsHere', { n })} onPress={() => router.push('/programme')} />
          </View>
        ) : null}
      </View>

      <SectionTitle>{t('map.places')}</SectionTitle>
      <FilterTabs<'all' | 'stepfree'> value={only} onChange={setOnly} options={[{ value: 'all', label: t('programme.all'), count: PLACES.length }, { value: 'stepfree', label: t('map.stepFree'), count: PLACES.filter((p) => p.stepFree).length }]} />
      <Group>
        {listed.map((p) => (
          <Row key={p.id} icon={p.stepFree && only === 'stepfree' ? 'accessibility' : ICON[p.kind]} title={p.name} subtitle={p.note}
            onPress={() => setSel(p.id)}
            right={sel === p.id ? <Icon name="circle-check" size={22} color="primary" stroke={2.2} /> : <View style={{ width: 22 }} />} />
        ))}
      </Group>
    </Page>
  );
}
