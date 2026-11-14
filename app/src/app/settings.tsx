import React from 'react';
import { View, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, SubHeader } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Segmented } from '@/ui/controls';
import { Group, Row, SectionTitle } from '@/ui/lists';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { TEXT_SCALES, type TextScale } from '@/state/prefs';
import { BRANDS, type BrandId } from '@/theme/brand';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const { c, radius } = useTheme();
  return (
    <View style={{ backgroundColor: c.surface, borderRadius: radius.md, padding: 14, gap: 10 }}>
      <Text variant="headline">{label}</Text>
      {children}
    </View>
  );
}

export default function Settings() {
  const { c } = useTheme();
  const { prefs, setPrefs } = usePrefs();
  const { t } = useT();
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <SubHeader title={t('settings.title')} close />
      <Page>
        <Field label={t('settings.language')}>
          <Segmented value={prefs.lang} onChange={(lang) => setPrefs({ lang })} options={[{ value: 'en', label: 'English' }, { value: 'am', label: 'አማርኛ' }]} />
        </Field>
        <Field label={t('settings.appearance')}>
          <Segmented value={prefs.mode} onChange={(mode) => setPrefs({ mode })}
            options={[{ value: 'system', label: t('settings.system') }, { value: 'light', label: t('settings.light') }, { value: 'dark', label: t('settings.dark') }]} />
        </Field>
        <Field label={t('settings.textSize')}>
          <Segmented<`${TextScale}`> value={`${prefs.textScale}`} onChange={(v) => setPrefs({ textScale: Number(v) as TextScale })}
            options={TEXT_SCALES.map((s) => ({ value: `${s}` as `${TextScale}`, label: `${Math.round(s * 100)}%` }))} />
        </Field>
        <Group>
          <Row icon="sliders-horizontal" title={t('settings.motion')} subtitle={t('settings.motionSub')}
            right={<Switch value={prefs.reduceMotion} onValueChange={(reduceMotion) => setPrefs({ reduceMotion })} accessibilityLabel={t('settings.motion')} trackColor={{ true: c.primary, false: c.border }} />} />
          <Row icon="shield" tone="green" title={t('settings.privacy')} subtitle={t('settings.privacySub')} />
        </Group>
        <Group>
          <Row icon="info" title={t('settings.about')} onPress={() => router.push('/about')} />
          <Row icon="list-checks" tone="blue" title={t('settings.sources')} subtitle={t('settings.sourcesSub')} onPress={() => router.push('/sources')} />
        </Group>

        <SectionTitle>{t('settings.demo')}</SectionTitle>
        <Field label={t('settings.brand')}>
          <Text variant="subhead" color="textSecondary">{t('settings.brandSub')}</Text>
          <Segmented<BrandId> value={prefs.brand} onChange={(brand) => setPrefs({ brand })}
            options={(Object.keys(BRANDS) as BrandId[]).map((id) => ({ value: id, label: BRANDS[id].name }))} />
        </Field>
        <Group>
          <Row icon="layers" tone="orange" title={t('settings.gallery')} subtitle={t('settings.gallerySub')} onPress={() => router.push('/gallery')} />
        </Group>
      </Page>
    </View>
  );
}
