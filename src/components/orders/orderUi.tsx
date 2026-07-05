import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { memo } from 'react';

export const MONO_ID_CLASS = 'font-mono text-xs tracking-tight text-navy-800 dark:text-gray-200';

const BRAND_BUTTON =
  'inline-flex w-full min-h-10 items-center justify-center rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 sm:w-auto';

const OUTLINE_BUTTON =
  'inline-flex w-full min-h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-navy-800 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-navy-600 dark:bg-navy-900/50 dark:text-gray-200 dark:hover:bg-navy-800 sm:w-auto';

const GHOST_BUTTON =
  'inline-flex w-full min-h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-navy-900/60 sm:w-auto';

export const BADGE_BASE =
  'inline-flex min-h-6 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium leading-none';

export function stopOrderInteraction(event: MouseEvent | KeyboardEvent) {
  event.stopPropagation();
}

export const OrderPrimaryButton = memo(function OrderPrimaryButton({
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
        className={BRAND_BUTTON}
        onClick={(e) => {
          stopOrderInteraction(e);
          onClick();
        }}
        onMouseDown={stopOrderInteraction}
        onKeyDown={stopOrderInteraction}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      title="Coming soon"
      className={`${BRAND_BUTTON} cursor-default opacity-90`}
    >
      {children}
    </button>
  );
});

export const OrderDrawerButton = memo(function OrderDrawerButton({
  children,
  variant = 'outline',
}: {
  children: ReactNode;
  variant?: 'outline' | 'ghost';
}) {
  const className = variant === 'ghost' ? GHOST_BUTTON : OUTLINE_BUTTON;
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      title="Coming soon"
      className={`${className} cursor-default opacity-90`}
    >
      {children}
    </button>
  );
});

export const OrderStatusBadge = memo(function OrderStatusBadge({
  label,
  styleClass,
  type,
}: {
  label: string;
  styleClass: string;
  type?: 'payment' | 'order';
}) {
  const ariaLabel = type === 'payment' ? `Payment status: ${label}` : type === 'order' ? `Order status: ${label}` : label;

  return (
    <span className={`${BADGE_BASE} ${styleClass}`} aria-label={ariaLabel}>
      {label}
    </span>
  );
});
