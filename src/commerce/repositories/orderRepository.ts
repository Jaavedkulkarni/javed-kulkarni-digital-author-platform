import type { Order, TablesInsert, TablesUpdate } from '../../types/database';
import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import { eq } from '../../lib/utils/filters';
import type { CommerceOrderStatus } from '../types/checkout.types';
import { mapCommerceStatusToDb } from '../workflow/orderWorkflow';

export class CommerceOrderRepository extends BaseRepository<'orders'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'orders', { softDelete: true });
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.findMany({
      filters: { conditions: [eq('user_id', userId)], match: 'all' },
      sort: { sortBy: 'created_at', sortDirection: 'desc' },
    });
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const rows = await this.findMany({
      filters: { conditions: [eq('order_number', orderNumber)], match: 'all' },
      pagination: { page: 1, pageSize: 1 },
    });
    return rows[0] ?? null;
  }

  async createOrder(payload: TablesInsert<'orders'>): Promise<Order> {
    return this.create(payload);
  }

  async updateOrder(id: string, payload: TablesUpdate<'orders'>): Promise<Order> {
    return this.update(id, payload);
  }

  async updateStatus(id: string, status: CommerceOrderStatus): Promise<Order> {
    const dbStatus = mapCommerceStatusToDb(status);
    const patch: TablesUpdate<'orders'> = { status: dbStatus };
    if (status === 'paid') patch.completed_at = new Date().toISOString();
    if (status === 'cancelled') patch.cancelled_at = new Date().toISOString();
    return this.update(id, patch);
  }
}

export function createCommerceOrderRepository(client: TypedSupabaseClient): CommerceOrderRepository {
  return new CommerceOrderRepository(client);
}
