import type { CreateChapterInput, UpdateChapterInput } from '../types/chapter.types';
import { mergeResults, validateLanguageCode, validatePositiveNumber, validateRequired } from './common';

export function validateCreateChapter(input: CreateChapterInput) {
  return mergeResults(
    validateRequired(input.title, 'Chapter title'),
    validateRequired(input.bookId, 'Book ID'),
    validatePositiveNumber(input.chapterNumber, 'Chapter number'),
    validateLanguageCode(input.languageCode ?? 'mr')
  );
}

export function validateUpdateChapter(input: UpdateChapterInput) {
  const results = [];
  if (input.title !== undefined) results.push(validateRequired(input.title, 'Chapter title'));
  if (input.chapterNumber !== undefined) results.push(validatePositiveNumber(input.chapterNumber, 'Chapter number'));
  if (input.languageCode !== undefined) results.push(validateLanguageCode(input.languageCode));
  return mergeResults(...results, { valid: true, errors: [] });
}
