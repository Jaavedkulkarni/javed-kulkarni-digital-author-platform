import type { BookActionLabel } from './bookTypes';

interface BookActionButtonProps {
  label?: BookActionLabel;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
}

export function BookActionButton({
  label = 'Continue Reading',
  disabled = true,
  loading = false,
  fullWidth = true,
  onClick,
  className = '',
}: BookActionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50 ${
        fullWidth ? 'w-full' : ''
      } ${loading ? 'animate-pulse' : ''} ${className}`}
    >
      {loading ? 'Loading...' : label}
    </button>
  );
}

export default BookActionButton;
