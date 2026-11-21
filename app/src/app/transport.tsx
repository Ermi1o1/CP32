import React, { useState } from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform, ScrollView, Image, Animated, PanResponder, Dimensions, type DimensionValue } from 'react-native';
import { SubHeader } from '@/ui/chrome';
import { Text } from '@/ui/Text';
import { Icon, type IconName } from '@/ui/Icon';
import { Tap } from '@/ui/Pressable';
import { useTheme } from '@/theme/ThemeProvider';
import { lift } from '@/ui/lift';
import { useT } from '@/i18n';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MIN_SHEET_HEIGHT = 350;
const MAX_SHEET_HEIGHT = SCREEN_HEIGHT * 0.8;
const SNAP_THRESHOLD = 50;
const COLLAPSED = SCREEN_HEIGHT - MIN_SHEET_HEIGHT;
const EXPANDED = SCREEN_HEIGHT - MAX_SHEET_HEIGHT;
const clamp = (y: number) => Math.min(COLLAPSED, Math.max(EXPANDED, y));

type Line = 'info' | 'danger';
interface Segment { top: DimensionValue; left: DimensionValue; width: DimensionValue; rotate: string }

type Tab = 'route' | 'lines' | 'stops' | 'places';

// Realistic transit lines (Blue and Red like COP31)
const ROUTES: { id: string; color: Line; segments: Segment[] }[] = [
  { id: 'blue', color: 'info', segments: [
    { top: '50%', left: '20%', width: '30%', rotate: '-15deg' },
    { top: '42%', left: '40%', width: '25%', rotate: '10deg' },
    { top: '45%', left: '60%', width: '20%', rotate: '-5deg' },
  ]},
  { id: 'red', color: 'danger', segments: [
    { top: '55%', left: '25%', width: '20%', rotate: '25deg' },
    { top: '60%', left: '40%', width: '15%', rotate: '-15deg' },
  ]}
];

const STOPS: { top: DimensionValue; left: DimensionValue; color: Line }[] = [
  { top: '48%', left: '22%', color: 'info' },
  { top: '40%', left: '42%', color: 'info' },
  { top: '43%', left: '62%', color: 'info' },
  { top: '57%', left: '27%', color: 'danger' },
  { top: '62%', left: '42%', color: 'danger' },
];

export default function Transport() {
  const { c, dark } = useTheme();
  const { t } = useT();
  const [activeTab, setActiveTab] = useState<Tab>('lines');

  // Draggable bottom sheet. panY is the sheet's translateY. On grant the
  // current position becomes the offset, so a drag continues from wherever the
  // sheet is (it no longer jumps back to the collapsed position after snapping
  // up); on release the offset is flattened and the sheet springs to a snap point.
  const [panY] = useState(() => new Animated.Value(COLLAPSED));
  const [drag] = useState(() => ({ base: COLLAPSED }));
  const [panResponder] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_e, g) => Math.abs(g.dy) > 4,
      onPanResponderGrant: () => {
        panY.stopAnimation((v) => {
          drag.base = v;
          panY.setOffset(v);
          panY.setValue(0);
        });
      },
      onPanResponderMove: (_e, g) => {
        panY.setValue(clamp(drag.base + g.dy) - drag.base);
      },
      onPanResponderRelease: (_e, g) => {
        panY.flattenOffset();
        const y = clamp(drag.base + g.dy);
        const target = g.dy > SNAP_THRESHOLD ? COLLAPSED
          : g.dy < -SNAP_THRESHOLD ? EXPANDED
          : y < (COLLAPSED + EXPANDED) / 2 ? EXPANDED : COLLAPSED;
        drag.base = target;
        Animated.spring(panY, { toValue: target, useNativeDriver: true }).start();
      },
      onPanResponderTerminate: () => {
        panY.flattenOffset();
        Animated.spring(panY, { toValue: drag.base, useNativeDriver: true }).start();
      },
    })
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <SubHeader title={t('transport.title')} />
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        
        {/* Real English Map Background */}
        <View style={{ flex: 1, backgroundColor: c.surfaceAlt, position: 'relative' }}>
          <Image 
            source={{ uri: 'https://static-maps.yandex.ru/1.x/?ll=38.7578,9.0192&z=11&l=map&size=600,400&lang=en_US' }} 
            style={{ width: '100%', height: '100%', opacity: 0.9 }} 
            resizeMode="cover"
          />

          {/* Render Multiple Transit Lines */}
          {ROUTES.map(route => route.segments.map((seg, i) => (
             <View key={`${route.id}-${i}`} style={{ position: 'absolute', top: seg.top, left: seg.left, width: seg.width, height: 5, backgroundColor: c[route.color], transform: [{ rotate: seg.rotate }], borderRadius: 3, opacity: 0.9 }} />
          )))}

          {/* Render Stops */}
          {STOPS.map((stop, i) => (
             <View key={i} style={{ position: 'absolute', top: stop.top, left: stop.left, width: 14, height: 14, borderRadius: 7, backgroundColor: c.surface, borderWidth: 3, borderColor: c[stop.color], marginTop: -5, marginLeft: -5 }} />
          ))}
          
        </View>

        {/* Draggable Bottom Sheet */}
        <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: SCREEN_HEIGHT, backgroundColor: c.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, transform: [{ translateY: panY }], ...lift(dark, 3) }}>
          
          {/* Draggable Handle Area */}
          <View {...panResponder.panHandlers} accessibilityHint={t('transport.dragHint')} style={{ minHeight: 48, paddingTop: 12, paddingBottom: 12, alignItems: 'center' }}>
            <View style={{ width: 40, height: 5, borderRadius: 3, backgroundColor: c.border }} />
          </View>

          {/* Search Bar */}
          <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: c.bg, borderRadius: 12, paddingHorizontal: 16, height: 50 }}>
              <View style={{ marginRight: 10 }}><Icon name="search" size={20} color="textSecondary" /></View>
              <TextInput placeholder={t('transport.search')} placeholderTextColor={c.textSecondary} style={{ flex: 1, color: c.text, fontSize: 15 }} />
            </View>
          </View>

          {/* Tab Content */}
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
            
            {activeTab === 'route' && (
              <View style={{ gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: c.bg, borderRadius: 12, paddingHorizontal: 16, height: 56 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c.success, marginRight: 12 }} />
                  <TextInput placeholder={t('transport.from')} placeholderTextColor={c.textSecondary} style={{ flex: 1, color: c.text, fontSize: 15 }} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: c.bg, borderRadius: 12, paddingHorizontal: 16, height: 56 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c.danger, marginRight: 12 }} />
                  <TextInput placeholder={t('transport.to')} placeholderTextColor={c.textSecondary} style={{ flex: 1, color: c.text, fontSize: 15 }} />
                </View>
                <Text variant="footnote" color="textSecondary" center style={{ marginTop: 16 }}>Pick a start and a destination to see which stop and which line to use.</Text>
              </View>
            )}

            {activeTab === 'lines' && [
              { id: 'E120', name: 'Merkez - Lara - COP32', stops: 11, time: '1 hr 31 min', dist: '37 km', type: 'Express' },
              { id: 'E210', name: 'Gürsu - COP32', stops: 7, time: '1 hr 20 min', dist: '52 km', type: 'Express' },
              { id: 'E220', name: 'Otogar - COP32', stops: 4, time: '1 hr 10 min', dist: '48 km', type: 'Express' },
              { id: 'O410', name: 'Havaalani - Lara - Kundu', stops: 50, time: '59 min', dist: '26 km', type: 'Bus' },
            ].map((line, i) => (
              <View key={line.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: c.border }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: i % 2 === 0 ? c.danger : c.info, alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                  <Text variant="label" weight={700} color={i % 2 === 0 ? 'onDanger' : 'onPrimary'}>{line.id}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="headline" weight={600} numberOfLines={1} style={{ fontSize: 16 }}>{line.id} - {line.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <Icon name="map" size={14} color="textSecondary" />
                    <Text variant="footnote" color="textSecondary">{line.type} · {line.stops} stops · {line.time} · {line.dist}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <Icon name="calendar" size={14} color="textSecondary" />
                    <Text variant="footnote" color="textSecondary">30 trips a day · 24 hours</Text>
                  </View>
                </View>
              </View>
            ))}

            {activeTab === 'stops' && [
              { id: '12003/1', lines: ['E120'] },
              { id: '12006/1', lines: ['E120'] },
              { id: '220-01/1', lines: ['E220'] },
            ].map((stop, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: c.border }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c.danger, alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                  <Icon name="map-pin" size={20} color="onDanger" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="headline" weight={600} style={{ fontSize: 16 }}>{stop.id}</Text>
                  <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                    {stop.lines.map(l => (
                      <View key={l} style={{ backgroundColor: c.danger, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                        <Text variant="label" weight={700} color="onDanger">{l}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))}

            {activeTab === 'places' && [
              { name: 'Skylight Hotel', area: 'Bole', dist: 'stop 200 m' },
              { name: 'Hyatt Regency', area: 'Meskel Square', dist: 'stop 360 m' },
              { name: 'Radisson Blu', area: 'Kazanchis', dist: 'stop 500 m' },
            ].map((place, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: c.border }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                  <Icon name="landmark" size={20} color="onPrimary" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="headline" weight={600} numberOfLines={1} style={{ fontSize: 16 }}>{place.name}</Text>
                  <Text variant="footnote" color="textSecondary" style={{ marginTop: 2 }}>{place.area} · {place.dist}</Text>
                </View>
              </View>
            ))}

          </ScrollView>
        </Animated.View>

        {/* Fixed Bottom Tabs (Matches COP31 style) */}
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: c.surface, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 32 : 16, borderTopWidth: 1, borderTopColor: c.divider, zIndex: 20 }}>
          <TabButton icon="map" label={t('transport.route')} active={activeTab === 'route'} onPress={() => setActiveTab('route')} />
          <TabButton icon="book-open" label={t('transport.lines')} active={activeTab === 'lines'} onPress={() => setActiveTab('lines')} />
          <TabButton icon="map" label={t('transport.stops')} active={activeTab === 'stops'} onPress={() => setActiveTab('stops')} />
          <TabButton icon="landmark" label={t('transport.places')} active={activeTab === 'places'} onPress={() => setActiveTab('places')} />
        </View>

      </KeyboardAvoidingView>
    </View>
  );
}

function TabButton({ icon, label, active, onPress }: { icon: IconName; label: string; active: boolean; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Tap onPress={onPress} accessibilityRole="tab" accessibilityState={{ selected: active }} accessibilityLabel={label} style={{ alignItems: 'center', justifyContent: 'center', gap: 4 }}>
      <View style={{ width: 56, height: 32, borderRadius: 16, backgroundColor: active ? c.primarySoft : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={20} color={active ? 'primary' : 'textSecondary'} />
      </View>
      <Text variant="label" weight={active ? 700 : 500} color={active ? 'primary' : 'textSecondary'}>{label}</Text>
    </Tap>
  );
}