import { memo, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { PrimaryButton, stopInteraction } from '../shared/buttons/PrimaryButton';
import { SecondaryButton } from '../shared/buttons/SecondaryButton';
import { StatusBadge } from '../shared/badges/StatusBadge';
import type { NotificationCategory } from './notificationTypes';
import { CATEGORY_STYLES, NOTIFICATION_CATEGORY_LABELS } from './notificationTypes';

const READ_BADGE =
  'border-gray-200 bg-gray-100 text-gray-600 dark:border-navy-600 dark:bg-navy-700 dark:text-gray-400';

const UNREAD_BADGE =
  'border-brand/30 bg-brand/10 text-brand dark:border-gold-500/30 dark:bg-gold-500/15 dark:text-gold-300';

const INTERACTIVE_SECONDARY =
  'inline-flex w-full min-h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-navy-800 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 dark:border-navy-600 dark:bg-navy-900/50 dark:text-gray-200 dark:hover:bg-navy-800 sm:w-auto';

function stopCardInteraction(event: MouseEvent | KeyboardEvent) {
  stopInteraction(event);
}

export const NotificationPrimaryButton = memo(function NotificationPrimaryButton({
  children,
  onClick,
  interactive = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  interactive?: boolean;
}) {
  return (
    <PrimaryButton
      interactive={interactive}
      onClick={
        interactive && onClick
          ? (event) => {
              stopCardInteraction(event);
              onClick();
            }
          : undefined
      }
      placeholder={!interactive}
    >
      {children}
    </PrimaryButton>
  );
});

export const NotificationSecondaryButton = memo(function NotificationSecondaryButton({
  children,
  onClick,
  interactive = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  interactive?: boolean;
}) {
  if (interactive && onClick) {
    return (
      <button
        type="button"
        onClick={(event) => {
          stopCardInteraction(event);
          onClick();
        }}
        className={INTERACTIVE_SECONDARY}
      >
        {children}
      </button>
    );
  }

  return <SecondaryButton placeholder>{children}</SecondaryButton>;
});

export const NotificationCategoryBadge = memo(function NotificationCategoryBadge({
  category,
}: {
  category: NotificationCategory;
}) {
  return (
    <StatusBadge
      label={NOTIFICATION_CATEGORY_LABELS[category]}
      styleClass={CATEGORY_STYLES[category]}
      ariaLabel={`Category: ${NOTIFICATION_CATEGORY_LABELS[category]}`}
    />
  );
});

export const NotificationReadBadge = memo(function NotificationReadBadge({ read }: { read: boolean }) {
  return (
    <StatusBadge
      label={read ? 'Read' : 'Unread'}
      styleClass={read ? READ_BADGE : UNREAD_BADGE}
      ariaLabel={read ? 'Notification read' : 'Notification unread'}
    />
  );
});
