import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

const BRAND_BUTTON_BASE =
  'inline-flex w-full items-center justify-center rounded-lg bg-brand font-medium text-white transition-colors hover:bg-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto';

const BRAND_BUTTON_SIZES = {
  default: 'min-h-10 px-4 py-2 text-sm',
  lg: 'min-h-11 px-6 py-2.5 text-base',
} as const;

export const OUTLINE_BUTTON_CLASS =
  'inline-flex w-full min-h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-navy-800 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-navy-600 dark:bg-navy-900/50 dark:text-gray-200 dark:hover:bg-navy-800 sm:w-auto';

const OUTLINE_BUTTON =
  'inline-flex w-full min-h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-navy-800 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-navy-600 dark:bg-navy-900/50 dark:text-gray-200 dark:hover:bg-navy-800 sm:w-auto';

export const MEMBERSHIP_BADGE_BASE =
  'inline-flex min-h-6 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium leading-none';

export function MembershipPrimaryButton({
  children,
  disabled = true,
  size = 'default',
}: {
  children: ReactNode;
  disabled?: boolean;
  size?: keyof typeof BRAND_BUTTON_SIZES;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-disabled={disabled}
      className={`${BRAND_BUTTON_BASE} ${BRAND_BUTTON_SIZES[size]}`}
    >
      {children}
    </button>
  );
}

export function MembershipOutlineButton({ children }: { children: ReactNode }) {
  return (
    <button type="button" disabled aria-disabled="true" className={OUTLINE_BUTTON}>
      {children}
    </button>
  );
}

export function MembershipBrowseLink({ children }: { children: ReactNode }) {
  return (
    <Link to="/#books" className={OUTLINE_BUTTON_CLASS}>
      {children}
    </Link>
  );
}

export function MembershipBadge({ label, styleClass }: { label: string; styleClass: string }) {
  return <span className={`${MEMBERSHIP_BADGE_BASE} ${styleClass}`}>{label}</span>;
}
