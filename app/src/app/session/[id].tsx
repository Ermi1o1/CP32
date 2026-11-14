import React from 'react';
import { View, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tick } from '@/ui/haptic';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SubHeader } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Icon } from '@/ui/Icon';
import { Tap } from '@/ui/Pressable';
import { Button, Skeleton, StateBlock } from '@/ui/controls';
import { HorizonLine, Photo, SavedMark, SaveToggle, Tag, accessKey } from '@/ui/event';
import { THEME_PHOTO } from '@/ui/photos';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { useContent } from '@/data/useContent';
import { useAgenda } from '@/state/agenda';
import { durationMin, phaseOf } from '@/data/time';

/**
 * Session page (v1.0). Photograph → THE LINE with the day → title → the clock
 * time, large → one primary action (save) → where → what → who.
 * Every field is always present, or visibly "to be confirmed".
 */
export default function SessionPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c, layout } = useTheme();
  const { prefs } = usePrefs();
  const { t } = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isSaved, toggle } = useAgenda();
  const data = useContent(async (r) => {
    const [event, session] = await Promise.all([r.getEvent(), r.getSession(String(id))]);
    const speakers = session ? await r.getSpeakers(session.speakerIds) : [];
    return { event, session, speakers };
  }, [id]);

  const heroH = 210 + insets.top;
  const Enter = prefs.reduceMotion ? View : Animated.View;
  const enter = (delay: number) => (prefs.reduceMotion ? {} : { entering: FadeInDown.duration(240).delay(delay) });

  if (!data) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <SubHeader />
        <View style={{ padding: 20, gap: 14 }}><Skeleton height={160} /><Skeleton height={3} /><Skeleton height={30} width="85%" /><Skeleton height={44} width="55%" /><Skeleton height={52} /></View>
      </View>
    );
  }
  const { event, session, speakers } = data;
  if (!session) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <SubHeader />
        <View style={{ padding: 20 }}>
          <StateBlock icon="calendar" title={t('session.notFound')} body={t('session.notFoundSub')} action={<Button kind="dark" label={t('home.cta')} onPress={() => router.replace('/programme')} />} />
        </View>
      </View>
    );
  }
  const phase = phaseOf(session, event.demoNow);
  const saved = isSaved(session.id);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 + insets.bottom }} {...({ tabIndex: 0 } as object)}>
        <View>
          <Photo name={THEME_PHOTO[session.theme]} height={heroH} />
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
            <SubHeader onPhoto right={<View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center' }}><SaveToggle id={session.id} title={session.title.en} size={22} /></View>} />
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: '100%', maxWidth: layout.maxContentWidth }}>
            <HorizonLine left={`${t('programme.day', { d: session.day })} · ${session.format}`} right={<SavedMark compact />} />

            <Enter {...enter(40)} style={{ paddingHorizontal: 20, paddingTop: 16, gap: 10 }}>
              <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                {phase === 'live' ? <Tag kind="live" label={t('phase.live')} /> : phase === 'ended' ? <Tag kind="ended" label={t('phase.ended')} /> : null}
                <Tag kind={session.access === 'public' ? 'public' : 'restricted'} label={t(accessKey(session.access))} />
              </View>
              <Text variant="display" accessibilityRole="header">{session.title.en}</Text>
            </Enter>

            <Enter {...enter(100)} style={{ paddingHorizontal: 20, paddingTop: 16 }}>
              <View style={{ height: 1, backgroundColor: c.text }} />
              <View style={{ flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, paddingTop: 12 }} accessible accessibilityLabel={`${session.start} to ${session.end}`}>
                <Text variant="clock">{session.start}</Text>
                <Text variant="title2" weight={400} color="textSecondary" tabular>– {session.end}</Text>
              </View>
              <Text variant="footnote" color="textSecondary" style={{ paddingTop: 2, paddingBottom: 12 }}>{t('session.yourTime')} · {t('session.minutes', { m: durationMin(session) })}</Text>
              <View style={{ height: 1, backgroundColor: c.divider }} />
              <Tap onPress={() => router.push('/map')} minTarget={false} accessibilityRole="link" accessibilityLabel={`${session.room}. ${t('session.onMap')}`}
                style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12, minHeight: 56, paddingVertical: 8 }}>
                <Icon name="map-pin" size={22} color="primary" stroke={2} />
                <Text variant="headline" weight={700} style={{ flexGrow: 1 }}>{session.room}</Text>
                <Text variant="subhead" weight={700} color="primary">{t('session.onMap')}</Text>
                <Icon name="chevron-right" size={18} color="primary" stroke={2} />
              </Tap>
              <View style={{ height: 1, backgroundColor: c.text }} />
            </Enter>

            <Enter {...enter(160)} style={{ paddingHorizontal: 20, paddingTop: 18 }}>
              <Button
                kind={saved ? 'outline' : 'primary'} wide icon={saved ? 'circle-check' : 'bookmark'}
                label={t(saved ? 'session.saved' : 'session.save')}
                accessibilityHint={saved ? t('session.unsave') : undefined}
                onPress={() => {
                  tick(toggle(session.id) ? 'confirm' : 'undo');
                }}
              />
            </Enter>

            {session.body.en ? (
              <Enter {...enter(200)} style={{ paddingHorizontal: 20, paddingTop: 22, gap: 8 }}>
                <Text variant="label" upper color="textSecondary" accessibilityRole="header">{t('session.about')}</Text>
                <Text variant="body">{session.body.en}</Text>
              </Enter>
            ) : null}

            {speakers.length ? (
              <Enter {...enter(240)} style={{ paddingHorizontal: 20, paddingTop: 24 }}>
                <Text variant="label" upper color="textSecondary" accessibilityRole="header">{t('session.speaking')}</Text>
                <View style={{ height: 1, backgroundColor: c.divider, marginTop: 8 }} />
                {speakers.map((p) => (
                  <View key={p.id}>
                    <View accessible accessibilityLabel={`${p.name}, ${p.role}, ${p.org}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 }}>
                      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}>
                        <Text variant="subhead" weight={800} color="primary">{p.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text variant="headline" weight={700}>{p.name}</Text>
                        <Text variant="footnote" color="textSecondary">{p.role} · {p.org}</Text>
                      </View>
                    </View>
                    <View style={{ height: 1, backgroundColor: c.divider }} />
                  </View>
                ))}
              </Enter>
            ) : null}

            <Text variant="footnote" color="textTertiary" style={{ paddingHorizontal: 20, paddingTop: 20 }}>{t('session.illustrative')}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
