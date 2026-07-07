# People Module v1.0.0 — Release Notes

**Release date:** 7 July 2026  
**Git tag:** `people-module-v1.0.0`  
**Scope:** Super Admin → People

---

## Summary

People Module v1.0.0 marks the **production freeze** of the Super Admin user management surface. This release completes the full user lifecycle—from creation through security operations, bulk management, import/export, and compliance-grade read-only timelines—without UI redesign or architecture changes.

---

## What's Included

### User lifecycle
- Create, edit, suspend, restore, soft delete, and recover users
- Profile management with avatar upload/delete and role assignment
- Account Security tab: passwords, invitations, verification, sessions, MFA, account unlock

### Operations at scale
- Multi-select with select-all-pages, invert, and clear
- Bulk suspend, restore, delete, recover, role changes, password reset, verification, and invites
- CSV/Excel import with preview and column mapping
- CSV/Excel/PDF export with async jobs for large datasets

### Compliance & observability
- **Activity** timeline with grouped time buckets
- **Audit** timeline with before/after JSON diff and developer payload view
- **Login history** with device, geo, and session indicators
- **Security events** with automatic risk classification (normal / warning / critical)
- Cursor pagination, infinite scroll, export with current filters
- Sensitive field masking throughout

---

## Validation Results (Sprint 02.10)

| Check | Result |
|-------|--------|
| `npm run typecheck` (People module) | **Pass** — zero People-related errors |
| `npm run build` | **Pass** |
| `npm run lint` (repo-wide) | Pre-existing non-People warnings/errors remain |

---

## Upgrade / Deploy Notes

1. Ensure Supabase migrations through `021_user_security_soft_delete` are applied
2. Deploy all People-related edge functions (see `PEOPLE_MODULE.md` edge table)
3. Verify `super_admin` role assignment for operators
4. Run [`QA_CHECKLIST.md`](./QA_CHECKLIST.md) in staging before production

---

## Documentation

- [`PEOPLE_MODULE.md`](./PEOPLE_MODULE.md) — architecture, schema, permissions, component map
- [`QA_CHECKLIST.md`](./QA_CHECKLIST.md) — production verification
- [`CHANGELOG.md`](./CHANGELOG.md) — version history

---

## Prepared Git Artifacts

**Commit message (suggested):**

```
chore(people): freeze People Module v1.0.0 for production

Harden TypeScript, error handling, timeline invalidation, and toolbar
interactions. Add module documentation, QA checklist, and release notes.
No new features or UI redesign.

Tag: people-module-v1.0.0
```

**Tag command:**

```bash
git tag -a people-module-v1.0.0 -m "People Module v1.0.0 — production freeze"
```

---

## What's Not in Scope

- General tab, roles tab, permissions tab, books/orders/subscriptions drawer tabs (placeholders)
- Dedicated `login_events` / `security_events` database tables
- Repo-wide ESLint cleanup (outside People module)

---

## Support

For defects, include: user ID, action attempted, request ID from audit/timeline drawer, and browser console network response (redact tokens).
