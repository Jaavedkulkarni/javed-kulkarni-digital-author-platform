import type { EngineNoteRepository } from '../repositories/noteRepository';
import type { CreateNoteInput, ReaderNote, UpdateNoteInput } from '../types/note.types';
import { mapNoteRow } from '../mappers/note.mapper';
import { validateCreateNote } from '../validators/noteValidator';

export class NotesEngine {
  constructor(private readonly repo: EngineNoteRepository) {}

  async list(userId: string, bookId: string): Promise<ReaderNote[]> {
    const rows = await this.repo.findByUserAndBook(userId, bookId);
    return rows.map(mapNoteRow);
  }

  async create(input: CreateNoteInput): Promise<{ note?: ReaderNote; errors?: string[] }> {
    const validation = validateCreateNote(input);
    if (!validation.valid) return { errors: validation.errors };

    const row = await this.repo.createNote({
      user_id: input.userId,
      book_id: input.bookId,
      title: input.title ?? null,
      content: input.content,
      is_pinned: input.isPinned ?? false,
      chapter_id: input.location.chapterId ?? null,
      page_number: input.location.pageNumber ?? null,
      position_percent: input.location.positionPercent ?? null,
      cfi_location: input.location.cfi ?? null,
    });

    return { note: mapNoteRow(row) };
  }

  async update(input: UpdateNoteInput): Promise<ReaderNote> {
    const row = await this.repo.updateNote(input.id, {
      title: input.title,
      content: input.content,
      is_pinned: input.isPinned,
    });
    return mapNoteRow(row);
  }

  async remove(id: string): Promise<void> {
    await this.repo.softDeleteNote(id);
  }
}

export function createNotesEngine(repo: EngineNoteRepository): NotesEngine {
  return new NotesEngine(repo);
}
