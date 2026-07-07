export { type DomainEventType, type DomainEvent } from './domain-event-bus';

export const DOMAIN_EVENT_TYPES = [
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
