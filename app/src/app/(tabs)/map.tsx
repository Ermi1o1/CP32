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
import { Tap } from '@/ui/Pressable';
import { lift } from '@/ui/lift';
import type { IconName } from '@/ui/Icon';
import type { StringKey } from '@/i18n';
import { useT } from '@/i18n';
import { useContent } from '@/data/useContent';
import { PLACES } from '@/data/guides';

const ICON = { hall: 'landmark', room: 'users', service: 'coffee', gate: 'map-pin' } as const;

/** The four things people look for first. Each selects a place on the plan. */
const QUICK: readonly { place: string; icon: IconName; label: StringKey }[] = [
  { place: 'court', icon: 'coffee', label: 'map.q.food' },
  { place: 'reg', icon: 'ticket', label: 'map.q.badges' },
  { place: 'gate1', icon: 'users', label: 'map.q.meet' },
  { place: 'gate2', icon: 'accessibility', label: 'map.q.entrance' },
];

/**
 * Map (v1.1). A quiet, nearly monochrome schematic of the venue with one
 * selected place, a panel for that place, and the list of places below.
 * The plan is a schematic and says so: the real venue is not announced.
 */
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
        style={{ borderRadius: radius.lg, backgroundColor: c.surface, ...lift(dark) }}>
        <SvgXml xml={venuePlanSvg(c as unknown as Record<string, string>, sel)} width="100%" height={undefined} style={{ aspectRatio: 350 / 290, borderRadius: radius.lg, overflow: 'hidden' }} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Icon name="info" size={14} color="textTertiary" stroke={2} />
        <Text variant="footnote" color="textTertiary">{t('map.schematic')}</Text>
      </View>

      <View style={{ backgroundColor: c.surface, borderRadius: radius.lg, padding: 18, gap: 4, ...lift(dark) }}>
        <Text variant="footnote" weight={600} color="primary">{t(`map.kind.${place.kind}`)}</Text>
        <Text variant="title2" accessibilityRole="header">{place.name}</Text>
        <Text variant="subhead" color="textSecondary">{place.note}</Text>
        {n > 0 ? (
          <View style={{ marginTop: 10 }}>
            <Button kind="dark" wide icon="calendar" label={t('map.sessionsHere', { n })} onPress={() => router.push('/programme')} />
          </View>
        ) : null}
      </View>

      <SectionTitle>{t('map.quick')}</SectionTitle>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {QUICK.map((q) => {
          const on = sel === q.place;
          return (
            <Tap key={q.place} onPress={() => setSel(q.place)} minTarget={false} accessibilityState={{ selected: on }} aria-pressed={on} accessibilityLabel={t(q.label)}
              style={{ flexGrow: 1, flexBasis: '45%', flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 56, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.md, backgroundColor: on ? c.ink : c.surface, ...lift(dark, 1) }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: on ? c.accent : c.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={q.icon} size={18} color={on ? 'onAccent' : 'onPrimarySoft'} stroke={2} />
              </View>
              <Text variant="subhead" weight={600} color={on ? 'onInk' : 'text'} style={{ flex: 1 }}>{t(q.label)}</Text>
            </Tap>
          );
        })}
      </View>

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
