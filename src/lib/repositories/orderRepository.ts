import type { Order, TablesInsert, TablesUpdate } from '../../types/database';
import type { TypedSupabaseClient } from '../supabase/clients/browser';
import { BaseRepository } from './baseRepository';
import { eq } from '../utils/filters';

export class OrderRepository extends BaseRepository<'orders'> {
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
    return this.findMany({
      filters: { conditions: [eq('order_number', orderNumber)], match: 'all' },
      pagination: { page: 1, pageSize: 1 },
    }).then((rows) => rows[0] ?? null);
  }

  async createOrder(payload: TablesInsert<'orders'>): Promise<Order> {
    return this.create(payload);
  }

  async updateOrder(id: string, payload: TablesUpdate<'orders'>): Promise<Order> {
    return this.update(id, payload);
  }
}

export function createOrderRepository(client: TypedSupabaseClient): OrderRepository {
  return new OrderRepository(client);
}
