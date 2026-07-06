import type { CreateCategoryInput, UpdateCategoryInput } from '../types/category.types';
import { mergeResults, validateRequired, validateSlug } from './common';

export function validateCreateCategory(input: CreateCategoryInput) {
  return mergeResults(
    validateRequired(input.name, 'Category name'),
    input.slug ? validateSlug(input.slug) : { valid: true, errors: [] }
  );
}

export function validateUpdateCategory(input: UpdateCategoryInput) {
  const results = [];
  if (input.name !== undefined) results.push(validateRequired(input.name, 'Category name'));
  if (input.slug) results.push(validateSlug(input.slug));
  return mergeResults(...results, { valid: true, errors: [] });
}

export function validateCategoryHierarchy(parentId: string | null | undefined, categoryId?: string) {
  if (!parentId || !categoryId) return { valid: true, errors: [] as string[] };
  if (parentId === categoryId) {
    return { valid: false, errors: ['A category cannot be its own parent.'] };
  }
  return { valid: true, errors: [] as string[] };
}
