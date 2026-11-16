import React from 'react';
import { View, ScrollView, useWindowDimensions, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GUTTER } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Icon, type IconName } from '@/ui/Icon';
import { Tap } from '@/ui/Pressable';
import { lift } from '@/ui/lift';
import { Button, Skeleton } from '@/ui/controls';
import { Group, Row, SectionTitle } from '@/ui/lists';
import { Photo, SavedMark, SaveToggle, SessionRow, Tag, accessKey } from '@/ui/event';
import { THEME_PHOTO, UPDATE_PHOTO } from '@/ui/photos';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';
import { useT, type StringKey } from '@/i18n';
import { useContent } from '@/data/useContent';
import { useNow } from '@/data/useNow';
import { useAgenda } from '@/state/agenda';
import { FEATURED, UPDATES } from '@/data/guides';
import { dayProgress, durationMin, minutesUntil, nextUp } from '@/data/time';
import type { Session } from '@/data/types';

/**
 * One quick action (v1.4): a deep-green tile with a white icon top-left, the
 * label bottom-left, and a large faint copy of the icon bleeding off the corner.
 */
function Quick({ icon, label, onPress }: { icon: IconName; label: StringKey; onPress: () => void }) {
  const { c, dark } = useTheme();
  const { prefs } = usePrefs();
  const { t } = useT();
  const k = Math.min(prefs.textScale, 1.5);
  const fg = dark ? 'onPrimarySoft' : 'onInk';
  return (
    <Tap onPress={onPress} minTarget={false} accessibilityLabel={t(label)}
      style={{ width: Math.round(122 * k), height: Math.round(104 * k), borderRadius: 24, backgroundColor: dark ? c.primarySoft : c.ink, padding: 14, justifyContent: 'space-between', overflow: 'hidden', ...lift(dark) }}>
      <View accessible={false} importantForAccessibility="no-hide-descendants" aria-hidden style={{ position: 'absolute', right: -18, bottom: -20, opacity: 0.13 }}>
        <Icon name={icon} size={92} color={fg} stroke={1.6} />
      </View>
      <Icon name={icon} size={26} color={fg} stroke={2} />
      <Text variant="footnote" weight={700} color={fg} numberOfLines={2} maxFontSizeMultiplier={1.5}>{t(label)}</Text>
    </Tap>
  );
}

/** Words on a photograph always sit on this solid deep-green plate, never on the image itself. */
const PLATE = 'rgba(7, 46, 41, 0.92)';
const ON_PLATE = '#FFFFFF';

/** One featured session: a large rounded photograph with its title on a solid plate and a round arrow. */
function Feature({ s, width, onPress }: { s: Session; width: number; onPress: () => void }) {
  const { c, radius, dark } = useTheme();
  const { prefs } = usePrefs();
  const { t } = useT();
  // With enlarged text the card grows so the title keeps three full lines.
  const big = prefs.textScale >= 1.5;
  const h = big ? 330 : 236;
  return (
    <Tap onPress={onPress} minTarget={false} accessibilityRole="link" accessibilityLabel={`${t('programme.day', { d: s.day })}, ${s.start}. ${s.title.en}`}
      style={{ width, height: h, borderRadius: radius.lg, backgroundColor: c.surfaceAlt, ...lift(dark, 3) }}>
      <Photo name={THEME_PHOTO[s.theme]} height={h} radius={radius.lg} />
      <View style={{ position: 'absolute', left: 10, right: 10, bottom: 10, borderRadius: 20, backgroundColor: PLATE, paddingVertical: 12, paddingLeft: 16, paddingRight: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="label" numberOfLines={1} style={{ color: ON_PLATE, letterSpacing: 0 }}>{`${t('programme.day', { d: s.day })} · ${s.start} · ${s.format}`}</Text>
          <Text variant="headline" weight={700} numberOfLines={big ? 4 : 2} style={{ color: ON_PLATE }}>{s.title.en}</Text>
        </View>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow-right" size={20} color="onAccent" stroke={2.2} />
        </View>
      </View>
    </Tap>
  );
}

/** Page dots under the featured carousel. Decoration only: the cards themselves are the controls. */
function Dots({ count, index }: { count: number; index: number }) {
  const { c } = useTheme();
  return (
    <View accessible={false} importantForAccessibility="no-hide-descendants" aria-hidden style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, paddingTop: 0 }}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={{ width: i === index ? 20 : 6, height: 6, borderRadius: 3, backgroundColor: i === index ? c.primary : c.surfaceAlt }} />
      ))}
    </View>
  );
}

/** One explainer in the horizontal row: a raised white card with a photograph, its kind and its title. */
function Explainer({ id, kind, title, onPress }: { id: string; kind: string; title: string; onPress: () => void }) {
  const { c, dark } = useTheme();
  return (
    <Tap onPress={onPress} minTarget={false} accessibilityRole="link" accessibilityLabel={`${kind}. ${title}`}
      style={{ width: 216, borderRadius: 24, backgroundColor: c.surface, ...lift(dark) }}>
      <View style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' }}>
        <Photo name={UPDATE_PHOTO[id] ?? 'highland'} height={104} />
      </View>
      <View style={{ gap: 2, padding: 14 }}>
        <Text variant="label" color="primary" style={{ letterSpacing: 0 }}>{kind}</Text>
        <Text variant="headline" numberOfLines={3}>{title}</Text>
      </View>
    </Tap>
  );
}

/**
 * Home (v1.4, D76, D78, D79). Opens on information, not on a photograph: one
 * compact deep-green status card, search, a featured carousel, four quick
 * actions, the next sessions, explainers and the essentials. The structure
 * follows what the best host-country apps do; the look is our own (D67).
 * It is not tied to a day; the demonstration switch "Conference-day preview"
 * turns the status card into a live day and adds the next-session panel.
 */
export default function Home() {
  const { c, layout, brand, radius, dark } = useTheme();
  // In the dark theme the status card is a deep green surface, not a bright one.
  const onCard = dark ? 'onPrimarySoft' : 'onInk';
  const { prefs } = usePrefs();
  const { t } = useT();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [page, setPage] = React.useState(0);
  const { saved } = useAgenda();
  const data = useContent(async (r) => ({ event: await r.getEvent(), sessions: await r.listSessions() }));
  const now = useNow(data?.event);

  const enter = (delay: number) => (prefs.reduceMotion ? {} : { entering: FadeInDown.duration(240).delay(delay) });
  const Enter = prefs.reduceMotion ? View : Animated.View;
  const next = data && now ? nextUp(data.sessions.filter((s) => s.day === now.day), now) : undefined;
  const featured = data ? FEATURED.map((id) => data.sessions.find((s) => s.id === id)).filter((s): s is Session => !!s) : [];
  // Before the event the list is simply the opening sessions; on a live day it is what comes after now.
  const upcoming = data
    ? (now ? data.sessions.filter((s) => s.day === now.day && s.start > now.time) : data.sessions.filter((s) => s.day === 1)).filter((s) => s.id !== next?.id).slice(0, 3)
    : [];
  const inner = Math.min(width, layout.maxContentWidth) - GUTTER * 2;
  const step = inner + 12;
  const go = (href: Href) => () => router.push(href);
  const onCarousel = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / step);
    if (i !== page) setPage(Math.max(0, Math.min(featured.length - 1, i)));
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} {...({ tabIndex: 0 } as object)}>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: '100%', maxWidth: layout.maxContentWidth }}>
            <View style={{ marginHorizontal: GUTTER, marginTop: 8, backgroundColor: dark ? c.primarySoft : c.ink, borderRadius: radius.lg, padding: 20, gap: 8, ...lift(dark, 3) }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <Text variant="label" upper color={onCard} style={{ flexShrink: 1 }}>{now && data ? `${t('home.dayOf', { d: now.day, n: data.event.dayCount })} · ${now.time}` : t('home.kicker')}</Text>
                <SavedMark compact />
              </View>
              <Text variant="displaySmall" color={onCard} accessibilityRole="header">{t('home.title')}</Text>
              {now ? (
                <View accessible={false} importantForAccessibility="no-hide-descendants" aria-hidden style={{ height: 6, borderRadius: 3, marginTop: 4, overflow: 'hidden', flexDirection: 'row' }}>
                  <View style={{ flex: dayProgress(now.time), backgroundColor: c.accent, borderRadius: 3 }} />
                  <View style={{ flex: 1 - dayProgress(now.time), marginLeft: 4, borderRadius: 3, backgroundColor: c[onCard], opacity: 0.28 }} />
                </View>
              ) : null}
              <Tap onPress={go('/sources')} minTarget={false} accessibilityRole="link" accessibilityLabel={`${t('home.statusNote')} ${t('settings.sources')}`}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44, marginBottom: -8 }}>
                <Icon name="info" size={17} color={onCard} stroke={2} />
                <Text variant="footnote" color={onCard} style={{ flex: 1 }}>{t('home.statusNote')}</Text>
                <Icon name="chevron-right" size={18} color={onCard} stroke={2} />
              </Tap>
            </View>

            <Enter {...enter(40)} style={{ paddingHorizontal: GUTTER, paddingTop: 14 }}>
              <Tap onPress={go('/search')} minTarget={false} accessibilityRole="search" accessibilityLabel={t('search.placeholder')}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.surface, borderRadius: radius.pill, minHeight: 56, paddingHorizontal: 20, ...lift(dark, 1) }}>
                <Icon name="search" size={21} color="textSecondary" stroke={2} />
                <Text variant="callout" color="textSecondary" style={{ flex: 1 }}>{t('search.placeholder')}</Text>
              </Tap>
            </Enter>

            {next && now ? (
              <Enter {...enter(80)} style={{ marginHorizontal: GUTTER, marginTop: 18, backgroundColor: c.surface, borderRadius: radius.lg, padding: 18, gap: 8, ...lift(dark) }}>
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

            {!data ? (
              <View style={{ padding: GUTTER, gap: 12 }}><Skeleton height={24} width="40%" /><Skeleton height={236} /></View>
            ) : (
              <>
                <Enter {...enter(80)} style={{ paddingHorizontal: GUTTER, paddingTop: 6 }}>
                  <SectionTitle action={t('home.all')} onAction={go('/programme')}>{t('home.highlights')}</SectionTitle>
                </Enter>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={step} decelerationRate="fast" onScroll={onCarousel} scrollEventThrottle={32}
                  contentContainerStyle={{ paddingHorizontal: GUTTER, gap: 12, paddingTop: 12, paddingBottom: 18 }} {...({ tabIndex: 0 } as object)}>
                  {featured.map((s) => <Feature key={s.id} s={s} width={inner} onPress={go(`/session/${s.id}`)} />)}
                </ScrollView>
                <Dots count={featured.length} index={page} />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: GUTTER, gap: 12, paddingTop: 22, paddingBottom: 14 }} {...({ tabIndex: 0 } as object)}>
                  <Quick icon="calendar" label="tab.programme" onPress={go('/programme')} />
                  <Quick icon="bookmark" label="programme.agenda" onPress={go('/agenda')} />
                  <Quick icon="map" label="tab.map" onPress={go('/map')} />
                  <Quick icon="users" label="programme.speakers" onPress={go('/speakers')} />
                  <Quick icon="landmark" label="programme.exhibitors" onPress={go('/exhibitors')} />
                  <Quick icon="book-open" label="glossary.title" onPress={go('/glossary')} />
                </ScrollView>


                {saved.size > 0 ? (
                  // Appears once something is saved: the visitor's own agenda, one tap away.
                  <View style={{ paddingHorizontal: GUTTER, paddingTop: 4 }}>
                    <Group>
                      <Row icon="bookmark" title={t('home.yourAgenda')} subtitle={t('home.savedCount', { n: saved.size })} onPress={go('/agenda')} />
                    </Group>
                  </View>
                ) : null}

                <View style={{ paddingHorizontal: GUTTER, paddingTop: 12 }}>
                  <SectionTitle action={t('home.seeAll')} onAction={go('/programme')}>{t('home.upcoming')}</SectionTitle>
                  <View style={{ paddingTop: 4 }}>
                    {upcoming.map((s, i) => <SessionRow key={s.id} session={s} now={now} index={i} showDay={!now} onPress={go(`/session/${s.id}`)} />)}
                  </View>
                </View>

                <View style={{ paddingHorizontal: GUTTER, paddingTop: 6 }}>
                  <SectionTitle action={t('home.seeAll')} onAction={go('/updates')}>{t('home.explainers')}</SectionTitle>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: GUTTER, gap: 12, paddingTop: 12, paddingBottom: 16 }} {...({ tabIndex: 0 } as object)}>
                  {UPDATES.map((u) => <Explainer key={u.id} id={u.id} kind={u.kind} title={u.title} onPress={go(`/explainer/${u.id}`)} />)}
                </ScrollView>

                <View style={{ paddingHorizontal: GUTTER, paddingTop: 10 }}>
                  <SectionTitle>{t('home.essentials')}</SectionTitle>
                  <View style={{ paddingTop: 6 }}>
                    <Group>
                      <Row icon="ticket" title={t('home.canAttend')} subtitle={t('home.canAttendSub')} onPress={go('/guide/attend')} />
                      <Row icon="luggage" title={t('home.plan')} subtitle={t('home.planSub')} onPress={go('/visit')} />
                      <Row icon="siren" tone="red" title={t('visit.emergency')} subtitle={t('visit.emergencySub')} onPress={go('/guide/emergency')} />
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
