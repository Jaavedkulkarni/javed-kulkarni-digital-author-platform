import type { KeyboardEvent } from 'react';
import { memo } from 'react';
import type { NotificationItem } from './notificationTypes';
import {
  CARD_HOVER,
  CARD_READ,
  CARD_SELECTED,
  CARD_UNREAD,
  CATEGORY_ICONS,
  CATEGORY_ICON_STYLES,
} from './notificationTypes';
import {
  NotificationCategoryBadge,
  NotificationReadBadge,
  NotificationPrimaryButton,
  NotificationSecondaryButton,
} from './notificationUi';
import { stopInteraction } from '../shared/buttons/PrimaryButton';

interface NotificationCardProps {
  item: NotificationItem;
  selected?: boolean;
  onSelect?: () => void;
  onMarkRead?: () => void;
  onDelete?: () => void;
}

export const NotificationCard = memo(function NotificationCard({
  item,
  selected = false,
  onSelect,
  onMarkRead,
  onDelete,
}: NotificationCardProps) {
  const Icon = CATEGORY_ICONS[item.category];
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

  const surfaceClass = item.read ? CARD_READ : CARD_UNREAD;

  return (
    <article
      aria-label={`${item.read ? 'Read' : 'Unread'} notification: ${item.title}`}
      className={`rounded-xl border p-4 shadow-sm sm:p-5 ${CARD_HOVER} ${
        selected ? CARD_SELECTED : surfaceClass
      }`}
    >
      <div
        role="button"
        tabIndex={isSelectable ? 0 : -1}
        aria-selected={selected}
        aria-label={`Select notification: ${item.title}`}
        onClick={handleSelect}
        onKeyDown={handleSelectKeyDown}
        className="flex cursor-pointer gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 sm:gap-4"
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${CATEGORY_ICON_STYLES[item.category]}`}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3
              className={`text-sm text-navy-900 dark:text-white sm:text-base ${
                item.read ? 'font-semibold' : 'font-bold'
              }`}
            >
              {item.title}
            </h3>
            <time
              dateTime={item.timestamp}
              className="shrink-0 text-xs tabular-nums text-gray-500 dark:text-gray-400"
            >
              {item.displayTime}
            </time>
          </div>

          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.message}</p>

          <div className="flex flex-wrap items-center gap-2">
            <NotificationCategoryBadge category={item.category} />
            <NotificationReadBadge read={item.read} />
          </div>
        </div>
      </div>

      <div
        className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 pt-3 dark:border-navy-700"
        onClick={stopInteraction}
        onKeyDown={stopInteraction}
        onMouseDown={stopInteraction}
      >
        <NotificationSecondaryButton interactive={!item.read} onClick={onMarkRead}>
          Mark as Read
        </NotificationSecondaryButton>
        <NotificationSecondaryButton interactive onClick={onDelete}>
          Delete
        </NotificationSecondaryButton>
        <NotificationPrimaryButton>View</NotificationPrimaryButton>
      </div>
    </article>
  );
});

export default NotificationCard;
