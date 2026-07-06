import type { SupabaseQueryBuilder } from './supabaseQuery';

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'in'
  | 'is'
  | 'not.is'
  | 'contains'
  | 'containedBy';

export interface FilterCondition {
  column: string;
  operator: FilterOperator;
  value: unknown;
}

export interface FilterGroup {
  conditions: FilterCondition[];
  match?: 'all' | 'any';
}

export function eq(column: string, value: unknown): FilterCondition {
  return { column, operator: 'eq', value };
}

export function neq(column: string, value: unknown): FilterCondition {
  return { column, operator: 'neq', value };
}

export function gt(column: string, value: unknown): FilterCondition {
  return { column, operator: 'gt', value };
}

export function gte(column: string, value: unknown): FilterCondition {
  return { column, operator: 'gte', value };
}

export function lt(column: string, value: unknown): FilterCondition {
  return { column, operator: 'lt', value };
}

export function lte(column: string, value: unknown): FilterCondition {
  return { column, operator: 'lte', value };
}

export function ilike(column: string, value: string): FilterCondition {
  return { column, operator: 'ilike', value: `%${value}%` };
}

export function inList(column: string, value: unknown[]): FilterCondition {
  return { column, operator: 'in', value };
}

export function isNull(column: string): FilterCondition {
  return { column, operator: 'is', value: null };
}

export function isNotNull(column: string): FilterCondition {
  return { column, operator: 'not.is', value: null };
}

export function notDeleted(deletedAtColumn = 'deleted_at'): FilterCondition {
  return isNull(deletedAtColumn);
}

export function and(...conditions: FilterCondition[]): FilterGroup {
  return { conditions, match: 'all' };
}

export function or(...conditions: FilterCondition[]): FilterGroup {
  return { conditions, match: 'any' };
}

export function applyFilter(query: SupabaseQueryBuilder, condition: FilterCondition): SupabaseQueryBuilder {
  switch (condition.operator) {
    case 'eq':
      return query.eq(condition.column, condition.value);
    case 'neq':
      return query.neq(condition.column, condition.value);
    case 'gt':
      return query.gt(condition.column, condition.value);
    case 'gte':
      return query.gte(condition.column, condition.value);
    case 'lt':
      return query.lt(condition.column, condition.value);
    case 'lte':
      return query.lte(condition.column, condition.value);
    case 'like':
      return query.like(condition.column, condition.value);
    case 'ilike':
      return query.ilike(condition.column, condition.value);
    case 'in':
      return query.in(condition.column, condition.value);
    case 'is':
      return query.is(condition.column, condition.value);
    case 'not.is':
      return query.filter(condition.column, 'not.is', condition.value);
    case 'contains':
      return query.contains(condition.column, condition.value);
    case 'containedBy':
      return query.containedBy(condition.column, condition.value);
    default:
      return query.filter(condition.column, condition.operator, condition.value);
  }
}

export function applyFilters<T extends SupabaseQueryBuilder>(
  query: T,
  group: FilterGroup
): T {
  if (group.match === 'any') {
    const expression = group.conditions
      .map((condition) => {
        const value =
          condition.operator === 'ilike'
            ? `%${String(condition.value).replace(/%/g, '')}%`
            : condition.value;
        return `${condition.column}.${condition.operator}.${value}`;
      })
      .join(',');

    return query.or(expression) as T;
  }

  return group.conditions.reduce<SupabaseQueryBuilder>(
    (current, condition) => applyFilter(current, condition),
    query
  ) as T;
}
