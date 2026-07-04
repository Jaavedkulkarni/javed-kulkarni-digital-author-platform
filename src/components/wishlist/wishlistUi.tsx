import { memo } from 'react';
import type { ReactNode, MouseEvent, KeyboardEvent } from 'react';

const BRAND_BUTTON =
  'inline-flex w-full min-h-10 items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 sm:w-auto';

const OUTLINE_BUTTON =
  'inline-flex w-full min-h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-navy-800 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 dark:border-navy-600 dark:bg-navy-900/50 dark:text-gray-200 dark:hover:bg-navy-800 sm:w-auto';

function stopInteraction(event: MouseEvent | KeyboardEvent) {
  event.stopPropagation();
}

function PlaceholderButton({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <button
      type="button"
      aria-disabled="true"
      title="Coming soon"
      className={`${className} cursor-default opacity-90`}
      onClick={(e) => {
        e.preventDefault();
        stopInteraction(e);
      }}
      onMouseDown={stopInteraction}
      onKeyDown={stopInteraction}
    >
      {children}
    </button>
  );
}

export const WishlistPrimaryButton = memo(function WishlistPrimaryButton({
  placeholderLabel,
}: {
  placeholderLabel: string;
}) {
  return <PlaceholderButton className={BRAND_BUTTON}>{placeholderLabel}</PlaceholderButton>;
});

export const WishlistSecondaryButton = memo(function WishlistSecondaryButton({
  placeholderLabel,
}: {
  placeholderLabel: string;
}) {
  return <PlaceholderButton className={OUTLINE_BUTTON}>{placeholderLabel}</PlaceholderButton>;
});

export const WishlistDiscountBadge = memo(function WishlistDiscountBadge({ label }: { label?: string }) {
  if (!label) return null;
  return (
    <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold leading-none text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-300">
      {label}
    </span>
  );
});
