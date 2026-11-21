import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Page, SubHeader } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Button, Skeleton, StateBlock } from '@/ui/controls';
import { SectionTitle } from '@/ui/lists';
import { SessionRow } from '@/ui/event';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { useContent } from '@/data/useContent';
import { useNow } from '@/data/useNow';

export default function SpeakerPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c } = useTheme();
  const { t } = useT();
  const router = useRouter();
  
  const data = useContent(async (r) => {
    const [event, people, sessions] = await Promise.all([r.getEvent(), r.getSpeakers([String(id)]), r.listSessions()]);
    return { event, person: people[0], sessions: sessions.filter((s) => s.speakerIds.includes(String(id))) };
  }, [id]);
  
  const now = useNow();

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <SubHeader title={t('programme.speakers')} />
      {!data ? (
        <Page><Skeleton height={40} width="70%" /><Skeleton height={20} width="50%" /><Skeleton height={100} style={{ marginTop: 20 }} /></Page>
      ) : !data.person ? (
        <Page><StateBlock icon="user-round" title={t('speakers.notFound')} body={t('speakers.notFoundSub')} action={<Button kind="dark" label={t('programme.speakers')} onPress={() => router.replace('/speakers')} />} /></Page>
      ) : (
        <Page title={data.person.name} sub={`${data.person.role} · ${data.person.org}`}>
          
          {data.person.bio ? (
            <View style={{ backgroundColor: c.surface, padding: 16, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: c.border }}>
              <Text variant="body" style={{ lineHeight: 24 }}>
                {data.person.bio}
              </Text>
            </View>
          ) : null}

          <SectionTitle>{`${t('speakers.sessions')} · ${data.sessions.length}`}</SectionTitle>
          <View>
            {data.sessions.map((s, i) => <SessionRow key={s.id} session={s} now={now} index={i} showDay onPress={() => router.push(`/session/${s.id}`)} />)}
          </View>
        </Page>
      )}
    </View>
  );
}