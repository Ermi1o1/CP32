import type { ViewStyle } from 'react-native';

/**
 * The soft shadow that raises a block off the page (v1.4, D79).
 * 1 = small controls (chips, round buttons), 2 = cards, 3 = the floating tab bar and hero blocks.
 * Tinted with the brand green in the light theme; plain black in the dark one.
 * On Android versions before 9 no shadow is drawn; the white block on the tinted page still reads.
 */
export function lift(dark: boolean, level: 1 | 2 | 3 = 2): ViewStyle {
  const i = level - 1;
  const y = [2, 6, 10][i]!;
  const blur = [8, 20, 30][i]!;
  const alpha = (dark ? [0.3, 0.4, 0.5] : [0.07, 0.09, 0.16])[i]!;
  return { boxShadow: `0px ${y}px ${blur}px rgba(${dark ? '0,0,0' : '11,79,71'},${alpha})` };
}
