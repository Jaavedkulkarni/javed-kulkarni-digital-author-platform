import type { CartStore } from '../cart/cartStore';
import type { AddToCartInput, CartSnapshot, UpdateCartItemInput } from '../types/cart.types';
import { validateAddToCart, validateCart } from '../validators/cartValidator';

export class CartService {
  constructor(private readonly store: CartStore) {}

  getCart(userId: string): CartSnapshot {
    return this.store.getCart(userId);
  }

  addItem(userId: string, input: AddToCartInput) {
    const validation = validateAddToCart(input);
    if (!validation.valid) return { success: false as const, errors: validation.errors };
    const cart = this.store.addItem(userId, input);
    return { success: true as const, cart };
  }

  updateItem(userId: string, input: UpdateCartItemInput) {
    const cart = this.store.updateItem(userId, input);
    return { success: true as const, cart };
  }

  removeItem(userId: string, lineItemId: string) {
    const cart = this.store.removeItem(userId, lineItemId);
    return { success: true as const, cart };
  }

  clearCart(userId: string) {
    this.store.clearCart(userId);
    return { success: true as const };
  }

  validateCart(userId: string) {
    const cart = this.store.getCart(userId);
    return validateCart(cart);
  }
}

export function createCartService(store: CartStore): CartService {
  return new CartService(store);
}
