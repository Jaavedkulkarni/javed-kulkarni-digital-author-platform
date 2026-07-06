import { memo } from 'react';

interface SortOption<T extends string = string> {
  value: T;
  label: string;
}

interface SortDropdownProps<T extends string = string> {
  id: string;
  label: string;
  options: SortOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  disabled?: boolean;
}

export const SortDropdown = memo(function SortDropdown<T extends string = string>({
  id,
  label,
  options,
  value,
  defaultValue,
  onChange,
  disabled = false,
}: SortDropdownProps<T>) {
  const activeClass =
    'h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-navy-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 dark:border-navy-700 dark:bg-navy-900/60 dark:text-gray-200';

  const disabledClass =
    'h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-navy-700 dark:bg-navy-900/60 dark:text-gray-400';

  return (
    <div className="min-w-[10rem] flex-1 sm:flex-none">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={disabled ? undefined : value}
        defaultValue={disabled ? defaultValue : undefined}
        onChange={disabled ? undefined : (e) => onChange?.(e.target.value as T)}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        className={disabled ? disabledClass : activeClass}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}) as <T extends string = string>(props: SortDropdownProps<T>) => JSX.Element;

export default SortDropdown;
