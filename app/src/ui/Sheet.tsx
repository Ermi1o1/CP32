import React from 'react';
import { Modal, View, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './Text';
import { Icon } from './Icon';
import { Tap } from './Pressable';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';
import { useT } from '@/i18n';

/**
 * Bottom sheet built on the platform's own modal — no extra native library
 * (ADR-008). Slides up from the bottom, dims the page behind it, closes on the
 * close button, a tap on the dimmed area, or the system back gesture. The
 * sheet never exceeds 80% of the screen and scrolls inside itself.
 */
export function Sheet({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  const { c, radius } = useTheme();
  const { prefs } = usePrefs();
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  return (
    <Modal visible={open} transparent animationType={prefs.reduceMotion ? 'none' : 'slide'} onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable onPress={onClose} accessibilityLabel={t('a11y.close')} accessibilityRole="button" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(16,22,20,0.45)' }} />
        <View accessibilityViewIsModal style={{ maxHeight: height * 0.8, backgroundColor: c.bg, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingBottom: insets.bottom + 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 8, paddingTop: 10 }}>
            <Text variant="title2" accessibilityRole="header" style={{ flex: 1 }}>{title}</Text>
            <Tap onPress={onClose} accessibilityLabel={t('a11y.close')} style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: c.fill }}>
                <Icon name="x" size={20} color="text" stroke={2} />
              </View>
            </Tap>
          </View>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 12, gap: 6 }}>{children}</ScrollView>
          {footer ? <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>{footer}</View> : null}
        </View>
      </View>
    </Modal>
  );
}
