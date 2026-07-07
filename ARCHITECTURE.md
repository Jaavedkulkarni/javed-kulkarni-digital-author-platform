# AuthorOS Architecture

## Layer Model

```
┌─────────────────────────────────────────────┐
│  UI Modules (People, Books, CMS, …)       │  ← Business features (never modify core)
├─────────────────────────────────────────────┤
│  Module Services + Repositories             │  ← Follow frozen patterns
├─────────────────────────────────────────────┤
│  src/enterprise/                            │  ← Runtime implementations
├─────────────────────────────────────────────┤
│  src/core/  (AuthorOS Core v1.0.0 FROZEN)   │  ← Contracts, constants, errors
├─────────────────────────────────────────────┤
│  src/lib/supabase + edge-functions          │  ← Client infrastructure
├─────────────────────────────────────────────┤
│  supabase/functions/_shared + edge fns      │  ← Server privileged layer
├─────────────────────────────────────────────┤
│  PostgreSQL + Storage + Auth                │  ← Supabase
└─────────────────────────────────────────────┘
```

## Repository Pattern

- One repository per aggregate/table group
- Read via browser client (RLS-enforced)
- Writes to privileged resources via edge functions only
- Map DB rows to domain types in repository — not in UI

## Service Pattern

- Services orchestrate repositories and edge calls
- Services map errors to `ERROR_CATALOG` codes
- Services return `ApiResponse<T>` or typed service results
- No direct Supabase admin calls from services

## Edge Function Pattern

All privileged operations use `createEnterpriseHandler`:

1. Build request context (request_id, trace_id, correlation_id, span_id)
2. Enforce rate limits
3. Check idempotency key
4. Authenticate actor + permission check
5. Validate input
6. Execute with service role (admin client)
7. Write audit + activity logs
8. Publish domain event + webhook
9. Return `{ success, data | error }` with version headers

## Permission Pattern

- Edge: `requirePermission(userClient, actor, 'super_admin' | 'admin' | 'staff')`
- Browser: `assertEnterprisePermission(roles, permission)` from `@/core`
- DB: RLS + `apply_user_role_change` RPC for role mutations

## Logging Pattern

- Edge: structured JSON via `_shared/logging/logger.ts`
- Browser: `createStructuredLog` from `@/enterprise/observability`
- Audit: `write_audit_log` RPC — never console-only for privileged ops

## Error Pattern

- All errors use `ERROR_CATALOG` from `@/core/errors`
- Never expose internal stack traces to users
- Map HTTP status → catalog code via `mapHttpStatusToCatalogCode`

## Caching Pattern

- React Query keys from `CACHE_KEYS` in `@/core/constants`
- Invalidate via `EnterpriseCacheInvalidator`
- Default stale time: 60s, GC: 300s

## React Query Pattern

- One query client per app shell (lazy-loaded routes)
- Query keys from `CACHE_KEYS`
- Mutations invalidate related cache keys on success

## Storage Pattern

- Bucket names from `STORAGE_BUCKETS` in `@/core/constants`
- Avatar uploads via `upload-avatar` edge function
- Public URLs for public buckets; signed URLs for private buckets
