import { memo, useCallback, useState } from 'react';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { generateSecurePassword } from '../create-user.schema';

interface PasswordGeneratorProps {
  onGenerate: (password: string) => void;
  disabled?: boolean;
}

export const PasswordGenerator = memo(function PasswordGenerator({
  onGenerate,
  disabled = false,
}: PasswordGeneratorProps) {
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    const password = generateSecurePassword(16);
    setLastGenerated(password);
    setCopied(false);
    onGenerate(password);
  }, [onGenerate]);

  const handleCopy = useCallback(async () => {
    if (!lastGenerated) return;
    try {
      await navigator.clipboard.writeText(lastGenerated);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [lastGenerated]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={disabled}
        className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-navy-600 bg-navy-900/60 px-3 text-xs font-medium text-gray-200 transition-colors hover:bg-navy-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
        Generate Password
      </button>
      {lastGenerated ? (
        <button
          type="button"
          onClick={() => void handleCopy()}
          disabled={disabled}
          className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-navy-600 bg-navy-900/60 px-3 text-xs font-medium text-gray-200 transition-colors hover:bg-navy-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {copied ? 'Copied' : 'Copy password'}
        </button>
      ) : null}
    </div>
  );
});

export default PasswordGenerator;
