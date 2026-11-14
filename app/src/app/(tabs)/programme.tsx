import React, { useMemo, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/ui/Text';
import { Button, Chip, ChipRow, Skeleton, StateBlock } from '@/ui/controls';
import { NowLine, SavedMark, SessionRow } from '@/ui/event';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { useContent } from '@/data/useContent';
import { useAgenda } from '@/state/agenda';
import { minutes } from '@/data/time';
import type { Session } from '@/data/types';

type Quick = 'all' | 'public' | 'saved';
type Item = { kind: 'session'; s: Session; i: number } | { kind: 'now' };

/**
 * Programme (v1.0): a timetable, not a stack of cards. Opens on today, with
 * the NOW line sitting between what has ended and what is next. Quick filters
 * combine with the day; each has its own designed empty state.
 */
export default function Programme() {
  const { c, layout } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const { saved } = useAgenda();
  const event = useContent((r) => r.getEvent());
  const all = useContent((r) => r.listSessions());
  const [dayPick, setDay] = useState<number | undefined>(undefined);
  const [quick, setQuick] = useState<Quick>('all');

  const day = dayPick ?? event?.demoNow.day ?? 1;
  const ofDay = useMemo(() => (all ?? []).filter((s) => s.day === day), [all, day]);
  const counts = { all: ofDay.length, public: ofDay.filter((s) => s.access === 'public').length, saved: ofDay.filter((s) => saved.has(s.id)).length };
  const shown = ofDay.filter((s) => (quick === 'public' ? s.access === 'public' : quick === 'saved' ? saved.has(s.id) : true));

  const items: Item[] = useMemo(() => {
    const out: Item[] = [];
    let placed = !event || day !== event.demoNow.day;
    shown.forEach((s, i) => {
      if (!placed && event && minutes(s.start) > minutes(event.demoNow.time)) { out.push({ kind: 'now' }); placed = true; }
      out.push({ kind: 'session', s, i });
    });
    return out;
  }, [shown, event, day]);

  const header = (
    <View style={{ gap: 12, paddingTop: 4, paddingBottom: 8 }}>
      <View style={{ paddingHorizontal: 20, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
        <Text variant="display" accessibilityRole="header">{t('tab.programme')}</Text>
        <View style={{ paddingBottom: 8 }}><SavedMark compact /></View>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <ChipRow>
          {Array.from({ length: event?.dayCount ?? 5 }, (_, i) => i + 1).map((d) => (
            <Chip key={d} label={t('programme.day', { d })} selected={d === day} onPress={() => setDay(d)} />
          ))}
        </ChipRow>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <ChipRow>
          <Chip label={t('programme.all')} count={counts.all} selected={quick === 'all'} onPress={() => setQuick('all')} />
          <Chip label={t('programme.public')} count={counts.public} selected={quick === 'public'} onPress={() => setQuick('public')} />
          <Chip label={t('programme.saved')} count={counts.saved} selected={quick === 'saved'} onPress={() => setQuick('saved')} />
        </ChipRow>
      </View>
      <View style={{ height: 1, backgroundColor: c.text, marginHorizontal: 20, marginTop: 4 }} />
    </View>
  );

  if (!event || !all) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        {header}
        <View style={{ padding: 20, gap: 18 }}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 14 }}><Skeleton height={20} width={52} /><View style={{ flex: 1, gap: 8 }}><Skeleton height={18} /><Skeleton height={12} width="60%" /></View></View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center' }}>
      <FlatList
        style={{ width: '100%', maxWidth: layout.maxContentWidth }}
        data={items}
        keyExtractor={(it) => (it.kind === 'now' ? 'now' : it.s.id)}
        ListHeaderComponent={header}
        // Re-run the staggered entrance when the day or filter changes.
        extraData={`${day}-${quick}`}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) =>
          item.kind === 'now'
            ? <NowLine time={event.demoNow.time} />
            : <SessionRow key={`${day}-${quick}-${item.s.id}`} session={item.s} now={event.demoNow} index={item.i} onPress={() => router.push(`/session/${item.s.id}`)} />
        }
        ListEmptyComponent={
          <View style={{ padding: 20 }}>
            <StateBlock
              icon={quick === 'saved' ? 'bookmark' : 'ticket'}
              title={t(quick === 'saved' ? 'programme.emptySaved' : 'programme.emptyPublic')}
              body={t(quick === 'saved' ? 'programme.emptySavedSub' : 'programme.emptyPublicSub')}
              action={<Button kind="dark" label={t('programme.showAll')} onPress={() => setQuick('all')} />}
            />
          </View>
        }
      />
    </View>
  );
}
