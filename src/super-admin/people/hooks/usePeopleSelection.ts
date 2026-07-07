import { useCallback, useMemo, useState } from 'react';
import type { PeopleUser } from '../types/people.types';

export interface PeopleSelectionState {
  selectedUsers: PeopleUser[];
  selectedCount: number;
  allPagesSelected: boolean;
  rowSelection: Record<string, boolean>;
  selectPage: (users: PeopleUser[]) => void;
  selectAllPages: () => void;
  invertPageSelection: (users: PeopleUser[]) => void;
  syncPageSelection: (selectedOnPage: PeopleUser[], pageUsers: PeopleUser[]) => void;
  clearSelection: () => void;
  setRowSelection: (value: Record<string, boolean>) => void;
  resetKey: number;
  bumpResetKey: () => void;
}

export function usePeopleSelection(total: number, pageUsers: PeopleUser[]): PeopleSelectionState {
  const [allPagesSelected, setAllPagesSelected] = useState(false);
  const [rowSelection, setRowSelectionState] = useState<Record<string, boolean>>({});
  const [selectedOffPage, setSelectedOffPage] = useState<Map<string, PeopleUser>>(new Map());
  const [resetKey, setResetKey] = useState(0);

  const selectedUsers = useMemo(() => {
    if (allPagesSelected) return [];
    const onPage = pageUsers.filter((user) => rowSelection[user.id]);
    const offPage = Array.from(selectedOffPage.values()).filter(
      (user) => !pageUsers.some((pageUser) => pageUser.id === user.id),
    );
    return [...onPage, ...offPage];
  }, [allPagesSelected, pageUsers, rowSelection, selectedOffPage]);

  const selectedCount = allPagesSelected ? total : selectedUsers.length;

  const setRowSelection = useCallback((value: Record<string, boolean>) => {
    setAllPagesSelected(false);
    setRowSelectionState(value);
  }, []);

  const syncPageSelection = useCallback((selectedOnPage: PeopleUser[], currentPageUsers: PeopleUser[]) => {
    setAllPagesSelected(false);
    setSelectedOffPage((prev) => {
      const next = new Map(prev);
      currentPageUsers.forEach((user) => next.delete(user.id));
      selectedOnPage.forEach((user) => next.set(user.id, user));
      return next;
    });
    const nextSelection: Record<string, boolean> = {};
    selectedOnPage.forEach((user) => {
      nextSelection[user.id] = true;
    });
    setRowSelectionState(nextSelection);
  }, []);

  const selectPage = useCallback((users: PeopleUser[]) => {
    setAllPagesSelected(false);
    const next: Record<string, boolean> = {};
    const map = new Map<string, PeopleUser>();
    users.forEach((user) => {
      next[user.id] = true;
      map.set(user.id, user);
    });
    setRowSelectionState(next);
    setSelectedOffPage(map);
  }, []);

  const selectAllPages = useCallback(() => {
    setAllPagesSelected(true);
    setRowSelectionState({});
    setSelectedOffPage(new Map());
  }, []);

  const invertPageSelection = useCallback((users: PeopleUser[]) => {
    setAllPagesSelected(false);
    setRowSelectionState((prev) => {
      const next = { ...prev };
      users.forEach((user) => {
        next[user.id] = !prev[user.id];
      });
      return next;
    });
    setSelectedOffPage((prev) => {
      const next = new Map(prev);
      users.forEach((user) => {
        if (next.has(user.id)) next.delete(user.id);
        else next.set(user.id, user);
      });
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setAllPagesSelected(false);
    setRowSelectionState({});
    setSelectedOffPage(new Map());
  }, []);

  const bumpResetKey = useCallback(() => {
    clearSelection();
    setResetKey((value) => value + 1);
  }, [clearSelection]);

  return {
    selectedUsers,
    selectedCount,
    allPagesSelected,
    rowSelection,
    selectPage,
    selectAllPages,
    invertPageSelection,
    syncPageSelection,
    clearSelection,
    setRowSelection,
    resetKey,
    bumpResetKey,
  };
}
