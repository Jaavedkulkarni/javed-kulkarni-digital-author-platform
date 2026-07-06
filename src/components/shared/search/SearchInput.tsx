import { memo } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  id: string;
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export const SearchInput = memo(function SearchInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
}: SearchInputProps) {
  const activeClass =
    'h-10 w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-navy-900 placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 dark:border-navy-700 dark:bg-navy-900/60 dark:text-white dark:placeholder:text-gray-500';

  const disabledClass =
    'h-10 w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-500 placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed dark:border-navy-700 dark:bg-navy-900/60 dark:text-gray-400 dark:placeholder:text-gray-500';

  return (
    <div className="relative min-w-0 flex-1 lg:max-w-md">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        aria-hidden="true"
      />
      <input
        id={id}
        type="search"
        placeholder={placeholder}
        value={disabled ? undefined : value}
        onChange={disabled ? undefined : (e) => onChange?.(e.target.value)}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        className={disabled ? disabledClass : activeClass}
      />
    </div>
  );
});

export default SearchInput;
