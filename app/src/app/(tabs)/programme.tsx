import React, { useMemo, useState } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { GUTTER, ScreenTitle } from '@/ui/chrome';
import { Button, Chip, Skeleton, StateBlock } from '@/ui/controls';
import { Sheet } from '@/ui/Sheet';
import { Text } from '@/ui/Text';
import { NowLine, SavedMark, SessionRow } from '@/ui/event';
import { Group, Row, SectionTitle } from '@/ui/lists';
import { useTheme } from '@/theme/ThemeProvider';
import { Tap } from '@/ui/Pressable';
import { useT } from '@/i18n';
import { useContent } from '@/data/useContent';
import { useNow } from '@/data/useNow';
import { useAgenda } from '@/state/agenda';
import { minutes } from '@/data/time';
import type { Session, Theme } from '@/data/types';

type Quick = 'all' | 'public' | 'saved';
type Item = { kind: 'session'; s: Session; i: number } | { kind: 'now' };

export default function Programme() {
  const { c, layout, radius } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const { saved } = useAgenda();
  const event = useContent((r) => r.getEvent());
  const all = useContent((r) => r.listSessions());
  const now = useNow(event);
  
  const [dayPick, setDay] = useState<number | undefined>(undefined);
  const [quick, setQuick] = useState<Quick>('all');
  const [sheet, setSheet] = useState(false);
  const [formats, setFormats] = useState<string[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const flip = <T,>(list: T[], v: T): T[] => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const active = formats.length + themes.length;

  const day = dayPick ?? now?.day ?? 1;
  const ofDay = useMemo(() => (all ?? []).filter((s) => s.day === day), [all, day]);
  const counts = { all: ofDay.length, public: ofDay.filter((s) => s.access === 'public').length, saved: ofDay.filter((s) => saved.has(s.id)).length };
  
  const shown = ofDay
    .filter((s) => (quick === 'public' ? s.access === 'public' : quick === 'saved' ? saved.has(s.id) : true))
    .filter((s) => (formats.length === 0 || formats.includes(s.format)) && (themes.length === 0 || themes.includes(s.theme)));
  const allFormats = [...new Set((all ?? []).map((s) => s.format))].sort();
  const allThemes = [...new Set((all ?? []).map((s) => s.theme))].sort();

  const items: Item[] = useMemo(() => {
    const out: Item[] = [];
    let placed = !now || day !== now.day;
    shown.forEach((s, i) => {
      if (!placed && now && minutes(s.start) > minutes(now.time)) { out.push({ kind: 'now' }); placed = true; }
      out.push({ kind: 'session', s, i });
    });
    return out;
  }, [shown, now, day]);

  const header = (
    <View style={{ paddingBottom: 8 }}>
      <ScreenTitle title={t('tab.programme')} right={<SavedMark />} />
      
      {/* Sleek horizontal Day selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 12 }}>
        {Array.from({ length: event?.dayCount ?? 5 }, (_, i) => {
          const d = i + 1;
          const on = day === d;
          return (
            <Tap key={d} onPress={() => setDay(d)} minTarget={false} accessibilityState={{ selected: on }}
              style={{ width: 68, height: 68, borderRadius: 16, backgroundColor: on ? c.ink : c.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: on ? c.ink : c.border }}>
              <Text variant="label" weight={600} color={on ? 'onInk' : 'textSecondary'}>{t('programme.dayShort')}</Text>
              <Text variant="headline" weight={700} color={on ? 'onInk' : 'text'} style={{ marginTop: -2 }}>{d}</Text>
            </Tap>
          );
        })}
      </ScrollView>

      {/* Sleek Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
        {(['all', 'public', 'saved'] as Quick[]).map((q) => {
          const on = quick === q;
          const count = counts[q];
          return (
            <Tap key={q} onPress={() => setQuick(q)} minTarget={false} accessibilityState={{ selected: on }}
              style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100, backgroundColor: on ? c.primary : c.surface, borderWidth: 1, borderColor: on ? c.primary : c.border }}>
              <Text variant="label" weight={600} color={on ? 'onPrimary' : 'text'}>
                {t(q === 'all' ? 'programme.all' : q === 'public' ? 'programme.public' : 'programme.saved')} {count > 0 ? `(${count})` : ''}
              </Text>
            </Tap>
          );
        })}
      </ScrollView>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <Text variant="footnote" color="textSecondary" style={{ flex: 1 }}>{t('programme.count', { n: shown.length })}{active ? ` · ${t('programme.filtersOn', { n: active })}` : ''}</Text>
        <Chip label={active ? `${t('programme.filter')} · ${active}` : t('programme.filter')} selected={active > 0} onPress={() => setSheet(true)} />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center' }}>
      <Sheet open={sheet} onClose={() => setSheet(false)} title={t('programme.filter')}
        footer={<View style={{ flexDirection: 'row', gap: 10 }}><Button kind="outline" flex={1} label={t('programme.clear')} onPress={() => { setFormats([]); setThemes([]); }} /><Button kind="dark" flex={1} label={t('programme.show', { n: shown.length })} onPress={() => setSheet(false)} /></View>}>
        <SectionTitle>{t('programme.format')}</SectionTitle>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 8 }}>
          {allFormats.map((f) => <Chip key={f} label={f} selected={formats.includes(f)} onPress={() => setFormats(flip(formats, f))} />)}
        </View>
        <SectionTitle>{t('programme.theme')}</SectionTitle>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 8 }}>
          {allThemes.map((th) => <Chip key={th} label={t(`theme.${th}`)} selected={themes.includes(th)} onPress={() => setThemes(flip(themes, th))} />)}
        </View>
      </Sheet>
      <FlatList
        style={{ width: '100%', maxWidth: layout.maxContentWidth }}
        data={event && all ? items : []}
        keyExtractor={(it) => (it.kind === 'now' ? 'now' : it.s.id)}
        ListHeaderComponent={header}
        extraData={`${day}-${quick}-${formats.join()}-${themes.join()}`}
        contentContainerStyle={{ paddingHorizontal: GUTTER, paddingTop: 2, paddingBottom: 28 }}
        ListFooterComponent={event && all ? (
          <View>
            <SectionTitle>{t('programme.more')}</SectionTitle>
            <Group>
              <Row icon="bookmark" title={t('programme.agenda')} subtitle={t('programme.agendaCount', { n: saved.size })} onPress={() => router.push('/agenda')} />
              <Row icon="landmark" title={t('exhibitors.title')} subtitle={t('exhibitors.lead')} onPress={() => router.push('/exhibitors')} />
              <Row icon="users" title={t('programme.speakers')} subtitle={t('programme.speakersSub')} onPress={() => router.push('/speakers')} />
            </Group>
          </View>
        ) : undefined}
        renderItem={({ item }) =>
          item.kind === 'now'
            ? <NowLine time={now?.time ?? ''} />
            : <SessionRow key={`${day}-${quick}-${item.s.id}`} session={item.s} now={now} index={item.i} onPress={() => router.push(`/session/${item.s.id}`)} />
        }
        ListEmptyComponent={
          !event || !all ? (
            <View style={{ gap: 18, paddingTop: 16 }}>
              {[0, 1, 2, 3].map((i) => (
                <View key={i} style={{ flexDirection: 'row', gap: 14 }}><Skeleton height={20} width={52} /><View style={{ flex: 1, gap: 8 }}><Skeleton height={18} /><Skeleton height={12} width="60%" /></View></View>
              ))}
            </View>
          ) : (
            <View style={{ paddingTop: 16 }}>
              <StateBlock
                icon={active ? 'sliders-horizontal' : quick === 'saved' ? 'bookmark' : 'ticket'}
                title={t(active ? 'programme.emptyFilter' : quick === 'saved' ? 'programme.emptySaved' : 'programme.emptyPublic')}
                body={t(active ? 'programme.emptyFilterSub' : quick === 'saved' ? 'programme.emptySavedSub' : 'programme.emptyPublicSub')}
                action={<Button kind="dark" label={t('programme.showAll')} onPress={() => { setQuick('all'); setFormats([]); setThemes([]); }} />}
              />
            </View>
          )
        }
      />
    </View>
  );
}