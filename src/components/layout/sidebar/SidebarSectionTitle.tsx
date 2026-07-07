import { memo } from 'react';
import type { SidebarSectionTitleProps } from './sidebar.types';

export const SidebarSectionTitle = memo(function SidebarSectionTitle({
  title,
  darkMode,
  collapsed,
}: SidebarSectionTitleProps) {
  if (collapsed) return null;

  return (
    <p
      className={`px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider ${
        darkMode ? 'text-gray-500' : 'text-gray-400'
      }`}
    >
      {title}
    </p>
  );
});

export default SidebarSectionTitle;
