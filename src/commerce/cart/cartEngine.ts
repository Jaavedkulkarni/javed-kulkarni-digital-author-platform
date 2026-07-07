import type { CartStore } from '../stores/cartStore';
import type { AddToCartInput, CartSnapshot, UpdateCartItemInput } from '../types/cart.types';

export class CartEngine {
  constructor(private readonly store: CartStore) {}

  getCart(userId: string): CartSnapshot {
    return this.store.getCart(userId);
  }

  addItem(userId: string, input: AddToCartInput): CartSnapshot {
    return this.store.addItem(userId, input);
  }

  removeItem(userId: string, lineItemId: string): CartSnapshot {
    return this.store.removeItem(userId, lineItemId);
  }

  updateQuantity(userId: string, input: UpdateCartItemInput): CartSnapshot {
    return this.store.updateItem(userId, input);
  }

  emptyCart(userId: string): void {
    this.store.clearCart(userId);
  }

  calculateSubtotal(userId: string): number {
    return this.store.calculateSubtotal(userId);
  }
}

export function createCartEngine(store: CartStore): CartEngine {
  return new CartEngine(store);
}
