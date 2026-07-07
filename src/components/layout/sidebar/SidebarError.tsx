import { memo } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import type { SidebarErrorProps } from './sidebar.types';

export const SidebarError = memo(function SidebarError({
  darkMode,
  message = 'Unable to load navigation.',
  onRetry,
}: SidebarErrorProps) {
  return (
    <div
      role="alert"
      className={`mx-3 flex flex-col items-center rounded-xl border px-4 py-8 text-center ${
        darkMode ? 'border-red-500/30 bg-red-500/10' : 'border-red-200 bg-red-50'
      }`}
    >
      <AlertCircle className="mb-3 h-8 w-8 text-red-400" aria-hidden="true" />
      <p className={`text-sm font-medium ${darkMode ? 'text-red-300' : 'text-red-700'}`}>{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Retry
        </button>
      ) : null}
    </div>
  );
});

export default SidebarError;
