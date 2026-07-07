# People Module Changelog

All notable changes to the People module are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [1.0.0] - 2026-07-07

### Added

- Production People page with search, filters, sort, pagination, and statistics
- Create User drawer with password strength, role selection, and edge-backed provisioning
- Edit User drawer (Profile + Security tabs) with avatar management and role editing
- Suspend, restore, soft delete, and recover flows (single + bulk dialogs)
- Account Security panel: password, invitation, verification, sessions, MFA, unlock
- Bulk operations: edit, suspend, restore, delete, recover, roles, password reset, verification, invite
- Import users (CSV/Excel) and export users (CSV/Excel/PDF) with async job support
- Activity timeline with time grouping, infinite scroll, and event detail drawer
- Audit timeline with JSON diff drawer, developer mode, and export
- Login history and security events timelines with risk severity classification
- Shared timeline UI: filters, export, cursor pagination, sensitive field masking
- React Query invalidation hub for lists, detail, security, sessions, and all timelines
- Module documentation: `PEOPLE_MODULE.md`, QA checklist, release notes

### Fixed (Sprint 02.10 hardening)

- TypeScript errors across delete/recover, suspend/restore, import/export, and repository casts
- Duplicate `PeopleStatistics` type export collision in module barrel
- Zod v4 compatibility for delete confirmation schema
- `SecondaryButton` interactive + onClick support for Import/Export toolbar actions
- `CreateUserForm` submit handler typing
- Timeline invalidation wired into delete, suspend, bulk, and security mutations
- Removed deprecated `usePeopleActivity` hook (superseded by `usePeopleActivityTimeline`)
- Friendly error classes with explicit `cause` property for ES2022 compatibility

### Security

- All mutations via edge functions with super_admin permission gate
- Protected account and last-super-admin guards in shared edge security layer
- Sensitive metadata masking in timeline diffs and exports

### Known Limitations

- Login history aggregates from audit/activity/auth sources (no dedicated login_events table)
- People list last-login column pending auth metadata join
- Login/security severity filter applied post-aggregation may affect page fill

---

## Pre-1.0.0 (Sprints 02.7–02.9)

Development sprints introduced account security, bulk/import/export, activity grouping, and timeline panels. See git history for incremental commits.

[1.0.0]: https://github.com/your-org/javed-kulkarni-digital-author-platform/releases/tag/people-module-v1.0.0
