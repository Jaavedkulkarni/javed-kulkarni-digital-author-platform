# Security Guide

AuthorOS Core v1.0.0 — mandatory security rules.

## Browser Security

| Rule | Enforcement |
|------|-------------|
| No service role key | Never `VITE_SUPABASE_SERVICE_ROLE_KEY` |
| No admin APIs | Never `supabase.auth.admin.*` in browser |
| No auth.users mutations | Edge functions only |
| Anon key + JWT | `getBrowserClient()` only |
| Secrets abstraction | `getSecretsManager()` from `@/enterprise` |

## Edge Security

| Rule | Enforcement |
|------|-------------|
| Service role in Deno only | `createAdminClient()` in `_shared/auth/` |
| JWT verification | `verify_jwt = true` in config.toml |
| Permission middleware | `requirePermission()` before privileged ops |
| Input validation | Zod/manual validation in `_shared/validation/` |
| Input sanitization | `sanitizeRecord()` in `_shared/security/` |
| Security headers | Applied on every edge response |

## Permission Model

```
super_admin → all operations
admin       → admin operations + role management (limited)
staff       → author/publisher operations
authenticated → own resource access (RLS)
```

## Audit Requirements

Every privileged operation must write:

- `audit_logs` (before/after state)
- `activity_logs` (timeline entry)
- Request context IDs (request_id, trace_id, correlation_id)

## Rate Limiting

Default: 120 req/min per endpoint, 60 per IP, 30 per user.

Returns HTTP 429 with `Retry-After` header. Code: `SYSTEM_002`.

## Idempotency

Pass `Idempotency-Key` header for mutation edge functions.

Duplicate key + different payload → `EDGE_002` (409).

## Validation Checklist

```bash
npm run validate:foundation
```

Verify no `VITE_*SERVICE_ROLE*` in environment.
