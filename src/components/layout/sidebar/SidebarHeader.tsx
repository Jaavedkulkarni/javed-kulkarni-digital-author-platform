import { memo } from 'react';
import { X } from 'lucide-react';
import type { SidebarHeaderProps } from './sidebar.types';

export const SidebarHeader = memo(function SidebarHeader({
  darkMode,
  collapsed,
  onClose,
}: SidebarHeaderProps) {
  return (
    <div
      className={`flex items-center gap-3 border-b px-4 py-5 ${
        darkMode ? 'border-navy-800' : 'border-gray-200'
      } ${collapsed ? 'justify-center px-2' : ''}`}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-lg font-bold text-navy-900"
        aria-hidden="true"
      >
        ज
      </div>
      {!collapsed ? (
        <div className="min-w-0 flex-1">
          <p className={`truncate text-sm font-bold ${darkMode ? 'text-white' : 'text-navy-800'}`}>
            AuthorOS
          </p>
          <p className="mt-0.5 truncate text-xs text-gold-500">जावेद कुलकर्णी</p>
        </div>
      ) : null}
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className={`rounded p-1 lg:hidden ${darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-navy-800'} focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50`}
          aria-label="Close navigation menu"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
});

export default SidebarHeader;
