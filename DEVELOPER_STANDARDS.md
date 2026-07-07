# Developer Standards

AuthorOS Core v1.0.0 — mandatory standards for all modules.

## Imports

| Need | Import From |
|------|-------------|
| Error codes | `@/core/errors` |
| Constants | `@/core/constants` |
| Enums | `@/core/enums` |
| Types | `@/core/types` |
| Interfaces | `@/core/interfaces` |
| API versioning | `@/core/versioning` |
| Edge invoke | `@/lib/edge-functions` |
| Enterprise runtime | `@/enterprise` |

## Prohibited

- Duplicating constants defined in `@/core/constants`
- Magic string error messages
- `supabase.auth.admin.*` in browser code
- Service role key in `VITE_*` env vars
- Direct `auth.users` mutations from browser
- Modifying `src/core/` from business modules
- TODO / FIXME comments in foundation code

## Required for New Modules

1. Repository for data access (read via RLS)
2. Service for orchestration
3. Edge function for privileged writes
4. Zod schemas for validation
5. React Query hooks with `CACHE_KEYS`
6. Error mapping to `ERROR_CATALOG`
7. Audit trail via edge functions (automatic)

## File Naming

| Type | Pattern |
|------|---------|
| Repository | `{entity}.repository.ts` |
| Service | `{entity}.service.ts` |
| Schema | `{entity}.schemas.ts` |
| Hook | `use{Entity}.ts` |
| Edge function folder | `{kebab-case}/index.ts` |

## TypeScript

- Strict mode enabled
- No `any` in foundation code
- Export types from module `types/` directory

## Git

- Foundation changes require architecture review
- Core v1.0.0 changes require major version bump

## Validation Before PR

```bash
npm run validate:foundation
npm run typecheck
npm run lint
npm run build
```

All must pass.
