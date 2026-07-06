import { GUEST_CHECKOUT_ENABLED } from '../constants/commerce.constants';
import type { CompleteCheckoutInput, StartCheckoutInput } from '../types/checkout.types';
import { mergeResults, validateEmail, validateRequired } from './common';

export function validateCheckoutStart(input: StartCheckoutInput) {
  if (!GUEST_CHECKOUT_ENABLED && !input.userId) {
    return { valid: false, errors: ['Guest checkout is disabled. Sign in to continue.'] };
  }
  return mergeResults(
    validateRequired(input.userId, 'User'),
    validateEmail(input.email)
  );
}

export function validateCheckoutComplete(input: CompleteCheckoutInput) {
  return validateRequired(input.sessionId, 'Checkout session');
}
