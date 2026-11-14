import React from 'react';
import { SectionList } from '@/screens/sections';

export default function Programme() {
  return (
    <SectionList
      title="tab.programme"
      sections={[
        { icon: 'calendar', title: 'programme.schedule', sub: 'programme.scheduleSub' },
        { icon: 'mic', tone: 'orange', title: 'programme.side', sub: 'programme.sideSub' },
        { icon: 'users', tone: 'blue', title: 'programme.speakers', sub: 'programme.speakersSub' },
        { icon: 'building-2', tone: 'green', title: 'programme.exhibitors', sub: 'programme.exhibitorsSub' },
        { icon: 'star', tone: 'orange', title: 'programme.agenda', sub: 'programme.agendaSub' },
      ]}
    />
  );
}
