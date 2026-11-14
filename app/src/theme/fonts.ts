/** Bundled font files. Loaded from the app package; nothing is fetched at run time (D49). */
export const FONT_FILES = {
  'Atkinson-400': require('../../assets/fonts/Atkinson-400.ttf'),
  'Atkinson-600': require('../../assets/fonts/Atkinson-600.ttf'),
  'Atkinson-700': require('../../assets/fonts/Atkinson-700.ttf'),
  'Atkinson-800': require('../../assets/fonts/Atkinson-800.ttf'),
  'NotoEthiopic-400': require('../../assets/fonts/NotoEthiopic-400.ttf'),
  'NotoEthiopic-600': require('../../assets/fonts/NotoEthiopic-600.ttf'),
  'NotoEthiopic-700': require('../../assets/fonts/NotoEthiopic-700.ttf'),
} as const;
