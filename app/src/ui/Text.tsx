import React from 'react';
import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';
import { hasEthiopic, textStyle, type TypeStyle } from '@/theme/typography';
import type { ColorRole } from '@/theme/brand';

export interface TextProps extends RNTextProps {
  variant?: TypeStyle;
  color?: ColorRole;
  weight?: 400 | 500 | 600 | 700 | 800;
  center?: boolean;
  upper?: boolean;
  display?: boolean;
  tabular?: boolean;
}

function flatten(children: React.ReactNode): string {
  let out = '';
  React.Children.forEach(children, (c) => {
    if (typeof c === 'string' || typeof c === 'number') out += String(c);
  });
  return out;
}

export function Text({ variant = 'body', color = 'text', weight, center, upper, display, tabular, style, children, ...rest }: TextProps) {
  const { c } = useTheme();
  const { prefs } = usePrefs();
  const ethiopic = hasEthiopic(flatten(children));
  
  // SAFETY FALLBACK: If an invalid variant is used, fallback to body to prevent crash
  const safeVariant = (variant === 'title' || variant === 'caption') ? 'body' : variant;
  
  const big = safeVariant === 'display' || safeVariant === 'largeTitle' || safeVariant === 'title1' || safeVariant === 'clock';
  const scale = big ? Math.min(prefs.textScale, 1.35) : prefs.textScale;
  
  // Try to get the style, fallback if the variant is missing from the system
  let base: any = {};
  try {
    base = textStyle(safeVariant, { ethiopic, lang: prefs.lang, scale, weight, display });
  } catch (e) {
    base = textStyle('body', { ethiopic, lang: prefs.lang, scale, weight, display });
  }

  const extra: TextStyle = {
    color: c[color],
    textAlign: center ? 'center' : undefined,
    textTransform: upper && !ethiopic ? 'uppercase' : undefined,
    letterSpacing: upper && !ethiopic && safeVariant !== 'label' ? 0.5 : base.letterSpacing,
    fontVariant: tabular || safeVariant === 'clock' ? ['tabular-nums'] : undefined,
  };
  
  return (
    <RNText
      {...rest}
      maxFontSizeMultiplier={big ? 1.35 : 2}
      accessibilityLanguage={ethiopic ? 'am' : 'en'}
      style={[base, extra, style]}>
      {children}
    </RNText>
  );
}