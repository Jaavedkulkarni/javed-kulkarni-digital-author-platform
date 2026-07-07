import { memo } from 'react';
import { Lock } from 'lucide-react';

interface ForbiddenProps {
  title?: string;
  message?: string;
  className?: string;
}

export const Forbidden = memo(function Forbidden({
  title = 'Access denied',
  message = 'You do not have permission to access this content.',
  className,
}: ForbiddenProps) {
  return (
    <div
      className={`flex min-h-[40vh] flex-col items-center justify-center px-6 text-center ${className ?? ''}`}
      role="alert"
      aria-live="polite"
    >
      <Lock className="mb-4 h-10 w-10 text-rose-300" aria-hidden />
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-gray-400">{message}</p>
      <p className="mt-3 text-xs text-gray-500">Error 403 — Unauthorized</p>
    </div>
  );
});

export default Forbidden;
