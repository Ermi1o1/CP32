import React from 'react';
import { View } from 'react-native';
import { Page, SubHeader } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { GLOSSARY } from '@/data/glossary';

/** Glossary: the words you hear at a climate conference, in plain language. */
export default function Glossary() {
  const { c } = useTheme();
  const { t } = useT();
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <SubHeader title={t('tab.updates')} />
      <Page title={t('glossary.title')} sub={t('glossary.lead')}>
        <View style={{ height: 1.5, backgroundColor: c.text }} />
        {GLOSSARY.map((g) => (
          <View key={g.term}>
            <View accessible style={{ paddingVertical: 14, gap: 3 }}>
              <Text variant="title3">{g.term}</Text>
              <Text variant="subhead" color="textSecondary">{g.def}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: c.divider }} />
          </View>
        ))}
      </Page>
    </View>
  );
}
