import type { Book, Chapter } from '../../types/database';
import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import type { BookLoadResult, ChapterContent, LoadedBookMetadata } from '../types/bookLoader.types';
import type { ReaderFormat } from '../types/common';
import { STORAGE_BUCKETS } from '../../lib/storage/buckets';
import { createSignedUrl } from '../../lib/storage/signedUrl';
import { withRetry } from '../../lib/utils/retry';

export class BookLoader {
  constructor(private readonly client: TypedSupabaseClient) {}

  async loadBook(
    bookId: string,
    format: ReaderFormat,
    fromCache = false
  ): Promise<BookLoadResult | null> {
    const book = await this.fetchBook(bookId);
    if (!book) return null;

    const metadata = this.buildMetadata(book, format);
    let assetUrl = null;

    if (format === 'epub' || format === 'pdf') {
      const storagePath = format === 'epub' ? book.epub_storage_path : book.pdf_storage_path;
      if (storagePath) {
        const signed = await withRetry(
          () => createSignedUrl(this.client.storage, STORAGE_BUCKETS.BOOK_FILES, storagePath),
          { scope: 'reader-engine.bookLoader.signedUrl' }
        );
        assetUrl = {
          bookId,
          format,
          signedUrl: signed.signedUrl,
          expiresIn: signed.expiresIn,
          storagePath,
        };
      }
    }

    return { metadata, assetUrl, fromCache };
  }

  async loadChapters(bookId: string): Promise<ChapterContent[]> {
    const result = await withRetry(
      async () => {
        const response = await this.client
          .from('chapters')
          .select('*')
          .eq('book_id', bookId)
          .eq('is_published', true)
          .is('deleted_at', null)
          .order('sort_order', { ascending: true });
        if (response.error) throw response.error;
        return (response.data ?? []) as Chapter[];
      },
      { scope: 'reader-engine.bookLoader.chapters' }
    );

    return result.map((ch) => ({
      chapterId: ch.id,
      title: ch.title,
      chapterNumber: ch.chapter_number,
      content: ch.content,
      wordCount: ch.word_count,
      storagePath: ch.content_storage_path,
    }));
  }

  async loadChapterBatch(bookId: string, startIndex: number, batchSize: number): Promise<ChapterContent[]> {
    const all = await this.loadChapters(bookId);
    return all.slice(startIndex, startIndex + batchSize);
  }

  private async fetchBook(bookId: string): Promise<Book | null> {
    const result = await withRetry(
      async () => {
        const response = await this.client.from('books').select('*').eq('id', bookId).maybeSingle();
        if (response.error) throw response.error;
        return response.data as Book | null;
      },
      { scope: 'reader-engine.bookLoader.book' }
    );
    return result;
  }

  private buildMetadata(book: Book, format: ReaderFormat): LoadedBookMetadata {
    return {
      bookId: book.id,
      title: book.title,
      authorName: null,
      coverUrl: book.cover_image,
      format,
      totalPages: book.total_pages,
      totalWords: null,
      language: book.primary_language,
    };
  }
}

export function createBookLoader(client: TypedSupabaseClient): BookLoader {
  return new BookLoader(client);
}
