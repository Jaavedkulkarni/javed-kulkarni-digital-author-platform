import { BookCover, BookMetadata } from '../book';
import { DashboardCard } from '../dashboard/DashboardCard';
import type { OrderCardItem } from './orderTypes';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_STYLES,
} from './orderTypes';
import {
  OrderGhostButton,
  OrderPrimaryButton,
  OrderSecondaryButton,
  OrderStatusBadge,
} from './orderUi';

interface OrderCardProps {
  order?: OrderCardItem;
  compact?: boolean;
}

const PLACEHOLDER = '—';

export function OrderCard({ order, compact = false }: OrderCardProps) {
  const title = order?.title ?? PLACEHOLDER;
  const paymentStatus = order?.paymentStatus;
  const orderStatus = order?.orderStatus;

  const layoutClass = compact
    ? 'flex flex-col gap-4 sm:flex-row sm:items-start'
    : 'flex h-full flex-col';

  const coverClass = compact ? 'sm:w-36 sm:shrink-0' : 'mb-4';

  return (
    <DashboardCard
      title={`Order ${order?.orderNumber ?? PLACEHOLDER}`}
      ariaLabel={`Order for ${title}`}
      className="h-full"
      footer={
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <OrderPrimaryButton>View Details</OrderPrimaryButton>
          <OrderSecondaryButton>Download Invoice</OrderSecondaryButton>
          <OrderSecondaryButton>Download Book</OrderSecondaryButton>
          <OrderGhostButton>Need Help</OrderGhostButton>
        </div>
      }
    >
      <article data-variant="order" className={layoutClass}>
        <div className={coverClass}>
          <BookCover
            src={order?.coverUrl}
            alt={order?.coverAlt ?? `${title} cover`}
            size={compact ? 'sm' : 'md'}
            empty={!order?.coverUrl}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <BookMetadata
            title={order?.title ?? PLACEHOLDER}
            author={order?.author ?? PLACEHOLDER}
            compact
          />

          <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Order Number</dt>
              <dd className="mt-0.5 font-medium tabular-nums text-navy-900 dark:text-white">
                {order?.orderNumber ?? PLACEHOLDER}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Invoice Number</dt>
              <dd className="mt-0.5 font-medium tabular-nums text-navy-900 dark:text-white">
                {order?.invoiceNumber ?? PLACEHOLDER}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Purchase Date</dt>
              <dd className="mt-0.5 text-navy-900 dark:text-white">{order?.purchaseDate ?? PLACEHOLDER}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Payment Method</dt>
              <dd className="mt-0.5 text-navy-900 dark:text-white">{order?.paymentMethod ?? PLACEHOLDER}</dd>
            </div>
          </dl>

          <div className="flex min-h-7 flex-wrap items-center gap-1.5 sm:gap-2">
            {paymentStatus ? (
              <OrderStatusBadge
                label={PAYMENT_STATUS_LABELS[paymentStatus]}
                styleClass={PAYMENT_STATUS_STYLES[paymentStatus]}
              />
            ) : (
              <OrderStatusBadge
                label="Payment Status"
                styleClass="border-gray-200 bg-gray-100 text-gray-500 dark:border-navy-600 dark:bg-navy-700 dark:text-gray-400"
              />
            )}
            {orderStatus ? (
              <OrderStatusBadge
                label={ORDER_STATUS_LABELS[orderStatus]}
                styleClass={ORDER_STATUS_STYLES[orderStatus]}
              />
            ) : (
              <OrderStatusBadge
                label="Order Status"
                styleClass="border-gray-200 bg-gray-100 text-gray-500 dark:border-navy-600 dark:bg-navy-700 dark:text-gray-400"
              />
            )}
          </div>

          <p className="text-lg font-bold tabular-nums text-navy-900 dark:text-white">
            {order?.amountPaid ? (
              <>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Amount Paid </span>
                {order.amountPaid}
              </>
            ) : (
              <>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount Paid: </span>
                {PLACEHOLDER}
              </>
            )}
          </p>
        </div>
      </article>
    </DashboardCard>
  );
}

export default OrderCard;
