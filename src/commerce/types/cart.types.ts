import type { DigitalFormat } from '../../types/database';
import type { CommerceCurrency, PricingModel } from './common';

export interface CartLineItem {
  id: string;
  bookId: string;
  title: string;
  format: DigitalFormat;
  unitPrice: number;
  quantity: number;
  pricingModel: PricingModel;
  isMembershipBook: boolean;
  coverImage?: string | null;
  authorName?: string | null;
}

export interface CartSnapshot {
  userId: string;
  items: CartLineItem[];
  currency: CommerceCurrency;
  updatedAt: string;
}

export interface AddToCartInput {
  bookId: string;
  title: string;
  format?: DigitalFormat;
  unitPrice: number;
  pricingModel?: PricingModel;
  isMembershipBook?: boolean;
  coverImage?: string | null;
  authorName?: string | null;
  quantity?: number;
}

export interface UpdateCartItemInput {
  lineItemId: string;
  quantity: number;
}
