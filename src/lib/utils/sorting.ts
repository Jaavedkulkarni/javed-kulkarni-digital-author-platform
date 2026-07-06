import type { SupabaseQueryBuilder } from './supabaseQuery';

export type SortDirection = 'asc' | 'desc';

export interface SortOption {
  column: string;
  direction?: SortDirection;
}

export interface SortInput {
  sortBy?: string;
  sortDirection?: SortDirection;
  sorts?: SortOption[];
}

export function normalizeSortDirection(direction: SortDirection | undefined): SortDirection {
  return direction === 'desc' ? 'desc' : 'asc';
}

export function parseSortInput(input: SortInput = {}): SortOption[] {
  if (input.sorts && input.sorts.length > 0) {
    return input.sorts.map((sort) => ({
      column: sort.column,
      direction: normalizeSortDirection(sort.direction),
    }));
  }

  if (input.sortBy) {
    return [
      {
        column: input.sortBy,
        direction: normalizeSortDirection(input.sortDirection),
      },
    ];
  }

  return [];
}

export function applySorting<T extends SupabaseQueryBuilder>(query: T, input: SortInput = {}): T {
  const sorts = parseSortInput(input);

  let current: SupabaseQueryBuilder = query;

  for (const sort of sorts) {
    current = current.order(sort.column, {
      ascending: sort.direction !== 'desc',
    });
  }

  return current as T;
}

export const DEFAULT_SORT: SortOption = { column: 'created_at', direction: 'desc' };

export function withDefaultSort(input: SortInput = {}, fallback: SortOption = DEFAULT_SORT): SortInput {
  const sorts = parseSortInput(input);
  if (sorts.length > 0) return input;

  return {
    ...input,
    sorts: [fallback],
  };
}
