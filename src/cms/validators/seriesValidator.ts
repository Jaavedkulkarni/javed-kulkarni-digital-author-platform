import type { CreateSeriesInput, UpdateSeriesInput } from '../types/series.types';
import { mergeResults, validateRequired, validateSlug } from './common';

export function validateCreateSeries(input: CreateSeriesInput) {
  return mergeResults(
    validateRequired(input.title, 'Series title'),
    input.slug ? validateSlug(input.slug) : { valid: true, errors: [] }
  );
}

export function validateUpdateSeries(input: UpdateSeriesInput) {
  const results = [];
  if (input.title !== undefined) results.push(validateRequired(input.title, 'Series title'));
  if (input.slug) results.push(validateSlug(input.slug));
  return mergeResults(...results, { valid: true, errors: [] });
}
