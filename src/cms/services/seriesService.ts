import type { TablesInsert, TablesUpdate } from '../../types/database';
import type { CmsSeriesRepository } from '../repositories/seriesRepository';
import type { CmsSeries, CreateSeriesInput, SeriesBookOrder, SeriesListFilters, UpdateSeriesInput } from '../types/series.types';
import { mapSeriesRow as mapSeries } from '../types/series.types';
import { validateCreateSeries, validateUpdateSeries } from '../validators/seriesValidator';
import { ensureUniqueSlug, slugifyText } from '../utils/slug';

export class SeriesService {
  constructor(private readonly repo: CmsSeriesRepository) {}

  async getById(id: string): Promise<CmsSeries | null> {
    const row = await this.repo.findById(id);
    return row ? mapSeries(row) : null;
  }

  async list(filters: SeriesListFilters = {}) {
    return (await this.repo.findByFilters(filters)).map(mapSeries);
  }

  async create(input: CreateSeriesInput): Promise<{ series?: CmsSeries; errors?: string[] }> {
    const validation = validateCreateSeries(input);
    if (!validation.valid) return { errors: validation.errors };

    const slugs = await this.repo.getAllSlugs();
    const slug = input.slug ? slugifyText(input.slug) : ensureUniqueSlug(input.title, slugs);

    const payload: TablesInsert<'series'> = {
      title: input.title.trim(),
      slug,
      subtitle: input.subtitle ?? null,
      description: input.description ?? null,
      author_id: input.authorId ?? null,
      publisher_id: input.publisherId ?? null,
      primary_language: input.primaryLanguage ?? 'mr',
      supported_languages: input.supportedLanguages ?? ['mr'],
      cover_storage_path: input.coverStoragePath ?? null,
      is_complete: input.isComplete ?? false,
      is_featured: input.isFeatured ?? false,
      sort_order: input.sortOrder ?? 0,
    };

    const row = await this.repo.insertSeries(payload);
    return { series: mapSeries(row) };
  }

  async update(id: string, input: UpdateSeriesInput): Promise<{ series?: CmsSeries; errors?: string[] }> {
    const validation = validateUpdateSeries(input);
    if (!validation.valid) return { errors: validation.errors };

    const payload: TablesUpdate<'series'> = {};
    if (input.title !== undefined) payload.title = input.title.trim();
    if (input.slug !== undefined) payload.slug = slugifyText(input.slug);
    if (input.description !== undefined) payload.description = input.description;
    if (input.isComplete !== undefined) payload.is_complete = input.isComplete;
    if (input.isFeatured !== undefined) payload.is_featured = input.isFeatured;

    const row = await this.repo.patchSeries(id, payload);
    return { series: mapSeries(row) };
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async setBookOrder(seriesId: string, orders: SeriesBookOrder[]): Promise<void> {
    await Promise.all(
      orders.map((order) => this.repo.updateBookOrder(seriesId, order.bookId, order.seriesOrder))
    );
    await this.repo.patchSeries(seriesId, { book_count: orders.length });
  }

  async getBooksInSeries(seriesId: string) {
    return this.repo.getBooksInSeries(seriesId);
  }
}

export function createSeriesService(repo: CmsSeriesRepository): SeriesService {
  return new SeriesService(repo);
}
