import { memo } from 'react';
import type { SidebarContentProps } from './sidebar.types';
import { SidebarGroup } from './SidebarGroup';
import { SidebarEmpty } from './SidebarEmpty';

export const SidebarContent = memo(function SidebarContent({
  groups,
  context,
}: SidebarContentProps) {
  if (groups.length === 0) {
    return <SidebarEmpty darkMode={context.darkMode} />;
  }

  return (
    <nav aria-label="Main navigation" className="space-y-1">
      {groups.map((group) => (
        <SidebarGroup key={group.id} group={group} context={context} />
      ))}
    </nav>
  );
});

export default SidebarContent;
