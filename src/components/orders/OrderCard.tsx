import type { KeyboardEvent } from 'react';
import { memo } from 'react';
import { BookCover } from '../book';
import type { OrderCardItem } from './orderTypes';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_STYLES,
} from './orderTypes';
import { OrderPrimaryButton, OrderStatusBadge, MONO_ID_CLASS, stopOrderInteraction } from './orderUi';

interface OrderCardProps {
  order: OrderCardItem;
  compact?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  onViewDetails?: () => void;
}

const PLACEHOLDER = '—';

const CARD_BASE =
  'relative flex h-full flex-col rounded-xl border p-4 transition-all duration-200 sm:p-4';

const CARD_NORMAL =
  'border-gray-200 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-lg dark:border-navy-700 dark:bg-navy-800';

const CARD_SELECTED =
  'border-brand ring-2 ring-brand/30 bg-white shadow-md dark:border-gold-500/40 dark:bg-navy-800 dark:ring-gold-500/20';

export const OrderCard = memo(function OrderCard({
  order,
  compact = false,
  selected = false,
  onSelect,
  onViewDetails,
}: OrderCardProps) {
  const title = order.title ?? PLACEHOLDER;
  const isSelectable = Boolean(onSelect);

  const handleSelect = () => {
    if (isSelectable) onSelect?.();
  };

  const handleSelectKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect();
    }
  };

  const coverSize = compact ? 'md' : 'lg';
  const layoutClass = compact ? 'flex gap-3 sm:flex-row sm:items-start' : 'flex flex-col';

  return (
    <article
      aria-label={`Order ${order.orderNumber ?? PLACEHOLDER} for ${title}`}
      data-variant="order"
      data-state={selected ? 'selected' : 'normal'}
      className={`${CARD_BASE} ${selected ? CARD_SELECTED : CARD_NORMAL}`}
    >
      <div
        role="button"
        tabIndex={isSelectable ? 0 : -1}
        aria-selected={selected}
        aria-label={`Select order ${order.orderNumber ?? PLACEHOLDER}`}
        onClick={handleSelect}
        onKeyDown={handleSelectKeyDown}
        className={`flex min-h-0 flex-1 cursor-pointer flex-col rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 ${layoutClass} gap-2`}
      >
        <div className={compact ? 'sm:w-36 sm:shrink-0' : ''}>
          <BookCover
            src={order.coverUrl}
            alt={order.coverAlt ?? `${title} cover`}
            size={coverSize}
            empty={!order.coverUrl}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="space-y-0.5">
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-navy-900 dark:text-white">
              {order.title ?? PLACEHOLDER}
            </h3>
            <p className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">{order.author ?? PLACEHOLDER}</p>
          </div>

          <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Order #</dt>
              <dd className={`${MONO_ID_CLASS} font-semibold`}>{order.orderNumber ?? PLACEHOLDER}</dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Date</dt>
              <dd className="text-navy-900 dark:text-white">{order.purchaseDate ?? PLACEHOLDER}</dd>
            </div>
          </dl>

          <div
            className="flex min-h-7 flex-wrap items-center gap-1.5"
            role="group"
            aria-label="Order status badges"
          >
            {order.paymentStatus ? (
              <OrderStatusBadge
                label={PAYMENT_STATUS_LABELS[order.paymentStatus]}
                styleClass={PAYMENT_STATUS_STYLES[order.paymentStatus]}
                type="payment"
              />
            ) : null}
            {order.orderStatus ? (
              <OrderStatusBadge
                label={ORDER_STATUS_LABELS[order.orderStatus]}
                styleClass={ORDER_STATUS_STYLES[order.orderStatus]}
                type="order"
              />
            ) : null}
          </div>

          <p className="text-base font-bold tabular-nums text-navy-900 dark:text-white">
            {order.amountPaid ?? PLACEHOLDER}
          </p>
        </div>
      </div>

      <div
        className="relative z-10 mt-3"
        onClick={stopOrderInteraction}
        onKeyDown={stopOrderInteraction}
        onMouseDown={stopOrderInteraction}
      >
        <OrderPrimaryButton onClick={onViewDetails} interactive={Boolean(onViewDetails)}>
          View Details
        </OrderPrimaryButton>
      </div>
    </article>
  );
});

export default OrderCard;
