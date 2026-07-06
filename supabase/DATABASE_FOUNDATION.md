# AuthorOS — Database Foundation

**Sprint:** Database Foundation  
**Migrations:** `011` – `016` (20260706120000 – 20260706170000)  
**Status:** Production-ready schema (mock auth / frontend not wired)

---

## Migration Order

| File | Scope |
|------|-------|
| `011_database_foundation_helpers.sql` | Enums, publisher role, profile extensions, RLS helpers |
| `012_database_foundation_catalog.sql` | authors, publishers, categories, series, books, chapters, book_categories |
| `013_database_foundation_commerce.sql` | library, wishlist, orders, order_items, payments, memberships |
| `014_database_foundation_reader_experience.sql` | reading_progress, bookmarks, notes, highlights, downloads |
| `015_database_foundation_platform.sql` | notifications, user_settings, analytics_events |
| `016_database_foundation_storage.sql` | Storage buckets + RLS policies (references only) |

**Depends on:** Migrations `001`–`010` (blog, books CMS, products, reader_profiles, roles)

---

## Core Tables

### Identity & Roles (extended from 010)

| Table | PK | Notes |
|-------|-----|-------|
| `profiles` | `auth.users.id` | + `phone`, `preferred_language`, `deleted_at` |
| `roles` | UUID | + `publisher` role, `description`, `updated_at` |
| `user_roles` | `(user_id, role_id)` | Unchanged junction |
| `authors` | UUID | Linked to `profiles` via `profile_id` |
| `publishers` | UUID | Linked to `profiles` via `profile_id` |

### Catalog

| Table | PK | Soft Delete | Notes |
|-------|-----|-------------|-------|
| `categories` | UUID | ✓ | Renamed from legacy `book_categories` entity |
| `books` | UUID | ✓ | `workflow_status`: draft → review → published → archived |
| `book_categories` | `(book_id, category_id)` | — | Junction (many-to-many) |
| `series` | UUID | ✓ | Multilingual via `supported_languages` JSONB |
| `chapters` | UUID | ✓ | Per `language_code` for future translations |

### Commerce

| Table | PK | Soft Delete |
|-------|-----|-------------|
| `library` | UUID | ✓ |
| `wishlist` | UUID | ✓ |
| `orders` | UUID | ✓ |
| `order_items` | UUID | ✓ |
| `payments` | UUID | ✓ |
| `memberships` | UUID | ✓ |

### Reader Experience

| Table | PK | Soft Delete |
|-------|-----|-------------|
| `reading_progress` | UUID | ✓ |
| `bookmarks` | UUID | ✓ |
| `notes` | UUID | ✓ |
| `highlights` | UUID | ✓ |
| `downloads` | UUID | ✓ |

### Platform

| Table | PK | Soft Delete |
|-------|-----|-------------|
| `notifications` | UUID | ✓ |
| `user_settings` | UUID | ✓ |
| `analytics_events` | UUID | — (append-only) |

---

## Book Workflow

```
draft → review → published → archived
```

- `workflow_status` (enum) — canonical state
- Legacy `status` column retained for backward compatibility (expanded CHECK)
- `published_at`, `reviewed_at`, `archived_at` timestamps

## Digital Formats

- Enum: `digital_format` (`epub`, `pdf`)
- Storage path columns on `books`: `epub_storage_path`, `pdf_storage_path`
- No file upload engine in this sprint — paths only

## Multilingual Support

- `books.primary_language` — ISO 639-1 (default `mr`)
- `books.supported_languages` — JSONB array
- `chapters.language_code` — per-chapter translation key
- `series.supported_languages` — JSONB array

---

## RLS Role Matrix

| Role | Catalog Write | Own Library | Orders | Analytics |
|------|---------------|-------------|--------|-----------|
| **Reader** | — | ✓ own rows | ✓ own | ✓ own events |
| **Author** | ✓ own books | ✓ | ✓ own | ✓ own books |
| **Publisher** | ✓ own books | ✓ | ✓ own | — |
| **Admin** | ✓ all | ✓ all | ✓ all | ✓ all |

Helper functions: `is_admin()`, `is_author()`, `is_publisher()`, `is_reader()`, `is_staff()`, `can_manage_book()`, `user_owns_book()`

---

## Storage Buckets (016)

| Bucket | Public | Purpose |
|--------|--------|---------|
| `book-covers` | ✓ | Cover images |
| `book-files` | ✗ | EPUB/PDF (entitlement-gated) |
| `author-assets` | ✓ | Author avatars |
| `publisher-assets` | ✓ | Publisher logos |

**Path conventions:**

```
book-covers/{book_id}/cover.webp
book-files/{book_id}/edition.epub
book-files/{book_id}/edition.pdf
author-assets/{author_id}/avatar.webp
publisher-assets/{publisher_id}/logo.webp
```

---

## Key Indexes

- All FK columns indexed
- Partial indexes on `deleted_at IS NULL` for active-row queries
- `notifications` partial index for unread
- `reading_progress` last-read ordering
- `analytics_events` time-series on `occurred_at`

---

## Triggers

- `updated_at` on all mutable tables (via `update_updated_at_column()`)
- `orders_before_insert_number` — auto `AO-00000001` order numbers
- `on_profile_created_settings` — default `user_settings` row

---

## Applying Migrations

```bash
supabase db push
# or
supabase migration up
```

---

## Freeze Notice

After Database Foundation freeze, do not alter migrations `011`–`016`. New changes require new numbered migrations only.
