import { memo } from 'react';
import { PrimaryButton } from '../shared/buttons/PrimaryButton';
import { SecondaryButton } from '../shared/buttons/SecondaryButton';

export const WishlistPrimaryButton = memo(function WishlistPrimaryButton({
  placeholderLabel,
}: {
  placeholderLabel: string;
}) {
  return (
    <PrimaryButton placeholder padding="md">
      {placeholderLabel}
    </PrimaryButton>
  );
});

export const WishlistSecondaryButton = memo(function WishlistSecondaryButton({
  placeholderLabel,
}: {
  placeholderLabel: string;
}) {
  return (
    <SecondaryButton placeholder padding="md">
      {placeholderLabel}
    </SecondaryButton>
  );
});

export const WishlistDiscountBadge = memo(function WishlistDiscountBadge({ label }: { label?: string }) {
  if (!label) return null;
  return (
    <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold leading-none text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-300">
      {label}
    </span>
  );
});
