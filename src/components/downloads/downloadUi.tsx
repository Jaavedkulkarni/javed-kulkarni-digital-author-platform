import type { ReactNode } from 'react';

const BRAND_BUTTON =
  'inline-flex w-full min-h-10 items-center justify-center rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 sm:w-auto';

const OUTLINE_BUTTON =
  'inline-flex w-full min-h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-navy-800 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-navy-600 dark:bg-navy-900/50 dark:text-gray-200 dark:hover:bg-navy-800 sm:w-auto';

export const BADGE_BASE =
  'inline-flex min-h-6 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium leading-none';

export function DownloadPrimaryButton({ children }: { children: ReactNode }) {
  return (
    <button type="button" disabled aria-disabled="true" className={BRAND_BUTTON}>
      {children}
    </button>
  );
}

export function DownloadSecondaryButton({ children }: { children: ReactNode }) {
  return (
    <button type="button" disabled aria-disabled="true" className={OUTLINE_BUTTON}>
      {children}
    </button>
  );
}

export function DownloadStatusBadge({ label, styleClass }: { label: string; styleClass: string }) {
  return <span className={`${BADGE_BASE} ${styleClass}`}>{label}</span>;
}
