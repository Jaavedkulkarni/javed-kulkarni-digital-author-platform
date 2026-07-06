import type { Tables, TablesInsert, TablesUpdate } from '../../types/database';
import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import { eq } from '../../lib/utils/filters';
import type { CommercePaymentStatus } from '../types/payment.types';

export class CommercePaymentRepository extends BaseRepository<'payments'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'payments', { softDelete: true });
  }

  async findByOrderId(orderId: string): Promise<Tables<'payments'>[]> {
    return this.findMany({
      filters: { conditions: [eq('order_id', orderId)], match: 'all' },
      sort: { sortBy: 'created_at', sortDirection: 'desc' },
    });
  }

  async createPayment(payload: TablesInsert<'payments'>): Promise<Tables<'payments'>> {
    return this.create(payload);
  }

  async updatePayment(id: string, payload: TablesUpdate<'payments'>): Promise<Tables<'payments'>> {
    return this.update(id, payload);
  }

  async updateStatus(id: string, status: CommercePaymentStatus): Promise<Tables<'payments'>> {
    const patch: TablesUpdate<'payments'> = { status };
    if (status === 'captured') patch.captured_at = new Date().toISOString();
    if (status === 'refunded') patch.refunded_at = new Date().toISOString();
    return this.update(id, patch);
  }
}

export function createCommercePaymentRepository(client: TypedSupabaseClient): CommercePaymentRepository {
  return new CommercePaymentRepository(client);
}
