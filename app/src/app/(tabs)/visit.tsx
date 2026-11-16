import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { GUTTER, Page } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Icon } from '@/ui/Icon';
import { Tap } from '@/ui/Pressable';
import { SectionTitle } from '@/ui/lists';
import { Photo, SavedMark } from '@/ui/event';
import { GUIDE_PHOTO } from '@/ui/photos';
import { lift } from '@/ui/lift';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { GUIDES } from '@/data/guides';

/** Visit (v1.4): the emergency entry first and unmistakable, then the practical guides as raised image cards, two to a row. */
export default function Visit() {
  const { c, radius, dark, layout } = useTheme();
  const { width } = useWindowDimensions();
  const { prefs } = usePrefs();
  const { t } = useT();
  const roomy = prefs.textScale < 1.5;
  const router = useRouter();
  const inner = Math.min(width, layout.maxContentWidth) - GUTTER * 2;
  const cardW = roomy ? Math.floor((inner - 12) / 2) : inner;
  const emergency = GUIDES.find((g) => g.emergency)!;
  return (
    <Page title={t('tab.visit')} sub={t('visit.lead')} right={<SavedMark />}>
      <Tap onPress={() => router.push('/guide/emergency')} minTarget={false} accessibilityRole="link" accessibilityLabel={`${emergency.title}. ${emergency.summary}`}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: dark ? c.primarySoft : c.ink, borderRadius: radius.lg, padding: 18, minHeight: 84, ...lift(dark, 3) }}>
        {roomy ? (
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.danger, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="siren" size={22} color="onDanger" stroke={2} />
          </View>
        ) : null}
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="headline" color={dark ? 'onPrimarySoft' : 'onInk'}>{emergency.title}</Text>
          <Text variant="footnote" color={dark ? 'onPrimarySoft' : 'onInk'}>{emergency.summary}</Text>
        </View>
        <Icon name="chevron-right" size={20} color={dark ? 'onPrimarySoft' : 'onInk'} stroke={2} />
      </Tap>

      <SectionTitle>{t('visit.guides')}</SectionTitle>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {GUIDES.filter((g) => !g.emergency).map((g) => (
          <Tap key={g.id} onPress={() => router.push(`/guide/${g.id}`)} minTarget={false} accessibilityRole="link" accessibilityLabel={`${g.title}. ${g.summary}`}
            style={{ width: cardW, backgroundColor: c.surface, borderRadius: 24, ...lift(dark) }}>
            <View style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' }}>
              <Photo name={GUIDE_PHOTO[g.id] ?? 'highland'} height={98} />
            </View>
            <View style={{ position: 'absolute', left: 12, top: 76, width: 44, height: 44, borderRadius: 22, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center', ...lift(dark, 1) }}>
              <Icon name={g.icon} size={21} color="primary" stroke={2} />
            </View>
            <View style={{ paddingHorizontal: 14, paddingTop: 28, paddingBottom: 14, gap: 2 }}>
              <Text variant="headline">{g.title}</Text>
              <Text variant="footnote" color="textSecondary">{g.summary}</Text>
            </View>
          </Tap>
        ))}
      </View>
    </Page>
  );
}
