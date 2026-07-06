import type { ReaderLayoutMode } from '../types/common';
import type { ReaderTypography } from '../types/typography.types';

export interface LayoutDimensions {
  contentWidth: number;
  contentHeight: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
}

export class LayoutEngine {
  computeDimensions(
    viewportWidth: number,
    viewportHeight: number,
    typography: ReaderTypography,
    mode: ReaderLayoutMode = 'paginated'
  ): LayoutDimensions {
    const marginH = typography.marginHorizontal;
    const marginV = typography.marginVertical;

    return {
      contentWidth: viewportWidth - marginH * 2,
      contentHeight: mode === 'scroll' ? viewportHeight : viewportHeight - marginV * 2,
      marginTop: marginV,
      marginBottom: marginV,
      marginLeft: marginH,
      marginRight: marginH,
    };
  }

  toCss(dimensions: LayoutDimensions): Record<string, string> {
    return {
      paddingTop: `${dimensions.marginTop}px`,
      paddingBottom: `${dimensions.marginBottom}px`,
      paddingLeft: `${dimensions.marginLeft}px`,
      paddingRight: `${dimensions.marginRight}px`,
      maxWidth: `${dimensions.contentWidth}px`,
    };
  }
}

export function createLayoutEngine(): LayoutEngine {
  return new LayoutEngine();
}
