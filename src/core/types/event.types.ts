export type AppEventType =
  | 'book.published'
  | 'book.purchased'
  | 'membership.activated'
  | 'reading.started'
  | 'reading.completed'
  | 'profile.updated';

export interface BookPublishedPayload {
  bookId: string;
  slug: string;
  title: string;
  publishedAt: string;
  actorId?: string | null;
}

export interface BookPurchasedPayload {
  orderId: string;
  bookId: string;
  userId: string;
  purchasedAt: string;
  amount?: number;
  currency?: string;
}

export interface MembershipActivatedPayload {
  userId: string;
  membershipId: string;
  tier: string;
  activatedAt: string;
}

export interface ReadingStartedPayload {
  userId: string;
  bookId: string;
  chapterId?: string | null;
  startedAt: string;
}

export interface ReadingCompletedPayload {
  userId: string;
  bookId: string;
  completedAt: string;
  progressPercent?: number;
}

export interface ProfileUpdatedPayload {
  userId: string;
  updatedAt: string;
  fields?: string[];
}

export interface AppEventPayloadMap {
  'book.published': BookPublishedPayload;
  'book.purchased': BookPurchasedPayload;
  'membership.activated': MembershipActivatedPayload;
  'reading.started': ReadingStartedPayload;
  'reading.completed': ReadingCompletedPayload;
  'profile.updated': ProfileUpdatedPayload;
}

export type AppEventPayload<T extends AppEventType = AppEventType> = AppEventPayloadMap[T];

export interface AppEvent<T extends AppEventType = AppEventType> {
  type: T;
  payload: AppEventPayload<T>;
  timestamp: string;
  correlationId?: string;
}

export type AppEventHandler<T extends AppEventType> = (event: AppEvent<T>) => void;

export type Unsubscribe = () => void;
