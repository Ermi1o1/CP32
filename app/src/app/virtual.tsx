import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, SubHeader } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { SectionTitle } from '@/ui/lists';
import { SessionRow } from '@/ui/event';
import { JoinVirtually } from '@/ui/JoinVirtually';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { useContent } from '@/data/useContent';
import { useNow } from '@/data/useNow';

/** Attend virtually: what the virtual event platform offers, the lobby, and the sessions streamed on it. */
export default function Virtual() {
  const { c } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const data = useContent(async (r) => ({ event: await r.getEvent(), sessions: await r.listSessions() }));
  const now = useNow(data?.event);
  const online = (data?.sessions ?? []).filter((s) => s.delivery === 'hybrid' || s.delivery === 'virtual');
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <SubHeader />
      <Page title={t('vep.title')}>
        <Text variant="body">{t('vep.intro')}</Text>
        <JoinVirtually />
        <Text variant="footnote" color="textSecondary">{t('vep.how')}</Text>
        {online.length ? (
          <View>
            <SectionTitle>{t('vep.hybrid')}</SectionTitle>
            {online.map((s, i) => <SessionRow key={s.id} session={s} now={now} index={i} showDay onPress={() => router.push(`/session/${s.id}`)} />)}
          </View>
        ) : null}
      </Page>
    </View>
  );
}
