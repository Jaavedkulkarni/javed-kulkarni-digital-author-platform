import { OrderPageHeader } from './OrderPageHeader';
import { OrderToolbar } from './OrderToolbar';
import { OrderStatistics } from './OrderStatistics';
import { OrderGrid } from './OrderGrid';

export function MyOrdersContent() {
  const orders: never[] = [];

  return (
    <div className="space-y-5 sm:space-y-6">
      <OrderPageHeader />
      <OrderToolbar />
      <OrderStatistics />
      <OrderGrid orders={orders} />
    </div>
  );
}

export default MyOrdersContent;
