export type WebhookDeliveryStatus = 'pending' | 'delivered' | 'failed' | 'retrying';

export interface WebhookSubscription {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
}

export interface WebhookDeliveryRecord {
  id: string;
  subscriptionId: string;
  eventType: string;
  status: WebhookDeliveryStatus;
  attempts: number;
  responseStatus: number | null;
  createdAt: string;
}

export interface WebhookDispatcher {
  dispatch(eventType: string, payload: Record<string, unknown>): Promise<void>;
}

export class ClientWebhookDispatcher implements WebhookDispatcher {
  async dispatch(): Promise<void> {
    // Webhook dispatch is server-side only (edge functions)
  }
}

export function getClientWebhookDispatcher(): WebhookDispatcher {
  return new ClientWebhookDispatcher();
}
