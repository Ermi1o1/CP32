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
        {GLOSSARY.map((g) => (
          <View key={g.term}>
            <View accessible style={{ paddingVertical: 10, gap: 3 }}>
              <Text variant="headline" color="primary">{g.term}</Text>
              <Text variant="subhead" color="textSecondary">{g.def}</Text>
            </View>
          </View>
        ))}
      </Page>
    </View>
  );
}
