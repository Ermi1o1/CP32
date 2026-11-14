import React from 'react';
import { SectionList } from '@/screens/sections';

export default function Updates() {
  return (
    <SectionList
      title="tab.updates"
      sections={[
        { icon: 'newspaper', title: 'updates.news', sub: 'updates.newsSub' },
        { icon: 'bell-ring', tone: 'red', title: 'updates.alerts', sub: 'updates.alertsSub' },
        { icon: 'file-text', tone: 'blue', title: 'updates.press', sub: 'updates.pressSub' },
        { icon: 'radio', tone: 'orange', title: 'updates.live', sub: 'updates.liveSub' },
        { icon: 'book-open', tone: 'green', title: 'updates.explainers', sub: 'updates.explainersSub' },
      ]}
    />
  );
}
