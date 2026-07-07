import { memo } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Settings } from 'lucide-react';
import type { SidebarFooterProps } from './sidebar.types';

const FOOTER_ICON_MAP = {
  settings: Settings,
  help: HelpCircle,
} as const;

function resolveFooterIcon(itemId: string) {
  if (itemId.includes('account') || itemId.includes('settings')) return FOOTER_ICON_MAP.settings;
  return FOOTER_ICON_MAP.help;
}

export const SidebarFooter = memo(function SidebarFooter({
  darkMode,
  collapsed,
  items,
  onNavigate,
}: SidebarFooterProps) {
  if (items.length === 0) return null;

  const itemIdle = darkMode
    ? 'text-gray-400 hover:bg-navy-800 hover:text-white'
    : 'text-gray-600 hover:bg-gray-100 hover:text-navy-800';

  return (
    <div
      className={`space-y-0.5 border-t p-3 ${darkMode ? 'border-navy-800' : 'border-gray-200'}`}
      aria-label="Sidebar footer"
    >
      {items.map((item) => {
        const Icon = resolveFooterIcon(item.id);
        return (
          <Link
            key={item.id}
            to={item.path}
            onClick={onNavigate}
            title={collapsed ? item.title : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 ${itemIdle} ${
              collapsed ? 'justify-center px-2' : ''
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {!collapsed ? <span>{item.title}</span> : null}
          </Link>
        );
      })}
    </div>
  );
});

export default SidebarFooter;
