import type { CreatePublisherInput, UpdatePublisherInput } from '../types/publisher.types';
import { mergeResults, validateEmail, validateRequired, validateSlug } from './common';

export function validateCreatePublisher(input: CreatePublisherInput) {
  return mergeResults(
    validateRequired(input.name, 'Publisher name'),
    input.slug ? validateSlug(input.slug) : { valid: true, errors: [] },
    validateEmail(input.contactEmail)
  );
}

export function validateUpdatePublisher(input: UpdatePublisherInput) {
  const results = [];
  if (input.name !== undefined) results.push(validateRequired(input.name, 'Publisher name'));
  if (input.slug) results.push(validateSlug(input.slug));
  if (input.contactEmail !== undefined) results.push(validateEmail(input.contactEmail));
  return mergeResults(...results, { valid: true, errors: [] });
}
