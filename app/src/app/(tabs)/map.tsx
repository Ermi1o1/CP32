import React from 'react';
import { SectionList } from '@/screens/sections';

export default function MapTab() {
  return (
    <SectionList
      title="tab.map"
      sections={[
        { icon: 'layers', title: 'map.venue', sub: 'map.venueSub' },
        { icon: 'map-pin', tone: 'blue', title: 'map.city', sub: 'map.citySub' },
        { icon: 'accessibility', tone: 'green', title: 'map.access', sub: 'map.accessSub' },
      ]}
    />
  );
}
