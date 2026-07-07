import { memo, useCallback, useEffect, useState } from 'react';
import type { UsePeopleDeleteRecoverReturn } from './delete-recover.hooks';
import {
  DELETE_USER_DEFAULT_VALUES,
  RECOVER_USER_DEFAULT_VALUES,
  deleteUserFormInputSchema,
  recoverUserFormSchema,
  type DeleteUserFormInput,
  type RecoverUserFormValues,
} from './delete-recover.schema';
import { DeleteUserDialog } from './components/DeleteUserDialog';
import { RecoverUserDialog } from './components/RecoverUserDialog';

interface PeopleDeleteRecoverDialogsProps {
  controller: UsePeopleDeleteRecoverReturn;
}

export const PeopleDeleteRecoverDialogs = memo(function PeopleDeleteRecoverDialogs({
  controller,
}: PeopleDeleteRecoverDialogsProps) {
  const {
    mode,
    targets,
    isSubmitting,
    bulkResults,
    bulkProgress,
    closeDialog,
    submitDelete,
    submitRecover,
  } = controller;

  const [deleteValues, setDeleteValues] = useState<DeleteUserFormInput>({
    reason: DELETE_USER_DEFAULT_VALUES.reason,
    notes: DELETE_USER_DEFAULT_VALUES.notes,
    confirmed: false,
  });
  const [recoverValues, setRecoverValues] = useState<RecoverUserFormValues>(RECOVER_USER_DEFAULT_VALUES);
  const [deleteErrors, setDeleteErrors] = useState<Partial<Record<keyof DeleteUserFormInput, string>>>({});
  const [recoverErrors, setRecoverErrors] = useState<Partial<Record<keyof RecoverUserFormValues, string>>>({});

  useEffect(() => {
    if (!mode) {
      setDeleteValues({
        reason: DELETE_USER_DEFAULT_VALUES.reason,
        notes: DELETE_USER_DEFAULT_VALUES.notes,
        confirmed: false,
      });
      setRecoverValues(RECOVER_USER_DEFAULT_VALUES);
      setDeleteErrors({});
      setRecoverErrors({});
    }
  }, [mode]);

  const handleDeleteChange = useCallback(
    <K extends keyof DeleteUserFormInput>(key: K, value: DeleteUserFormInput[K]) => {
      setDeleteValues((prev) => ({ ...prev, [key]: value }));
      setDeleteErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    [],
  );

  const handleRecoverChange = useCallback(
    <K extends keyof RecoverUserFormValues>(key: K, value: RecoverUserFormValues[K]) => {
      setRecoverValues((prev) => ({ ...prev, [key]: value }));
      setRecoverErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    [],
  );

  const confirmDelete = useCallback(() => {
    const parsed = deleteUserFormInputSchema.safeParse(deleteValues);
    if (!parsed.success) {
      const nextErrors: Partial<Record<keyof DeleteUserFormInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === 'string' && !nextErrors[key as keyof DeleteUserFormInput]) {
          nextErrors[key as keyof DeleteUserFormInput] = issue.message;
        }
      }
      setDeleteErrors(nextErrors);
      return;
    }
    if (!parsed.data.confirmed) {
      setDeleteErrors({ confirmed: 'Please confirm this soft delete' });
      return;
    }
    void submitDelete(parsed.data);
  }, [deleteValues, submitDelete]);

  const confirmRecover = useCallback(() => {
    const parsed = recoverUserFormSchema.safeParse(recoverValues);
    if (!parsed.success) {
      const nextErrors: Partial<Record<keyof RecoverUserFormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === 'string' && !nextErrors[key as keyof RecoverUserFormValues]) {
          nextErrors[key as keyof RecoverUserFormValues] = issue.message;
        }
      }
      setRecoverErrors(nextErrors);
      return;
    }
    void submitRecover(parsed.data);
  }, [recoverValues, submitRecover]);

  const deleteOpen = mode === 'delete' || mode === 'bulk-delete';
  const recoverOpen = mode === 'recover' || mode === 'bulk-recover';

  return (
    <>
      <DeleteUserDialog
        open={deleteOpen}
        users={targets}
        isSubmitting={isSubmitting}
        bulkResults={bulkResults}
        bulkProgress={bulkProgress}
        values={deleteValues}
        errors={deleteErrors}
        onChange={handleDeleteChange}
        onClose={closeDialog}
        onConfirm={confirmDelete}
      />
      <RecoverUserDialog
        open={recoverOpen}
        users={targets}
        isSubmitting={isSubmitting}
        bulkResults={bulkResults}
        bulkProgress={bulkProgress}
        values={recoverValues}
        errors={recoverErrors}
        onChange={handleRecoverChange}
        onClose={closeDialog}
        onConfirm={confirmRecover}
      />
    </>
  );
});

export default PeopleDeleteRecoverDialogs;
