# AuthorOS Core Architecture Version

| Field | Value |
|-------|-------|
| **Architecture** | AuthorOS Core |
| **Version** | **1.0.0** |
| **Status** | **FROZEN** |
| **API Version** | v1 |
| **Freeze Sprint** | 02.3D |
| **Effective Date** | 2026-07-07 |

## Scope

This version covers the immutable enterprise foundation:

- Authentication & session management (browser client only)
- Authorization & RBAC
- Edge Functions (privileged operations)
- Repository / Service patterns
- Feature flags, audit, activity logs
- Storage, notifications, event bus, jobs
- Request context, idempotency, rate limiting
- Distributed locks, webhooks, observability, health
- Global error catalog
- API versioning (v1)

## Folder Structure (Frozen)

```
src/
  core/                    # AuthorOS Core v1.0.0 — FROZEN
    constants/             # Canonical constants (roles, flags, buckets, cache, events)
    enums/                 # Canonical enums
    errors/                # Global error catalog (AUTH_001, USER_001, …)
    interfaces/            # Repository, Service, Event, Job, Storage contracts
    types/                 # ApiResponse, Pagination, RequestContext, Audit, Health
    validation/            # Foundation validation
    versioning/            # API v1 contracts
    permissions/           # Permission engine
    feature-flags/         # Feature flag engine
    events/                # Event bus
    services/              # Core services
  enterprise/              # Enterprise runtime (re-exports core + implementations)
  lib/
    supabase/              # Supabase client foundation
    edge-functions/        # Edge function invoke client
    storage/               # Storage helpers
supabase/
  functions/
    _shared/               # Shared edge middleware (FROZEN pattern)
    {function-name}/       # One function per privileged operation
  migrations/              # Database schema
```

## Coding Standards

| Layer | Rule |
|-------|------|
| Browser | Anon key + user JWT only. Never service role. Never `auth.admin.*` |
| Edge | Service role inside Deno only. Always use `createEnterpriseHandler` |
| Errors | Use `ERROR_CATALOG` codes — no magic strings |
| Constants | Import from `@/core/constants` — never duplicate |
| Events | Publish via domain event bus — no inline business logic in events |
| Cache | Use `CACHE_KEYS` from core — invalidate via `EnterpriseCacheInvalidator` |

## Naming Standards

| Artifact | Convention | Example |
|----------|------------|---------|
| Edge function | kebab-case | `create-user` |
| Service class | PascalCase + Service | `CreateUserService` |
| Repository class | PascalCase + Repository | `PeopleRepository` |
| Error code | DOMAIN_NNN | `AUTH_001` |
| Cache key | `['enterprise', module, …]` | `CACHE_KEYS.people.all` |
| Domain event | PascalCase | `UserCreated` |
| Feature flag | EnablePascalCase | `EnableAvatarUpload` |

## Immutable Patterns

See companion guides:

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [REPOSITORY_GUIDE.md](./REPOSITORY_GUIDE.md)
- [SERVICE_GUIDE.md](./SERVICE_GUIDE.md)
- [EDGE_FUNCTION_GUIDE.md](./EDGE_FUNCTION_GUIDE.md)
- [ERROR_CATALOG.md](./ERROR_CATALOG.md)
- [DEVELOPER_STANDARDS.md](./DEVELOPER_STANDARDS.md)
- [ARCHITECTURE_FREEZE.md](./ARCHITECTURE_FREEZE.md)

## Version History

| Version | Sprint | Notes |
|---------|--------|-------|
| 1.0.0 | 02.3D | Architecture freeze — enterprise core immutable |
