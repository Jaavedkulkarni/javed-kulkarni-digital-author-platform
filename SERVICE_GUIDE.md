# Service Guide

AuthorOS Core v1.0.0 — frozen service pattern.

## Interface

```typescript
import type { IService, IServiceResult } from '@/core/interfaces';
```

## Rules

1. Services orchestrate repositories and edge function calls
2. Services validate input (Zod) before operations
3. Services map all errors to `ERROR_CATALOG` codes
4. Services never use service role or admin APIs
5. Services invalidate React Query cache after mutations

## Structure

```
src/{module}/services/
  {entity}.service.ts
src/{module}/schemas/
  {entity}.schemas.ts
```

## Edge Function Services

For privileged CRUD, create a dedicated service that calls edge functions:

```typescript
import { invokeEdgeFunction } from '@/lib/edge-functions';
import { createIdempotencyKey } from '@/enterprise';
import { createCatalogError } from '@/core/errors';

export class CreateUserService {
  async createUser(values: CreateUserFormValues) {
    const result = await invokeEdgeFunction('create-user', body, {
      idempotencyKey: createIdempotencyKey('create-user'),
    });
    if (!result.success) {
      throw createCatalogError('USER_002', { overrideMessage: result.error.message });
    }
    return result.data;
  }
}
```

## React Query Integration

```typescript
// On mutation success:
await createEnterpriseCacheInvalidator(queryClient).people();
showToast('User created successfully');
```

## Error Mapping

| Scenario | Code |
|----------|------|
| Validation failure | SYSTEM_001 |
| Unauthorized | AUTH_001 |
| Forbidden | ROLE_001 |
| Not found | USER_001 |
| Conflict | USER_002 |
| Rate limited | SYSTEM_002 |
| Edge failure | EDGE_001 |
