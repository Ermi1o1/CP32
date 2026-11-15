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

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 8, paddingVertical: 12 }}>
      <Text variant="headline">{label}</Text>
      {hint ? <Text variant="footnote" color="textSecondary">{hint}</Text> : null}
      {children}
    </View>
  );
}

export default function Settings() {
  const { c } = useTheme();
  const { prefs, setPrefs } = usePrefs();
  const { t } = useT();
  const router = useRouter();
  const sw = (value: boolean, on: (v: boolean) => void, label: string) => (
    <Switch value={value} onValueChange={on} accessibilityLabel={label} trackColor={{ true: c.primary, false: c.border }} />
  );
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <SubHeader close />
      <Page title={t('settings.title')}>
        <SectionTitle>{t('settings.display')}</SectionTitle>
        <Group>
          <Field label={t('settings.appearance')}>
            <Segmented value={prefs.mode} onChange={(mode) => setPrefs({ mode })}
              options={[{ value: 'system', label: t('settings.system') }, { value: 'light', label: t('settings.light') }, { value: 'dark', label: t('settings.dark') }]} />
          </Field>
          <Field label={t('settings.textSize')}>
            <Segmented<`${TextScale}`> value={`${prefs.textScale}`} onChange={(v) => setPrefs({ textScale: Number(v) as TextScale })}
              options={TEXT_SCALES.map((s) => ({ value: `${s}` as `${TextScale}`, label: `${Math.round(s * 100)}%` }))} />
          </Field>
          <Field label={t('settings.language')} hint={t('settings.languageHint')}>
            <Segmented value={prefs.lang} onChange={(lang) => setPrefs({ lang })} options={[{ value: 'en', label: 'English' }, { value: 'am', label: 'አማርኛ' }]} />
          </Field>
          <Row icon="sliders-horizontal" title={t('settings.motion')} subtitle={t('settings.motionSub')} right={sw(prefs.reduceMotion, (reduceMotion) => setPrefs({ reduceMotion }), t('settings.motion'))} />
        </Group>

        <SectionTitle>{t('settings.aboutSection')}</SectionTitle>
        <Group>
          <Row icon="shield" title={t('settings.privacy')} subtitle={t('settings.privacySub')} />
          <Row icon="info" title={t('settings.about')} onPress={() => router.push('/about')} />
          <Row icon="list-checks" title={t('settings.sources')} subtitle={t('settings.sourcesSub')} onPress={() => router.push('/sources')} />
        </Group>

        <SectionTitle>{t('settings.demo')}</SectionTitle>
        <Group>
          <Row icon="clock" title={t('settings.live')} subtitle={t('settings.liveSub')} right={sw(prefs.livePreview, (livePreview) => setPrefs({ livePreview }), t('settings.live'))} />
          <Field label={t('settings.brand')} hint={t('settings.brandSub')}>
            <Segmented<BrandId> value={prefs.brand} onChange={(brand) => setPrefs({ brand })}
              options={(Object.keys(BRANDS) as BrandId[]).map((id) => ({ value: id, label: BRANDS[id].name }))} />
          </Field>
          <Row icon="layers" title={t('settings.gallery')} subtitle={t('settings.gallerySub')} onPress={() => router.push('/gallery')} />
        </Group>
      </Page>
    </View>
  );
}
