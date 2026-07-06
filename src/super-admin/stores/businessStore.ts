import type { BusinessPolicy } from '../types/business.types';
import { generateId } from '../utils/common';

const policies: BusinessPolicy[] = [
  { id: generateId('bp'), category: 'commission', name: 'Digital Book Commission', value: '30%', updatedAt: new Date().toISOString() },
  { id: generateId('bp'), category: 'membership', name: 'Premium Membership', value: '₹499/month', updatedAt: new Date().toISOString() },
  { id: generateId('bp'), category: 'withdrawal', name: 'Min Withdrawal', value: '₹1000', updatedAt: new Date().toISOString() },
  { id: generateId('bp'), category: 'tax', name: 'GST Rate', value: '18%', updatedAt: new Date().toISOString() },
  { id: generateId('bp'), category: 'paperback', name: 'Paperback Markup', value: '15%', updatedAt: new Date().toISOString() },
  { id: generateId('bp'), category: 'coupon', name: 'Max Discount', value: '50%', updatedAt: new Date().toISOString() },
  { id: generateId('bp'), category: 'wallet', name: 'Wallet Hold Period', value: '7 days', updatedAt: new Date().toISOString() },
  { id: generateId('bp'), category: 'settlement', name: 'Publisher Settlement', value: 'Net 30', updatedAt: new Date().toISOString() },
  { id: generateId('bp'), category: 'service_pricing', name: 'Cover Design Base', value: '₹2500', updatedAt: new Date().toISOString() },
];

export function getBusinessPolicies(category?: BusinessPolicy['category']) {
  return category ? policies.filter((p) => p.category === category) : policies;
}

export function updatePolicy(id: string, value: string): BusinessPolicy | null {
  const p = policies.find((x) => x.id === id);
  if (!p) return null;
  p.value = value;
  p.updatedAt = new Date().toISOString();
  return p;
}
