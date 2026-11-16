import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Page, SubHeader } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Button, StateBlock } from '@/ui/controls';
import { Group, Row, SectionTitle, initialsOf } from '@/ui/lists';
import { Photo, SessionRow } from '@/ui/event';
import { THEME_PHOTO } from '@/ui/photos';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { useContent } from '@/data/useContent';
import { useNow } from '@/data/useNow';
import { EXHIBITORS } from '@/data/exhibitors';
import { PLACES } from '@/data/guides';

/** One exhibitor: what they show, where to find them, their people and their sessions. */
export default function ExhibitorPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c, radius } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const e = EXHIBITORS.find((x) => x.id === String(id));
  const data = useContent(async (r) => {
    const [event, people, sessions] = await Promise.all([r.getEvent(), r.listSpeakers(), r.listSessions()]);
    const mine = people.filter((p) => p.org === e?.name);
    const ids = new Set(mine.map((p) => p.id));
    return { event, people: mine, sessions: sessions.filter((s) => s.speakerIds.some((x) => ids.has(x))) };
  }, [id]);
  const now = useNow(data?.event);
  const place = PLACES.find((p) => p.id === e?.placeId);
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <SubHeader title={t('exhibitors.title')} />
      {!e ? (
        <Page><StateBlock icon="building-2" title={t('exhibitors.notFound')} body={t('exhibitors.notFoundSub')} action={<Button kind="dark" label={t('exhibitors.title')} onPress={() => router.replace('/exhibitors')} />} /></Page>
      ) : (
        <Page title={e.name} sub={e.kind}>
          <Photo name={THEME_PHOTO[e.theme]} height={170} radius={radius.md} />
          <Text variant="body">{e.about}</Text>
          <Group>
            <View style={{ height: 0 }} />
            <Row icon="map-pin" title={`${place?.name ?? ''} · ${t('exhibitors.stand', { s: e.stand })}`} subtitle={place?.note} value={t('session.onMap')} onPress={() => router.push('/map')} />
          </Group>
          {data && data.sessions.length ? (
            <View>
              <SectionTitle>{`${t('speakers.sessions')} · ${data.sessions.length}`}</SectionTitle>
              {data.sessions.map((s, i) => <SessionRow key={s.id} session={s} now={now} index={i} showDay onPress={() => router.push(`/session/${s.id}`)} />)}
            </View>
          ) : null}
          {data && data.people.length ? (
            <View>
              <SectionTitle>{t('exhibitors.people')}</SectionTitle>
              <Group>
                {data.people.map((p) => <Row key={p.id} initials={initialsOf(p.name)} title={p.name} subtitle={p.role} onPress={() => router.push(`/speaker/${p.id}`)} />)}
              </Group>
            </View>
          ) : null}
          <Text variant="footnote" color="textTertiary">{t('exhibitors.illustrative')}</Text>
        </Page>
      )}
    </View>
  );
}
