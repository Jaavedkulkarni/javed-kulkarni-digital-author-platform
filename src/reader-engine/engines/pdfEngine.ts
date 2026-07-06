import type { ReaderLocation } from '../types/common';

export interface PdfRenderState {
  bookId: string;
  currentPage: number;
  totalPages: number;
  scale: number;
}

export class PdfEngine {
  createRenderState(bookId: string, totalPages: number): PdfRenderState {
    return { bookId, currentPage: 1, totalPages, scale: 1.0 };
  }

  pageToProgress(currentPage: number, totalPages: number): number {
    if (totalPages <= 0) return 0;
    return Math.min(100, Math.round((currentPage / totalPages) * 100 * 100) / 100);
  }

  progressToPage(progressPercent: number, totalPages: number): number {
    if (totalPages <= 0) return 1;
    return Math.max(1, Math.ceil((progressPercent / 100) * totalPages));
  }

  resolveLocation(pageNumber: number, totalPages: number): ReaderLocation {
    return {
      pageNumber,
      positionPercent: this.pageToProgress(pageNumber, totalPages),
    };
  }

  getVisiblePageRange(currentPage: number, buffer = 2, totalPages: number): number[] {
    const start = Math.max(1, currentPage - buffer);
    const end = Math.min(totalPages, currentPage + buffer);
    const pages: number[] = [];
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  }
}

export function createPdfEngine(): PdfEngine {
  return new PdfEngine();
}
