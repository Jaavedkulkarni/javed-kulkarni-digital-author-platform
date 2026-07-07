import { memo } from 'react';
import type { SidebarGroupProps } from './sidebar.types';
import { SidebarSectionTitle } from './SidebarSectionTitle';
import { SidebarItem } from './SidebarItem';

export const SidebarGroup = memo(function SidebarGroup({ group, context, depth = 0 }: SidebarGroupProps) {
  if (!group.isVisible || group.items.length === 0) return null;

  return (
    <section aria-label={group.title} className="space-y-0.5">
      <SidebarSectionTitle title={group.title} darkMode={context.darkMode} collapsed={context.collapsed} />
      {group.items.map((item) => (
        <SidebarItem key={item.id} item={item} context={context} depth={depth} />
      ))}
    </section>
  );
});

export default SidebarGroup;
