import { memo } from 'react';
import { Navigation } from 'lucide-react';
import type { SidebarEmptyProps } from './sidebar.types';

export const SidebarEmpty = memo(function SidebarEmpty({ darkMode }: SidebarEmptyProps) {
  return (
    <div
      role="status"
      aria-label="No navigation available"
      className={`mx-3 flex flex-col items-center rounded-xl border border-dashed px-4 py-8 text-center ${
        darkMode ? 'border-navy-700 bg-navy-800/30' : 'border-gray-200 bg-gray-50'
      }`}
    >
      <Navigation className={`mb-3 h-8 w-8 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} aria-hidden="true" />
      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-navy-800'}`}>
        No navigation available
      </p>
      <p className={`mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
        Your roles may not include any menu items yet.
      </p>
    </div>
  );
});

export default SidebarEmpty;
