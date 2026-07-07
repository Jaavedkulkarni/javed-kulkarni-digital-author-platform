import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { createCommerceOrderRepository, CommerceOrderRepository } from './orderRepository';
import { createCommerceOrderItemsRepository, CommerceOrderItemsRepository } from './orderItemsRepository';
import { createCommercePaymentRepository, CommercePaymentRepository } from './paymentRepository';
import { createCommerceMembershipRepository, CommerceMembershipRepository } from './membershipRepository';
import { createLibraryEntitlementRepository, LibraryEntitlementRepository } from './libraryEntitlementRepository';
import { createCommerceCouponRepository, CommerceCouponRepository } from './couponRepository';
import { createCommerceInvoiceRepository, CommerceInvoiceRepository } from './invoiceRepository';
import { createCommerceWalletRepository, CommerceWalletRepository } from './walletRepository';

export interface CommerceRepositories {
  orders: CommerceOrderRepository;
  orderItems: CommerceOrderItemsRepository;
  payments: CommercePaymentRepository;
  memberships: CommerceMembershipRepository;
  entitlements: LibraryEntitlementRepository;
  coupons: CommerceCouponRepository;
  invoices: CommerceInvoiceRepository;
  wallet: CommerceWalletRepository;
}

export function createCommerceRepositories(client: TypedSupabaseClient): CommerceRepositories {
  return {
    orders: createCommerceOrderRepository(client),
    orderItems: createCommerceOrderItemsRepository(client),
    payments: createCommercePaymentRepository(client),
    memberships: createCommerceMembershipRepository(client),
    entitlements: createLibraryEntitlementRepository(client),
    coupons: createCommerceCouponRepository(),
    invoices: createCommerceInvoiceRepository(),
    wallet: createCommerceWalletRepository(),
  };
}

export {
  CommerceOrderRepository,
  CommerceOrderItemsRepository,
  CommercePaymentRepository,
  CommerceMembershipRepository,
  LibraryEntitlementRepository,
  CommerceCouponRepository,
  CommerceInvoiceRepository,
  CommerceWalletRepository,
};
