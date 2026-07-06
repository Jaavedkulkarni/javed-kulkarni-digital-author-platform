import type { PricingEngine } from '../pricing/pricingEngine';
import type { OrderProcessor } from '../orders/orderProcessor';
import type { PaymentOrchestrator } from '../payments/paymentOrchestrator';
import type { CommercePaymentRepository } from '../repositories/paymentRepository';
import type { CartStore } from '../cart/cartStore';
import type { CheckoutSessionStore } from './checkoutSessionStore';
import type {
  CheckoutResult,
  CompleteCheckoutInput,
  StartCheckoutInput,
} from '../types/checkout.types';
import type { PaymentProviderId } from '../types/payment.types';
import type { MembershipTier } from '../../types/database';
import { validateCheckoutComplete, validateCheckoutStart } from '../validators/checkoutValidator';
import { validateCart } from '../validators/cartValidator';
import { validatePurchaseEligibility } from '../validators/purchaseValidator';
import { calculateGst, resolveBuyerStateCode } from '../tax/gstCalculator';
import { SELLER_STATE_CODE } from '../constants/commerce.constants';
import { roundMoney, isFreeAmount } from '../utils/money';
import type { OrderLineItem } from '../types/order.types';
import type { TablesInsert } from '../../types/database';

export interface CheckoutEngineDeps {
  cartStore: CartStore;
  sessionStore: CheckoutSessionStore;
  pricingEngine: PricingEngine;
  orderProcessor: OrderProcessor;
  paymentOrchestrator: PaymentOrchestrator;
  paymentRepo: CommercePaymentRepository;
}

export interface CheckoutContext {
  membershipTier?: MembershipTier | null;
  alreadyOwnsBookIds?: string[];
  hasActiveMembership?: boolean;
  isFirstOrder?: boolean;
}

export class CheckoutEngine {
  constructor(private readonly deps: CheckoutEngineDeps) {}

  startCheckout(input: StartCheckoutInput, context: CheckoutContext = {}) {
    const validation = validateCheckoutStart(input);
    if (!validation.valid) return { success: false as const, errors: validation.errors };

    const cart = this.deps.cartStore.getCart(input.userId);
    const cartValidation = validateCart(cart);
    if (!cartValidation.valid) return { success: false as const, errors: cartValidation.errors };

    const purchaseValidation = validatePurchaseEligibility({
      userId: input.userId,
      items: cart.items,
      alreadyOwnsBookIds: context.alreadyOwnsBookIds,
      hasActiveMembership: context.hasActiveMembership,
    });
    if (!purchaseValidation.valid) {
      return { success: false as const, errors: purchaseValidation.errors };
    }

    const pricing = this.deps.pricingEngine.price({
      items: cart.items,
      currency: cart.currency,
      membershipTier: context.membershipTier,
      couponCode: input.couponCode,
      regionCode: input.regionCode,
    });

    const buyerState = resolveBuyerStateCode(input.billingAddress?.state);
    const tax = calculateGst({
      taxableAmount: pricing.taxableAmount,
      sellerStateCode: SELLER_STATE_CODE,
      buyerStateCode: buyerState,
    });

    const session = this.deps.sessionStore.create({
      userId: input.userId,
      cart,
      buyer: {
        userId: input.userId,
        email: input.email,
        name: input.name,
        phone: input.phone,
        billingAddress: input.billingAddress,
      },
      pricing,
      tax,
      couponCode: input.couponCode,
      currency: cart.currency,
      guestCheckout: false,
    });

    return { success: true as const, session };
  }

  async completeCheckout(
    input: CompleteCheckoutInput,
    provider: PaymentProviderId = 'mock'
  ): Promise<{ success: boolean; data?: CheckoutResult; errors?: string[] }> {
    const validation = validateCheckoutComplete(input);
    if (!validation.valid) return { success: false, errors: validation.errors };

    const session = this.deps.sessionStore.get(input.sessionId);
    if (!session) return { success: false, errors: ['Checkout session expired or not found.'] };

    const orderItems: Omit<OrderLineItem, 'id'>[] = session.cart.items.map((item, index) => {
      const linePricing = session.pricing.lines[index];
      const lineSubtotal = linePricing?.lineSubtotal ?? item.unitPrice * item.quantity;
      const lineDiscount = roundMoney(
        (linePricing?.membershipDiscount ?? 0) + (linePricing?.couponDiscount ?? 0),
        session.currency
      );
      const lineTaxShare =
        session.pricing.taxableAmount > 0
          ? roundMoney(
              (lineSubtotal - lineDiscount) * (session.tax.taxAmount / session.pricing.taxableAmount),
              session.currency
            )
          : 0;

      return {
        bookId: item.bookId,
        title: item.title,
        format: item.format,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        discountAmount: lineDiscount,
        taxAmount: lineTaxShare,
        lineTotal: roundMoney(lineSubtotal - lineDiscount + lineTaxShare, session.currency),
      };
    });

    const totalAmount = roundMoney(session.pricing.taxableAmount + session.tax.taxAmount, session.currency);

    const order = await this.deps.orderProcessor.createOrder({
      userId: session.userId,
      buyer: session.buyer,
      items: orderItems,
      subtotal: session.pricing.subtotal,
      discountAmount: session.pricing.discountTotal,
      taxAmount: session.tax.taxAmount,
      totalAmount,
      currency: session.currency,
      couponCode: session.couponCode,
      metadata: {
        checkoutSessionId: session.id,
        taxRegion: session.tax.region,
        gstComponents: session.tax.components,
      },
    });

    let orderStatus = order.status;
    const paymentInsert: TablesInsert<'payments'> = {
      order_id: order.id,
      user_id: session.userId,
      status: 'pending',
      provider,
      amount: totalAmount,
      currency: session.currency,
      method: isFreeAmount(totalAmount) ? 'free' : 'card',
      metadata: { checkoutSessionId: session.id },
    };

    const paymentRow = await this.deps.paymentRepo.createPayment(paymentInsert);

    if (isFreeAmount(totalAmount)) {
      await this.deps.paymentRepo.updateStatus(paymentRow.id, 'captured');
      orderStatus = (
        await this.deps.orderProcessor.transition({
          orderId: order.id,
          currentStatus: 'pending',
          nextStatus: 'paid',
        })
      ).status;
    } else {
      await this.deps.orderProcessor.transition({
        orderId: order.id,
        currentStatus: 'pending',
        nextStatus: 'processing',
      });
      orderStatus = 'processing';

      const intent = await this.deps.paymentOrchestrator.initiatePayment({
        orderId: order.id,
        userId: session.userId,
        amount: totalAmount,
        currency: session.currency,
        provider,
        metadata: { orderNumber: order.orderNumber },
      });

      await this.deps.paymentRepo.updatePayment(paymentRow.id, {
        provider_payment_id: intent.providerPaymentId,
        provider_order_id: intent.providerOrderId ?? null,
        status: intent.status,
      });
    }

    this.deps.sessionStore.remove(session.id);
    this.deps.cartStore.clearCart(session.userId);

    return {
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentId: paymentRow.id,
        status: orderStatus,
        totalAmount,
        currency: session.currency,
      },
    };
  }
}

export function createCheckoutEngine(deps: CheckoutEngineDeps): CheckoutEngine {
  return new CheckoutEngine(deps);
}
