import type { ReaderThemeId } from '../types/common';
import { READER_THEMES } from '../constants/readerEngine.constants';

export interface ThemeStyles {
  backgroundColor: string;
  color: string;
  accentColor: string;
}

export class ThemeEngine {
  getTheme(themeId: ReaderThemeId): ThemeStyles {
    const theme = READER_THEMES[themeId];
    return {
      backgroundColor: theme.background,
      color: theme.text,
      accentColor: theme.accent,
    };
  }

  getAvailableThemes(): ReaderThemeId[] {
    return ['light', 'dark', 'sepia'];
  }

  toCssVariables(themeId: ReaderThemeId): Record<string, string> {
    const styles = this.getTheme(themeId);
    return {
      '--reader-bg': styles.backgroundColor,
      '--reader-text': styles.color,
      '--reader-accent': styles.accentColor,
    };
  }
}

export function createThemeEngine(): ThemeEngine {
  return new ThemeEngine();
}
