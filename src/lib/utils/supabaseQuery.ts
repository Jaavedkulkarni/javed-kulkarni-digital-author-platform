export type SupabaseQueryBuilder = {
  eq: (column: string, value: unknown) => SupabaseQueryBuilder;
  neq: (column: string, value: unknown) => SupabaseQueryBuilder;
  gt: (column: string, value: unknown) => SupabaseQueryBuilder;
  gte: (column: string, value: unknown) => SupabaseQueryBuilder;
  lt: (column: string, value: unknown) => SupabaseQueryBuilder;
  lte: (column: string, value: unknown) => SupabaseQueryBuilder;
  like: (column: string, value: unknown) => SupabaseQueryBuilder;
  ilike: (column: string, value: unknown) => SupabaseQueryBuilder;
  in: (column: string, value: unknown) => SupabaseQueryBuilder;
  is: (column: string, value: unknown) => SupabaseQueryBuilder;
  contains: (column: string, value: unknown) => SupabaseQueryBuilder;
  containedBy: (column: string, value: unknown) => SupabaseQueryBuilder;
  or: (filters: string) => SupabaseQueryBuilder;
  filter: (column: string, operator: string, value: unknown) => SupabaseQueryBuilder;
  order: (
    column: string,
    options?: { ascending?: boolean; nullsFirst?: boolean; foreignTable?: string }
  ) => SupabaseQueryBuilder;
  range: (from: number, to: number) => SupabaseQueryBuilder;
  select: (columns?: string, options?: { count?: 'exact' | 'planned' | 'estimated'; head?: boolean }) => SupabaseQueryBuilder;
  single: () => Promise<{ data: unknown; error: unknown; count: number | null }>;
  maybeSingle: () => Promise<{ data: unknown; error: unknown; count: number | null }>;
  then: (
    onfulfilled?: (value: { data: unknown; error: unknown; count: number | null }) => unknown
  ) => Promise<{ data: unknown; error: unknown; count: number | null }>;
};
