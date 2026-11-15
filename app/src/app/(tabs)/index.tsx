import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
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
import { dayProgress, durationMin, minutesUntil, nextUp } from '@/data/time';
import type { Session } from '@/data/types';

function Tile({ icon, title, sub, onPress }: { icon: IconName; title: StringKey; sub: StringKey; onPress: () => void }) {
  const { c, radius } = useTheme();
  const { prefs } = usePrefs();
  const { t } = useT();
  return (
    <Tap onPress={onPress} minTarget={false} accessibilityLabel={`${t(title)}. ${t(sub)}`}
      style={{ flexBasis: prefs.textScale >= 1.3 ? '100%' : '47%', flexGrow: 1, minHeight: prefs.textScale >= 1.3 ? 0 : 112, backgroundColor: c.surface, borderRadius: radius.md, borderWidth: 1, borderColor: c.divider, padding: 14, justifyContent: 'space-between', gap: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Icon name={icon} size={24} color="text" stroke={1.8} />
        <Icon name="chevron-right" size={16} color="textTertiary" stroke={2} />
      </View>
      <View style={{ gap: 2 }}>
        <Text variant="headline">{t(title)}</Text>
        <Text variant="footnote" color="textSecondary">{t(sub)}</Text>
      </View>
    </Tap>
  );
}

function Highlight({ s, onPress }: { s: Session; onPress: () => void }) {
  const { radius } = useTheme();
  const { t } = useT();
  return (
    <Tap onPress={onPress} minTarget={false} accessibilityLabel={`${t('programme.day', { d: s.day })}, ${s.start}. ${s.title.en}`} style={{ width: 232, gap: 8 }}>
      <Photo name={THEME_PHOTO[s.theme]} height={140} radius={radius.md} />
      <Text variant="label" upper color="textSecondary">{`${t('programme.day', { d: s.day })} · ${s.start} · ${s.format}`}</Text>
      <Text variant="headline" numberOfLines={3}>{s.title.en}</Text>
    </Tap>
  );
}

/**
 * Home (v1.1, D76). A general landing page: what this is, where to start,
 * a few highlights, and the practical essentials. It is NOT tied to a day.
 * Only the demonstration switch "Conference-day preview" adds the live
 * "next session" block and the day-progress dot on the line.
 */
export default function Home() {
  const { c, layout, brand } = useTheme();
  const { prefs } = usePrefs();
  const { t } = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const data = useContent(async (r) => ({ event: await r.getEvent(), sessions: await r.listSessions() }));
  const now = useNow(data?.event);

  const heroH = Math.round(230 + insets.top);
  const enter = (delay: number) => (prefs.reduceMotion ? {} : { entering: FadeInDown.duration(240).delay(delay) });
  const Enter = prefs.reduceMotion ? View : Animated.View;
  const next = data && now ? nextUp(data.sessions.filter((s) => s.day === now.day), now) : undefined;
  const featured = data ? FEATURED.map((id) => data.sessions.find((s) => s.id === id)).filter((s): s is Session => !!s) : [];

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }} {...({ tabIndex: 0 } as object)}>
        <View>
          <Photo name="highland" height={heroH} />
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
            <AppHeader onPhoto />
          </View>
        </View>

        <View style={{ alignItems: 'center' }}>
          <View style={{ width: '100%', maxWidth: layout.maxContentWidth }}>
            <HorizonLine
              progress={now ? dayProgress(now.time) : undefined}
              left={now && data ? `${t('home.dayOf', { d: now.day, n: data.event.dayCount })} · ${now.time}` : t('home.kicker')}
              right={<SavedMark />}
            />

            <View style={{ paddingHorizontal: GUTTER, paddingTop: 16, gap: 8 }}>
              <Text variant="display" accessibilityRole="header">{t('home.title')}</Text>
              <Text variant="body" color="textSecondary">{t('home.lead')}</Text>
              {/* The permanent independence line (D66, D65a): always on Home. */}
              <Text variant="footnote" color="textTertiary">{t(brand.descriptorKey)}</Text>
            </View>

            {!data ? (
              <View style={{ padding: GUTTER, gap: 12 }}><Skeleton height={52} /><Skeleton height={112} /><Skeleton height={112} /></View>
            ) : (
              <View style={{ paddingHorizontal: GUTTER, gap: 12 }}>
                {next && now ? (
                  <Enter {...enter(40)} style={{ marginTop: 14, backgroundColor: c.surface, borderRadius: 14, borderWidth: 1, borderColor: c.divider, padding: 16, gap: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <Tag kind="next" label={`${t('home.next')} · ${t('home.inMin', { m: minutesUntil(next.start, now.time) })}`} />
                      <Tag kind={next.access === 'public' ? 'public' : 'restricted'} label={t(accessKey(next.access))} />
                    </View>
                    <Tap onPress={() => router.push(`/session/${next.id}`)} minTarget={false} accessibilityRole="link" accessibilityLabel={`${next.start}. ${next.title.en}`} style={{ gap: 4 }}>
                      <Text variant="clock">{next.start}</Text>
                      <Text variant="displaySmall">{next.title.en}</Text>
                      <Text variant="footnote" color="textSecondary">{[next.room, next.format, t('session.minutes', { m: durationMin(next) })].join(' · ')}</Text>
                    </Tap>
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 6, alignItems: 'center' }}>
                      <Button kind="dark" flex={1} label={t('home.open')} onPress={() => router.push(`/session/${next.id}`)} />
                      <View style={{ borderWidth: 1.5, borderColor: c.border, borderRadius: 14, width: 52, height: 52, alignItems: 'center', justifyContent: 'center' }}>
                        <SaveToggle id={next.id} title={next.title.en} />
                      </View>
                    </View>
                  </Enter>
                ) : (
                  <Enter {...enter(40)} style={{ marginTop: 14 }}>
                    <Button kind="dark" wide icon="calendar" label={t('home.cta')} onPress={() => router.push('/programme')} />
                  </Enter>
                )}

                <Enter {...enter(100)}>
                  <SectionTitle>{t('home.sections')}</SectionTitle>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
                    <Tile icon="calendar" title="tab.programme" sub="home.tileProgramme" onPress={() => router.push('/programme')} />
                    <Tile icon="map" title="tab.map" sub="home.tileMap" onPress={() => router.push('/map')} />
                    <Tile icon="ticket" title="home.canAttend" sub="home.tileAttend" onPress={() => router.push('/guide/attend')} />
                    <Tile icon="luggage" title="home.plan" sub="home.tileVisit" onPress={() => router.push('/visit')} />
                  </View>
                </Enter>

                <Enter {...enter(160)}>
                  <SectionTitle action={t('home.all')} onAction={() => router.push('/programme')}>{t('home.highlights')}</SectionTitle>
                </Enter>
              </View>
            )}

            {data ? (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: GUTTER, gap: 14, paddingTop: 14 }}>
                  {featured.map((s) => <Highlight key={s.id} s={s} onPress={() => router.push(`/session/${s.id}`)} />)}
                </ScrollView>
                <View style={{ paddingHorizontal: GUTTER }}>
                  <SectionTitle>{t('home.essentials')}</SectionTitle>
                  <Group>
                    <Row icon="bookmark" title={t('programme.agenda')} subtitle={t('programme.agendaSub')} onPress={() => router.push('/agenda')} />
                    <Row icon="siren" tone="red" title={t('visit.emergency')} subtitle={t('visit.emergencySub')} onPress={() => router.push('/guide/emergency')} />
                    <Row icon="train-front" title={t('visit.around')} subtitle={t('visit.aroundSub')} onPress={() => router.push('/guide/around')} />
                    <Row icon="list-checks" title={t('settings.sources')} subtitle={t('settings.sourcesSub')} onPress={() => router.push('/sources')} />
                  </Group>
                </View>
              </>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
