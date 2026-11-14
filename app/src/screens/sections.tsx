import React from 'react';
import { Page } from '@/ui/chrome';
import { Group, Row, type Tone } from '@/ui/lists';
import { useT, type StringKey } from '@/i18n';
import type { IconName } from '@/ui/Icon';

export interface SectionDef { icon: IconName; tone?: Tone; title: StringKey; sub: StringKey }

/**
 * A tab root at the shell stage: the large title and the section list that the
 * information architecture defines for the tab. Each later build step replaces
 * one of these with its real screen; the structure itself is final.
 */
export function SectionList({ title, sections, children }: { title: StringKey; sections: readonly SectionDef[]; children?: React.ReactNode }) {
  const { t } = useT();
  return (
    <Page title={t(title)}>
      {children}
      <Group>
        {sections.map((s) => (
          <Row key={s.title} icon={s.icon} tone={s.tone} title={t(s.title)} subtitle={t(s.sub)} onPress={() => {}} />
        ))}
      </Group>
    </Page>
  );
}
