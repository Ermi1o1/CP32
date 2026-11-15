import React, { useMemo, useState } from 'react';
import { View, TextInput, Platform } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Page, SubHeader } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Icon, type IconName } from '@/ui/Icon';
import { Chip, StateBlock } from '@/ui/controls';
import { Group, Row, SectionTitle } from '@/ui/lists';
import { SavedMark } from '@/ui/event';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';
import { useT, type StringKey } from '@/i18n';
import { search, type HitKind } from '@/data/search';
import { fontFor } from '@/theme/typography';

const KINDS: readonly { kind: HitKind; label: StringKey; icon: IconName }[] = [
  { kind: 'session', label: 'search.sessions', icon: 'calendar' },
  { kind: 'person', label: 'search.people', icon: 'user-round' },
  { kind: 'exhibitor', label: 'exhibitors.title', icon: 'building-2' },
  { kind: 'place', label: 'search.places', icon: 'map-pin' },
  { kind: 'guide', label: 'search.guides', icon: 'book-open' },
  { kind: 'term', label: 'search.terms', icon: 'circle-help' },
];
const SUGGEST = ['water', 'Hall B', 'visa', 'finance', 'loss and damage', 'coffee'];

/**
 * Search (v1.1). One box over everything in the app — sessions, people,
 * places, guides and glossary terms — working without a connection. Results
 * are the app's own entries, grouped by kind; it never composes an answer.
 */
export default function Search() {
  const { c, radius } = useTheme();
  const { prefs } = usePrefs();
  const { t } = useT();
  const router = useRouter();
  const [q, setQ] = useState('');
  const hits = useMemo(() => search(q), [q]);
  const size = Math.round(17 * prefs.textScale);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <SubHeader />
      <Page title={t('a11y.search')} right={<SavedMark />}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: c.surface, borderRadius: radius.md, borderWidth: 1.5, borderColor: c.text, paddingHorizontal: 14, minHeight: 54 }}>
          <Icon name="search" size={20} color="text" stroke={2} />
          <TextInput
            value={q} onChangeText={setQ} autoFocus autoCorrect={false} autoCapitalize="none" returnKeyType="search"
            placeholder={t('search.placeholder')} placeholderTextColor={c.textTertiary}
            accessibilityLabel={t('search.placeholder')}
            // The bordered frame around the field is the focus indicator; the browser's own inner outline would double it.
            style={[{ flex: 1, color: c.text, fontFamily: fontFor(400, false), fontSize: size, paddingVertical: 12 }, Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null]}
          />
          {q ? (
            <View style={{ marginRight: -8 }}>
              <Chip label={t('search.clear')} onPress={() => setQ('')} />
            </View>
          ) : null}
        </View>

        {q.trim().length < 2 ? (
          <>
            <SectionTitle>{t('search.try')}</SectionTitle>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 8 }}>
              {SUGGEST.map((s) => <Chip key={s} label={s} onPress={() => setQ(s)} />)}
            </View>
            <Text variant="footnote" color="textTertiary">{t('search.scope')}</Text>
          </>
        ) : hits.length === 0 ? (
          <StateBlock icon="search" title={t('search.none', { q: q.trim() })} body={t('search.noneSub')} />
        ) : (
          KINDS.map(({ kind, label, icon }) => {
            const group = hits.filter((h) => h.kind === kind);
            if (!group.length) return null;
            return (
              <View key={kind}>
                <SectionTitle>{`${t(label)} · ${group.length}`}</SectionTitle>
                <Group>
                  {group.slice(0, 8).map((h) => (
                    <Row key={`${h.kind}-${h.id}`} icon={icon} title={h.title} subtitle={h.sub} onPress={() => router.push(h.href as Href)} />
                  ))}
                </Group>
              </View>
            );
          })
        )}
      </Page>
    </View>
  );
}
