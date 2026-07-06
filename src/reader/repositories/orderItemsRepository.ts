import type { Tables } from '../../types/database';
import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';

export class ReaderOrderItemsRepository extends BaseRepository<'order_items'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'order_items', { softDelete: true });
  }

  async findByOrderIds(orderIds: string[]): Promise<Tables<'order_items'>[]> {
    if (orderIds.length === 0) return [];
    return this.findMany({
      filters: {
        conditions: orderIds.map((id) => ({ column: 'order_id', operator: 'eq' as const, value: id })),
        match: 'any',
      },
    });
  }
}

export function createReaderOrderItemsRepository(client: TypedSupabaseClient): ReaderOrderItemsRepository {
  return new ReaderOrderItemsRepository(client);
}
