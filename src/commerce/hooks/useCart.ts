import { useCallback, useMemo, useState } from 'react';
import type { AddToCartInput, CartSnapshot, UpdateCartItemInput } from '../types/cart.types';
import { useCommerceServices } from './useCommerceServices';

export function useCart(userId: string | null | undefined) {
  const { cart: cartService } = useCommerceServices();
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  const cart: CartSnapshot = useMemo(() => {
    if (!userId) {
      return { userId: '', items: [], currency: 'INR', updatedAt: new Date().toISOString() };
    }
    void version;
    return cartService.getCart(userId);
  }, [cartService, userId, version]);

  const subtotal = useMemo(() => {
    if (!userId) return 0;
    void version;
    return cartService.calculateSubtotal(userId);
  }, [cartService, userId, version]);

  const addItem = useCallback(
    async (input: AddToCartInput) => {
      if (!userId) return { success: false as const, errors: ['Sign in to add items to cart.'] };
      const result = cartService.addItem(userId, input);
      refresh();
      return result;
    },
    [cartService, userId, refresh]
  );

  const updateItem = useCallback(
    async (input: UpdateCartItemInput) => {
      if (!userId) return { success: false as const, errors: ['Sign in to update cart.'] };
      const result = cartService.updateItem(userId, input);
      refresh();
      return result;
    },
    [cartService, userId, refresh]
  );

  const removeItem = useCallback(
    async (lineItemId: string) => {
      if (!userId) return { success: false as const, errors: ['Sign in to update cart.'] };
      const result = cartService.removeItem(userId, lineItemId);
      refresh();
      return result;
    },
    [cartService, userId, refresh]
  );

  const clearCart = useCallback(async () => {
    if (!userId) return { success: false as const, errors: ['Sign in to clear cart.'] };
    const result = cartService.clearCart(userId);
    refresh();
    return result;
  }, [cartService, userId, refresh]);

  return {
    cart,
    subtotal,
    itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    addItem,
    updateItem,
    removeItem,
    clearCart,
    refresh,
  };
}
