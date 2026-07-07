# People Module — Production QA Checklist (v1.0.0)

Use this checklist before tagging `people-module-v1.0.0` or deploying to production.

---

## Authentication & Authorization

- [ ] Only `super_admin` can access `/super-admin/people`
- [ ] Non-admin users receive permission denied (no data leak)
- [ ] Edge functions reject unauthenticated requests
- [ ] Edge functions reject non–super-admin roles
- [ ] Protected account actions blocked with friendly error
- [ ] Last super admin cannot be demoted/deleted/suspended
- [ ] Self-destructive actions (delete own account) blocked where applicable

---

## CRUD Lifecycle

### Create User
- [ ] Required fields validated (email, name, role, password strength)
- [ ] Duplicate email shows friendly error
- [ ] Success refreshes list + stats
- [ ] Audit + activity entries created

### Edit User
- [ ] Profile fields save correctly
- [ ] Role assign/remove works
- [ ] Avatar upload + delete works
- [ ] Dirty-state close confirmation works
- [ ] Cancel discards unsaved changes

### Suspend / Restore
- [ ] Single user suspend with reason
- [ ] Bulk suspend with progress
- [ ] Restore reactivates account
- [ ] Timelines invalidate after success

### Delete / Recover
- [ ] Soft delete requires confirmation checkbox
- [ ] Deleted users appear with deleted status filter
- [ ] Recover restores previous active status
- [ ] Bulk delete/recover reports partial failures

---

## Account Security

- [ ] Reset password / force change / temp password
- [ ] Invitation send, resend, cancel, regenerate
- [ ] Email verify / revoke verification
- [ ] Session revoke single + revoke all
- [ ] MFA reset / disable / require
- [ ] Unlock account / reset failed attempts
- [ ] Sensitive values never shown in UI after generation (masking)
- [ ] Security tab invalidates timelines on success

---

## Bulk Operations

- [ ] Select page / select all pages / invert / clear
- [ ] Bulk edit, suspend, restore, delete, recover
- [ ] Bulk role assign/remove
- [ ] Bulk password reset, verification, invite
- [ ] Progress UI during operation
- [ ] Partial failure summary + CSV export of results
- [ ] Cancel mid-batch stops further processing

---

## Import / Export

- [ ] CSV template download
- [ ] Excel template download
- [ ] Import preview shows valid/invalid/duplicate counts
- [ ] Import execute with column mapping
- [ ] Export selected / filtered / all / visible columns
- [ ] Export formats: CSV, Excel, PDF
- [ ] Large export async job completes via polling

---

## Timelines (Read-only)

### Activity
- [ ] Grouped by time buckets (Today, Yesterday, etc.)
- [ ] Infinite scroll loads next page
- [ ] Search + date filters work
- [ ] Event detail drawer opens on click
- [ ] Export respects current filters

### Audit
- [ ] Actor, target, action, severity displayed
- [ ] Audit detail drawer shows JSON diff (added/removed/modified)
- [ ] Developer mode shows raw JSON + metadata
- [ ] Sensitive fields masked

### Login History
- [ ] Login, logout, failed login, session, MFA events
- [ ] Current session badge when applicable
- [ ] Risk severity badges (normal/warning/critical)

### Security Events
- [ ] Password, invite, lock, escalation events classified
- [ ] Critical events show red indicators
- [ ] Detail drawer shows trace/request/correlation IDs

---

## Performance

- [ ] People list loads in < 2s with 10k users (paginated)
- [ ] Audit timeline scroll remains responsive (no full client load)
- [ ] Bulk 100 users completes or enters async job
- [ ] Import 500 rows preview < 10s
- [ ] Drawer tab switch does not refetch unrelated tabs unnecessarily
- [ ] No memory growth after extended infinite scroll

---

## Accessibility

- [ ] Keyboard: Tab through toolbar, table, drawer
- [ ] Escape closes drawers/dialogs
- [ ] Screen reader announces dialog titles
- [ ] Focus visible on interactive elements
- [ ] Color contrast meets AA for severity badges and text
- [ ] Responsive layout on mobile/tablet widths

---

## Error Handling

- [ ] No raw Postgres/Supabase errors in toasts
- [ ] No stack traces in UI
- [ ] Network failure shows retry-friendly message
- [ ] Validation errors inline on forms

---

## Observability

- [ ] Edge responses include request/correlation context
- [ ] Timeline metrics bar shows query time + record count
- [ ] Failed edge calls logged server-side (check Supabase logs)

---

## Regression

- [ ] `npm run lint` — no new People-module errors
- [ ] `npm run typecheck` — zero People-module TS errors
- [ ] `npm run build` — passes
- [ ] Other Super Admin modules unaffected

---

## Edge Cases

- [ ] User with no roles displays fallback role
- [ ] Empty timeline states show helpful messages
- [ ] Export with zero rows shows toast (no crash)
- [ ] Concurrent edit: stale data refresh on reopen
- [ ] Timezone/country mapping for known timezones

---

**Sign-off**

| Role | Name | Date |
|------|------|------|
| Engineering | | |
| QA | | |
| Product | | |
