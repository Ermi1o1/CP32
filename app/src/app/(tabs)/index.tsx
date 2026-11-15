import React from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppHeader, GUTTER } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Icon, type IconName } from '@/ui/Icon';
import { Tap } from '@/ui/Pressable';
import { Button, Skeleton } from '@/ui/controls';
import { Group, Row, SectionTitle } from '@/ui/lists';
import { HorizonLine, Photo, SavedMark, SaveToggle, Tag, accessKey } from '@/ui/event';
import { THEME_PHOTO } from '@/ui/photos';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';
import { useT, type StringKey } from '@/i18n';
import { useContent } from '@/data/useContent';
import { useNow } from '@/data/useNow';
import { FEATURED } from '@/data/guides';
import { durationMin, minutesUntil, nextUp } from '@/data/time';
import type { Session } from '@/data/types';

/** One quick action: a large green disc with an icon, and a label under it. */
function Quick({ icon, label, onPress, width }: { icon: IconName; label: StringKey; onPress: () => void; width: number }) {
  const { c } = useTheme();
  const { prefs } = usePrefs();
  const { t } = useT();
  return (
    <Tap onPress={onPress} minTarget={false} accessibilityLabel={t(label)} style={{ width, alignItems: 'center', gap: 8 }}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={26} color="onPrimarySoft" stroke={1.9} />
      </View>
      {/* The label under a disc stops growing at 150%, so one long word still fits its column. */}
      <Text variant="footnote" weight={600} center numberOfLines={2} maxFontSizeMultiplier={1.3} style={{ fontSize: Math.round(13.5 * Math.min(prefs.textScale, 1.5)), lineHeight: Math.round(18 * Math.min(prefs.textScale, 1.5)) }}>{t(label)}</Text>
    </Tap>
  );
}

function Highlight({ s, onPress }: { s: Session; onPress: () => void }) {
  const { radius } = useTheme();
  const { t } = useT();
  return (
    <Tap onPress={onPress} minTarget={false} accessibilityLabel={`${t('programme.day', { d: s.day })}, ${s.start}. ${s.title.en}`} style={{ width: 264, gap: 10 }}>
      <Photo name={THEME_PHOTO[s.theme]} height={168} radius={radius.lg} />
      <View style={{ gap: 3, paddingHorizontal: 2 }}>
        <Text variant="footnote" weight={600} color="primary">{`${t('programme.day', { d: s.day })} · ${s.start} · ${s.format}`}</Text>
        <Text variant="headline" numberOfLines={2}>{s.title.en}</Text>
      </View>
    </Tap>
  );
}

/**
 * Home (v1.2, D76, D77). A general landing page built the way people expect a
 * finished app to open: a photograph, a clear title, a search field, four
 * quick actions, a row of highlights, and the essentials. No boxes, no rules.
 * It is not tied to a day; the demonstration switch "Conference-day preview"
 * adds the next-session panel.
 */
export default function Home() {
  const { c, layout, brand, radius } = useTheme();
  const { prefs } = usePrefs();
  const { t } = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const data = useContent(async (r) => ({ event: await r.getEvent(), sessions: await r.listSessions() }));
  const now = useNow(data?.event);

  const heroH = Math.round(260 + insets.top);
  const enter = (delay: number) => (prefs.reduceMotion ? {} : { entering: FadeInDown.duration(240).delay(delay) });
  const Enter = prefs.reduceMotion ? View : Animated.View;
  const next = data && now ? nextUp(data.sessions.filter((s) => s.day === now.day), now) : undefined;
  const featured = data ? FEATURED.map((id) => data.sessions.find((s) => s.id === id)).filter((s): s is Session => !!s) : [];
  const inner = Math.min(width, layout.maxContentWidth) - GUTTER * 2;
  const quickCols = prefs.textScale >= 1.5 ? 2 : 4;
  const go = (href: Href) => () => router.push(href);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} {...({ tabIndex: 0 } as object)}>
        <View>
          <Photo name="highland" height={heroH} hero />
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
            <AppHeader onPhoto />
          </View>
        </View>

        <View style={{ alignItems: 'center' }}>
          <View style={{ width: '100%', maxWidth: layout.maxContentWidth }}>
            <HorizonLine left={now && data ? `${t('home.dayOf', { d: now.day, n: data.event.dayCount })} · ${now.time}` : t('home.kicker')} right={<SavedMark />} />

            <View style={{ paddingHorizontal: GUTTER, paddingTop: 10, gap: 8 }}>
              <Text variant="display" accessibilityRole="header">{t('home.title')}</Text>
              <Text variant="body" color="textSecondary">{t('home.lead')}</Text>
            </View>

            <Enter {...enter(40)} style={{ paddingHorizontal: GUTTER, paddingTop: 18 }}>
              <Tap onPress={go('/search')} minTarget={false} accessibilityRole="search" accessibilityLabel={t('search.placeholder')}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.surface, borderRadius: radius.pill, minHeight: 56, paddingHorizontal: 20 }}>
                <Icon name="search" size={21} color="textSecondary" stroke={2} />
                <Text variant="callout" color="textSecondary" style={{ flex: 1 }}>{t('search.placeholder')}</Text>
              </Tap>
            </Enter>

            {next && now ? (
              <Enter {...enter(80)} style={{ marginHorizontal: GUTTER, marginTop: 18, backgroundColor: c.surface, borderRadius: radius.lg, padding: 18, gap: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <Tag kind="next" label={`${t('home.next')} · ${t('home.inMin', { m: minutesUntil(next.start, now.time) })}`} />
                  <Tag kind={next.access === 'public' ? 'public' : 'restricted'} label={t(accessKey(next.access))} />
                </View>
                <Tap onPress={go(`/session/${next.id}`)} minTarget={false} accessibilityRole="link" accessibilityLabel={`${next.start}. ${next.title.en}`} style={{ gap: 4 }}>
                  <Text variant="clock">{next.start}</Text>
                  <Text variant="displaySmall">{next.title.en}</Text>
                  <Text variant="footnote" color="textSecondary">{[next.room, next.format, t('session.minutes', { m: durationMin(next) })].join(' · ')}</Text>
                </Tap>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 6, alignItems: 'center' }}>
                  <Button kind="dark" flex={1} label={t('home.open')} onPress={go(`/session/${next.id}`)} />
                  <View style={{ borderRadius: 27, width: 54, height: 54, alignItems: 'center', justifyContent: 'center', backgroundColor: c.bg }}>
                    <SaveToggle id={next.id} title={next.title.en} />
                  </View>
                </View>
              </Enter>
            ) : null}

            <Enter {...enter(100)} style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 18, paddingHorizontal: GUTTER, paddingTop: 24 }}>
              <Quick width={inner / quickCols} icon="calendar" label="tab.programme" onPress={go('/programme')} />
              <Quick width={inner / quickCols} icon="map" label="tab.map" onPress={go('/map')} />
              <Quick width={inner / quickCols} icon="bookmark" label="programme.agenda" onPress={go('/agenda')} />
              <Quick width={inner / quickCols} icon="luggage" label="home.plan" onPress={go('/visit')} />
            </Enter>

            {!data ? (
              <View style={{ padding: GUTTER, gap: 12 }}><Skeleton height={24} width="40%" /><Skeleton height={168} /></View>
            ) : (
              <>
                <Enter {...enter(160)} style={{ paddingHorizontal: GUTTER, paddingTop: 10 }}>
                  <SectionTitle action={t('home.all')} onAction={go('/programme')}>{t('home.highlights')}</SectionTitle>
                </Enter>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: GUTTER, gap: 16, paddingTop: 12 }}>
                  {featured.map((s) => <Highlight key={s.id} s={s} onPress={go(`/session/${s.id}`)} />)}
                </ScrollView>

                <View style={{ paddingHorizontal: GUTTER, paddingTop: 10 }}>
                  <SectionTitle>{t('home.essentials')}</SectionTitle>
                  <View style={{ paddingTop: 6 }}>
                    <Group>
                      <Row icon="ticket" title={t('home.canAttend')} subtitle={t('home.canAttendSub')} onPress={go('/guide/attend')} />
                      <Row icon="siren" tone="red" title={t('visit.emergency')} subtitle={t('visit.emergencySub')} onPress={go('/guide/emergency')} />
                      <Row icon="list-checks" title={t('settings.sources')} subtitle={t('settings.sourcesSub')} onPress={go('/sources')} />
                    </Group>
                  </View>
                  {/* The permanent independence line (D66, D65a): always on Home. */}
                  <Text variant="footnote" color="textTertiary" center style={{ paddingTop: 22 }}>{t(brand.descriptorKey)}</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
