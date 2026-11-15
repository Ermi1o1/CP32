import React from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/ui/Text';
import { Icon, Mark, type IconName } from '@/ui/Icon';
import { Button } from '@/ui/controls';
import { Photo, HorizonLine, SavedMark } from '@/ui/event';
import { GUTTER } from '@/ui/chrome';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';
import { useT, type StringKey } from '@/i18n';

function Point({ icon, title, body }: { icon: IconName; title: StringKey; body: StringKey }) {
  const { c } = useTheme();
  const { t } = useT();
  return (
    <View>
      <View style={{ flexDirection: 'row', gap: 14, paddingVertical: 10 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={21} color="onPrimarySoft" stroke={1.9} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="headline">{t(title)}</Text>
          <Text variant="footnote" color="textSecondary">{t(body)}</Text>
        </View>
      </View>
    </View>
  );
}

/**
 * First-run statement (D66, D65a), in the same language as the rest of the
 * app: photograph, the line, title, three ruled points, one button. Shown
 * once; it says the app is independent, the content is illustrative, and
 * nothing leaves the phone.
 */
export default function Welcome() {
  const { c, brand, layout } = useTheme();
  const { setPrefs } = usePrefs();
  const { t } = useT();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 20 }}>
      <Photo name="highland" height={200 + insets.top} hero />
      <HorizonLine left={t('home.kicker')} right={<SavedMark />} />
      <View style={{ flexGrow: 1, alignItems: 'center' }}>
        <View style={{ width: '100%', maxWidth: layout.maxContentWidth, flexGrow: 1, paddingHorizontal: GUTTER, paddingTop: 18 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Mark size={30} />
            <Text variant="title3">{brand.name}</Text>
          </View>
          <Text variant="display" accessibilityRole="header" style={{ marginTop: 10 }}>{t('welcome.title')}</Text>
          <Text variant="body" color="textSecondary" style={{ marginTop: 6 }}>{t('welcome.lead')}</Text>
          <View style={{ height: 10 }} />
          <Point icon="shield" title="welcome.p1Title" body="welcome.p1" />
          <Point icon="info" title="welcome.p2Title" body="welcome.p2" />
          <Point icon="wifi-off" title="welcome.p3Title" body="welcome.p3" />
          <View style={{ flexGrow: 1, minHeight: 20 }} />
          <Button kind="dark" wide label={t('common.continue')} onPress={() => setPrefs({ welcomed: true })} />
        </View>
      </View>
    </ScrollView>
  );
}
