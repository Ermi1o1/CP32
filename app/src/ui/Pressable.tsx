import React from 'react';
import { Pressable as RNPressable, type PressableProps, type StyleProp, type ViewStyle, Platform } from 'react-native';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';

/**
 * Pressable with the system's shared feedback: slight scale-down on press
 * (removed under reduce-motion), a visible focus ring, and a minimum 48 px target.
 */
export function Tap({ style, children, minTarget = true, ...rest }: Omit<PressableProps, 'style'> & { style?: StyleProp<ViewStyle>; minTarget?: boolean }) {
  const { c, layout, motion } = useTheme();
  const { prefs } = usePrefs();
  return (
    <RNPressable
      accessibilityRole="button"
      {...rest}
      style={(state) => {
        const focused = (state as { focused?: boolean }).focused === true;
        return [
          minTarget ? { minHeight: layout.minTarget, minWidth: layout.minTarget } : null,
          style,
          state.pressed ? { opacity: 0.85, transform: prefs.reduceMotion ? undefined : [{ scale: motion.pressScale }] } : null,
          focused && Platform.OS === 'web' ? { outlineColor: c.focus, outlineWidth: 3, outlineStyle: 'solid', outlineOffset: 2 } : null,
        ];
      }}>
      {children}
    </RNPressable>
  );
}
