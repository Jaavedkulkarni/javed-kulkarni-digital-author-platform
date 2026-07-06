import type { WishlistItem, TablesInsert, TablesUpdate } from '../../types/database';
import type { TypedSupabaseClient } from '../supabase/clients/browser';
import { BaseRepository } from './baseRepository';
import { eq } from '../utils/filters';

export class WishlistRepository extends BaseRepository<'wishlist'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'wishlist', { softDelete: true });
  }

  async findByUser(userId: string): Promise<WishlistItem[]> {
    return this.findMany({
      filters: { conditions: [eq('user_id', userId)], match: 'all' },
      sort: { sortBy: 'added_at', sortDirection: 'desc' },
    });
  }

  async findByUserAndBook(userId: string, bookId: string): Promise<WishlistItem | null> {
    return this.findMany({
      filters: {
        conditions: [eq('user_id', userId), eq('book_id', bookId)],
        match: 'all',
      },
      pagination: { page: 1, pageSize: 1 },
    }).then((rows) => rows[0] ?? null);
  }

  async addToWishlist(payload: TablesInsert<'wishlist'>): Promise<WishlistItem> {
    return this.create(payload);
  }

  async updateWishlistItem(id: string, payload: TablesUpdate<'wishlist'>): Promise<WishlistItem> {
    return this.update(id, payload);
  }
}

export function createWishlistRepository(client: TypedSupabaseClient): WishlistRepository {
  return new WishlistRepository(client);
}
