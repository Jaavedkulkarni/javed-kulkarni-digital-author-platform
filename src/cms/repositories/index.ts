import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { createCmsBookRepository, CmsBookRepository } from './bookRepository';
import { createCmsAuthorRepository, CmsAuthorRepository } from './authorRepository';
import { createCmsPublisherRepository, CmsPublisherRepository } from './publisherRepository';
import { createCmsCategoryRepository, CmsCategoryRepository } from './categoryRepository';
import { createCmsSeriesRepository, CmsSeriesRepository } from './seriesRepository';
import { createCmsChapterRepository, CmsChapterRepository } from './chapterRepository';

export interface CmsRepositories {
  books: CmsBookRepository;
  authors: CmsAuthorRepository;
  publishers: CmsPublisherRepository;
  categories: CmsCategoryRepository;
  series: CmsSeriesRepository;
  chapters: CmsChapterRepository;
}

export function createCmsRepositories(client: TypedSupabaseClient): CmsRepositories {
  return {
    books: createCmsBookRepository(client),
    authors: createCmsAuthorRepository(client),
    publishers: createCmsPublisherRepository(client),
    categories: createCmsCategoryRepository(client),
    series: createCmsSeriesRepository(client),
    chapters: createCmsChapterRepository(client),
  };
}

export {
  CmsBookRepository,
  CmsAuthorRepository,
  CmsPublisherRepository,
  CmsCategoryRepository,
  CmsSeriesRepository,
  CmsChapterRepository,
};

export {
  createCmsBookRepository,
  createCmsAuthorRepository,
  createCmsPublisherRepository,
  createCmsCategoryRepository,
  createCmsSeriesRepository,
  createCmsChapterRepository,
};
