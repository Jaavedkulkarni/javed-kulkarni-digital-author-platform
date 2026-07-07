import { memo } from 'react';
import { computePasswordStrength } from '../create-user.schema';
import type { PasswordStrengthLevel } from '../create-user.types';

const LEVEL_STYLES: Record<PasswordStrengthLevel, string> = {
  weak: 'bg-red-500',
  fair: 'bg-amber-500',
  good: 'bg-sky-500',
  strong: 'bg-emerald-500',
};

const LEVEL_WIDTH: Record<PasswordStrengthLevel, string> = {
  weak: 'w-1/4',
  fair: 'w-2/4',
  good: 'w-3/4',
  strong: 'w-full',
};

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength = memo(function PasswordStrength({ password }: PasswordStrengthProps) {
  const result = computePasswordStrength(password);
  const { checks } = result;

  if (!password) {
    return (
      <p className="text-xs text-gray-500" aria-live="polite">
        Enter a password to see strength.
      </p>
    );
  }

  return (
    <div className="space-y-2" aria-live="polite">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-gray-400">Password strength</span>
        <span className="text-xs font-medium text-gray-300">{result.label}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-navy-700">
        <div
          className={`h-full rounded-full transition-all duration-300 ${LEVEL_STYLES[result.level]} ${LEVEL_WIDTH[result.level]}`}
          role="meter"
          aria-valuenow={result.score}
          aria-valuemin={0}
          aria-valuemax={5}
          aria-label={`Password strength: ${result.label}`}
        />
      </div>
      <ul className="grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
        <CheckItem met={checks.minLength} label="12+ characters" />
        <CheckItem met={checks.uppercase} label="Uppercase letter" />
        <CheckItem met={checks.lowercase} label="Lowercase letter" />
        <CheckItem met={checks.number} label="Number" />
        <CheckItem met={checks.special} label="Special character" />
      </ul>
    </div>
  );
});

function CheckItem({ met, label }: { met: boolean; label: string }) {
  return (
    <li className={met ? 'text-emerald-400' : 'text-gray-500'}>
      {met ? '✓' : '○'} {label}
    </li>
  );
}

export default PasswordStrength;
