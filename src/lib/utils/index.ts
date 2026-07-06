export { logger, setLogLevel, getLogLevel } from './logger';
export type { LogLevel } from './logger';

export {
  SupabaseServiceError,
  normalizeSupabaseError,
  getErrorMessage,
  isNotFoundError,
  isRetryableError,
  isPostgrestError,
  isAuthError,
  isStorageError,
} from './errors';
export type { SupabaseErrorSource, SupabaseErrorDetails } from './errors';

export { withRetry } from './retry';
export type { RetryOptions } from './retry';

export {
  normalizePage,
  normalizePageSize,
  getPaginationRange,
  buildPaginationMeta,
  createPaginatedResult,
} from './pagination';
export type { PaginationInput, PaginationRange, PaginationMeta, PaginatedResult } from './pagination';

export {
  eq,
  neq,
  gt,
  gte,
  lt,
  lte,
  ilike,
  inList,
  isNull,
  isNotNull,
  notDeleted,
  and,
  or,
  applyFilter,
  applyFilters,
} from './filters';
export type { FilterOperator, FilterCondition, FilterGroup } from './filters';

export {
  normalizeSortDirection,
  parseSortInput,
  applySorting,
  withDefaultSort,
  DEFAULT_SORT,
} from './sorting';
export type { SortDirection, SortOption, SortInput } from './sorting';

export { checkSupabaseConnection } from './healthCheck';
export type { ConnectionHealthStatus, ConnectionHealthResult } from './healthCheck';
