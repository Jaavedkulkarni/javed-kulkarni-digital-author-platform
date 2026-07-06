export interface BusinessPolicy {
  id: string;
  category: 'commission' | 'membership' | 'service_pricing' | 'paperback' | 'coupon' | 'wallet' | 'settlement' | 'withdrawal' | 'tax';
  name: string;
  value: string;
  updatedAt: string;
}
