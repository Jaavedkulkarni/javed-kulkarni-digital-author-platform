import type { Tables, TablesInsert } from '../../types/database';
import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import { eq } from '../../lib/utils/filters';

export class CommerceOrderItemsRepository extends BaseRepository<'order_items'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'order_items', { softDelete: true });
  }

  async findByOrderId(orderId: string): Promise<Tables<'order_items'>[]> {
    return this.findMany({
      filters: { conditions: [eq('order_id', orderId)], match: 'all' },
    });
  }

  async createItems(items: TablesInsert<'order_items'>[]): Promise<Tables<'order_items'>[]> {
    const created: Tables<'order_items'>[] = [];
    for (const item of items) {
      created.push(await this.create(item));
    }
    return created;
  }
}

export function createCommerceOrderItemsRepository(
  client: TypedSupabaseClient
): CommerceOrderItemsRepository {
  return new CommerceOrderItemsRepository(client);
}
