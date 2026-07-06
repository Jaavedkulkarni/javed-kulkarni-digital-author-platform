import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { BaseRepository } from '../../lib/repositories/baseRepository';
import type { Tables, TablesInsert, TablesUpdate } from '../../types/database';
import { eq } from '../../lib/utils/filters';
import type { ChapterListFilters } from '../types/chapter.types';

export class CmsChapterRepository extends BaseRepository<'chapters'> {
  constructor(client: TypedSupabaseClient) {
    super(client, 'chapters', { softDelete: true });
  }

  async findByBook(filters: ChapterListFilters) {
    const conditions = [eq('book_id', filters.bookId)];
    if (filters.languageCode) conditions.push(eq('language_code', filters.languageCode));

    return this.findMany({
      filters: { conditions, match: 'all' },
      sort: { sortBy: 'sort_order', sortDirection: 'asc' },
    });
  }

  async insertChapter(payload: TablesInsert<'chapters'>): Promise<Tables<'chapters'>> {
    return this.create(payload);
  }

  async patchChapter(id: string, payload: TablesUpdate<'chapters'>): Promise<Tables<'chapters'>> {
    return this.update(id, payload);
  }

  async reorderChapters(bookId: string, orderedIds: string[]) {
    const updates = orderedIds.map((id, index) =>
      this.client
        .from('chapters')
        .update({ sort_order: index + 1, chapter_number: index + 1 } as never)
        .eq('id', id)
        .eq('book_id', bookId)
    );
    await Promise.all(updates);
  }
}

export function createCmsChapterRepository(client: TypedSupabaseClient): CmsChapterRepository {
  return new CmsChapterRepository(client);
}
