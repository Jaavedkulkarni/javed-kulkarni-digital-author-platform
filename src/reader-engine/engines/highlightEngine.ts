import type { EngineHighlightRepository } from '../repositories/highlightRepository';
import type { CreateHighlightInput, ReaderHighlight, UpdateHighlightInput } from '../types/highlight.types';
import { mapHighlightRow } from '../mappers/highlight.mapper';
import { validateCreateHighlight } from '../validators/highlightValidator';
import { DEFAULT_HIGHLIGHT_COLOR } from '../constants/readerEngine.constants';

export class HighlightEngine {
  constructor(private readonly repo: EngineHighlightRepository) {}

  async list(userId: string, bookId: string): Promise<ReaderHighlight[]> {
    const rows = await this.repo.findByUserAndBook(userId, bookId);
    return rows.map(mapHighlightRow);
  }

  async create(input: CreateHighlightInput): Promise<{ highlight?: ReaderHighlight; errors?: string[] }> {
    const validation = validateCreateHighlight(input);
    if (!validation.valid) return { errors: validation.errors };

    const row = await this.repo.createHighlight({
      user_id: input.userId,
      book_id: input.bookId,
      selected_text: input.selectedText,
      note: input.note ?? null,
      color: input.color ?? DEFAULT_HIGHLIGHT_COLOR,
      chapter_id: input.location.chapterId ?? null,
      page_number: input.location.pageNumber ?? null,
      position_start: input.location.positionPercent ?? null,
      position_end: input.location.positionPercent ?? null,
      cfi_range: input.location.cfiRange ?? input.location.cfi ?? null,
    });

    return { highlight: mapHighlightRow(row) };
  }

  async update(input: UpdateHighlightInput): Promise<ReaderHighlight> {
    const row = await this.repo.updateHighlight(input.id, {
      note: input.note,
      color: input.color,
    });
    return mapHighlightRow(row);
  }

  async remove(id: string): Promise<void> {
    await this.repo.softDeleteHighlight(id);
  }
}

export function createHighlightEngine(repo: EngineHighlightRepository): HighlightEngine {
  return new HighlightEngine(repo);
}
