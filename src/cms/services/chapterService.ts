import type { TablesInsert, TablesUpdate } from '../../types/database';
import type { CmsChapterRepository } from '../repositories/chapterRepository';
import type {
  ChapterListFilters,
  CmsChapter,
  CreateChapterInput,
  UpdateChapterInput,
} from '../types/chapter.types';
import { mapChapterRow as mapChapter } from '../types/chapter.types';
import type { ChapterWorkflowStatus } from '../types/workflow.types';
import { validateChapterWorkflowTransition } from '../workflow/chapterWorkflow';
import { validateCreateChapter, validateUpdateChapter } from '../validators/chapterValidator';
import { calculateReadingTimeMinutes, calculateWordCount } from '../utils/readingTime';

export class ChapterService {
  constructor(private readonly repo: CmsChapterRepository) {}

  async getById(id: string): Promise<CmsChapter | null> {
    const row = await this.repo.findById(id);
    return row ? mapChapter(row) : null;
  }

  async listByBook(filters: ChapterListFilters) {
    const rows = await this.repo.findByBook(filters);
    return rows.map(mapChapter);
  }

  async create(input: CreateChapterInput): Promise<{ chapter?: CmsChapter; errors?: string[] }> {
    const validation = validateCreateChapter(input);
    if (!validation.valid) return { errors: validation.errors };

    const wordCount = calculateWordCount(input.content);
    const payload: TablesInsert<'chapters'> = {
      book_id: input.bookId,
      title: input.title.trim(),
      slug: input.slug ?? null,
      chapter_number: input.chapterNumber,
      summary: input.summary ?? null,
      content: input.content ?? null,
      content_storage_path: input.contentStoragePath ?? null,
      language_code: input.languageCode ?? 'mr',
      parent_chapter_id: input.parentChapterId ?? null,
      is_preview: input.isPreview ?? false,
      is_published: false,
      sort_order: input.sortOrder ?? input.chapterNumber,
      word_count: wordCount,
      estimated_read_minutes: calculateReadingTimeMinutes(wordCount),
    };

    const row = await this.repo.insertChapter(payload);
    return { chapter: mapChapter(row) };
  }

  async update(id: string, input: UpdateChapterInput): Promise<{ chapter?: CmsChapter; errors?: string[] }> {
    const validation = validateUpdateChapter(input);
    if (!validation.valid) return { errors: validation.errors };

    const payload: TablesUpdate<'chapters'> = {};
    if (input.title !== undefined) payload.title = input.title.trim();
    if (input.summary !== undefined) payload.summary = input.summary;
    if (input.content !== undefined) {
      payload.content = input.content;
      payload.word_count = calculateWordCount(input.content);
      payload.estimated_read_minutes = calculateReadingTimeMinutes(payload.word_count as number);
    }
    if (input.chapterNumber !== undefined) payload.chapter_number = input.chapterNumber;
    if (input.sortOrder !== undefined) payload.sort_order = input.sortOrder;

    const row = await this.repo.patchChapter(id, payload);
    return { chapter: mapChapter(row) };
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async transition(id: string, target: ChapterWorkflowStatus): Promise<{ chapter?: CmsChapter; errors?: string[] }> {
    const existing = await this.repo.findById(id);
    if (!existing) return { errors: ['Chapter not found.'] };

    const current = mapChapter(existing).workflowStatus;
    const guard = validateChapterWorkflowTransition(current, target);
    if (!guard.allowed) return { errors: [guard.error ?? 'Invalid transition.'] };

    if (target === 'archived') {
      await this.repo.delete(id);
      const archived = await this.repo.findById(id);
      return { chapter: archived ? mapChapter(archived) : undefined };
    }

    const payload: TablesUpdate<'chapters'> = {
      is_published: target === 'published',
      deleted_at: null,
    };

    const row = await this.repo.patchChapter(id, payload);
    return { chapter: mapChapter(row) };
  }

  async reorder(bookId: string, orderedIds: string[]): Promise<void> {
    await this.repo.reorderChapters(bookId, orderedIds);
  }
}

export function createChapterService(repo: CmsChapterRepository): ChapterService {
  return new ChapterService(repo);
}
