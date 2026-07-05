import type {
  OrderCardItem,
  OrderDetailView,
  OrderPaymentStatus,
  OrderStatus,
} from '../components/orders/orderTypes';
import type { MockOrder } from '../data/mockOrders';

export type OrderSortKey = 'newest' | 'oldest' | 'highest-amount' | 'lowest-amount' | 'recently-downloaded';

export type OrderViewMode = 'grid' | 'list';

export type OrderTriFilter = 'all' | 'yes' | 'no';

export type OrderPaymentStatusFilter = 'all' | OrderPaymentStatus;

export type OrderStatusFilter = 'all' | OrderStatus;

export interface OrderFilters {
  paymentStatus: OrderPaymentStatusFilter;
  orderStatus: OrderStatusFilter;
  membershipPurchase: OrderTriFilter;
  downloadAvailable: OrderTriFilter;
  year: string;
}

export const DEFAULT_ORDER_FILTERS: OrderFilters = {
  paymentStatus: 'all',
  orderStatus: 'all',
  membershipPurchase: 'all',
  downloadAvailable: 'all',
  year: 'all',
};

export interface OrderStats {
  total: number;
  completed: number;
  pending: number;
  refunded: number;
  cancelled: number;
}

export function formatOrderAmount(amount: number): string {
  if (amount === 0) return 'Free';
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatDisplayDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function toOrderCardItem(order: MockOrder): OrderCardItem {
  return {
    id: order.id,
    title: order.bookTitle,
    author: order.author,
    coverUrl: order.cover,
    coverAlt: `${order.bookTitle} cover`,
    orderNumber: order.orderNumber,
    purchaseDate: formatDisplayDate(order.purchaseDate),
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    amountPaid: formatOrderAmount(order.amount),
  };
}

/** Internal detail view with future-ready commerce placeholders. */
export function toOrderDetailView(order: MockOrder): OrderDetailView {
  const subtotal = order.amount + order.discount;
  const gstPercent = order.gst > 0 && subtotal > 0 ? Math.round((order.gst / subtotal) * 100) : 0;

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    invoiceNumber: order.invoiceNumber,
    bookTitle: order.bookTitle,
    author: order.author,
    language: order.language,
    category: order.category,
    format: order.format,
    purchaseDate: formatDisplayDate(order.purchaseDate),
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    amountPaid: formatOrderAmount(order.amount),
    membershipPurchase: order.membershipPurchase,
    downloadAvailable: order.downloadAvailable,
    invoiceAvailable: order.invoiceAvailable,
    supportAvailable: order.supportAvailable,
    subtotal: formatOrderAmount(subtotal),
    discountAmount: order.discount > 0 ? formatOrderAmount(order.discount) : '—',
    gstPercent: gstPercent > 0 ? `${gstPercent}%` : '—',
    gstAmount: order.gst > 0 ? formatOrderAmount(order.gst) : '—',
    grandTotal: formatOrderAmount(order.amount),
    transactionId: `TXN-${order.orderNumber.replace('AO-', '')}`,
    paymentReference: `REF-${order.invoiceNumber.replace('INV-', '')}`,
    invoiceUrl: order.invoiceAvailable ? null : null,
    billingName: '—',
    billingEmail: '—',
    downloadLimit: order.downloadAvailable ? 5 : 0,
    downloadCount: order.downloadCount,
    membershipPlan: order.membershipPurchase ? 'Reader Membership' : null,
    membershipExpiry: order.membershipPurchase ? '—' : null,
  };
}

export function searchOrders(orders: MockOrder[], query: string): MockOrder[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return orders;

  return orders.filter(
    (order) =>
      order.bookTitle.toLowerCase().includes(normalized) ||
      order.author.toLowerCase().includes(normalized) ||
      order.orderNumber.toLowerCase().includes(normalized) ||
      order.invoiceNumber.toLowerCase().includes(normalized)
  );
}

export function filterOrders(orders: MockOrder[], filters: OrderFilters): MockOrder[] {
  return orders.filter((order) => {
    if (filters.paymentStatus !== 'all' && order.paymentStatus !== filters.paymentStatus) return false;
    if (filters.orderStatus !== 'all' && order.orderStatus !== filters.orderStatus) return false;

    if (filters.membershipPurchase === 'yes' && !order.membershipPurchase) return false;
    if (filters.membershipPurchase === 'no' && order.membershipPurchase) return false;

    if (filters.downloadAvailable === 'yes' && !order.downloadAvailable) return false;
    if (filters.downloadAvailable === 'no' && order.downloadAvailable) return false;

    if (filters.year !== 'all') {
      const year = new Date(order.purchaseDate).getFullYear().toString();
      if (year !== filters.year) return false;
    }

    return true;
  });
}

export function sortOrders(orders: MockOrder[], sortKey: OrderSortKey): MockOrder[] {
  const sorted = [...orders];

  switch (sortKey) {
    case 'newest':
      return sorted.sort(
        (a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
      );
    case 'oldest':
      return sorted.sort(
        (a, b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()
      );
    case 'highest-amount':
      return sorted.sort((a, b) => b.amount - a.amount);
    case 'lowest-amount':
      return sorted.sort((a, b) => a.amount - b.amount);
    case 'recently-downloaded':
      return sorted.sort((a, b) => {
        const aTime = a.lastDownloadedAt ? new Date(a.lastDownloadedAt).getTime() : 0;
        const bTime = b.lastDownloadedAt ? new Date(b.lastDownloadedAt).getTime() : 0;
        return bTime - aTime;
      });
    default:
      return sorted;
  }
}

export function calculateOrderStats(orders: MockOrder[]): OrderStats {
  return orders.reduce<OrderStats>(
    (stats, order) => {
      stats.total += 1;
      if (order.orderStatus === 'completed') stats.completed += 1;
      if (order.orderStatus === 'pending') stats.pending += 1;
      if (order.orderStatus === 'refunded') stats.refunded += 1;
      if (order.orderStatus === 'cancelled') stats.cancelled += 1;
      return stats;
    },
    { total: 0, completed: 0, pending: 0, refunded: 0, cancelled: 0 }
  );
}

export function hasActiveOrderFilters(filters: OrderFilters, searchQuery: string): boolean {
  return (
    searchQuery.trim().length > 0 ||
    filters.paymentStatus !== 'all' ||
    filters.orderStatus !== 'all' ||
    filters.membershipPurchase !== 'all' ||
    filters.downloadAvailable !== 'all' ||
    filters.year !== 'all'
  );
}

export function getOrderFilterOptions(orders: MockOrder[]) {
  const years = [
    ...new Set(orders.map((order) => new Date(order.purchaseDate).getFullYear().toString())),
  ].sort((a, b) => Number(b) - Number(a));
  return { years };
}

export function processOrders(
  orders: MockOrder[],
  query: string,
  filters: OrderFilters,
  sortKey: OrderSortKey
): MockOrder[] {
  const filtered = filterOrders(orders, filters);
  const searched = searchOrders(filtered, query);
  return sortOrders(searched, sortKey);
}

export function findMockOrder(orders: MockOrder[], orderId: string): MockOrder | undefined {
  return orders.find((order) => order.id === orderId);
}
