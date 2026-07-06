import type { ReactNode } from 'react';
import { PrimaryButton } from '../shared/buttons/PrimaryButton';
import { SecondaryButton } from '../shared/buttons/SecondaryButton';

export function ReadingPrimaryButton({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-col items-stretch gap-1 sm:w-auto">
      <PrimaryButton disabled placeholder>
        {children}
      </PrimaryButton>
      <span className="text-center text-[11px] leading-tight text-gray-500 dark:text-gray-400">
        Reader Coming Soon
      </span>
    </div>
  );
}

export function ReadingSecondaryButton({ children }: { children: ReactNode }) {
  return <SecondaryButton>{children}</SecondaryButton>;
}
