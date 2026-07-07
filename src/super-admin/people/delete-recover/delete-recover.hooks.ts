import { useCallback, useMemo, useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import { mapEdgeFunctionInvokeError } from '../../../lib/edge-functions';
import { useInvalidatePeople } from '../hooks';
import type { PeopleUser } from '../types/people.types';
import { mapDeleteRecoverErrorToMessage } from './delete-recover.errors';
import { getDeleteRecoverService } from './delete-recover.service';
import type {
  BulkUserActionResult,
  DeleteUserFormInput,
  PeopleDeleteRecoverDialogMode,
  RecoverUserFormValues,
} from './delete-recover.types';

export function usePeopleDeleteRecover(onComplete?: () => void) {
  const [mode, setMode] = useState<PeopleDeleteRecoverDialogMode>(null);
  const [targets, setTargets] = useState<PeopleUser[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bulkResults, setBulkResults] = useState<BulkUserActionResult[]>([]);
  const [bulkProgress, setBulkProgress] = useState({ completed: 0, total: 0 });
  const { showToast } = useToast();
  const { invalidateEverything, invalidateDetail, invalidateTimelines } = useInvalidatePeople();
  const service = useMemo(() => getDeleteRecoverService(), []);

  const closeDialog = useCallback(() => {
    if (isSubmitting) return;
    setMode(null);
    setTargets([]);
    setBulkResults([]);
    setBulkProgress({ completed: 0, total: 0 });
  }, [isSubmitting]);

  const openDelete = useCallback((users: PeopleUser[]) => {
    setTargets(users);
    setMode(users.length > 1 ? 'bulk-delete' : 'delete');
    setBulkResults([]);
    setBulkProgress({ completed: 0, total: users.length });
  }, []);

  const openRecover = useCallback((users: PeopleUser[]) => {
    setTargets(users);
    setMode(users.length > 1 ? 'bulk-recover' : 'recover');
    setBulkResults([]);
    setBulkProgress({ completed: 0, total: users.length });
  }, []);

  const invalidateAfterChange = useCallback(
    async (userIds: string[]) => {
      await Promise.all([
        invalidateEverything(),
        ...userIds.map((id) => invalidateDetail(id)),
        ...userIds.map((id) => invalidateTimelines(id)),
      ]);
      onComplete?.();
    },
    [invalidateDetail, invalidateEverything, invalidateTimelines, onComplete],
  );

  const deleteOne = useCallback(
    async (user: PeopleUser, values: DeleteUserFormInput): Promise<BulkUserActionResult> => {
      try {
        await service.deleteUser({
          userId: user.id,
          reason: values.reason,
          notes: values.notes || undefined,
        });
        return { user, success: true };
      } catch (error) {
        const message =
          (await mapEdgeFunctionInvokeError(error).catch(() => null)) ??
          mapDeleteRecoverErrorToMessage(error);
        return { user, success: false, message };
      }
    },
    [service],
  );

  const recoverOne = useCallback(
    async (user: PeopleUser, values: RecoverUserFormValues): Promise<BulkUserActionResult> => {
      try {
        await service.recoverUser({
          userId: user.id,
          notes: values.notes || undefined,
        });
        return { user, success: true };
      } catch (error) {
        const message =
          (await mapEdgeFunctionInvokeError(error).catch(() => null)) ??
          mapDeleteRecoverErrorToMessage(error);
        return { user, success: false, message };
      }
    },
    [service],
  );

  const submitDelete = useCallback(
    async (values: DeleteUserFormInput) => {
      if (targets.length === 0) return;
      setIsSubmitting(true);
      setBulkResults([]);
      setBulkProgress({ completed: 0, total: targets.length });

      const results: BulkUserActionResult[] = [];
      for (let index = 0; index < targets.length; index += 1) {
        const result = await deleteOne(targets[index], values);
        results.push(result);
        setBulkResults([...results]);
        setBulkProgress({ completed: index + 1, total: targets.length });
      }

      const successCount = results.filter((item) => item.success).length;
      const failed = results.filter((item) => !item.success);

      if (successCount > 0) {
        await invalidateAfterChange(results.filter((item) => item.success).map((item) => item.user.id));
      }

      if (failed.length === 0) {
        showToast(
          targets.length === 1
            ? 'User deleted successfully'
            : `${successCount} users deleted successfully`,
        );
        closeDialog();
      } else if (successCount === 0) {
        showToast(failed[0]?.message ?? 'Unable to delete user');
      } else {
        showToast(`${successCount} deleted, ${failed.length} failed`);
      }

      setIsSubmitting(false);
    },
    [closeDialog, deleteOne, invalidateAfterChange, showToast, targets],
  );

  const submitRecover = useCallback(
    async (values: RecoverUserFormValues) => {
      if (targets.length === 0) return;
      setIsSubmitting(true);
      setBulkResults([]);
      setBulkProgress({ completed: 0, total: targets.length });

      const results: BulkUserActionResult[] = [];
      for (let index = 0; index < targets.length; index += 1) {
        const result = await recoverOne(targets[index], values);
        results.push(result);
        setBulkResults([...results]);
        setBulkProgress({ completed: index + 1, total: targets.length });
      }

      const successCount = results.filter((item) => item.success).length;
      const failed = results.filter((item) => !item.success);

      if (successCount > 0) {
        await invalidateAfterChange(results.filter((item) => item.success).map((item) => item.user.id));
      }

      if (failed.length === 0) {
        showToast(
          targets.length === 1
            ? 'User recovered successfully'
            : `${successCount} users recovered successfully`,
        );
        closeDialog();
      } else if (successCount === 0) {
        showToast(failed[0]?.message ?? 'Unable to recover user');
      } else {
        showToast(`${successCount} recovered, ${failed.length} failed`);
      }

      setIsSubmitting(false);
    },
    [closeDialog, invalidateAfterChange, recoverOne, showToast, targets],
  );

  return {
    mode,
    targets,
    isSubmitting,
    bulkResults,
    bulkProgress,
    openDelete,
    openRecover,
    closeDialog,
    submitDelete,
    submitRecover,
  };
}

export type UsePeopleDeleteRecoverReturn = ReturnType<typeof usePeopleDeleteRecover>;
