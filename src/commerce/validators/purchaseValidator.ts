import type { CartLineItem } from '../types/cart.types';

export interface PurchaseValidationContext {
  userId: string;
  items: CartLineItem[];
  alreadyOwnsBookIds?: string[];
  hasActiveMembership?: boolean;
}

export function validatePurchaseEligibility(context: PurchaseValidationContext) {
  const errors: string[] = [];

  if (context.items.length === 0) {
    errors.push('No items to purchase.');
  }

  for (const item of context.items) {
    if (context.alreadyOwnsBookIds?.includes(item.bookId)) {
      errors.push(`You already own "${item.title}".`);
    }
    if (item.isMembershipBook && !context.hasActiveMembership) {
      errors.push(`"${item.title}" requires an active membership.`);
    }
    if (item.pricingModel === 'paid' && item.unitPrice <= 0) {
      errors.push(`"${item.title}" has an invalid price.`);
    }
  }

  return { valid: errors.length === 0, errors };
}
