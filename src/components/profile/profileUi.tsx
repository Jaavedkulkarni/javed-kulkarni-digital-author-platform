import type { ReactNode } from 'react';
import { memo } from 'react';
import { PrimaryButton } from '../shared/buttons/PrimaryButton';
import { SecondaryButton } from '../shared/buttons/SecondaryButton';
import { StatusBadge } from '../shared/badges/StatusBadge';

export const ProfilePrimaryButton = memo(function ProfilePrimaryButton({ children }: { children: ReactNode }) {
  return (
    <PrimaryButton disabled placeholder>
      {children}
    </PrimaryButton>
  );
});

export const ProfileSecondaryButton = memo(function ProfileSecondaryButton({ children }: { children: ReactNode }) {
  return <SecondaryButton placeholder>{children}</SecondaryButton>;
});

export const ProfileStatusBadge = memo(function ProfileStatusBadge({
  label,
  styleClass,
  ariaLabel,
}: {
  label: string;
  styleClass: string;
  ariaLabel?: string;
}) {
  return <StatusBadge label={label} styleClass={styleClass} ariaLabel={ariaLabel ?? label} />;
});

interface ProfileInfoRowProps {
  label: string;
  value: string;
}

export const ProfileInfoRow = memo(function ProfileInfoRow({ label, value }: ProfileInfoRowProps) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="text-sm text-navy-900 dark:text-white">{value}</dd>
    </div>
  );
});

export default ProfileInfoRow;
