import { useCallback, useState } from 'react';
import type { CheckoutSession, CompleteCheckoutInput, StartCheckoutInput } from '../types/checkout.types';
import type { CheckoutContext } from '../checkout/checkoutEngine';
import type { PaymentProviderId } from '../types/payment.types';
import { useCommerceServices } from './useCommerceServices';

export function useCheckout() {
  const { checkout, pricing } = useCommerceServices();
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = useCallback(
    async (input: StartCheckoutInput, context?: CheckoutContext) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = checkout.start(input, context);
        if (!result.success) {
          setError(result.errors?.join(' ') ?? 'Checkout failed.');
          return result;
        }
        setSession(result.session);
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    [checkout]
  );

  const completeCheckout = useCallback(
    async (input: CompleteCheckoutInput, provider: PaymentProviderId = 'mock') => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await checkout.complete(input, provider);
        if (!result.success) {
          setError(result.errors?.join(' ') ?? 'Payment failed.');
          return result;
        }
        setSession(null);
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    [checkout]
  );

  const previewPricing = useCallback(
    (input: Parameters<typeof pricing.calculatePricing>[0]) => pricing.calculatePricing(input),
    [pricing]
  );

  const validateCart = useCallback(
    (userId: string) => checkout.validateCart(userId),
    [checkout]
  );

  const validateEntitlement = useCallback(
    (userId: string, context?: Parameters<typeof checkout.validateEntitlement>[1]) =>
      checkout.validateEntitlement(userId, context),
    [checkout]
  );

  const prepareOrder = useCallback(
    (checkoutSession: CheckoutSession) => checkout.prepareOrder(checkoutSession),
    [checkout]
  );

  const preparePaymentRequest = useCallback(
    (
      checkoutSession: CheckoutSession,
      orderId: string,
      provider: PaymentProviderId = 'mock'
    ) => checkout.preparePaymentRequest(checkoutSession, orderId, provider),
    [checkout]
  );

  const reset = useCallback(() => {
    setSession(null);
    setError(null);
  }, []);

  return {
    session,
    isLoading,
    error,
    startCheckout,
    completeCheckout,
    previewPricing,
    validateCart,
    validateEntitlement,
    prepareOrder,
    preparePaymentRequest,
    reset,
  };
}
