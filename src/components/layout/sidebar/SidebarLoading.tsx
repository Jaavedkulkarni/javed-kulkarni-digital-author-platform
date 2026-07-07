import { memo } from 'react';
import type { SidebarLoadingProps } from './sidebar.types';

export const SidebarLoading = memo(function SidebarLoading({ darkMode, collapsed }: SidebarLoadingProps) {
  const bone = darkMode ? 'bg-navy-700' : 'bg-gray-200';

  return (
    <div aria-busy="true" aria-label="Loading navigation" className="space-y-3 px-3 py-4">
      {Array.from({ length: collapsed ? 4 : 6 }).map((_, index) => (
        <div key={index} className={`animate-pulse rounded-lg ${bone} ${collapsed ? 'mx-auto h-10 w-10' : 'h-10 w-full'}`} />
      ))}
    </div>
  );
});

export default SidebarLoading;
