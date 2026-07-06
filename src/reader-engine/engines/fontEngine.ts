import type { ReaderTypography } from '../types/typography.types';
import { DEFAULT_TYPOGRAPHY } from '../types/typography.types';
import { FONT_FAMILY_MAP } from '../constants/readerEngine.constants';

export class FontEngine {
  getDefaults(): ReaderTypography {
    return { ...DEFAULT_TYPOGRAPHY };
  }

  resolveFontFamily(family: ReaderTypography['fontFamily']): string {
    return FONT_FAMILY_MAP[family] ?? FONT_FAMILY_MAP.serif;
  }

  clampFontSize(size: number): number {
    return Math.min(32, Math.max(12, size));
  }

  clampLineHeight(height: number): number {
    return Math.min(2.5, Math.max(1.2, height));
  }

  toCss(typography: ReaderTypography): Record<string, string> {
    return {
      fontFamily: this.resolveFontFamily(typography.fontFamily),
      fontSize: `${this.clampFontSize(typography.fontSize)}px`,
      lineHeight: String(this.clampLineHeight(typography.lineHeight)),
    };
  }
}

export function createFontEngine(): FontEngine {
  return new FontEngine();
}
