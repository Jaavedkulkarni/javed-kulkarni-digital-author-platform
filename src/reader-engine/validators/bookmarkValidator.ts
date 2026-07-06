import type { CreateBookmarkInput } from '../types/bookmark.types';
import { mergeResults, validateRequired } from './common';

export function validateCreateBookmark(input: CreateBookmarkInput) {
  return mergeResults(
    validateRequired(input.userId, 'User'),
    validateRequired(input.bookId, 'Book')
  );
}
