import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

interface BookCoverPlaceholderProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function BookCoverPlaceholder({ size = 'md', label = 'Book cover' }: BookCoverPlaceholderProps) {
  const sizeClass =
    size === 'sm' ? 'h-16 w-12' : size === 'lg' ? 'h-32 w-24 sm:h-36 sm:w-28' : 'h-24 w-16';

  return (
    <div
      role="img"
      aria-label={label}
      className={`flex flex-shrink-0 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-100 dark:border-navy-600 dark:bg-navy-900/60 ${sizeClass}`}
    >
      <BookOpen
        className={`text-gray-400 dark:text-gray-500 ${size === 'lg' ? 'h-8 w-8' : 'h-5 w-5'}`}
        aria-hidden="true"
      />
    </div>
  );
}

export function DashboardEmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500 dark:border-navy-600 dark:bg-navy-900/40 dark:text-gray-400">
      {message}
    </p>
  );
}

export function DashboardMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-3 dark:border-navy-700 dark:bg-navy-900/50">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-navy-900 dark:text-white">{value}</p>
    </div>
  );
}

export function DashboardActionButton({
  children,
  disabled = true,
  onClick,
  type = 'button',
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex w-full items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
    >
      {children}
    </button>
  );
}

export function DashboardBrandLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="inline-flex w-full items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-gold-400/50 sm:w-auto"
    >
      {children}
    </Link>
  );
}
