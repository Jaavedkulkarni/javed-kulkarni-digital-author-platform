import type { Book, Category } from '../../types/database';
import { withRetry } from '../../lib/utils/retry';
import { getReaderDataAccess } from './readerDataAccess';

export interface BookCatalogContext {
  books: Map<string, Book>;
  categories: Map<string, Category>;
}

export async function loadBookCatalog(bookIds: string[]): Promise<BookCatalogContext> {
  const uniqueIds = [...new Set(bookIds.filter(Boolean))];
  const books = new Map<string, Book>();
  const categories = new Map<string, Category>();

  if (uniqueIds.length === 0) {
    return { books, categories };
  }

  const { client, repositories } = getReaderDataAccess();

  const bookRows = await withRetry(
    async () => {
      const result = await client.from('books').select('*').in('id', uniqueIds);
      if (result.error) throw result.error;
      return (result.data ?? []) as Book[];
    },
    { scope: 'reader.catalog.books' }
  );

  for (const book of bookRows) {
    books.set(book.id, book);
  }

  const categoryIds = [...new Set(bookRows.map((b) => b.category_id).filter(Boolean))] as string[];

  if (categoryIds.length > 0) {
    const categoryRows = await repositories.categories.findMany({
      filters: {
        conditions: categoryIds.map((id) => ({ column: 'id', operator: 'eq' as const, value: id })),
        match: 'any',
      },
    });
    for (const category of categoryRows) {
      categories.set(category.id, category);
    }
  }

  return { books, categories };
}
