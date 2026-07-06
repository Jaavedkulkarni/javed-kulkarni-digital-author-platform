import type { ReviewDecision } from '../types/common';
import { invalidResult, validResult } from './common';

export function validateReviewDecision(decision: ReviewDecision): ReturnType<typeof validResult> {
  if (!['approve', 'reject', 'request_changes'].includes(decision)) {
    return invalidResult(['Invalid review decision.']);
  }
  return validResult();
}
