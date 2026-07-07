import { memo } from 'react';
import { Search } from 'lucide-react';
import type { SidebarSearchProps } from './sidebar.types';

export const SidebarSearch = memo(function SidebarSearch({
  darkMode,
  collapsed,
  value,
  onChange,
}: SidebarSearchProps) {
  if (collapsed) {
    return (
      <div className="px-2 py-3">
        <button
          type="button"
          title="Search navigation"
          aria-label="Search navigation"
          className={`flex h-10 w-full items-center justify-center rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 ${
            darkMode
              ? 'border-navy-700 bg-navy-900/60 text-gray-400 hover:text-white'
              : 'border-gray-200 bg-gray-50 text-gray-500 hover:text-navy-800'
          }`}
        >
          <Search className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div className="px-3 py-3">
      <label htmlFor="sidebar-search" className="sr-only">
        Search navigation
      </label>
      <div className="relative">
        <Search
          className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}
          aria-hidden="true"
        />
        <input
          id="sidebar-search"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search menu..."
          className={`h-10 w-full rounded-lg border py-2 pl-10 pr-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 ${
            darkMode
              ? 'border-navy-700 bg-navy-900/60 text-white placeholder:text-gray-500'
              : 'border-gray-200 bg-gray-50 text-navy-900 placeholder:text-gray-400'
          }`}
        />
      </div>
    </div>
  );
});

export default SidebarSearch;
