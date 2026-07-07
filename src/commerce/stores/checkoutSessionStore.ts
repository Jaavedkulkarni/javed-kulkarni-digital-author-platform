import type { CheckoutSession } from '../types/checkout.types';
import { CHECKOUT_SESSION_TTL_MINUTES } from '../constants/commerce.constants';

function createSessionId(): string {
  return `chk_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function computeExpiresAt(): string {
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + CHECKOUT_SESSION_TTL_MINUTES);
  return expires.toISOString();
}

export class CheckoutSessionStore {
  private sessions = new Map<string, CheckoutSession>();

  create(session: Omit<CheckoutSession, 'id' | 'createdAt' | 'expiresAt'>): CheckoutSession {
    const record: CheckoutSession = {
      ...session,
      id: createSessionId(),
      createdAt: new Date().toISOString(),
      expiresAt: computeExpiresAt(),
    };
    this.sessions.set(record.id, record);
    return record;
  }

  get(sessionId: string): CheckoutSession | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    if (new Date(session.expiresAt) < new Date()) {
      this.sessions.delete(sessionId);
      return null;
    }
    return session;
  }

  remove(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  clear(): void {
    this.sessions.clear();
  }
}

let sessionStoreInstance: CheckoutSessionStore | null = null;

export function getCheckoutSessionStore(): CheckoutSessionStore {
  if (!sessionStoreInstance) sessionStoreInstance = new CheckoutSessionStore();
  return sessionStoreInstance;
}

export function resetCheckoutSessionStore(): void {
  sessionStoreInstance = null;
}
