export const DOMAIN_EVENT_NAMES = [
  'UserCreated',
  'UserUpdated',
  'UserDeleted',
  'UserSuspended',
  'UserRestored',
  'RoleAssigned',
  'RoleRemoved',
  'AvatarUploaded',
  'AvatarDeleted',
  'PasswordReset',
  'InviteSent',
  'BookCreated',
  'BookPublished',
  'MembershipPurchased',
  'OrderCreated',
  'PaymentCompleted',
] as const;

export type DomainEventName = (typeof DOMAIN_EVENT_NAMES)[number];

export const WEBHOOK_EVENT_WILDCARD = '*' as const;
