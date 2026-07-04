import type { ReactNode } from 'react';

const BRAND_BUTTON =
  'inline-flex w-full items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto';

const OUTLINE_BUTTON =
  'inline-flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-navy-800 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-navy-600 dark:bg-navy-900/50 dark:text-gray-200 dark:hover:bg-navy-800 sm:w-auto';

export function WishlistPrimaryButton({
  children,
  disabled = true,
}: {
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button type="button" disabled={disabled} aria-disabled={disabled} className={BRAND_BUTTON}>
      {children}
    </button>
  );
}

export function WishlistSecondaryButton({
  children,
  disabled = true,
}: {
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button type="button" disabled={disabled} aria-disabled={disabled} className={OUTLINE_BUTTON}>
      {children}
    </button>
  );
}

export function WishlistDiscountBadge({ label }: { label?: string }) {
  if (!label) return null;
  return (
    <span className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-300">
      {label}
    </span>
  );
}
