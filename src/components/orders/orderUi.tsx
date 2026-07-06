import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { memo } from 'react';
import { PrimaryButton, stopInteraction } from '../shared/buttons/PrimaryButton';
import { SecondaryButton } from '../shared/buttons/SecondaryButton';
import { GhostButton } from '../shared/buttons/DangerButton';
import { StatusBadge, BADGE_BASE } from '../shared/badges/StatusBadge';

export const MONO_ID_CLASS = 'font-mono text-xs tracking-tight text-navy-800 dark:text-gray-200';

export { BADGE_BASE };

export function stopOrderInteraction(event: MouseEvent | KeyboardEvent) {
  stopInteraction(event);
}

export const OrderPrimaryButton = memo(function OrderPrimaryButton({
  children,
  onClick,
  interactive = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  interactive?: boolean;
}) {
  return (
    <PrimaryButton interactive={interactive} onClick={onClick} placeholder={!interactive}>
      {children}
    </PrimaryButton>
  );
});

export const OrderDrawerButton = memo(function OrderDrawerButton({
  children,
  variant = 'outline',
}: {
  children: ReactNode;
  variant?: 'outline' | 'ghost';
}) {
  if (variant === 'ghost') {
    return <GhostButton placeholder>{children}</GhostButton>;
  }

  return <SecondaryButton placeholder>{children}</SecondaryButton>;
});

export const OrderStatusBadge = memo(function OrderStatusBadge({
  label,
  styleClass,
  type,
}: {
  label: string;
  styleClass: string;
  type?: 'payment' | 'order';
}) {
  const ariaLabel =
    type === 'payment' ? `Payment status: ${label}` : type === 'order' ? `Order status: ${label}` : label;

  return <StatusBadge label={label} styleClass={styleClass} ariaLabel={ariaLabel} />;
});
