import React from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/ui/Text';
import { Icon, Mark, type IconName } from '@/ui/Icon';
import { Button, Segmented } from '@/ui/controls';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';
import { useT, type StringKey } from '@/i18n';

function Point({ icon, title, body }: { icon: IconName; title: StringKey; body: StringKey }) {
  const { c } = useTheme();
  const { t } = useT();
  return (
    <View style={{ flexDirection: 'row', gap: 14 }}>
      <View style={{ width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: c.primarySoft }}>
        <Icon name={icon} size={22} color="onPrimarySoft" />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="headline">{t(title)}</Text>
        <Text variant="subhead" color="textSecondary">{t(body)}</Text>
      </View>
    </View>
  );
}

/**
 * First-run statement (D66, D65a). Shown once, before anything else, and
 * cannot be skipped past without the "Continue" tap. It says three things:
 * the app is independent, the content is illustrative, nothing leaves the phone.
 */
export default function Welcome() {
  const { c, brand, layout } = useTheme();
  const { prefs, setPrefs } = usePrefs();
  const { t } = useT();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 28, paddingBottom: insets.bottom + 20, paddingHorizontal: 22, alignItems: 'center' }}>
      <View style={{ width: '100%', maxWidth: layout.maxContentWidth, flexGrow: 1, gap: 22 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Mark size={52} />
          <View style={{ flex: 1 }}>
            <Text variant="title2">{brand.name}</Text>
            <Text variant="footnote" color="textSecondary">{t(brand.descriptorKey)}</Text>
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <Text variant="largeTitle" accessibilityRole="header">{t('welcome.title')}</Text>
          <Text variant="body" color="textSecondary">{t('welcome.lead')}</Text>
        </View>

        <View style={{ gap: 18 }}>
          <Point icon="shield" title="welcome.p1Title" body="welcome.p1" />
          <Point icon="info" title="welcome.p2Title" body="welcome.p2" />
          <Point icon="wifi-off" title="welcome.p3Title" body="welcome.p3" />
        </View>

        <View style={{ gap: 8 }}>
          <Text variant="footnote" color="textSecondary" weight={700} upper>{t('welcome.language')}</Text>
          <Segmented value={prefs.lang} onChange={(lang) => setPrefs({ lang })} options={[{ value: 'en', label: 'English' }, { value: 'am', label: 'አማርኛ' }]} />
        </View>

        <View style={{ flexGrow: 1 }} />
        <Button kind="primary" wide label={t('common.continue')} onPress={() => setPrefs({ welcomed: true })} />
      </View>
    </ScrollView>
  );
}
