import type { CartEngine } from '../cart/cartEngine';
import type { AddToCartInput, CartSnapshot, UpdateCartItemInput } from '../types/cart.types';
import { validateAddToCart, validateCart } from '../validators/cartValidator';

export class CartService {
  constructor(private readonly engine: CartEngine) {}

  getCart(userId: string): CartSnapshot {
    return this.engine.getCart(userId);
  }

  addItem(userId: string, input: AddToCartInput) {
    const validation = validateAddToCart(input);
    if (!validation.valid) return { success: false as const, errors: validation.errors };
    const cart = this.engine.addItem(userId, input);
    return { success: true as const, cart };
  }

  updateItem(userId: string, input: UpdateCartItemInput) {
    const cart = this.engine.updateQuantity(userId, input);
    return { success: true as const, cart };
  }

  removeItem(userId: string, lineItemId: string) {
    const cart = this.engine.removeItem(userId, lineItemId);
    return { success: true as const, cart };
  }

  clearCart(userId: string) {
    this.engine.emptyCart(userId);
    return { success: true as const };
  }

  calculateSubtotal(userId: string): number {
    return this.engine.calculateSubtotal(userId);
  }

  validateCart(userId: string) {
    const cart = this.engine.getCart(userId);
    return validateCart(cart);
  }
}

export function createCartService(engine: CartEngine): CartService {
  return new CartService(engine);
}
