import { memo } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface AuthSuccessBannerProps {
  message: string;
}

export const AuthSuccessBanner = memo(function AuthSuccessBanner({ message }: AuthSuccessBannerProps) {
  return (
    <div
      className="mb-4 flex items-center gap-3 rounded-lg bg-emerald-500/20 p-3 text-emerald-300"
      role="status"
      aria-live="polite"
    >
      <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
      <p className="text-sm">{message}</p>
    </div>
  );
});

export default AuthSuccessBanner;
