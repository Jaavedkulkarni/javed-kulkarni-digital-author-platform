import { memo, useCallback, useState } from 'react';
import { EditUserPanel } from '../../edit-user';
import type { EditUserRoleOption } from '../../edit-user/edit-user.types';
import type { EditUserDetail } from '../../types/people.types';
import { EDIT_USER_UNSAVED_MESSAGE } from '../../edit-user/edit-user.constants';
import { EDIT_USER_DRAWER_TABS, type EditUserDrawerTab } from '../account-security.constants';
import { AccountSecurityPanel } from './AccountSecurityPanel';

interface EditUserDrawerShellProps {
  detail: EditUserDetail;
  roleOptions: EditUserRoleOption[];
  rolesLoading?: boolean;
  onClose: () => void;
  onSaved?: () => void;
  onDirtyChange?: (dirty: boolean) => void;
}

export const EditUserDrawerShell = memo(function EditUserDrawerShell({
  detail,
  roleOptions,
  rolesLoading = false,
  onClose,
  onSaved,
  onDirtyChange,
}: EditUserDrawerShellProps) {
  const [activeTab, setActiveTab] = useState<EditUserDrawerTab>('profile');
  const [editDirty, setEditDirty] = useState(false);

  const handleDirtyChange = useCallback(
    (dirty: boolean) => {
      setEditDirty(dirty);
      onDirtyChange?.(dirty);
    },
    [onDirtyChange],
  );

  const handleTabChange = useCallback(
    (tab: EditUserDrawerTab) => {
      if (tab === activeTab) return;
      if (activeTab === 'profile' && editDirty) {
        const confirmed = window.confirm(EDIT_USER_UNSAVED_MESSAGE);
        if (!confirmed) return;
        setEditDirty(false);
        onDirtyChange?.(false);
      }
      setActiveTab(tab);
    },
    [activeTab, editDirty, onDirtyChange],
  );

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-navy-700 px-2">
        <div className="flex gap-1 overflow-x-auto py-2" role="tablist" aria-label="Edit user sections">
          {EDIT_USER_DRAWER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => handleTabChange(tab.id)}
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

      {activeTab === 'profile' ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <EditUserPanel
            detail={detail}
            roleOptions={roleOptions}
            rolesLoading={rolesLoading}
            onClose={onClose}
            onSaved={onSaved}
            onDirtyChange={handleDirtyChange}
          />
        </div>
      ) : (
        <AccountSecurityPanel userId={detail.id} />
      )}
    </div>
  );
});

export default EditUserDrawerShell;
