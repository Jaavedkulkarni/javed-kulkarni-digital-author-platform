# Event Guide

AuthorOS Core v1.0.0 — domain event bus.

## Event Catalog

Defined in `@/core/constants/events.constants.ts`:

| Event | Trigger |
|-------|---------|
| UserCreated | User created via edge function |
| UserUpdated | Profile updated |
| UserDeleted | Soft delete |
| UserSuspended | Status → suspended |
| UserRestored | Restore from delete/suspend |
| RoleAssigned | Role assigned via RPC |
| RoleRemoved | Role removed |
| AvatarUploaded | Avatar upload edge function |
| AvatarDeleted | Avatar delete edge function |
| PasswordReset | Password reset flow |
| InviteSent | User invite |
| BookCreated | Book created |
| BookPublished | Book published |
| MembershipPurchased | Membership purchase |
| OrderCreated | Order created |
| PaymentCompleted | Payment completed |

## Rules

1. **Events contain data only** — no business logic in event handlers
2. **Publish after successful operation** — not before
3. **Include request IDs** — requestId, correlationId, traceId
4. **Version events** — use `versionedEventEnvelope()` from `@/core/versioning`

## Browser Event Bus

```typescript
import { getDomainEventBus } from '@/enterprise';

const bus = getDomainEventBus();
bus.subscribe('UserCreated', (event) => {
  // React to event — no mutations here
});
```

## Edge Event Bus

```typescript
import { getDomainEventBus } from '../_shared/events/domain-event-bus.ts';

bus.publish('UserCreated', payload, {
  requestId: ctx.requestContext.requestId,
  correlationId: ctx.requestContext.correlationId,
  traceId: ctx.requestContext.traceId,
});
```

## Webhook Integration

Events automatically dispatch to active webhook subscriptions via `_shared/webhooks/dispatcher.ts`.

Signature header: `X-Webhook-Signature`

Event header: `X-Webhook-Event`
