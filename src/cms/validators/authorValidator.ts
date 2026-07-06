import type { CreateAuthorInput, UpdateAuthorInput } from '../types/author.types';
import { mergeResults, validateRequired, validateSlug } from './common';

export function validateCreateAuthor(input: CreateAuthorInput) {
  return mergeResults(
    validateRequired(input.displayName, 'Display name'),
    input.slug ? validateSlug(input.slug) : { valid: true, errors: [] }
  );
}

export function validateUpdateAuthor(input: UpdateAuthorInput) {
  const results = [];
  if (input.displayName !== undefined) results.push(validateRequired(input.displayName, 'Display name'));
  if (input.slug) results.push(validateSlug(input.slug));
  return mergeResults(...results, { valid: true, errors: [] });
}
