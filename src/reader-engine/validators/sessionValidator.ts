import type { StartSessionInput } from '../types/session.types';
import { mergeResults, validateRequired } from './common';

export function validateStartSession(input: StartSessionInput) {
  return mergeResults(
    validateRequired(input.userId, 'User'),
    validateRequired(input.bookId, 'Book'),
    validateRequired(input.deviceInfo.deviceId, 'Device')
  );
}
