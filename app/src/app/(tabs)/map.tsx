import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import { Page } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Icon } from '@/ui/Icon';
import { Button, FilterTabs } from '@/ui/controls';
import { Group, Row, SectionTitle } from '@/ui/lists';
import { SavedMark, venuePlanSvg } from '@/ui/event';
import { useTheme } from '@/theme/ThemeProvider';
import { Tap } from '@/ui/Pressable';
import { lift } from '@/ui/lift';
import type { IconName } from '@/ui/Icon';
import type { StringKey } from '@/i18n';
import { useT } from '@/i18n';
import { useContent } from '@/data/useContent';
import { PLACES } from '@/data/guides';

const ICON = { hall: 'landmark', room: 'users', service: 'coffee', gate: 'map' } as const;

const QUICK: readonly { place: string; icon: IconName; label: StringKey }[] = [
  { place: 'court', icon: 'coffee', label: 'map.q.food' },
  { place: 'reg', icon: 'ticket', label: 'map.q.badges' },
  { place: 'gate1', icon: 'users', label: 'map.q.meet' },
  { place: 'gate2', icon: 'accessibility', label: 'map.q.entrance' },
];

export default function MapTab() {
  const { c, radius, dark } = useTheme();
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
        style={{ borderRadius: 16, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, ...lift(dark, 1) }}>
        <SvgXml xml={venuePlanSvg(c as unknown as Record<string, string>, sel)} width="100%" height={undefined} style={{ aspectRatio: 350 / 290, borderRadius: 16, overflow: 'hidden' }} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Icon name="info" size={14} color="textTertiary" stroke={2} />
        <Text variant="footnote" color="textTertiary">{t('map.schematic')}</Text>
      </View>

      <View style={{ backgroundColor: c.surface, borderRadius: 16, padding: 16, gap: 4, borderWidth: 1, borderColor: c.border, ...lift(dark, 1) }}>
        <Text variant="label" weight={600} color="primary">{t(`map.kind.${place.kind}`)}</Text>
        <Text variant="headline" weight={700} accessibilityRole="header">{place.name}</Text>
        <Text variant="footnote" color="textSecondary">{place.note}</Text>
        {n > 0 ? (
          <View style={{ marginTop: 10 }}>
            <Button kind="dark" wide icon="calendar" label={t('map.sessionsHere', { n })} onPress={() => router.push('/programme')} />
          </View>
        ) : null}
      </View>

      <SectionTitle>{t('map.quick')}</SectionTitle>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 8 }}>
        {QUICK.map((q) => {
          const on = sel === q.place;
          return (
            <Tap key={q.place} onPress={() => setSel(q.place)} minTarget={false} accessibilityState={{ selected: on }} aria-pressed={on} accessibilityLabel={t(q.label)}
              style={{ width: 120, height: 100, padding: 12, borderRadius: 16, backgroundColor: on ? c.ink : c.surface, borderWidth: 1, borderColor: on ? c.ink : c.border, ...lift(dark, 1) }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: on ? c.accent : c.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={q.icon} size={16} color={on ? 'onAccent' : 'onPrimarySoft'} stroke={2} />
              </View>
              <Text variant="footnote" weight={600} color={on ? 'onInk' : 'text'} style={{ marginTop: 'auto' }}>{t(q.label)}</Text>
            </Tap>
          );
        })}
      </ScrollView>

      <SectionTitle>{t('map.places')}</SectionTitle>
      <FilterTabs<'all' | 'stepfree'> value={only} onChange={setOnly} options={[{ value: 'all', label: t('programme.all'), count: PLACES.length }, { value: 'stepfree', label: t('map.stepFree'), count: PLACES.filter((p) => p.stepFree).length }]} />
      <Group>
        {listed.map((p) => (
          <Row key={p.id} icon={p.stepFree && only === 'stepfree' ? 'accessibility' : p.icon ?? ICON[p.kind]} title={p.name} subtitle={p.note}
            onPress={() => setSel(p.id)}
            right={sel === p.id ? <Icon name="circle-check" size={22} color="primary" stroke={2.2} /> : <View style={{ width: 22 }} />} />
        ))}
      </Group>
    </Page>
  );
}