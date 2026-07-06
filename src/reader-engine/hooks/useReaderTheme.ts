import { useCallback, useState } from 'react';
import { useReaderEngineServices } from './useReaderEngineServices';
import type { ReaderThemeId } from '../types/common';
import type { ReaderTypography } from '../types/typography.types';

export function useReaderTheme(initialTheme: ReaderThemeId = 'light') {
  const { theme, font, layout } = useReaderEngineServices();
  const [themeId, setThemeId] = useState<ReaderThemeId>(initialTheme);
  const [typography, setTypography] = useState<ReaderTypography>(font.getDefaults());

  const themeStyles = theme.getTheme(themeId);
  const cssVariables = theme.toCssVariables(themeId);
  const fontCss = font.toCss(typography);

  const setFontSize = useCallback(
    (size: number) => setTypography((prev) => ({ ...prev, fontSize: font.clampFontSize(size) })),
    [font]
  );

  const setFontFamily = useCallback(
    (family: ReaderTypography['fontFamily']) => setTypography((prev) => ({ ...prev, fontFamily: family })),
    []
  );

  const setLineHeight = useCallback(
    (height: number) => setTypography((prev) => ({ ...prev, lineHeight: font.clampLineHeight(height) })),
    [font]
  );

  const setMargins = useCallback((horizontal: number, vertical: number) => {
    setTypography((prev) => ({ ...prev, marginHorizontal: horizontal, marginVertical: vertical }));
  }, []);

  const getLayout = useCallback(
    (viewportWidth: number, viewportHeight: number) =>
      layout.computeDimensions(viewportWidth, viewportHeight, typography),
    [layout, typography]
  );

  return {
    themeId,
    setThemeId,
    availableThemes: theme.getAvailableThemes(),
    themeStyles,
    cssVariables,
    typography,
    fontCss,
    setFontSize,
    setFontFamily,
    setLineHeight,
    setMargins,
    getLayout,
  };
}
