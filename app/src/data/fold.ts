/**
 * Search normaliser (D47). Makes two strings comparable:
 *  - lower-cases and strips accents and punctuation;
 *  - folds Ge'ez homophone letter series onto one series
 *    (ሐ and ኀ → ሀ, ሠ → ሰ, ዐ → አ, ፀ → ጸ), so either spelling finds the other;
 *  - turns Ge'ez numerals into digits (፴፪ → 32).
 * The homophone list still needs review by an Amharic linguist.
 */
const FOLD: Record<number, number> = { 0x1210: 0x1200, 0x1280: 0x1200, 0x1220: 0x1230, 0x12d0: 0x12a0, 0x1340: 0x1338 };

export function fold(input: string): string {
  let s = (input ?? '').normalize('NFKD').replace(/[̀-ͯ]/g, '');
  s = s.replace(/[፩-፼]+/g, (m) => {
    let total = 0;
    let cur = 0;
    for (const ch of m) {
      const p = ch.codePointAt(0)!;
      if (p <= 0x1371) cur += p - 0x1368;                 // ፩–፱ = 1–9
      else if (p <= 0x137a) cur += (p - 0x1371) * 10;     // ፲–፺ = 10–90
      else if (p === 0x137b) { total += (cur || 1) * 100; cur = 0; } // ፻ = 100
      else { total = (total + (cur || 1)) * 10000; cur = 0; }        // ፼ = 10,000
    }
    return String(total + cur);
  });
  let out = '';
  for (const ch of s) {
    const p = ch.codePointAt(0)!;
    let mapped = ch;
    for (const k of Object.keys(FOLD)) {
      const base = Number(k);
      if (p >= base && p < base + 8) { mapped = String.fromCodePoint(FOLD[base]! + (p - base)); break; }
    }
    out += mapped;
  }
  return out.toLowerCase().replace(/[፠-፨]|[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
}
