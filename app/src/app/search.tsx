import React from 'react';
import { View } from 'react-native';
import { Page, SubHeader } from '@/ui/chrome';
import { StateBlock } from '@/ui/controls';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';

/** Search arrives with build step 6 (Ge'ez-aware, offline). The route exists now so the header button has a home. */
export default function Search() {
  const { c } = useTheme();
  const { t } = useT();
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <SubHeader />
      <Page title={t('a11y.search')}>
        <StateBlock icon="search" title={t('a11y.search')} body={t('common.comingInBuild')} />
      </Page>
    </View>
  );
}
