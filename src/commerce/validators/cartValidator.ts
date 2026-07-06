import type { AddToCartInput, CartSnapshot } from '../types/cart.types';
import { mergeResults, validatePositiveNumber, validResult } from './common';

export function validateAddToCart(input: AddToCartInput) {
  const results = [
    input.bookId ? validResult() : { valid: false, errors: ['Book ID is required.'] },
    input.title?.trim() ? validResult() : { valid: false, errors: ['Title is required.'] },
    validatePositiveNumber(input.unitPrice ?? 0, 'Unit price'),
  ];
  if (input.pricingModel !== 'free' && (input.unitPrice ?? 0) <= 0) {
    results.push({ valid: false, errors: ['Paid books must have a price greater than zero.'] });
  }
  return mergeResults(...results);
}

export function validateCart(cart: CartSnapshot) {
  if (cart.items.length === 0) {
    return { valid: false, errors: ['Cart is empty.'] };
  }
  return validResult();
}
