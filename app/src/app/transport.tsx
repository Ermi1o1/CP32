import React from 'react';
import { View } from 'react-native';
import { Page, SubHeader } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Icon, type IconName } from '@/ui/Icon';
import { Group, Row, SectionTitle } from '@/ui/lists';
import { Skeleton } from '@/ui/controls';
import { Provenance } from '@/ui/Provenance';
import { lift } from '@/ui/lift';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { useTransport, type GuideKind } from '@/data/transport';

const ICON: Record<GuideKind, IconName> = { corridor: 'train-front', airport: 'plane', fares: 'banknote', taxi: 'car', venue: 'map-pin' };

/**
 * Getting around Addis. Plain, sourced advice; no drawn routes (nothing is
 * drawn that cannot be sourced) and a labelled place for live tracking.
 * Reads through TransportRepository so a live provider can replace the
 * bundled data without this screen changing.
 */
export default function Transport() {
  const { c, radius, dark } = useTheme();
  const { t } = useT();
  const data = useTransport(async (r) => ({ notes: await r.listNotes(), lines: await r.listLines(), live: r.liveProvider() }));

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <SubHeader />
      <Page title={t('transport.title')} sub={t('transport.lead')}>
        {!data ? (
          <View style={{ gap: 12 }}><Skeleton height={120} /><Skeleton height={160} /></View>
        ) : (
          <>
            <View accessible accessibilityLabel={`${t('transport.liveTitle')}. ${t(data.live.state === 'connected' ? 'transport.liveOn' : 'transport.liveSoon')}`}
              style={{ borderRadius: radius.lg, padding: 16, gap: 8, backgroundColor: c.surface, borderWidth: 1, borderStyle: 'dashed', borderColor: c.border }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.infoBg, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="radio" size={18} color="info" stroke={2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="headline">{t('transport.liveTitle')}</Text>
                  <Text variant="footnote" color="textSecondary">{t('transport.poweredBy', { p: data.live.name })}</Text>
                </View>
              </View>
              <Text variant="subhead" color="textSecondary">{t(data.live.state === 'connected' ? 'transport.liveOn' : 'transport.liveSoon')}</Text>
            </View>

            <SectionTitle>{t('transport.lines')}</SectionTitle>
            <Group>
              {data.lines.map((l) => (
                <Row key={l.id} icon="train-front" title={l.name.en} subtitle={`${l.termini[0]} ↔ ${l.termini[1]}`} />
              ))}
            </Group>

            {data.notes.map((n) => (
              <View key={n.id} style={{ backgroundColor: c.surface, borderRadius: radius.lg, padding: 16, gap: 10, ...lift(dark, 1) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={ICON[n.kind]} size={18} color="onPrimarySoft" stroke={2} />
                  </View>
                  <Text variant="title3" accessibilityRole="header" style={{ flex: 1 }}>{n.title.en}</Text>
                </View>
                {n.body.map((p, i) => <Text key={i} variant="body">{p.en}</Text>)}
                <Provenance certainty={n.certainty} source={n.source} />
              </View>
            ))}
          </>
        )}
      </Page>
    </View>
  );
}
