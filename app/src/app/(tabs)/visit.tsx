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

export default function Visit() {
  const { c, dark, layout } = useTheme();
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
        style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: dark ? c.primarySoft : c.ink, borderRadius: 16, padding: 16, minHeight: 72, ...lift(dark, 2) }}>
        {roomy ? (
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c.danger, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="siren" size={20} color="onDanger" stroke={2} />
          </View>
        ) : null}
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="headline" weight={700} color={dark ? 'onPrimarySoft' : 'onInk'}>{emergency.title}</Text>
          <Text variant="footnote" color={dark ? 'onPrimarySoft' : 'onInk'}>{emergency.summary}</Text>
        </View>
        <Icon name="chevron-right" size={20} color={dark ? 'onPrimarySoft' : 'onInk'} stroke={2} />
      </Tap>

      <SectionTitle>{t('visit.guides')}</SectionTitle>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {GUIDES.filter((g) => !g.emergency).map((g) => (
          <Tap key={g.id} onPress={() => router.push(`/guide/${g.id}`)} minTarget={false} accessibilityRole="link" accessibilityLabel={`${g.title}. ${g.summary}`}
            style={{ width: cardW, backgroundColor: c.surface, borderRadius: 16, borderWidth: 1, borderColor: c.border, overflow: 'hidden', ...lift(dark, 1) }}>
            <Photo name={GUIDE_PHOTO[g.id] ?? 'highland'} height={100} />
            <View style={{ padding: 12, gap: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Icon name={g.icon} size={16} color="primary" stroke={2} />
                <Text variant="headline" weight={700} numberOfLines={2} style={{ fontSize: 15 }}>{g.title}</Text>
              </View>
              <Text variant="footnote" color="textSecondary" numberOfLines={2}>{g.summary}</Text>
            </View>
          </Tap>
        ))}
      </View>
    </Page>
  );
}