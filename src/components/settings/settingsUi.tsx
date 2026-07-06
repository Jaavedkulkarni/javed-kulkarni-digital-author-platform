import type { ReactNode } from 'react';
import { memo } from 'react';
import { PrimaryButton } from '../shared/buttons/PrimaryButton';
import { SecondaryButton } from '../shared/buttons/PrimaryButton';
import { DangerButton } from '../shared/buttons/PrimaryButton';
import {
  LABEL_CLASS,
  RADIO_IDLE_CLASS,
  RADIO_LABEL_CLASS,
  RADIO_SELECTED_CLASS,
  SELECT_CLASS,
} from './settingsTypes';

export const SettingsPrimaryButton = memo(function SettingsPrimaryButton({
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

export const SettingsSecondaryButton = memo(function SettingsSecondaryButton({
  children,
  onClick,
  interactive = false,
  placeholder = false,
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  interactive?: boolean;
  placeholder?: boolean;
  title?: string;
}) {
  if (interactive && onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={title}
        className="inline-flex w-full min-h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-navy-800 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 dark:border-navy-600 dark:bg-navy-900/50 dark:text-gray-200 dark:hover:bg-navy-800 sm:w-auto"
      >
        {children}
      </button>
    );
  }

  return (
    <SecondaryButton placeholder={placeholder} title={title}>
      {children}
    </SecondaryButton>
  );
});

export const SettingsDangerButton = memo(function SettingsDangerButton({
  children,
  placeholder = true,
  title,
}: {
  children: ReactNode;
  placeholder?: boolean;
  title?: string;
}) {
  if (placeholder) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        title={title ?? 'Coming soon'}
        className="inline-flex w-full min-h-10 cursor-not-allowed items-center justify-center rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-700 opacity-50 dark:border-rose-900/50 dark:bg-navy-900/50 dark:text-rose-300 sm:w-auto"
      >
        {children}
      </button>
    );
  }

  return <DangerButton disabled={false}>{children}</DangerButton>;
});

interface SettingsToggleRowProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const SettingsToggleRow = memo(function SettingsToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
}: SettingsToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm font-medium text-navy-900 dark:text-white">
          {label}
        </label>
        {description ? (
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{description}</p>
        ) : null}
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-brand focus:ring-gold-400/50 dark:border-navy-600"
      />
    </div>
  );
});

interface SettingsSelectRowProps {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}

export const SettingsSelectRow = memo(function SettingsSelectRow({
  id,
  label,
  value,
  options,
  onChange,
}: SettingsSelectRowProps) {
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={SELECT_CLASS}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
});

interface SettingsInfoRowProps {
  label: string;
  value: string;
}

export const SettingsInfoRow = memo(function SettingsInfoRow({ label, value }: SettingsInfoRowProps) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <dt className={LABEL_CLASS}>{label}</dt>
      <dd className="text-sm text-navy-900 dark:text-white">{value}</dd>
    </div>
  );
});

interface SettingsRadioOption {
  value: string;
  label: string;
}

interface SettingsRadioGroupProps {
  name: string;
  label: string;
  options: readonly SettingsRadioOption[];
  selected: string;
  onChange: (value: string) => void;
}

export const SettingsRadioGroup = memo(function SettingsRadioGroup({
  name,
  label,
  options,
  selected,
  onChange,
}: SettingsRadioGroupProps) {
  return (
    <fieldset>
      <legend className={`${LABEL_CLASS} mb-2`}>{label}</legend>
      <div className="flex flex-wrap gap-3" role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const isSelected = option.value === selected;
          return (
            <label
              key={option.value}
              className={`${RADIO_LABEL_CLASS} ${isSelected ? RADIO_SELECTED_CLASS : RADIO_IDLE_CLASS}`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="text-brand focus:ring-gold-400/50"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
});
