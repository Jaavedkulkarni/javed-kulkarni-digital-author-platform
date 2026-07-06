import { memo } from 'react';
import { AlertCircle } from 'lucide-react';

interface AuthErrorBannerProps {
  message: string;
}

export const AuthErrorBanner = memo(function AuthErrorBanner({ message }: AuthErrorBannerProps) {
  return (
    <div
      className="mb-4 flex items-center gap-3 rounded-lg bg-red-500/20 p-3 text-red-400"
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
      <p className="text-sm">{message}</p>
    </div>
  );
});

export default AuthErrorBanner;
