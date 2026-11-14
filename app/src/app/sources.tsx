import React from 'react';
import { View } from 'react-native';
import { Page, SubHeader } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Group, Row, SectionTitle } from '@/ui/lists';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';

/**
 * Sources and status (D66). The one place that separates what is publicly
 * reported, what is invented for the demonstration, and what nobody knows yet.
 */
export default function Sources() {
  const { c } = useTheme();
  const { t } = useT();
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <SubHeader title={t('sources.title')} />
      <Page>
        <Text variant="body" color="textSecondary">{t('sources.lead')}</Text>
        <SectionTitle>{t('sources.reported')}</SectionTitle>
        <Group>
          <Row icon="newspaper" tone="blue" title={t('sources.r1')} subtitle={t('sources.r1s')} />
          <Row icon="calendar" tone="blue" title={t('sources.r2')} subtitle={t('sources.r2s')} />
          <Row icon="external-link" tone="blue" title={t('sources.r3')} subtitle={t('sources.r3s')} />
        </Group>
        <SectionTitle>{t('sources.illustrative')}</SectionTitle>
        <Group>
          <Row icon="mic" tone="orange" title={t('sources.i1')} subtitle={t('sources.i1s')} />
          <Row icon="bell" tone="orange" title={t('sources.i2')} subtitle={t('sources.i2s')} />
          <Row icon="map" tone="orange" title={t('sources.i3')} subtitle={t('sources.i3s')} />
        </Group>
        <SectionTitle>{t('sources.unknown')}</SectionTitle>
        <Group>
          <Row icon="circle-help" title={t('sources.u1')} value={t('common.tbc')} />
          <Row icon="circle-help" title={t('sources.u2')} value={t('common.tbc')} />
          <Row icon="circle-help" title={t('sources.u3')} value={t('common.tbc')} />
        </Group>
      </Page>
    </View>
  );
}
