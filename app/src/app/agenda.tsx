import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, SubHeader } from '@/ui/chrome';
import { Button, Skeleton, StateBlock } from '@/ui/controls';
import { SectionTitle } from '@/ui/lists';
import { SavedMark, SessionRow } from '@/ui/event';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { useContent } from '@/data/useContent';
import { useNow } from '@/data/useNow';
import { useAgenda } from '@/state/agenda';

/** My agenda: every session saved on this phone, across all days, in order. */
export default function Agenda() {
  const { c } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const { saved } = useAgenda();
  const data = useContent(async (r) => ({ event: await r.getEvent(), sessions: await r.listSessions() }));
  const now = useNow(data?.event);
  const mine = (data?.sessions ?? []).filter((s) => saved.has(s.id));
  const days = [...new Set(mine.map((s) => s.day))];
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <SubHeader />
      <Page title={t('programme.agenda')} sub={t('agenda.lead')} right={<SavedMark />}>
        {!data ? (
          <View style={{ gap: 14 }}><Skeleton height={20} width="40%" /><Skeleton height={56} /><Skeleton height={56} /></View>
        ) : mine.length === 0 ? (
          <StateBlock icon="bookmark" title={t('agenda.empty')} body={t('agenda.emptySub')} action={<Button kind="dark" icon="calendar" label={t('home.cta')} onPress={() => router.push('/programme')} />} />
        ) : (
          days.map((d) => (
            <View key={d}>
              <SectionTitle>{t('programme.day', { d })}</SectionTitle>
              {mine.filter((s) => s.day === d).map((s, i) => (
                <SessionRow key={s.id} session={s} now={now} index={i} onPress={() => router.push(`/session/${s.id}`)} />
              ))}
            </View>
          ))
        )}
      </Page>
    </View>
  );
}
