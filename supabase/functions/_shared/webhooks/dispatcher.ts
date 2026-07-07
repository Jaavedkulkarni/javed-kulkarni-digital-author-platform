import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import type { Logger } from '../logging/logger.ts';
import type { DomainEventType } from '../events/domain-event-bus.ts';

async function signPayload(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function dispatchWebhookEvent(
  adminClient: SupabaseClient,
  eventType: DomainEventType,
  payload: Record<string, unknown>,
  logger: Logger,
): Promise<void> {
  const { data: subscriptions, error } = await adminClient
    .from('webhook_subscriptions')
    .select('id, url, secret, events')
    .eq('is_active', true);

  if (error || !subscriptions?.length) return;

  for (const sub of subscriptions) {
    if (!sub.events.includes(eventType) && !sub.events.includes('*')) continue;

    const body = JSON.stringify({ eventType, payload, timestamp: new Date().toISOString() });
    const signature = await signPayload(body, sub.secret);

    const { data: delivery } = await adminClient
      .from('webhook_deliveries')
      .insert({
        subscription_id: sub.id,
        event_type: eventType,
        payload,
        status: 'pending',
      })
      .select('id')
      .single();

    try {
      const response = await fetch(sub.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': eventType,
        },
        body,
      });

      await adminClient
        .from('webhook_deliveries')
        .update({
          status: response.ok ? 'delivered' : 'failed',
          attempts: 1,
          response_status: response.status,
          response_body: (await response.text()).slice(0, 4000),
          delivered_at: response.ok ? new Date().toISOString() : null,
          next_retry_at: response.ok ? null : new Date(Date.now() + 60_000).toISOString(),
        })
        .eq('id', delivery?.id);
    } catch (fetchError) {
      logger.warn('Webhook delivery failed', {
        subscriptionId: sub.id,
        message: fetchError instanceof Error ? fetchError.message : 'unknown',
      });
      if (delivery?.id) {
        await adminClient
          .from('webhook_deliveries')
          .update({
            status: 'retrying',
            attempts: 1,
            next_retry_at: new Date(Date.now() + 60_000).toISOString(),
          })
          .eq('id', delivery.id);
      }
    }
  }
}
