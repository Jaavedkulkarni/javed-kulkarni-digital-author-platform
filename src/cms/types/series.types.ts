import type { Tables } from '../../types/database';

export interface CreateSeriesInput {
  title: string;
  slug?: string;
  subtitle?: string | null;
  description?: string | null;
  authorId?: string | null;
  publisherId?: string | null;
  primaryLanguage?: string;
  supportedLanguages?: string[];
  coverStoragePath?: string | null;
  isComplete?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
}

export type UpdateSeriesInput = Partial<CreateSeriesInput>;

export interface SeriesListFilters {
  authorId?: string;
  publisherId?: string;
  isFeatured?: boolean;
  search?: string;
}

export interface SeriesBookOrder {
  bookId: string;
  seriesOrder: number;
}

export interface CmsSeries extends Tables<'series'> {
  bookOrders?: SeriesBookOrder[];
}

export function mapSeriesRow(row: Tables<'series'>): CmsSeries {
  return row;
}
