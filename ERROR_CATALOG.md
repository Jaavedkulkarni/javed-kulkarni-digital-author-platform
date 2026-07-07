# AuthorOS Error Catalog

AuthorOS Core v1.0.0 — canonical error codes. **No magic strings.**

Source of truth: `src/core/errors/error-catalog.ts`

## Usage

```typescript
import { createCatalogError, ERROR_CATALOG, resolveErrorContract } from '@/core/errors';

throw createCatalogError('AUTH_001');
const contract = resolveErrorContract('USER_001', '/ERROR_CATALOG.md', { requestId });
```

---

## AUTH — Authentication

### AUTH_001
| Field | Value |
|-------|-------|
| Message | Authentication required |
| HTTP Status | 401 |
| Severity | warning |
| Recovery | Sign in and retry with a valid session token |

### AUTH_002
| Field | Value |
|-------|-------|
| Message | Session expired |
| HTTP Status | 401 |
| Severity | warning |
| Recovery | Sign in again to obtain a fresh session |

### AUTH_003
| Field | Value |
|-------|-------|
| Message | Invalid credentials |
| HTTP Status | 401 |
| Severity | warning |
| Recovery | Verify email and password, then retry |

---

## USER — User Management

### USER_001
| Field | Value |
|-------|-------|
| Message | User not found |
| HTTP Status | 404 |
| Severity | error |
| Recovery | Verify the user identifier and retry |

### USER_002
| Field | Value |
|-------|-------|
| Message | User already exists |
| HTTP Status | 409 |
| Severity | warning |
| Recovery | Use a different email or restore an existing account |

### USER_003
| Field | Value |
|-------|-------|
| Message | User account is suspended |
| HTTP Status | 403 |
| Severity | warning |
| Recovery | Contact platform support to restore access |

---

## ROLE — Authorization

### ROLE_001
| Field | Value |
|-------|-------|
| Message | Insufficient permissions |
| HTTP Status | 403 |
| Severity | warning |
| Recovery | Request the required role from a platform administrator |

### ROLE_002
| Field | Value |
|-------|-------|
| Message | Role assignment failed |
| HTTP Status | 409 |
| Severity | error |
| Recovery | Verify role name and target user, then retry |

---

## BOOK — Catalog

### BOOK_001 — Book not found (404)
### BOOK_002 — Book is not published (403)

---

## CMS — Content Management

### CMS_001 — CMS resource not found (404)
### CMS_002 — CMS operation not permitted (403)

---

## ORDER — Commerce

### ORDER_001 — Order not found (404)
### ORDER_002 — Order cannot be modified in current state (409)

---

## PAYMENT — Payments

### PAYMENT_001 — Payment processing failed (402)
### PAYMENT_002 — Payments feature is disabled (503)

---

## SYSTEM — Platform

### SYSTEM_001
| Field | Value |
|-------|-------|
| Message | Validation failed |
| HTTP Status | 400 |
| Severity | warning |
| Recovery | Correct input fields and retry |

### SYSTEM_002
| Field | Value |
|-------|-------|
| Message | Rate limit exceeded |
| HTTP Status | 429 |
| Severity | warning |
| Recovery | Wait for Retry-After interval, then retry |

### SYSTEM_003
| Field | Value |
|-------|-------|
| Message | Internal server error |
| HTTP Status | 500 |
| Severity | critical |
| Recovery | Retry later. Contact support if the issue persists |

---

## STORAGE — File Storage

### STORAGE_001 — File upload failed (400)

---

## EDGE — Edge Functions

### EDGE_001 — Edge function invocation failed (502)
### EDGE_002 — Idempotency key conflict (409)

---

## Adding New Codes

1. Add entry to `src/core/errors/error-catalog.ts`
2. Document in this file
3. Map in service/edge error handlers
4. Run `npm run validate:foundation`

**Do not use string literals for error messages in services.**
