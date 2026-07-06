import type {
  AppEvent,
  AppEventHandler,
  AppEventType,
  Unsubscribe,
} from '../types/event.types';
import { auditLogger } from '../services/auditLogger';
import { globalLogger } from '../services/globalLogger';
import { CORE_LOG_SCOPES, AUDIT_ACTIONS } from '../constants/app.constants';

type HandlerMap = Map<AppEventType, Set<AppEventHandler<AppEventType>>>;

function createCorrelationId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export class EventBus {
  private handlers: HandlerMap = new Map();

  on<T extends AppEventType>(type: T, handler: AppEventHandler<T>): Unsubscribe {
    const bucket = this.handlers.get(type) ?? new Set<AppEventHandler<AppEventType>>();
    bucket.add(handler as AppEventHandler<AppEventType>);
    this.handlers.set(type, bucket);
    return () => bucket.delete(handler as AppEventHandler<AppEventType>);
  }

  once<T extends AppEventType>(type: T, handler: AppEventHandler<T>): Unsubscribe {
    const unsubscribe = this.on(type, (event) => {
      unsubscribe();
      handler(event as AppEvent<T>);
    });
    return unsubscribe;
  }

  emit<T extends AppEventType>(
    type: T,
    payload: AppEvent<T>['payload'],
    correlationId?: string
  ): AppEvent<T> {
    const event: AppEvent<T> = {
      type,
      payload,
      timestamp: new Date().toISOString(),
      correlationId: correlationId ?? createCorrelationId(),
    };

    globalLogger.debug(CORE_LOG_SCOPES.events, `Emit ${type}`, event);
    auditLogger.log(AUDIT_ACTIONS.eventEmitted, { type, correlationId: event.correlationId });

    const bucket = this.handlers.get(type);
    bucket?.forEach((handler) => {
      try {
        (handler as AppEventHandler<T>)(event);
      } catch (error) {
        globalLogger.error(CORE_LOG_SCOPES.events, `Handler failed for ${type}`, error);
      }
    });

    return event;
  }

  clear(type?: AppEventType): void {
    if (type) {
      this.handlers.delete(type);
      return;
    }
    this.handlers.clear();
  }

  listenerCount(type: AppEventType): number {
    return this.handlers.get(type)?.size ?? 0;
  }
}

let eventBusInstance: EventBus | null = null;

export function getEventBus(): EventBus {
  if (!eventBusInstance) {
    eventBusInstance = new EventBus();
  }
  return eventBusInstance;
}

export function resetEventBus(): void {
  eventBusInstance = null;
}

export function createEventBus(): EventBus {
  return new EventBus();
}
