import type { Order, Tables } from '../../types/database';
import type { MockOrder } from '../../data/mockOrders';
import type { OrderPaymentStatus, OrderStatus } from '../../components/orders/orderTypes';
import type { BookCatalogContext } from '../infrastructure/bookCatalog';
import {
  formatDateLabel,
  mapDigitalFormatToBookFormat,
  resolveBookAuthor,
  resolveBookCategory,
  resolveBookCover,
  resolveBookLanguage,
  resolveBookTitle,
} from './format';

function mapOrderStatus(status: Order['status']): OrderStatus {
  if (status === 'completed') return 'completed';
  if (status === 'cancelled') return 'cancelled';
  if (status === 'refunded') return 'refunded';
  if (status === 'processing' || status === 'failed' || status === 'pending') return 'pending';
  return 'pending';
}

function mapPaymentStatus(payment: Tables<'payments'> | undefined, order: Order): OrderPaymentStatus {
  if (!payment) {
    return order.status === 'completed' ? 'paid' : 'pending';
  }
  if (payment.status === 'captured' || payment.status === 'authorized') return 'paid';
  if (payment.status === 'refunded') return 'refunded';
  if (payment.status === 'failed') return 'failed';
  return 'pending';
}

export function mapOrderToMockOrder(
  order: Order,
  item: Tables<'order_items'> | undefined,
  catalog: BookCatalogContext,
  payment?: Tables<'payments'>,
  download?: Tables<'downloads'>
): MockOrder {
  const book = item ? catalog.books.get(item.book_id) : undefined;
  const metadata = (order.metadata ?? {}) as Record<string, unknown>;

  return {
    id: order.id,
    orderNumber: order.order_number,
    invoiceNumber: `INV-${order.order_number}`,
    bookId: item?.book_id ?? order.id,
    bookTitle: item?.title_snapshot ?? resolveBookTitle(book),
    author: resolveBookAuthor(book),
    cover: resolveBookCover(book),
    language: resolveBookLanguage(book),
    category: resolveBookCategory(book, catalog.categories),
    format: mapDigitalFormatToBookFormat(item?.format),
    purchaseDate: formatDateLabel(order.placed_at ?? order.created_at),
    paymentMethod: (metadata.paymentMethod as string) ?? payment?.provider ?? 'Online',
    paymentStatus: mapPaymentStatus(payment, order),
    orderStatus: mapOrderStatus(order.status),
    amount: order.total_amount,
    discount: order.discount_amount,
    gst: order.tax_amount,
    membershipPurchase: Boolean(metadata.membershipPurchase),
    downloadAvailable: download?.status === 'ready' || download?.status === 'completed',
    downloadCount: download?.download_count ?? 0,
    invoiceAvailable: order.status === 'completed',
    supportAvailable: true,
    lastDownloadedAt: formatDateLabel(download?.last_downloaded_at ?? null) || null,
  };
}
