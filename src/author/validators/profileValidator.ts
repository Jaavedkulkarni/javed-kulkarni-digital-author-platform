import type { UpdateAuthorProfileInput } from '../types/author.types';
import { mergeResults, validateRequired } from './common';

export function validateAuthorProfileUpdate(input: UpdateAuthorProfileInput) {
  if (input.displayName !== undefined) {
    return mergeResults(validateRequired(input.displayName, 'Display name'));
  }
  return validResult();
}

function validResult() {
  return { valid: true, errors: [] as string[] };
}
