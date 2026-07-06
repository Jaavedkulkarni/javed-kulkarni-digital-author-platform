import type { ReaderLocation } from '../types/common';

export function isValidCfi(cfi: string | null | undefined): boolean {
  if (!cfi) return false;
  return cfi.startsWith('epubcfi(') && cfi.endsWith(')');
}

export function compareLocations(a: ReaderLocation, b: ReaderLocation): number {
  const aPercent = a.positionPercent ?? 0;
  const bPercent = b.positionPercent ?? 0;
  if (aPercent !== bPercent) return aPercent - bPercent;
  const aPage = a.pageNumber ?? 0;
  const bPage = b.pageNumber ?? 0;
  return aPage - bPage;
}

export function locationToKey(location: ReaderLocation): string {
  return [
    location.chapterId ?? '',
    location.pageNumber ?? '',
    location.positionPercent ?? '',
    location.cfi ?? '',
  ].join('|');
}
