import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../shared/buttons/PrimaryButton';
import { SecondaryButton } from '../shared/buttons/SecondaryButton';
import { StatusBadge, BADGE_BASE } from '../shared/badges/StatusBadge';

export const MEMBERSHIP_BADGE_BASE = BADGE_BASE;

export const OUTLINE_BUTTON_CLASS =
  'inline-flex w-full min-h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-navy-800 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-navy-600 dark:bg-navy-900/50 dark:text-gray-200 dark:hover:bg-navy-800 sm:w-auto';

export function MembershipPrimaryButton({
  children,
  disabled = true,
  size = 'default',
}: {
  children: ReactNode;
  disabled?: boolean;
  size?: 'default' | 'lg';
}) {
  return (
    <PrimaryButton disabled={disabled} size={size} padding={size === 'lg' ? 'md' : 'sm'}>
      {children}
    </PrimaryButton>
  );
}

export function MembershipOutlineButton({ children }: { children: ReactNode }) {
  return <SecondaryButton>{children}</SecondaryButton>;
}

export function MembershipBrowseLink({ children }: { children: ReactNode }) {
  return (
    <Link to="/#books" className={OUTLINE_BUTTON_CLASS}>
      {children}
    </Link>
  );
}

export function MembershipBadge({ label, styleClass }: { label: string; styleClass: string }) {
  return <StatusBadge label={label} styleClass={styleClass} />;
}
