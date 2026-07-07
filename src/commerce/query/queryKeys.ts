export const commerceQueryKeys = {
  all: ['commerce'] as const,
  cart: (userId: string) => [...commerceQueryKeys.all, 'cart', userId] as const,
  checkout: (sessionId: string) => [...commerceQueryKeys.all, 'checkout', sessionId] as const,
  orders: (userId: string) => [...commerceQueryKeys.all, 'orders', userId] as const,
  order: (orderId: string) => [...commerceQueryKeys.all, 'order', orderId] as const,
  payments: (orderId: string) => [...commerceQueryKeys.all, 'payments', orderId] as const,
  membership: (userId: string) => [...commerceQueryKeys.all, 'membership', userId] as const,
  entitlements: (userId: string) => [...commerceQueryKeys.all, 'entitlements', userId] as const,
  entitlement: (userId: string, bookId: string) =>
    [...commerceQueryKeys.all, 'entitlement', userId, bookId] as const,
  coupons: () => [...commerceQueryKeys.all, 'coupons'] as const,
  coupon: (code: string) => [...commerceQueryKeys.all, 'coupon', code] as const,
  invoices: (userId: string) => [...commerceQueryKeys.all, 'invoices', userId] as const,
  invoice: (orderId: string) => [...commerceQueryKeys.all, 'invoice', orderId] as const,
  wallet: (userId: string) => [...commerceQueryKeys.all, 'wallet', userId] as const,
  walletTransactions: (userId: string) => [...commerceQueryKeys.all, 'wallet-transactions', userId] as const,
  pricing: (userId: string) => [...commerceQueryKeys.all, 'pricing', userId] as const,
};
