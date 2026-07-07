import { memo } from 'react';
import { ShieldOff } from 'lucide-react';

interface UnauthorizedProps {
  title?: string;
  message?: string;
  className?: string;
}

export const Unauthorized = memo(function Unauthorized({
  title = 'Sign in required',
  message = 'You must be signed in to access this content.',
  className,
}: UnauthorizedProps) {
  return (
    <div
      className={`flex min-h-[40vh] flex-col items-center justify-center px-6 text-center ${className ?? ''}`}
      role="alert"
      aria-live="polite"
    >
      <ShieldOff className="mb-4 h-10 w-10 text-amber-300" aria-hidden />
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-gray-400">{message}</p>
      <p className="mt-3 text-xs text-gray-500">Error 401 — Unauthenticated</p>
    </div>
  );
});

export default Unauthorized;
