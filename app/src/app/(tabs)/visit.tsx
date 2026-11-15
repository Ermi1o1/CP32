import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Page } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Icon } from '@/ui/Icon';
import { Tap } from '@/ui/Pressable';
import { Group, Row, SectionTitle } from '@/ui/lists';
import { SavedMark } from '@/ui/event';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { GUIDES } from '@/data/guides';

/** Visit (v1.1): the emergency entry first and unmistakable, then the practical guides as one ruled list. */
export default function Visit() {
  const { c, radius } = useTheme();
  const { prefs } = usePrefs();
  const { t } = useT();
  const roomy = prefs.textScale < 1.5;
  const router = useRouter();
  const emergency = GUIDES.find((g) => g.emergency)!;
  return (
    <Page title={t('tab.visit')} sub={t('visit.lead')} right={<SavedMark />}>
      <Tap onPress={() => router.push('/guide/emergency')} minTarget={false} accessibilityRole="link" accessibilityLabel={`${emergency.title}. ${emergency.summary}`}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: c.ink, borderRadius: radius.md, padding: 16, minHeight: 76 }}>
        {roomy ? (
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.danger, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="siren" size={22} color="onDanger" stroke={2} />
          </View>
        ) : null}
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="headline" color="onInk">{emergency.title}</Text>
          <Text variant="footnote" color="onInk">{emergency.summary}</Text>
        </View>
        <Icon name="chevron-right" size={20} color="onInk" stroke={2} />
      </Tap>

      <SectionTitle>{t('visit.guides')}</SectionTitle>
      <Group>
        {GUIDES.filter((g) => !g.emergency).map((g) => (
          <Row key={g.id} icon={g.icon} title={g.title} subtitle={g.summary} onPress={() => router.push(`/guide/${g.id}`)} />
        ))}
      </Group>
    </Page>
  );
}
