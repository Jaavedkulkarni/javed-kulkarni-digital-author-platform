import type { LibraryItem, TablesInsert } from '../../types/database';
import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { createLibraryRepository, LibraryRepository } from '../../lib/repositories/libraryRepository';
import type {
  EntitlementCheckResult,
  GrantEntitlementInput,
  LibraryEntitlement,
} from '../types/entitlement.types';

function mapLibraryItem(row: LibraryItem, link?: { orderId?: string; orderItemId?: string }): LibraryEntitlement {
  return {
    id: row.id,
    userId: row.user_id,
    bookId: row.book_id,
    format: row.format ?? 'epub',
    source: (row.source as LibraryEntitlement['source']) ?? 'purchase',
    orderId: link?.orderId ?? null,
    orderItemId: link?.orderItemId ?? null,
    expiresAt: row.expires_at,
    grantedAt: row.acquired_at ?? row.created_at,
  };
}

export class LibraryEntitlementRepository {
  private readonly orderLinks = new Map<string, { orderId: string | null; orderItemId: string | null }>();

  constructor(private readonly libraryRepo: LibraryRepository) {}

  async findByUser(userId: string): Promise<LibraryEntitlement[]> {
    const rows = await this.libraryRepo.findByUser(userId);
    return rows.map((row) => mapLibraryItem(row, this.orderLinks.get(row.id)));
  }

  async findByUserAndBook(userId: string, bookId: string): Promise<LibraryEntitlement | null> {
    const row = await this.libraryRepo.findByUserAndBook(userId, bookId);
    return row ? mapLibraryItem(row, this.orderLinks.get(row.id)) : null;
  }

  async checkEntitlement(userId: string, bookId: string): Promise<EntitlementCheckResult> {
    const entitlement = await this.findByUserAndBook(userId, bookId);
    if (!entitlement) return { entitled: false, entitlement: null };
    if (entitlement.expiresAt && new Date(entitlement.expiresAt) < new Date()) {
      return { entitled: false, entitlement };
    }
    return { entitled: true, entitlement };
  }

  async grantEntitlement(input: GrantEntitlementInput): Promise<LibraryEntitlement> {
    const check = await this.checkEntitlement(input.userId, input.bookId);
    if (check.entitled && check.entitlement) {
      return check.entitlement;
    }

    const payload: TablesInsert<'library'> = {
      user_id: input.userId,
      book_id: input.bookId,
      format: input.format,
      source: input.source,
      expires_at: input.expiresAt ?? null,
    };

    const row = await this.libraryRepo.addToLibrary(payload);
    this.orderLinks.set(row.id, {
      orderId: input.orderId ?? null,
      orderItemId: input.orderItemId ?? null,
    });
    return mapLibraryItem(row, this.orderLinks.get(row.id));
  }
}

export function createLibraryEntitlementRepository(client: TypedSupabaseClient): LibraryEntitlementRepository {
  return new LibraryEntitlementRepository(createLibraryRepository(client));
}
