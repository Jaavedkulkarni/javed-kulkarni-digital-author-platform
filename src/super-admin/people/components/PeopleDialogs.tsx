import { memo } from 'react';
import { PeopleDeleteRecoverDialogs } from '../delete-recover';
import type { UsePeopleDeleteRecoverReturn } from '../delete-recover';
import { PeopleSuspendRestoreDialogs } from '../suspend-restore';
import type { UsePeopleSuspendRestoreReturn } from '../suspend-restore';

interface PeopleDialogsProps {
  suspendRestore: UsePeopleSuspendRestoreReturn;
  deleteRecover: UsePeopleDeleteRecoverReturn;
}

export const PeopleDialogs = memo(function PeopleDialogs({
  suspendRestore,
  deleteRecover,
}: PeopleDialogsProps) {
  return (
    <>
      <PeopleSuspendRestoreDialogs controller={suspendRestore} />
      <PeopleDeleteRecoverDialogs controller={deleteRecover} />
    </>
  );
});

export default PeopleDialogs;
