import type { CreateBookInput, UpdateBookInput } from '../types/book.types';
import { mergeResults, validResult, validateIsbn, validateLanguageCode, validateRequired, validateSlug } from './common';

export function validateCreateBook(input: CreateBookInput) {
  return mergeResults(
    validateRequired(input.title, 'Title'),
    input.slug ? validateSlug(input.slug) : validResult(),
    validateIsbn(input.isbn),
    validateLanguageCode(input.primaryLanguage ?? 'mr')
  );
}

export function validateUpdateBook(input: UpdateBookInput) {
  const results = [];
  if (input.title !== undefined) results.push(validateRequired(input.title, 'Title'));
  if (input.slug !== undefined && input.slug) results.push(validateSlug(input.slug));
  if (input.isbn !== undefined) results.push(validateIsbn(input.isbn));
  if (input.primaryLanguage !== undefined) results.push(validateLanguageCode(input.primaryLanguage));
  return mergeResults(...results, validResult());
}
