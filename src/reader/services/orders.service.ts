import type { Tables } from '../../types/database';
import { withRetry } from '../../lib/utils/retry';
import { getReaderDataAccess } from '../infrastructure/readerDataAccess';
import { loadBookCatalog } from '../infrastructure/bookCatalog';
import { mapOrderToMockOrder } from '../mappers/order.mapper';
import type { MockOrder } from '../../data/mockOrders';

export async function fetchOrders(userId: string): Promise<MockOrder[]> {
  const { repositories, readerRepositories, client } = getReaderDataAccess();

  const orders = await withRetry(
    async () => repositories.orders.findByUser(userId),
    { scope: 'reader.orders.fetch' }
  );

  if (orders.length === 0) return [];

  const orderIds = orders.map((order) => order.id);
  const [orderItems, paymentsResult, downloads] = await Promise.all([
    readerRepositories.orderItems.findByOrderIds(orderIds),
    client.from('payments').select('*').in('order_id', orderIds),
    readerRepositories.downloads.findByUser(userId),
  ]);

  if (paymentsResult.error) throw paymentsResult.error;

  const itemsByOrder = new Map<string, (typeof orderItems)[number]>();
  for (const item of orderItems) {
    if (!itemsByOrder.has(item.order_id)) {
      itemsByOrder.set(item.order_id, item);
    }
  }

  const paymentsByOrder = new Map(
    ((paymentsResult.data ?? []) as Tables<'payments'>[]).map((p) => [p.order_id, p])
  );

  const downloadsByBook = new Map(downloads.map((d) => [d.book_id, d]));
  const bookIds = orderItems.map((item) => item.book_id);
  const catalog = await loadBookCatalog(bookIds);

  return orders.map((order) => {
    const item = itemsByOrder.get(order.id);
    const payment = paymentsByOrder.get(order.id);
    const download = item ? downloadsByBook.get(item.book_id) : undefined;
    return mapOrderToMockOrder(order, item, catalog, payment, download);
  });
}
