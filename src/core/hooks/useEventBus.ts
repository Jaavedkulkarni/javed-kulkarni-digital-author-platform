import { useCallback } from 'react';
import { useCore } from './useCore';
import type { AppEventType, AppEventHandler, AppEvent } from '../types/event.types';

export function useEventBus() {
  const { events } = useCore();

  const emit = useCallback(
    <T extends AppEventType>(type: T, payload: AppEvent<T>['payload'], correlationId?: string) =>
      events.emit(type, payload, correlationId),
    [events]
  );

  const on = useCallback(
    <T extends AppEventType>(type: T, handler: AppEventHandler<T>) => events.on(type, handler),
    [events]
  );

  const once = useCallback(
    <T extends AppEventType>(type: T, handler: AppEventHandler<T>) => events.once(type, handler),
    [events]
  );

  return { emit, on, once, bus: events };
}
