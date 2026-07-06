import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../supabase/config/constants';

export interface PaginationInput {
  page?: number;
  pageSize?: number;
}

export interface PaginationRange {
  from: number;
  to: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  from: number;
  to: number;
  total: number | null;
  totalPages: number | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function normalizePage(page: number | undefined): number {
  if (!page || page < 1) return 1;
  return Math.floor(page);
}

export function normalizePageSize(pageSize: number | undefined): number {
  if (!pageSize || pageSize < 1) return DEFAULT_PAGE_SIZE;
  return Math.min(Math.floor(pageSize), MAX_PAGE_SIZE);
}

export function getPaginationRange(input: PaginationInput = {}): PaginationRange {
  const page = normalizePage(input.page);
  const pageSize = normalizePageSize(input.pageSize);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  return { from, to };
}

export function buildPaginationMeta(
  input: PaginationInput,
  total: number | null
): PaginationMeta {
  const page = normalizePage(input.page);
  const pageSize = normalizePageSize(input.pageSize);
  const { from, to } = getPaginationRange({ page, pageSize });
  const totalPages = total === null ? null : Math.max(1, Math.ceil(total / pageSize));

  return {
    page,
    pageSize,
    from,
    to,
    total,
    totalPages,
    hasNextPage: total === null ? false : page < (totalPages ?? 1),
    hasPreviousPage: page > 1,
  };
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

export function createPaginatedResult<T>(
  data: T[],
  input: PaginationInput,
  total: number | null
): PaginatedResult<T> {
  return {
    data,
    pagination: buildPaginationMeta(input, total),
  };
}
