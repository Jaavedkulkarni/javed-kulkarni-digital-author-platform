import type { CreateHighlightInput } from '../types/highlight.types';
import { mergeResults, validateRequired } from './common';

export function validateCreateHighlight(input: CreateHighlightInput) {
  return mergeResults(
    validateRequired(input.userId, 'User'),
    validateRequired(input.bookId, 'Book'),
    validateRequired(input.selectedText, 'Selected text')
  );
}
