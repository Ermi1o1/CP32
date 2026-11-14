import React from 'react';
import { SvgXml } from 'react-native-svg';
import { ICONS, type IconName } from './icons.generated';
import { useTheme } from '@/theme/ThemeProvider';
import type { ColorRole } from '@/theme/brand';

export type { IconName };

/** Lucide outline icon, drawn from bundled SVG paths only (D49). Decorative unless a parent labels it. */
export function Icon({ name, size = 24, color = 'text', stroke = 1.75, fill }: { name: IconName; size?: number; color?: ColorRole; stroke?: number; fill?: string }) {
  const { c } = useTheme();
  const xml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${fill ?? 'none'}" stroke="${c[color]}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
  return <SvgXml xml={xml} width={size} height={size} accessibilityElementsHidden importantForAccessibility="no" />;
}

export function Mark({ size = 30 }: { size?: number }) {
  const { brand } = useTheme();
  return <SvgXml xml={brand.markSvg} width={size} height={size} style={{ borderRadius: size * 0.22, overflow: 'hidden' }} />;
}
