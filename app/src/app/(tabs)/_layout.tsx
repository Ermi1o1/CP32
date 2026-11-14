import React from 'react';
import { Tabs } from 'expo-router/js-tabs';
import { AppHeader, TabBar, type TabItem } from '@/ui/chrome';
import { useT, type StringKey } from '@/i18n';
import type { IconName } from '@/ui/Icon';

/** The five primary destinations (D16 v2). Order and labels are fixed by the information architecture. */
const TABS: readonly { name: string; label: StringKey; icon: IconName }[] = [
  { name: 'index', label: 'tab.home', icon: 'house' },
  { name: 'programme', label: 'tab.programme', icon: 'calendar' },
  { name: 'map', label: 'tab.map', icon: 'map' },
  { name: 'visit', label: 'tab.visit', icon: 'luggage' },
  { name: 'updates', label: 'tab.updates', icon: 'newspaper' },
];

export default function TabsLayout() {
  const { t } = useT();
  return (
    <Tabs
      screenOptions={{ header: () => <AppHeader /> }}
      tabBar={({ state, navigateToTab }) => {
        const items: TabItem[] = state.routes.map((route, i) => {
          const def = TABS.find((x) => x.name === route.name) ?? TABS[0]!;
          return {
            key: route.key,
            label: t(def.label),
            icon: def.icon,
            focused: state.index === i,
            onPress: () => navigateToTab(route.key),
          };
        });
        return <TabBar items={items} />;
      }}>
      {TABS.map((tab) => (
        // Home draws its own header over the hero photograph.
        <Tabs.Screen key={tab.name} name={tab.name} options={tab.name === 'index' ? { headerShown: false } : undefined} />
      ))}
    </Tabs>
  );
}
