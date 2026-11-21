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

function Quick({ icon, label, onPress }: { icon: IconName; label: StringKey; onPress: () => void }) {
  const { c, dark } = useTheme();
  const { t } = useT();
  return (
    <Tap onPress={onPress} minTarget={false} accessibilityLabel={t(label)}
      style={{ width: 104, height: 104, borderRadius: 20, backgroundColor: dark ? c.primarySoft : c.ink, padding: 14, justifyContent: 'space-between', overflow: 'hidden', ...lift(dark, 1) }}>
      <View accessible={false} importantForAccessibility="no-hide-descendants" aria-hidden style={{ position: 'absolute', right: -12, bottom: -16, opacity: 0.1 }}>
        <Icon name={icon} size={72} color={dark ? 'onPrimarySoft' : 'onInk'} stroke={1.6} />
      </View>
      <Icon name={icon} size={24} color={dark ? 'onPrimarySoft' : 'onInk'} stroke={2} />
      <Text variant="footnote" weight={600} color={dark ? 'onPrimarySoft' : 'onInk'} numberOfLines={2} style={{ marginTop: 'auto' }}>{t(label)}</Text>
    </Tap>
  );
}

const PLATE = 'rgba(7, 46, 41, 0.92)';
const ON_PLATE = '#FFFFFF';

function Feature({ s, width, onPress }: { s: Session; width: number; onPress: () => void }) {
  const { c, dark } = useTheme();
  const { t } = useT();
  const h = 220;
  const a11yLabel = t('programme.day', { d: s.day }) + ', ' + s.start + '. ' + s.title.en;

  return (
    <Tap onPress={onPress} minTarget={false} accessibilityRole="link" accessibilityLabel={a11yLabel}
      style={{ width, height: h, borderRadius: 24, backgroundColor: c.surfaceAlt, ...lift(dark, 2) }}>
      <Photo name={THEME_PHOTO[s.theme]} height={h} radius={24} />
      <View style={{ position: 'absolute', left: 12, right: 12, bottom: 12, borderRadius: 16, backgroundColor: PLATE, paddingVertical: 12, paddingLeft: 16, paddingRight: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text variant="label" weight={600} numberOfLines={1} style={{ color: ON_PLATE, letterSpacing: 0.5 }}>{t('programme.day', { d: s.day })} · {s.start} · {s.format}</Text>
          <Text variant="headline" weight={700} numberOfLines={2} style={{ color: ON_PLATE, fontSize: 17 }}>{s.title.en}</Text>
        </View>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow-right" size={18} color="onAccent" stroke={2.2} />
        </View>
      </View>
    </Tap>
  );
}

function Dots({ count, index }: { count: number; index: number }) {
  const { c } = useTheme();
  return (
    <View accessible={false} importantForAccessibility="no-hide-descendants" aria-hidden style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, paddingTop: 8 }}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={{ width: i === index ? 20 : 6, height: 6, borderRadius: 3, backgroundColor: i === index ? c.primary : c.border }} />
      ))}
    </View>
  );
}
function Explainer({ id, kind, title, onPress }: { id: string; kind: string; title: string; onPress: () => void }) {
  const { c, dark } = useTheme();
  return (
    <Tap onPress={onPress} minTarget={false} accessibilityRole="link" accessibilityLabel={kind + '. ' + title}
      style={{ width: 220, borderRadius: 16, backgroundColor: c.surface, ...lift(dark, 1) }}>
      <View style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: 'hidden' }}>
        <Photo name={UPDATE_PHOTO[id] ?? 'highland'} height={100} />
      </View>
      <View style={{ gap: 4, padding: 14 }}>
        <Text variant="label" weight={600} color="primary" style={{ letterSpacing: 0.5 }}>{kind}</Text>
        <Text variant="body" weight={600} numberOfLines={2} style={{ fontSize: 15 }}>{title}</Text>
      </View>
    </Tap>
  );
}

export default function Home() {
  const { c, layout, brand, radius, dark } = useTheme();
  const onCard = dark ? 'onPrimarySoft' : 'onInk';
  const { prefs } = usePrefs();
  const { t } = useT();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [page, setPage] = React.useState(0);
  const { saved } = useAgenda();
  const data = useContent(async (r) => ({ event: await r.getEvent(), sessions: await r.listSessions() }));
  
  const liveNow = useNow(data?.event);
  const now = data?.event?.demoNow || liveNow;
  const enter = (delay: number) => (prefs.reduceMotion ? {} : { entering: FadeInDown.duration(240).delay(delay) });
  const Enter = prefs.reduceMotion ? View : Animated.View;

  const liveSession = data && now ? data.sessions.find(s => s.day === now.day && s.start <= now.time && s.end > now.time) : undefined;
  const next = data && now ? nextUp(data.sessions.filter(s => s.day === now.day && s.start > now.time), now) : undefined;
  const featured = data ? FEATURED.map((id) => data.sessions.find((s) => s.id === id)).filter((s): s is Session => !!s) : [];
  
  const upcoming = data
    ? (now ? data.sessions.filter((s) => s.day === now.day && s.start > (next?.end || now.time)) : data.sessions.filter((s) => s.day === 1))
        .filter((s) => s.id !== next?.id && s.id !== liveSession?.id)
        .slice(0, 3)
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
            
            <View style={{ marginHorizontal: GUTTER, marginTop: 8, backgroundColor: dark ? c.primarySoft : c.ink, borderRadius: 20, padding: 20, gap: 8, ...lift(dark, 2) }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <Text variant="label" upper weight={600} color={onCard} style={{ flexShrink: 1, letterSpacing: 0.5 }}>{now && data ? t('home.dayOf', { d: now.day, n: data.event.dayCount }) + ' · ' + now.time : t('home.kicker')}</Text>
                <SavedMark compact />
              </View>
              <Text variant="displaySmall" weight={700} color={onCard} accessibilityRole="header">{t('home.title')}</Text>
              {now ? (
                <View accessible={false} importantForAccessibility="no-hide-descendants" aria-hidden style={{ height: 6, borderRadius: 3, marginTop: 8, overflow: 'hidden', flexDirection: 'row' }}>
                  <View style={{ flex: dayProgress(now.time), backgroundColor: c.accent, borderRadius: 3 }} />
<View style={{ flex: 1 - dayProgress(now.time), marginLeft: 4, borderRadius: 3, backgroundColor: c[onCard], opacity: 0.28 }} />
                </View>
              ) : null}
            </View>

            <Enter {...enter(40)} style={{ paddingHorizontal: GUTTER, paddingTop: 16 }}>
              <Tap onPress={go('/search')} minTarget={false} accessibilityRole="search" accessibilityLabel={t('search.placeholder')}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.surface, borderRadius: radius.pill, minHeight: 52, paddingHorizontal: 20, ...lift(dark, 1) }}>
                <Icon name="search" size={20} color="textSecondary" stroke={2} />
                <Text variant="callout" color="textSecondary" style={{ flex: 1, fontSize: 15 }}>{t('search.placeholder')}</Text>
              </Tap>
            </Enter>

            {liveSession && now ? (
              <Enter {...enter(60)} style={{ marginHorizontal: GUTTER, marginTop: 20, backgroundColor: c.surface, borderWidth: 1, borderColor: '#E53935', borderRadius: 20, padding: 18, gap: 10, ...lift(dark, 2) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <View style={{ backgroundColor: '#E53935', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                     <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF' }} />
                     <Text variant="label" weight={700} style={{ color: '#FFF', letterSpacing: 0.5 }}>LIVE NOW</Text>
                  </View>
                  <Tag kind={liveSession.access === 'public' ? 'public' : 'restricted'} label={t(accessKey(liveSession.access))} />
                </View>
                <Tap onPress={go('/session/' + liveSession.id)} minTarget={false} accessibilityRole="link" style={{ gap: 4 }}>
                  <Text variant="label" weight={600} style={{ color: '#E53935' }}>{liveSession.start} - {liveSession.end}</Text>
                  <Text variant="headline" weight={700} style={{ color: c.text, fontSize: 20 }}>{liveSession.title.en}</Text>
                  <Text variant="footnote" color="textSecondary" style={{ marginTop: 2 }}>{[liveSession.room, liveSession.format].join(' · ')}</Text>
                </Tap>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 6, alignItems: 'center' }}>
                  <Button kind="primary" flex={1} label={t('session.viewLive') || 'View Live Session'} onPress={go('/session/' + liveSession.id)} />
                  <View style={{ borderRadius: 24, width: 48, height: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: c.bg }}>
                    <SaveToggle id={liveSession.id} title={liveSession.title.en} />
                  </View>
                </View>
              </Enter>
            ) : null}

            {next && now ? (
              <Enter {...enter(80)} style={{ marginHorizontal: GUTTER, marginTop: 20, backgroundColor: c.surface, borderRadius: 20, padding: 18, gap: 8, ...lift(dark, 1) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <Tag kind="next" label={t('home.next') + ' · ' + t('home.inMin', { m: minutesUntil(next.start, now.time) })} />
                </View>
                <Tap onPress={go('/session/' + next.id)} minTarget={false} accessibilityRole="link" style={{ gap: 4 }}>
                  <Text variant="label" weight={600} color="textSecondary">{next.start}</Text>
                  <Text variant="headline" weight={700} style={{ fontSize: 20 }}>{next.title.en}</Text>
                  <Text variant="footnote" color="textSecondary" style={{ marginTop: 2 }}>{[next.room, next.format, t('session.minutes', { m: durationMin(next) })].join(' · ')}</Text>
                </Tap>
              </Enter>
            ) : null}
{!data ? (
              <View style={{ padding: GUTTER, gap: 12 }}><Skeleton height={24} width="40%" /><Skeleton height={220} /></View>
            ) : (
              <>
                <Enter {...enter(80)} style={{ paddingHorizontal: GUTTER, paddingTop: 16 }}>
                  <SectionTitle action={t('home.all')} onAction={go('/programme')}>{t('home.highlights')}</SectionTitle>
                </Enter>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={step} decelerationRate="fast" onScroll={onCarousel} scrollEventThrottle={32}
                  contentContainerStyle={{ paddingHorizontal: GUTTER, gap: 16, paddingTop: 8, paddingBottom: 16 }} {...({ tabIndex: 0 } as object)}>
                  {featured.map((s) => <Feature key={s.id} s={s} width={inner} onPress={go('/session/' + s.id)} />)}
                </ScrollView>
                <Dots count={featured.length} index={page} />

                <View style={{ paddingTop: 24 }}>
                  <View style={{ paddingHorizontal: GUTTER }}>
                    <SectionTitle>{t('home.sections')}</SectionTitle>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: GUTTER, gap: 12, paddingTop: 8, paddingBottom: 8 }} {...({ tabIndex: 0 } as object)}>
                    <Quick icon="calendar" label="tab.programme" onPress={go('/programme')} />
                    <Quick icon="bookmark" label="programme.agenda" onPress={go('/agenda')} />
                    <Quick icon="map" label="tab.map" onPress={go('/map')} />
                    <Quick icon="train-front" label="transport.title" onPress={go('/transport')} />
                    <Quick icon="users" label="programme.speakers" onPress={go('/speakers')} />
                    <Quick icon="book-open" label="glossary.title" onPress={go('/glossary')} />
                  </ScrollView>
                </View>

                {saved.size > 0 ? (
                  <View style={{ paddingHorizontal: GUTTER, paddingTop: 12 }}>
                    <Group>
                      <Row icon="bookmark" title={t('home.yourAgenda')} subtitle={t('home.savedCount', { n: saved.size })} onPress={go('/agenda')} />
                    </Group>
                  </View>
                ) : null}

                <View style={{ paddingHorizontal: GUTTER, paddingTop: 20 }}>
                  <SectionTitle action={t('home.seeAll')} onAction={go('/programme')}>{t('home.upcoming')}</SectionTitle>
                  <View style={{ paddingTop: 4 }}>
                    {upcoming.map((s, i) => <SessionRow key={s.id} session={s} now={now} index={i} showDay={!now} onPress={go('/session/' + s.id)} />)}
                  </View>
                </View>

                <View style={{ paddingHorizontal: GUTTER, paddingTop: 20 }}>
                  <SectionTitle action={t('home.seeAll')} onAction={go('/updates')}>{t('home.explainers')}</SectionTitle>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: GUTTER, gap: 12, paddingTop: 8, paddingBottom: 16 }} {...({ tabIndex: 0 } as object)}>
                  {UPDATES.map((u) => <Explainer key={u.id} id={u.id} kind={u.kind} title={u.title} onPress={go('/explainer/' + u.id)} />)}
                </ScrollView>

                <View style={{ paddingHorizontal: GUTTER, paddingTop: 20 }}>
                  <SectionTitle>{t('home.essentials')}</SectionTitle>
                  <View style={{ paddingTop: 4 }}>
                    <Group>
                      <Row icon="ticket" title={t('home.canAttend')} subtitle={t('home.canAttendSub')} onPress={go('/guide/attend')} />
                      <Row icon="luggage" title={t('home.plan')} subtitle={t('home.planSub')} onPress={go('/visit')} />
                      <Row icon="siren" tone="red" title={t('visit.emergency')} subtitle={t('visit.emergencySub')} onPress={go('/guide/emergency')} />
                    </Group>
                  </View>
                  <Text variant="footnote" color="textTertiary" center style={{ paddingTop: 24, paddingBottom: 12 }}>{t(brand.descriptorKey)}</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}