import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { getCartStore } from '../stores/cartStore';
import { createCartEngine } from '../cart/cartEngine';
import { createPricingEngine } from '../pricing/pricingEngine';
import { createGstEngine } from '../tax/gstEngine';
import { createCommerceRepositories } from '../repositories';
import { createOrderProcessor } from '../orders/orderProcessor';
import { createOrderEngine } from '../orders/orderEngine';
import { createReceiptGenerator } from '../orders/receiptGenerator';
import { createRefundPreparationService } from '../orders/refundPreparation';
import { createPaymentOrchestrator } from '../payments/paymentOrchestrator';
import { createInvoiceGenerator } from '../invoice/invoiceGenerator';
import { getCheckoutSessionStore } from '../stores/checkoutSessionStore';
import { createCheckoutEngine } from '../checkout/checkoutEngine';
import { createEntitlementEngine } from '../entitlement/entitlementEngine';
import { createCartService, CartService } from './cartService';
import { createPricingService, PricingService } from './pricingService';
import { createCheckoutService, CheckoutService } from './checkoutService';
import { createOrderService, OrderService } from './orderService';
import { createPaymentService, PaymentService } from './paymentService';
import { createInvoiceService, InvoiceService } from './invoiceService';
import { createCouponService, CouponService } from './couponService';
import { createDiscountService, DiscountService } from './discountService';
import { createMembershipService, MembershipService } from './membershipService';
import { createEntitlementService, EntitlementService } from './entitlementService';
import { createWalletService, WalletService } from './walletService';
import { createFulfillmentService, FulfillmentService } from './fulfillmentService';

export interface CommerceServices {
  cart: CartService;
  pricing: PricingService;
  discount: DiscountService;
  coupons: CouponService;
  checkout: CheckoutService;
  orders: OrderService;
  payments: PaymentService;
  invoices: InvoiceService;
  memberships: MembershipService;
  entitlements: EntitlementService;
  wallet: WalletService;
  fulfillment: FulfillmentService;
}

export function createCommerceServices(client: TypedSupabaseClient): CommerceServices {
  const repos = createCommerceRepositories(client);
  const cartStore = getCartStore();
  const cartEngine = createCartEngine(cartStore);
  const sessionStore = getCheckoutSessionStore();
  const pricingEngine = createPricingEngine();
  const gstEngine = createGstEngine();
  const orderProcessor = createOrderProcessor(repos.orders, repos.orderItems);
  const orderEngine = createOrderEngine(orderProcessor);
  const paymentOrchestrator = createPaymentOrchestrator();
  const receiptGenerator = createReceiptGenerator();
  const refundPreparation = createRefundPreparationService(paymentOrchestrator);
  const invoiceGenerator = createInvoiceGenerator();
  const entitlementEngine = createEntitlementEngine(repos.entitlements, repos.orderItems);

  const checkoutEngine = createCheckoutEngine({
    cartStore,
    sessionStore,
    pricingEngine,
    orderProcessor,
    paymentOrchestrator,
    paymentRepo: repos.payments,
  });

  const orders = createOrderService(orderEngine, receiptGenerator, refundPreparation);
  const invoices = createInvoiceService(invoiceGenerator, repos.invoices);
  const entitlements = createEntitlementService(repos.entitlements, entitlementEngine);

  return {
    cart: createCartService(cartEngine),
    pricing: createPricingService(pricingEngine, gstEngine),
    discount: createDiscountService(),
    coupons: createCouponService(repos.coupons),
    checkout: createCheckoutService(checkoutEngine),
    orders,
    payments: createPaymentService(paymentOrchestrator, repos.payments, orderProcessor),
    invoices,
    memberships: createMembershipService(repos.memberships),
    entitlements,
    wallet: createWalletService(repos.wallet),
    fulfillment: createFulfillmentService(orders, entitlements, invoices),
  };
}

export {
  CartService,
  PricingService,
  DiscountService,
  CouponService,
  CheckoutService,
  OrderService,
  PaymentService,
  InvoiceService,
  MembershipService,
  EntitlementService,
  WalletService,
  FulfillmentService,
  createCartService,
  createPricingService,
  createDiscountService,
  createCouponService,
  createCheckoutService,
  createOrderService,
  createPaymentService,
  createInvoiceService,
  createMembershipService,
  createEntitlementService,
  createWalletService,
  createFulfillmentService,
};
