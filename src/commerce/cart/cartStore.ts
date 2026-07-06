import type { CartLineItem, CartSnapshot, AddToCartInput, UpdateCartItemInput } from '../types/cart.types';
import { DEFAULT_CURRENCY } from '../constants/commerce.constants';

function createLineItemId(bookId: string, format: string): string {
  return `${bookId}:${format}`;
}

export class CartStore {
  private carts = new Map<string, CartSnapshot>();

  getCart(userId: string): CartSnapshot {
    return (
      this.carts.get(userId) ?? {
        userId,
        items: [],
        currency: DEFAULT_CURRENCY,
        updatedAt: new Date().toISOString(),
      }
    );
  }

  saveCart(cart: CartSnapshot): CartSnapshot {
    const snapshot = { ...cart, updatedAt: new Date().toISOString() };
    this.carts.set(cart.userId, snapshot);
    return snapshot;
  }

  addItem(userId: string, input: AddToCartInput): CartSnapshot {
    const cart = this.getCart(userId);
    const format = input.format ?? 'epub';
    const lineId = createLineItemId(input.bookId, format);
    const existing = cart.items.find((item) => item.id === lineId);

    let items: CartLineItem[];
    if (existing) {
      items = cart.items.map((item) =>
        item.id === lineId
          ? { ...item, quantity: item.quantity + (input.quantity ?? 1) }
          : item
      );
    } else {
      const line: CartLineItem = {
        id: lineId,
        bookId: input.bookId,
        title: input.title,
        format,
        unitPrice: input.unitPrice,
        quantity: input.quantity ?? 1,
        pricingModel: input.pricingModel ?? (input.unitPrice <= 0 ? 'free' : 'paid'),
        isMembershipBook: input.isMembershipBook ?? false,
        coverImage: input.coverImage,
        authorName: input.authorName,
      };
      items = [...cart.items, line];
    }

    return this.saveCart({ ...cart, items });
  }

  updateItem(userId: string, input: UpdateCartItemInput): CartSnapshot {
    const cart = this.getCart(userId);
    const items =
      input.quantity <= 0
        ? cart.items.filter((item) => item.id !== input.lineItemId)
        : cart.items.map((item) =>
            item.id === input.lineItemId ? { ...item, quantity: input.quantity } : item
          );
    return this.saveCart({ ...cart, items });
  }

  removeItem(userId: string, lineItemId: string): CartSnapshot {
    const cart = this.getCart(userId);
    return this.saveCart({
      ...cart,
      items: cart.items.filter((item) => item.id !== lineItemId),
    });
  }

  clearCart(userId: string): void {
    this.carts.delete(userId);
  }
}

let cartStoreInstance: CartStore | null = null;

export function getCartStore(): CartStore {
  if (!cartStoreInstance) cartStoreInstance = new CartStore();
  return cartStoreInstance;
}

export function resetCartStore(): void {
  cartStoreInstance = null;
}
