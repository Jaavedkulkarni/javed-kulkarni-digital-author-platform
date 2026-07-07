# Edge Function Guide

AuthorOS Core v1.0.0 — all privileged operations must use this pattern.

## Creating a New Edge Function

1. Create `supabase/functions/{name}/index.ts`
2. Use `createEnterpriseHandler` from `_shared/handler-enterprise.ts`
3. Add JWT verify in `supabase/config.toml`
4. Add rate limit override in `_shared/rate-limit/middleware.ts` if needed
5. Map errors to catalog codes

## Template

```typescript
import { createEnterpriseHandler, emitDomainEventAndAudit } from '../_shared/handler-enterprise.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';

Deno.serve(
  createEnterpriseHandler('{name}', { permission: 'super_admin' }, async (ctx) => {
    // 1. Validate ctx.body
    // 2. Execute privileged operation via ctx.adminClient
    // 3. Audit + event
    await emitDomainEventAndAudit(ctx, {
      eventType: 'UserCreated',
      payload: { /* … */ },
      audit: { action: 'create', entity: 'user', /* … */ },
    });
    return jsonSuccess({ /* … */ });
  }),
);
```

## Middleware Stack (Automatic)

| Step | Module |
|------|--------|
| CORS + security headers | `_shared/cors.ts`, `_shared/security/` |
| Request context | `_shared/request-context/` |
| Rate limiting | `_shared/rate-limit/` |
| Idempotency | `_shared/idempotency/` |
| Auth + permissions | `_shared/auth/`, `_shared/permissions/` |
| Metrics | `_shared/observability/metrics.ts` |

## Client Invocation

```typescript
import { invokeEdgeFunctionOrThrow } from '@/lib/edge-functions';
import { createIdempotencyKey } from '@/enterprise';

const data = await invokeEdgeFunctionOrThrow('create-user', body, {
  idempotencyKey: createIdempotencyKey('create-user'),
});
```

Headers sent automatically: `x-request-id`, `x-trace-id`, `x-correlation-id`, `x-span-id`, `x-api-version`.

## Security Rules

- Service role key only inside Deno via `createAdminClient()`
- Never return service role key in responses
- Rollback auth user on partial failure (see `create-user`)
- Validate all input before privileged operations

## API Versioning

Current version: **v1**. Pass `x-api-version: v1` header (automatic via invoke client).

Future v2 functions will live alongside v1 without duplicating `_shared` modules.
