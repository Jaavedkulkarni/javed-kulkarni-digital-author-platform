import { DOMAIN_EVENT_NAMES } from './events.constants';

export const WEBHOOK_DELIVERY_MAX_ATTEMPTS = 5;
export const WEBHOOK_RETRY_DELAY_MS = 60_000;
export const WEBHOOK_SIGNATURE_HEADER = 'X-Webhook-Signature' as const;
export const WEBHOOK_EVENT_HEADER = 'X-Webhook-Event' as const;

export const WEBHOOK_EVENTS = [...DOMAIN_EVENT_NAMES, '*'] as const;

export type WebhookEventName = (typeof WEBHOOK_EVENTS)[number];
