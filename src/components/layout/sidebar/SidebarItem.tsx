import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import type { SidebarItemProps } from './sidebar.types';
import { isNavigationItemActive } from './sidebar.utils';

export const SidebarItem = memo(function SidebarItem({ item, context, depth = 0 }: SidebarItemProps) {
  const location = useLocation();
  const { darkMode, collapsed, expandedGroups, onToggleGroup, onNavigate } = context;

  const hasChildren = item.children.length > 0;
  const isExpanded = expandedGroups.has(item.id);
  const isActive = isNavigationItemActive(location.pathname, item);

  const itemIdle = darkMode
    ? 'text-gray-400 hover:bg-navy-800 hover:text-white'
    : 'text-gray-600 hover:bg-gray-100 hover:text-navy-800';
  const itemActive = darkMode
    ? 'border border-gold-500/20 bg-gold-500/15 text-gold-400'
    : 'border border-gold-200 bg-gold-50 text-gold-700';

  if (hasChildren) {
    return (
      <div className="space-y-0.5">
        <button
          type="button"
          id={`sidebar-group-trigger-${item.id}`}
          aria-expanded={isExpanded}
          aria-controls={`sidebar-group-panel-${item.id}`}
          title={collapsed ? item.title : undefined}
          onClick={() => onToggleGroup(item.id)}
          style={!collapsed && depth > 0 ? { paddingLeft: `${0.75 + depth * 0.75}rem` } : undefined}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 ${
            isActive ? itemActive : itemIdle
          } ${collapsed ? 'justify-center px-2' : ''}`}
        >
          <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {!collapsed ? (
            <>
              <span className="min-w-0 flex-1 truncate text-left">{item.title}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </>
          ) : null}
        </button>
        {isExpanded && !collapsed ? (
          <div
            id={`sidebar-group-panel-${item.id}`}
            role="group"
            aria-labelledby={`sidebar-group-trigger-${item.id}`}
            className="space-y-0.5"
          >
            {item.children.map((child) => (
              <SidebarItem key={child.id} item={child} context={context} depth={depth + 1} />
            ))}
          </div>
        ) : null}
        {isExpanded && collapsed ? (
          <div className="space-y-0.5 pl-1">
            {item.children.map((child) => (
              <SidebarItem key={child.id} item={child} context={context} depth={depth + 1} />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  if (!item.path || item.action) return null;

  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      title={collapsed ? item.title : undefined}
      aria-current={isActive ? 'page' : undefined}
      style={!collapsed && depth > 0 ? { paddingLeft: `${0.75 + depth * 0.75}rem` } : undefined}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 ${
        isActive ? itemActive : itemIdle
      } ${collapsed ? 'justify-center px-2' : ''}`}
    >
      <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {!collapsed ? <span className="truncate">{item.title}</span> : null}
      {!collapsed && item.badge ? (
        <span className="ml-auto rounded-full bg-gold-500/15 px-2 py-0.5 text-[10px] font-semibold text-gold-400">
          {item.badge.count ?? item.badge.label}
        </span>
      ) : null}
    </Link>
  );
});

export default SidebarItem;
