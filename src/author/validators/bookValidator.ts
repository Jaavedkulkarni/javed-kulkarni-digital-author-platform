import type { AuthorCreateBookInput } from '../types/book.types';
import { mergeResults, validateRequired } from './common';

export function validateAuthorCreateBook(input: AuthorCreateBookInput) {
  return mergeResults(
    validateRequired(input.title, 'Title'),
    validateRequired(input.authorId, 'Author'),
    validateRequired(input.createdBy, 'Actor')
  );
}
