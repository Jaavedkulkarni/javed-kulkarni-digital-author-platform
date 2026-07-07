import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { memo } from 'react';

type ButtonPadding = 'sm' | 'md';
type ButtonSize = 'default' | 'lg';

const PADDING_CLASS: Record<ButtonPadding, string> = {
  sm: 'py-2',
  md: 'py-2.5',
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  default: 'px-4',
  lg: 'px-6',
};

const BRAND_BASE =
  'inline-flex w-full min-h-10 items-center justify-center rounded-lg bg-brand text-sm font-medium text-white transition-colors hover:bg-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 sm:w-auto';

const OUTLINE_BASE =
  'inline-flex w-full min-h-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-navy-800 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-navy-600 dark:bg-navy-900/50 dark:text-gray-200 dark:hover:bg-navy-800 sm:w-auto';

const DANGER_BASE =
  'inline-flex w-full min-h-10 items-center justify-center rounded-lg border border-rose-200 bg-white text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900/50 dark:bg-navy-900/50 dark:text-rose-300 dark:hover:bg-rose-950/30 sm:w-auto';

const GHOST_BASE =
  'inline-flex w-full min-h-10 items-center justify-center rounded-lg text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-navy-900/60 sm:w-auto';

function stopInteraction(event: MouseEvent | KeyboardEvent) {
  event.stopPropagation();
}

interface SharedButtonProps {
  children: ReactNode;
  disabled?: boolean;
  placeholder?: boolean;
  interactive?: boolean;
  padding?: ButtonPadding;
  size?: ButtonSize;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (event: MouseEvent<HTMLButtonElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
  title?: string;
  type?: 'button' | 'submit';
}

function buildButtonClass(base: string, padding: ButtonPadding, size: ButtonSize, extra?: string) {
  const textSize = size === 'lg' ? 'text-base' : 'text-sm';
  const minH = size === 'lg' ? 'min-h-11' : 'min-h-10';
  return `${base.replace('min-h-10', minH)} ${SIZE_CLASS[size]} ${PADDING_CLASS[padding]} ${textSize} ${extra ?? ''}`;
}

export const PrimaryButton = memo(function PrimaryButton({
  children,
  disabled = false,
  placeholder = false,
  interactive = false,
  padding = 'sm',
  size = 'default',
  className = '',
  onClick,
  onMouseDown,
  onKeyDown,
  title,
  type = 'button',
}: SharedButtonProps) {
  const isDisabled = disabled || (placeholder && !interactive);
  const classes = buildButtonClass(
    BRAND_BASE,
    padding,
    size,
    `${placeholder && !interactive ? 'cursor-default opacity-90' : ''} ${isDisabled && !placeholder ? 'disabled:cursor-not-allowed disabled:opacity-50' : ''} ${className}`
  );

  return (
    <button
      type={type}
      disabled={isDisabled && !interactive}
      aria-disabled={isDisabled && !interactive ? true : undefined}
      title={title ?? (placeholder && !interactive ? 'Coming soon' : undefined)}
      className={classes}
      onClick={
        interactive
          ? (e) => {
              stopInteraction(e);
              onClick?.(e);
            }
          : placeholder
            ? (e) => {
                e.preventDefault();
                stopInteraction(e);
              }
            : undefined
      }
      onMouseDown={interactive || placeholder ? (e) => { stopInteraction(e); onMouseDown?.(e); } : undefined}
      onKeyDown={interactive || placeholder ? (e) => { stopInteraction(e); onKeyDown?.(e); } : undefined}
    >
      {children}
    </button>
  );
});

export const SecondaryButton = memo(function SecondaryButton({
  children,
  disabled = true,
  placeholder = false,
  interactive = false,
  padding = 'sm',
  size = 'default',
  className = '',
  title,
  onClick,
}: Omit<SharedButtonProps, 'onMouseDown' | 'onKeyDown'>) {
  const isDisabled = disabled || (placeholder && !interactive);
  const classes = buildButtonClass(
    OUTLINE_BASE,
    padding,
    size,
    `${placeholder && !interactive ? 'cursor-default opacity-90' : ''} ${className}`
  );

  return (
    <button
      type="button"
      disabled={isDisabled && !interactive}
      aria-disabled={isDisabled && !interactive ? true : undefined}
      title={title ?? (placeholder && !interactive ? 'Coming soon' : undefined)}
      className={classes}
      onClick={
        interactive
          ? (e) => {
              stopInteraction(e);
              onClick?.(e);
            }
          : placeholder
            ? (e) => {
                e.preventDefault();
                stopInteraction(e);
              }
            : undefined
      }
      onMouseDown={interactive || placeholder ? stopInteraction : undefined}
      onKeyDown={interactive || placeholder ? stopInteraction : undefined}
    >
      {children}
    </button>
  );
});

export const DangerButton = memo(function DangerButton({
  children,
  disabled = true,
  padding = 'sm',
  className = '',
}: Pick<SharedButtonProps, 'children' | 'disabled' | 'padding' | 'className'>) {
  return (
    <button type="button" disabled={disabled} aria-disabled={disabled} className={`${buildButtonClass(DANGER_BASE, padding, 'default')} ${className}`}>
      {children}
    </button>
  );
});

export const GhostButton = memo(function GhostButton({
  children,
  disabled = true,
  placeholder = false,
  padding = 'sm',
  className = '',
}: Pick<SharedButtonProps, 'children' | 'disabled' | 'placeholder' | 'padding' | 'className'>) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-disabled={disabled}
      title={placeholder ? 'Coming soon' : undefined}
      className={`${buildButtonClass(GHOST_BASE, padding, 'default', placeholder ? 'cursor-default opacity-90' : '')} ${className}`}
    >
      {children}
    </button>
  );
});

export { stopInteraction };
