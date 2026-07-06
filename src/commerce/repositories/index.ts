import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { createCommerceOrderRepository, CommerceOrderRepository } from './orderRepository';
import { createCommerceOrderItemsRepository, CommerceOrderItemsRepository } from './orderItemsRepository';
import { createCommercePaymentRepository, CommercePaymentRepository } from './paymentRepository';

export interface CommerceRepositories {
  orders: CommerceOrderRepository;
  orderItems: CommerceOrderItemsRepository;
  payments: CommercePaymentRepository;
}

export function createCommerceRepositories(client: TypedSupabaseClient): CommerceRepositories {
  return {
    orders: createCommerceOrderRepository(client),
    orderItems: createCommerceOrderItemsRepository(client),
    payments: createCommercePaymentRepository(client),
  };
}
