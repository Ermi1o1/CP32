import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Page } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Button, Banner } from '@/ui/controls';
import { Group, Row, SectionTitle } from '@/ui/lists';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';

export default function Home() {
  const { c, radius, brand } = useTheme();
  const { t } = useT();
  const router = useRouter();
  return (
    <Page>
      {/* The permanent independence line (D66, D65a). It sits directly under the brand, on Home, always. */}
      <Text variant="footnote" color="textSecondary">{t(brand.descriptorKey)}</Text>

      <View style={{ backgroundColor: c.heroTo, borderRadius: radius.lg, padding: 20, gap: 8 }}>
        <Text variant="footnote" weight={700} upper style={{ color: c.heroKicker }}>{t('home.kicker')}</Text>
        <Text variant="title1" color="onHero" accessibilityRole="header">{t('home.title')}</Text>
        <Text variant="subhead" color="onHero">{t('home.dates')}</Text>
        <View style={{ marginTop: 8 }}>
          <Button kind="primary" icon="calendar" label={t('home.cta')} onPress={() => router.push('/programme')} />
        </View>
      </View>

      <Banner tone="info" title={t('home.offline')} body={t('home.offlineSub')} />

      <SectionTitle>{t('home.sections')}</SectionTitle>
      <Group>
        <Row icon="ticket" tone="orange" title={t('home.canAttend')} subtitle={t('home.canAttendSub')} onPress={() => router.push('/updates')} />
        <Row icon="luggage" tone="blue" title={t('home.plan')} subtitle={t('home.planSub')} onPress={() => router.push('/visit')} />
        <Row icon="siren" tone="red" title={t('visit.emergency')} subtitle={t('visit.emergencySub')} onPress={() => router.push('/visit')} />
      </Group>
    </Page>
  );
}
