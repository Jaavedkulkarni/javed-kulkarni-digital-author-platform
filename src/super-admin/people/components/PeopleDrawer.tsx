import { memo, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { PEOPLE_DRAWER_TABS } from '../constants/people.constants';
import type { PeopleDrawerTab, PeopleUser } from '../types/people.types';

interface PeopleDrawerProps {
  user: PeopleUser | null;
  open: boolean;
  activeTab: PeopleDrawerTab;
  onTabChange: (tab: PeopleDrawerTab) => void;
  onClose: () => void;
}

const DRAWER_TRANSITION_MS = 300;

function PlaceholderPanel({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-dashed border-navy-600 bg-navy-900/40 p-6 text-center">
      <p className="text-sm font-medium text-gray-300">{title}</p>
      <p className="mt-2 text-xs text-gray-500">
        Detailed {title.toLowerCase()} content will be available when CRUD is implemented.
      </p>
    </div>
  );
}

export const PeopleDrawer = memo(function PeopleDrawer({
  user,
  open,
  activeTab,
  onTabChange,
  onClose,
}: PeopleDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
    return undefined;
  }, [open]);

  if (!user) return null;

  const activeTabLabel = PEOPLE_DRAWER_TABS.find((tab) => tab.id === activeTab)?.label ?? 'General';

  return (
    <div
      className={`fixed inset-0 z-[120] ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close drawer backdrop"
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${user.name} details`}
        className={`absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l border-navy-700 bg-[#0f1117] shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionDuration: `${DRAWER_TRANSITION_MS}ms` }}
      >
        <header className="flex items-start justify-between gap-4 border-b border-navy-700 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">User profile</p>
            <h2 className="mt-1 text-lg font-semibold text-white">{user.name}</h2>
            <p className="mt-1 text-sm text-gray-400">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-navy-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="border-b border-navy-700 px-2">
          <div className="flex gap-1 overflow-x-auto py-2" role="tablist" aria-label="User detail sections">
            {PEOPLE_DRAWER_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 ${
                  activeTab === tab.id
                    ? 'bg-gold-500/15 text-gold-400'
                    : 'text-gray-400 hover:bg-navy-700 hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <PlaceholderPanel title={activeTabLabel} />
        </div>
      </aside>
    </div>
  );
});

export default PeopleDrawer;
