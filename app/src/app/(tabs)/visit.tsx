import React from 'react';
import { SectionList } from '@/screens/sections';

export default function Visit() {
  return (
    <SectionList
      title="tab.visit"
      sections={[
        { icon: 'siren', tone: 'red', title: 'visit.emergency', sub: 'visit.emergencySub' },
        { icon: 'plane', title: 'visit.before', sub: 'visit.beforeSub' },
        { icon: 'train-front', tone: 'blue', title: 'visit.around', sub: 'visit.aroundSub' },
        { icon: 'bed', tone: 'orange', title: 'visit.stay', sub: 'visit.staySub' },
        { icon: 'coffee', tone: 'green', title: 'visit.explore', sub: 'visit.exploreSub' },
        { icon: 'wallet', title: 'visit.money', sub: 'visit.moneySub' },
      ]}
    />
  );
}
