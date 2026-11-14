import React from 'react';
import { View } from 'react-native';
import Constants from 'expo-constants';
import { Page, SubHeader } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Mark } from '@/ui/Icon';
import { Banner } from '@/ui/controls';
import { Group, Row } from '@/ui/lists';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';

export default function About() {
  const { c, brand } = useTheme();
  const { t } = useT();
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <SubHeader title={t('about.title')} />
      <Page>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Mark size={64} />
          <View style={{ flex: 1 }}>
            <Text variant="title1">{brand.name}</Text>
            <Text variant="footnote" color="textSecondary">{t(brand.descriptorKey)}</Text>
          </View>
        </View>
        <Banner tone="info" title={t('about.independent')} />
        <Text variant="body">{t('about.body1')}</Text>
        <Text variant="body">{t('about.body2')}</Text>
        <Text variant="body" color="textSecondary">{t('about.body3')}</Text>
        <Group>
          <Row icon="info" title={t('about.version')} value={Constants.expoConfig?.version ?? '—'} />
        </Group>
      </Page>
    </View>
  );
}
