# AuthorOS Foundation

AuthorOS Core v1.0.0 is the frozen enterprise foundation for all platform modules.

## Foundation Components

| Component | Location | Status |
|-----------|----------|--------|
| Error Catalog | `src/core/errors/` | Frozen |
| Constants | `src/core/constants/` | Frozen |
| Enums | `src/core/enums/` | Frozen |
| Types | `src/core/types/foundation.types.ts` | Frozen |
| Interfaces | `src/core/interfaces/` | Frozen |
| API Versioning | `src/core/versioning/` | Frozen v1 |
| Validation | `src/core/validation/` | Frozen |
| Enterprise Runtime | `src/enterprise/` | Frozen patterns |
| Edge Shared | `supabase/functions/_shared/` | Frozen |
| Supabase Clients | `src/lib/supabase/` | Frozen |
| Edge Invoke | `src/lib/edge-functions/` | Frozen |

## Data Flow

```
Browser (anon + JWT)
  → invokeEdgeFunction (request context + idempotency + api version headers)
    → Edge Function (createEnterpriseHandler)
      → validate → rate limit → idempotency → permission check
      → privileged operation (service role)
      → audit log + activity log + domain event + webhook
      → typed ApiResponse
  → Service maps errors via ERROR_CATALOG
  → React Query cache invalidation via CACHE_KEYS
```

## Database Foundation

Migration `020_enterprise_foundation.sql` provides:

- `audit_logs`, `activity_logs`, `feature_flags`
- `idempotency_keys`, `rate_limit_counters`, `background_jobs`
- `webhook_subscriptions`, `webhook_deliveries`, `distributed_locks`
- `user_security` (temp password metadata)
- `avatars` storage bucket

## Validation

Run foundation validation:

```bash
npm run validate:foundation
npm run validate
```

Programmatic validation:

```typescript
import { runFoundationValidation, assertFoundationValid } from '@/core';
assertFoundationValid();
```

## Related Documentation

- [ARCHITECTURE_VERSION.md](./ARCHITECTURE_VERSION.md)
- [FOUNDATION_CHECKLIST.md](./FOUNDATION_CHECKLIST.md)
- [ARCHITECTURE_FREEZE.md](./ARCHITECTURE_FREEZE.md)
