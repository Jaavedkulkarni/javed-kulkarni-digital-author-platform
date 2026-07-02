import {
  acceptRoleInvitation,
  createRoleInvitation,
  fetchPendingInvitations,
} from './roleService';
import type { CreateInvitationPayload, RoleInvitation } from '../types/roles';

/** Invitation system API — UI to be added in a future sprint. */
export const invitationService = {
  createInvitation: (payload: CreateInvitationPayload) => createRoleInvitation(payload),
  listPendingInvitations: (): Promise<RoleInvitation[]> => fetchPendingInvitations(),
  acceptInvitation: (token: string, userId: string) => acceptRoleInvitation(token, userId),
};

export default invitationService;
