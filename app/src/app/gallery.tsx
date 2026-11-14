import React, { useState } from 'react';
import { View } from 'react-native';
import { Page, SubHeader } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Button, Chip, ChipRow, Banner, Skeleton, StateBlock } from '@/ui/controls';
import { Group, Row, SectionTitle, Card } from '@/ui/lists';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';

/** Every base component in the current theme, brand, language and text size. Used for review and for automated checks. */
export default function Gallery() {
  const { c } = useTheme();
  const { t } = useT();
  const [chip, setChip] = useState(0);
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <SubHeader title={t('gallery.title')} />
      <Page>
        <SectionTitle>{t('gallery.type')}</SectionTitle>
        <Card>
          <Text variant="largeTitle">{t('gallery.sample')}</Text>
          <Text variant="title2">{t('gallery.sample')}</Text>
          <Text variant="headline">{t('gallery.sample')}</Text>
          <Text variant="body">{t('welcome.lead')}</Text>
          <Text variant="footnote" color="textSecondary">{t('brand.descriptor')}</Text>
        </Card>

        <SectionTitle>{t('gallery.buttons')}</SectionTitle>
        <View style={{ gap: 10 }}>
          <Button kind="primary" icon="calendar-plus" label={t('gallery.primary')} />
          <Button kind="tinted" icon="map-pin" label={t('gallery.secondary')} />
          <Button kind="plain" label={t('gallery.plain')} />
        </View>

        <SectionTitle>{t('gallery.chips')}</SectionTitle>
        <ChipRow>
          {[t('gallery.chipAll'), t('gallery.chipPublic'), t('gallery.chipToday'), t('programme.side'), t('programme.speakers')].map((label, i) => (
            <Chip key={label} label={label} selected={chip === i} onPress={() => setChip(i)} />
          ))}
        </ChipRow>

        <SectionTitle>{t('gallery.banners')}</SectionTitle>
        <View style={{ gap: 10 }}>
          <Banner tone="info" title={t('gallery.bInfo')} body={t('gallery.bInfoSub')} />
          <Banner tone="success" title={t('gallery.bOk')} body={t('gallery.bOkSub')} />
          <Banner tone="warning" title={t('gallery.bWarn')} body={t('gallery.bWarnSub')} />
          <Banner tone="danger" title={t('gallery.bDanger')} body={t('gallery.bDangerSub')} />
        </View>

        <SectionTitle>{t('gallery.rows')}</SectionTitle>
        <Group>
          <Row icon="calendar" title={t('programme.schedule')} subtitle={t('programme.scheduleSub')} onPress={() => {}} />
          <Row icon="siren" tone="red" title={t('visit.emergency')} subtitle={t('visit.emergencySub')} onPress={() => {}} />
          <Row icon="circle-help" tone="blue" title={t('sources.u1')} value={t('common.tbc')} />
        </Group>

        <SectionTitle>{t('gallery.states')}</SectionTitle>
        <Card>
          <Text variant="footnote" color="textSecondary">{t('gallery.loading')}</Text>
          <Skeleton height={20} width="70%" />
          <Skeleton />
          <Skeleton width="85%" />
        </Card>
        <StateBlock icon="star" title={t('gallery.emptyTitle')} body={t('gallery.emptySub')} action={<Button kind="tinted" label={t('home.cta')} />} />
        <StateBlock icon="wifi-off" title={t('gallery.errorTitle')} body={t('gallery.errorSub')} />
      </Page>
    </View>
  );
}
