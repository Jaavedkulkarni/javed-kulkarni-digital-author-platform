export type ReaderFontFamily = 'serif' | 'sans-serif' | 'literata' | 'charter' | 'system';

export interface ReaderTypography {
  fontFamily: ReaderFontFamily;
  fontSize: number;
  lineHeight: number;
  marginHorizontal: number;
  marginVertical: number;
}

export const DEFAULT_TYPOGRAPHY: ReaderTypography = {
  fontFamily: 'serif',
  fontSize: 18,
  lineHeight: 1.6,
  marginHorizontal: 24,
  marginVertical: 16,
};
