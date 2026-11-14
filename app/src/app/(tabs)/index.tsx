import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { AppHeader } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Button, Skeleton, StateBlock } from '@/ui/controls';
import { HorizonLine, Photo, SavedMark, SessionRow, SaveToggle, Tag, accessKey } from '@/ui/event';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { useContent } from '@/data/useContent';
import { dayProgress, durationMin, minutes, minutesUntil, nextUp } from '@/data/time';

/**
 * Home (v1.0). One question, answered in one glance: what is next?
 *
 *   photograph → THE LINE (day, time, saved-on-phone; a dot shows where we are in the day)
 *   → the next session, with its clock time as the largest thing on the screen
 *   → the rest of today as a timetable.
 */
export default function Home() {
  const { c, layout, brand } = useTheme();
  const { prefs } = usePrefs();
  const { t } = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const event = useContent((r) => r.getEvent());
  const today = useContent(async (r) => {
    const e = await r.getEvent();
    return r.listSessions({ day: e.demoNow.day });
  });

  const heroH = Math.round(250 + insets.top);
  const Enter = prefs.reduceMotion ? View : Animated.View;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} {...({ tabIndex: 0 } as object)}>
        <View>
          <Photo name="highland" height={heroH} />
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
            <AppHeader onPhoto />
          </View>
        </View>

        {!event || !today ? (
          <View style={{ padding: 20, gap: 12 }}>
            <Skeleton height={3} />
            <Skeleton height={14} width="45%" />
            <Skeleton height={44} width="40%" />
            <Skeleton height={26} width="90%" />
            <Skeleton height={52} />
          </View>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '100%', maxWidth: layout.maxContentWidth }}>
              <HorizonLine
                progress={dayProgress(event.demoNow.time)}
                left={`${t('home.dayOf', { d: event.demoNow.day, n: event.dayCount })} · ${event.demoNow.time} ${t('home.addisTime')}`}
                right={<SavedMark />}
              />
              {/* The permanent independence line (D66, D65a): always on Home, directly under the status. */}
              <Text variant="footnote" color="textSecondary" style={{ paddingHorizontal: 20, paddingTop: 6 }}>{t(brand.descriptorKey)}</Text>

              {(() => {
                const next = nextUp(today, event.demoNow);
                if (!next) {
                  return (
                    <View style={{ padding: 20 }}>
                      <StateBlock icon="circle-check" title={t('home.nothingNext')} body={t('home.nothingNextSub')} action={<Button kind="dark" label={t('home.cta')} onPress={() => router.push('/programme')} />} />
                    </View>
                  );
                }
                const later = today.filter((s) => minutes(s.start) > minutes(next.start));
                return (
                  <>
                    <Enter {...(prefs.reduceMotion ? {} : { entering: FadeInDown.duration(240).delay(60) })} style={{ paddingHorizontal: 20, paddingTop: 18, gap: 8 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <Tag kind="next" label={`${t('home.next')} · ${t('home.inMin', { m: minutesUntil(next.start, event.demoNow.time) })}`} />
                        <Text variant="footnote" color="textSecondary">{[next.room, next.format, t('session.minutes', { m: durationMin(next) })].join(' · ')}</Text>
                      </View>
                      <View style={{ flexDirection: prefs.textScale >= 1.3 ? 'column' : 'row', alignItems: 'flex-start', gap: prefs.textScale >= 1.3 ? 4 : 14 }}>
                        <Text variant="clock" accessibilityLabel={next.start}>{next.start}</Text>
                        <View style={{ flex: prefs.textScale >= 1.3 ? undefined : 1, paddingTop: 2 }}>
                          <Text variant="displaySmall" accessibilityRole="header" onPress={() => router.push(`/session/${next.id}`)}>{next.title.en}</Text>
                        </View>
                      </View>
                      <Text variant="footnote" color="textSecondary">{t(accessKey(next.access))}</Text>
                      <View style={{ flexDirection: 'row', gap: 10, marginTop: 8, alignItems: 'center' }}>
                        <Button kind="primary" flex={1} icon="chevron-right" label={t('home.open')} onPress={() => router.push(`/session/${next.id}`)} />
                        <View style={{ borderWidth: 1.5, borderColor: c.border, borderRadius: 14, width: 52, height: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: c.surface }}>
                          <SaveToggle id={next.id} title={next.title.en} />
                        </View>
                      </View>
                    </Enter>

                    <Enter {...(prefs.reduceMotion ? {} : { entering: FadeIn.duration(240).delay(140) })} style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 28, paddingBottom: 4 }}>
                      <Text variant="title3" accessibilityRole="header">{t('home.later')}</Text>
                      <Text variant="subhead" weight={700} color="primary" onPress={() => router.push('/programme')} accessibilityRole="link">{t('home.all')} ›</Text>
                    </Enter>
                    <View style={{ height: 1, backgroundColor: c.text, marginHorizontal: 20, marginTop: 6 }} />
                    {later.slice(0, 4).map((s, i) => (
                      <SessionRow key={s.id} session={s} now={event.demoNow} index={i + 3} onPress={() => router.push(`/session/${s.id}`)} />
                    ))}
                  </>
                );
              })()}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
