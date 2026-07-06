export {
  type AppEventType,
  type AppEvent,
  type AppEventPayload,
  type AppEventPayloadMap,
  type AppEventHandler,
  type Unsubscribe,
  type BookPublishedPayload,
  type BookPurchasedPayload,
  type MembershipActivatedPayload,
  type ReadingStartedPayload,
  type ReadingCompletedPayload,
  type ProfileUpdatedPayload,
} from '../types/event.types';

export const APP_EVENT_TYPES = [
  'book.published',
  'book.purchased',
  'membership.activated',
  'reading.started',
  'reading.completed',
  'profile.updated',
] as const;

export const APP_EVENT_LABELS: Record<(typeof APP_EVENT_TYPES)[number], string> = {
  'book.published': 'Book Published',
  'book.purchased': 'Book Purchased',
  'membership.activated': 'Membership Activated',
  'reading.started': 'Reading Started',
  'reading.completed': 'Reading Completed',
  'profile.updated': 'Profile Updated',
};
