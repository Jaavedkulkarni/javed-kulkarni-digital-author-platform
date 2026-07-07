import { memo, useCallback, useEffect, useState } from 'react';
import type { UsePeopleSuspendRestoreReturn } from './suspend-restore.hooks';
import {
  RESTORE_USER_DEFAULT_VALUES,
  restoreUserFormSchema,
  SUSPEND_USER_DEFAULT_VALUES,
  suspendUserFormSchema,
  type RestoreUserFormValues,
  type SuspendUserFormValues,
} from './suspend-restore.schema';
import { RestoreUserDialog } from './components/RestoreUserDialog';
import { SuspendUserDialog } from './components/SuspendUserDialog';

interface PeopleSuspendRestoreDialogsProps {
  controller: UsePeopleSuspendRestoreReturn;
}

export const PeopleSuspendRestoreDialogs = memo(function PeopleSuspendRestoreDialogs({
  controller,
}: PeopleSuspendRestoreDialogsProps) {
  const {
    mode,
    targets,
    isSubmitting,
    bulkResults,
    bulkProgress,
    closeDialog,
    submitSuspend,
    submitRestore,
  } = controller;

  const [suspendValues, setSuspendValues] = useState<SuspendUserFormValues>(SUSPEND_USER_DEFAULT_VALUES);
  const [restoreValues, setRestoreValues] = useState<RestoreUserFormValues>(RESTORE_USER_DEFAULT_VALUES);
  const [suspendErrors, setSuspendErrors] = useState<Partial<Record<keyof SuspendUserFormValues, string>>>({});
  const [restoreErrors, setRestoreErrors] = useState<Partial<Record<keyof RestoreUserFormValues, string>>>({});

  useEffect(() => {
    if (!mode) {
      setSuspendValues(SUSPEND_USER_DEFAULT_VALUES);
      setRestoreValues(RESTORE_USER_DEFAULT_VALUES);
      setSuspendErrors({});
      setRestoreErrors({});
    }
  }, [mode]);

  const handleSuspendChange = useCallback(
    <K extends keyof SuspendUserFormValues>(key: K, value: SuspendUserFormValues[K]) => {
      setSuspendValues((prev) => ({ ...prev, [key]: value }));
      setSuspendErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    [],
  );

  const handleRestoreChange = useCallback(
    <K extends keyof RestoreUserFormValues>(key: K, value: RestoreUserFormValues[K]) => {
      setRestoreValues((prev) => ({ ...prev, [key]: value }));
      setRestoreErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    [],
  );

  const confirmSuspend = useCallback(() => {
    const parsed = suspendUserFormSchema.safeParse(suspendValues);
    if (!parsed.success) {
      const nextErrors: Partial<Record<keyof SuspendUserFormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === 'string' && !nextErrors[key as keyof SuspendUserFormValues]) {
          nextErrors[key as keyof SuspendUserFormValues] = issue.message;
        }
      }
      setSuspendErrors(nextErrors);
      return;
    }
    void submitSuspend(parsed.data);
  }, [submitSuspend, suspendValues]);

  const confirmRestore = useCallback(() => {
    const parsed = restoreUserFormSchema.safeParse(restoreValues);
    if (!parsed.success) {
      const nextErrors: Partial<Record<keyof RestoreUserFormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === 'string' && !nextErrors[key as keyof RestoreUserFormValues]) {
          nextErrors[key as keyof RestoreUserFormValues] = issue.message;
        }
      }
      setRestoreErrors(nextErrors);
      return;
    }
    void submitRestore(parsed.data);
  }, [restoreValues, submitRestore]);

  const suspendOpen = mode === 'suspend' || mode === 'bulk-suspend';
  const restoreOpen = mode === 'restore' || mode === 'bulk-restore';

  return (
    <>
      <SuspendUserDialog
        open={suspendOpen}
        users={targets}
        isSubmitting={isSubmitting}
        bulkResults={bulkResults}
        bulkProgress={bulkProgress}
        values={suspendValues}
        errors={suspendErrors}
        onChange={handleSuspendChange}
        onClose={closeDialog}
        onConfirm={confirmSuspend}
      />
      <RestoreUserDialog
        open={restoreOpen}
        users={targets}
        isSubmitting={isSubmitting}
        bulkResults={bulkResults}
        bulkProgress={bulkProgress}
        values={restoreValues}
        errors={restoreErrors}
        onChange={handleRestoreChange}
        onClose={closeDialog}
        onConfirm={confirmRestore}
      />
    </>
  );
});

export default PeopleSuspendRestoreDialogs;
