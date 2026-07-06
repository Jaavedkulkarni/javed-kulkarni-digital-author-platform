import type { ReactNode } from 'react';
import { PrimaryButton } from '../shared/buttons/PrimaryButton';
import { SecondaryButton } from '../shared/buttons/SecondaryButton';
import { DangerButton } from '../shared/buttons/DangerButton';
import { StatusBadge, BADGE_BASE } from '../shared/badges/StatusBadge';

export { BADGE_BASE };

export function DownloadPrimaryButton({ children }: { children: ReactNode }) {
  return <PrimaryButton disabled>{children}</PrimaryButton>;
}

export function DownloadSecondaryButton({ children }: { children: ReactNode }) {
  return <SecondaryButton>{children}</SecondaryButton>;
}

export function DownloadDangerButton({ children }: { children: ReactNode }) {
  return <DangerButton>{children}</DangerButton>;
}

export function DownloadStatusBadge({ label, styleClass }: { label: string; styleClass: string }) {
  return <StatusBadge label={label} styleClass={styleClass} />;
}
