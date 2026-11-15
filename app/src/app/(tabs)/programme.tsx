import React, { useMemo, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { GUTTER, ScreenTitle } from '@/ui/chrome';
import { Button, FilterTabs, Segmented, Skeleton, StateBlock } from '@/ui/controls';
import { NowLine, SavedMark, SessionRow } from '@/ui/event';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';
import { useContent } from '@/data/useContent';
import { useNow } from '@/data/useNow';
import { useAgenda } from '@/state/agenda';
import { minutes } from '@/data/time';
import type { Session } from '@/data/types';

type Quick = 'all' | 'public' | 'saved';
type Item = { kind: 'session'; s: Session; i: number } | { kind: 'now' };

/**
 * Programme (v1.1): a timetable. Two visibly different controls: a segmented
 * strip for WHICH DAY, and text tabs for WHICH SESSIONS. Opens on day one
 * (or on today with the now-line, in the conference-day preview).
 */
export default function Programme() {
  const { c, layout } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const { saved } = useAgenda();
  const event = useContent((r) => r.getEvent());
  const all = useContent((r) => r.listSessions());
  const now = useNow(event);
  const [dayPick, setDay] = useState<number | undefined>(undefined);
  const [quick, setQuick] = useState<Quick>('all');

  const day = dayPick ?? now?.day ?? 1;
  const ofDay = useMemo(() => (all ?? []).filter((s) => s.day === day), [all, day]);
  const counts = { all: ofDay.length, public: ofDay.filter((s) => s.access === 'public').length, saved: ofDay.filter((s) => saved.has(s.id)).length };
  const shown = ofDay.filter((s) => (quick === 'public' ? s.access === 'public' : quick === 'saved' ? saved.has(s.id) : true));

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
    <View style={{ gap: 12, paddingBottom: 4 }}>
      <ScreenTitle title={t('tab.programme')} right={<SavedMark />} />
      <Segmented<`${number}`>
        value={`${day}`} onChange={(v) => setDay(Number(v))}
        options={Array.from({ length: event?.dayCount ?? 5 }, (_, i) => ({ value: `${i + 1}` as `${number}`, label: `${i + 1}`, sub: t('programme.dayShort') }))}
      />
      <FilterTabs<Quick>
        value={quick} onChange={setQuick}
        options={[{ value: 'all', label: t('programme.all'), count: counts.all }, { value: 'public', label: t('programme.public'), count: counts.public }, { value: 'saved', label: t('programme.saved'), count: counts.saved }]}
      />
      <View style={{ height: 1.5, backgroundColor: c.text, marginTop: -6 }} />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center' }}>
      <FlatList
        style={{ width: '100%', maxWidth: layout.maxContentWidth }}
        data={event && all ? items : []}
        keyExtractor={(it) => (it.kind === 'now' ? 'now' : it.s.id)}
        ListHeaderComponent={header}
        extraData={`${day}-${quick}`}
        contentContainerStyle={{ paddingHorizontal: GUTTER, paddingTop: 2, paddingBottom: 28 }}
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
                icon={quick === 'saved' ? 'bookmark' : 'ticket'}
                title={t(quick === 'saved' ? 'programme.emptySaved' : 'programme.emptyPublic')}
                body={t(quick === 'saved' ? 'programme.emptySavedSub' : 'programme.emptyPublicSub')}
                action={<Button kind="dark" label={t('programme.showAll')} onPress={() => setQuick('all')} />}
              />
            </View>
          )
        }
      />
    </View>
  );
}
