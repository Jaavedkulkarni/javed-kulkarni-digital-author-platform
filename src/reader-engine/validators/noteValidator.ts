import type { CreateNoteInput } from '../types/note.types';
import { mergeResults, validateRequired } from './common';

export function validateCreateNote(input: CreateNoteInput) {
  return mergeResults(
    validateRequired(input.userId, 'User'),
    validateRequired(input.bookId, 'Book'),
    validateRequired(input.content, 'Note content')
  );
}
