import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { createCmsRepositories } from '../repositories';
import { createBookService, BookService } from './bookService';
import { createAuthorService, AuthorService } from './authorService';
import { createPublisherService, PublisherService } from './publisherService';
import { createCategoryService, CategoryService } from './categoryService';
import { createSeriesService, SeriesService } from './seriesService';
import { createChapterService, ChapterService } from './chapterService';

export interface CmsServices {
  books: BookService;
  authors: AuthorService;
  publishers: PublisherService;
  categories: CategoryService;
  series: SeriesService;
  chapters: ChapterService;
}

export function createCmsServices(client: TypedSupabaseClient): CmsServices {
  const repos = createCmsRepositories(client);

  return {
    books: createBookService(repos.books),
    authors: createAuthorService(repos.authors),
    publishers: createPublisherService(repos.publishers),
    categories: createCategoryService(repos.categories),
    series: createSeriesService(repos.series),
    chapters: createChapterService(repos.chapters),
  };
}

export {
  BookService,
  AuthorService,
  PublisherService,
  CategoryService,
  SeriesService,
  ChapterService,
  createBookService,
  createAuthorService,
  createPublisherService,
  createCategoryService,
  createSeriesService,
  createChapterService,
};
