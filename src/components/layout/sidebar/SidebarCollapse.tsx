import { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { SidebarCollapseProps } from './sidebar.types';

export const SidebarCollapse = memo(function SidebarCollapse({
  darkMode,
  collapsed,
  onToggle,
}: SidebarCollapseProps) {
  return (
    <div className={`hidden border-t p-3 lg:block ${darkMode ? 'border-navy-800' : 'border-gray-200'}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!collapsed}
        className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 ${
          darkMode
            ? 'text-gray-400 hover:bg-navy-800 hover:text-white'
            : 'text-gray-600 hover:bg-gray-100 hover:text-navy-800'
        }`}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" aria-hidden="true" /> : <ChevronLeft className="h-4 w-4" aria-hidden="true" />}
        {!collapsed ? <span>Collapse</span> : null}
      </button>
    </div>
  );
});

export default SidebarCollapse;
