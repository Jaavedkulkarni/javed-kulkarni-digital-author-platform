export type DomainEventType =
  | 'UserCreated'
  | 'UserUpdated'
  | 'UserDeleted'
  | 'UserSuspended'
  | 'UserRestored'
  | 'RoleAssigned'
  | 'RoleRemoved'
  | 'AvatarUploaded'
  | 'AvatarDeleted'
  | 'PasswordReset'
  | 'InviteSent'
  | 'BookCreated'
  | 'BookPublished'
  | 'MembershipPurchased'
  | 'OrderCreated'
  | 'PaymentCompleted';

export interface DomainEvent<TPayload extends Record<string, unknown> = Record<string, unknown>> {
  type: DomainEventType;
  payload: TPayload;
  requestId: string;
  correlationId: string;
  traceId: string;
  timestamp: string;
}

export type DomainEventHandler = (event: DomainEvent) => void | Promise<void>;

type HandlerMap = Map<DomainEventType, Set<DomainEventHandler>>;

export class DomainEventBus {
  private handlers: HandlerMap = new Map();

  subscribe(type: DomainEventType, handler: DomainEventHandler): () => void {
    const bucket = this.handlers.get(type) ?? new Set();
    bucket.add(handler);
    this.handlers.set(type, bucket);
    return () => bucket.delete(handler);
  }

  unsubscribe(type: DomainEventType, handler: DomainEventHandler): void {
    this.handlers.get(type)?.delete(handler);
  }

  publish<TPayload extends Record<string, unknown>>(
    type: DomainEventType,
    payload: TPayload,
    ids: { requestId: string; correlationId: string; traceId: string },
  ): DomainEvent<TPayload> {
    return this.dispatch({
      type,
      payload,
      requestId: ids.requestId,
      correlationId: ids.correlationId,
      traceId: ids.traceId,
      timestamp: new Date().toISOString(),
    });
  }

  dispatch<TPayload extends Record<string, unknown>>(event: DomainEvent<TPayload>): DomainEvent<TPayload> {
    const bucket = this.handlers.get(event.type);
    bucket?.forEach((handler) => {
      Promise.resolve(handler(event)).catch(() => undefined);
    });
    return event;
  }

  clear(type?: DomainEventType): void {
    if (type) {
      this.handlers.delete(type);
      return;
    }
    this.handlers.clear();
  }
}

let bus: DomainEventBus | null = null;

export function getDomainEventBus(): DomainEventBus {
  if (!bus) bus = new DomainEventBus();
  return bus;
}

export function resetDomainEventBus(): void {
  bus = null;
}
