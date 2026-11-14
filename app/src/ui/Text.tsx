import React from 'react';
import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';
import { useTheme, usePrefs } from '@/theme/ThemeProvider';
import { hasEthiopic, textStyle, type TypeStyle } from '@/theme/typography';
import type { ColorRole } from '@/theme/brand';

export interface TextProps extends RNTextProps {
  variant?: TypeStyle;
  color?: ColorRole;
  weight?: 400 | 600 | 700 | 800;
  center?: boolean;
  upper?: boolean;
}

function flatten(children: React.ReactNode): string {
  let out = '';
  React.Children.forEach(children, (c) => {
    if (typeof c === 'string' || typeof c === 'number') out += String(c);
  });
  return out;
}

/**
 * The only text component screens may use. It picks the bundled font for the
 * script actually present in the string, applies the taller Amharic line
 * height, the in-app text size, and tags the language for screen readers.
 */
export function Text({ variant = 'body', color = 'text', weight, center, upper, style, children, ...rest }: TextProps) {
  const { c } = useTheme();
  const { prefs } = usePrefs();
  const ethiopic = hasEthiopic(flatten(children));
  const base = textStyle(variant, { ethiopic, lang: prefs.lang, scale: prefs.textScale, weight });
  const extra: TextStyle = {
    color: c[color],
    textAlign: center ? 'center' : undefined,
    // Upper-casing and tracking are Latin conventions; Ge'ez has no case.
    textTransform: upper && !ethiopic ? 'uppercase' : undefined,
    letterSpacing: upper && !ethiopic ? 0.5 : base.letterSpacing,
  };
  return (
    <RNText
      {...rest}
      // Honour the phone's own font-size setting as well, up to 200% combined is tested.
      maxFontSizeMultiplier={2}
      accessibilityLanguage={ethiopic ? 'am' : 'en'}
      style={[base, extra, style]}>
      {children}
    </RNText>
  );
}
