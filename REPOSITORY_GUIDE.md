# Repository Guide

AuthorOS Core v1.0.0 — frozen repository pattern.

## Interface

```typescript
import type { IRepository, IWritableRepository } from '@/core/interfaces';
```

## Rules

1. **Read-only from browser** — use `getBrowserClient()` with RLS
2. **No auth.users access** from browser repositories
3. **Map rows to domain types** in the repository layer
4. **No UI logic** in repositories
5. **Privileged writes** go through edge functions, not repositories

## Structure

```
src/{module}/repositories/
  {entity}.repository.ts    # Data access
  index.ts                  # Exports
```

## Example

```typescript
export class PeopleRepository {
  constructor(private readonly client: TypedSupabaseClient) {}

  async findAll(query: PeopleQuery): Promise<PeopleRepositoryRow[]> {
    const { data, error } = await this.client
      .from('profiles')
      .select('*, user_roles(roles(name))')
      .is('deleted_at', null);
    if (error) throw new PeopleRepositoryError('query_failed', error.message);
    return (data ?? []).map(mapPeopleRow);
  }
}
```

## Error Handling

Throw module-specific repository errors that services map to `ERROR_CATALOG`:

| Repository Error | Catalog Code |
|-----------------|--------------|
| not_found | USER_001 |
| conflict | USER_002 |
| permission_denied | ROLE_001 |

## Pagination

Use `PAGINATION_DEFAULTS` from `@/core/constants`:

```typescript
const { page, pageSize } = { ...PAGINATION_DEFAULTS, ...params };
const from = (page - 1) * pageSize;
```
