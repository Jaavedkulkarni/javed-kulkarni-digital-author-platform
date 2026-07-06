import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { getCartStore } from '../cart/cartStore';
import { createPricingEngine } from '../pricing/pricingEngine';
import { createCommerceRepositories } from '../repositories';
import { createOrderProcessor } from '../orders/orderProcessor';
import { createReceiptGenerator } from '../orders/receiptGenerator';
import { createRefundPreparationService } from '../orders/refundPreparation';
import { createPaymentOrchestrator } from '../payments/paymentOrchestrator';
import { createInvoiceGenerator } from '../invoice/invoiceGenerator';
import { getCheckoutSessionStore } from '../checkout/checkoutSessionStore';
import { createCheckoutEngine } from '../checkout/checkoutEngine';
import { createCartService, CartService } from './cartService';
import { createPricingService, PricingService } from './pricingService';
import { createCheckoutService, CheckoutService } from './checkoutService';
import { createOrderService, OrderService } from './orderService';
import { createPaymentService, PaymentService } from './paymentService';
import { createInvoiceService, InvoiceService } from './invoiceService';

export interface CommerceServices {
  cart: CartService;
  pricing: PricingService;
  checkout: CheckoutService;
  orders: OrderService;
  payments: PaymentService;
  invoices: InvoiceService;
}

export function createCommerceServices(client: TypedSupabaseClient): CommerceServices {
  const repos = createCommerceRepositories(client);
  const cartStore = getCartStore();
  const sessionStore = getCheckoutSessionStore();
  const pricingEngine = createPricingEngine();
  const orderProcessor = createOrderProcessor(repos.orders, repos.orderItems);
  const paymentOrchestrator = createPaymentOrchestrator();
  const receiptGenerator = createReceiptGenerator();
  const refundPreparation = createRefundPreparationService(paymentOrchestrator);
  const invoiceGenerator = createInvoiceGenerator();

  const checkoutEngine = createCheckoutEngine({
    cartStore,
    sessionStore,
    pricingEngine,
    orderProcessor,
    paymentOrchestrator,
    paymentRepo: repos.payments,
  });

  return {
    cart: createCartService(cartStore),
    pricing: createPricingService(pricingEngine),
    checkout: createCheckoutService(checkoutEngine),
    orders: createOrderService(orderProcessor, receiptGenerator, refundPreparation),
    payments: createPaymentService(paymentOrchestrator, repos.payments, orderProcessor),
    invoices: createInvoiceService(invoiceGenerator),
  };
}

export {
  CartService,
  PricingService,
  CheckoutService,
  OrderService,
  PaymentService,
  InvoiceService,
  createCartService,
  createPricingService,
  createCheckoutService,
  createOrderService,
  createPaymentService,
  createInvoiceService,
};
