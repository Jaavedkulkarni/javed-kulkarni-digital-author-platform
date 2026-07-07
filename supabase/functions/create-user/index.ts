import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';

import { createAdminClient, deleteAuthUser } from '../_shared/auth/context.ts';

import { ConflictError, InternalError } from '../_shared/errors/app-error.ts';

import {

  createEnterpriseHandler,

  emitDomainEventAndAudit,

} from '../_shared/handler-enterprise.ts';

import { loadFeatureFlags } from '../_shared/feature-flags/index.ts';

import { jsonSuccess } from '../_shared/responses/json.ts';

import { setTemporaryPasswordMetadata } from '../_shared/temp-password/manager.ts';

import {

  buildFullName,

  validateCreateUserRequest,

  type CreateUserRequest,

} from '../_shared/validation/user-requests.ts';

import { sendNotification } from '../_shared/notifications/engine.ts';

import { renderEmailTemplate } from '../_shared/email-templates/engine.ts';



interface CreateUserResponseData {

  userId: string;

  email: string;

  profileStatus: string;

  primaryRole: string;

  temporaryPasswordStatus: {

    active: boolean;

    expiresAt: string | null;

    forcePasswordChange: boolean;

    firstLoginRequired: boolean;

  };

}



async function assignRoleIfNeeded(

  userClient: SupabaseClient,

  targetUserId: string,

  role: string,

  reason: string,

): Promise<void> {

  if (role === 'reader') return;



  const { error } = await userClient.rpc('apply_user_role_change', {

    p_target_user_id: targetUserId,

    p_role_name: role,

    p_action: 'assign',

    p_reason: reason,

  });



  if (error && !error.message.includes('Role already assigned')) {

    throw error;

  }

}



async function finalizeProfile(

  adminClient: SupabaseClient,

  userId: string,

  payload: CreateUserRequest,

  fullName: string,

): Promise<string> {

  const profileStatus = payload.emailVerificationRequired ? 'pending' : payload.status;



  const { error } = await adminClient

    .from('profiles')

    .update({

      full_name: fullName,

      status: profileStatus,

      phone: payload.phone ?? null,

      preferred_language: payload.language,

      timezone: payload.timezone,

      updated_at: new Date().toISOString(),

    })

    .eq('id', userId);



  if (error) throw error;

  return profileStatus;

}



Deno.serve(

  createEnterpriseHandler('create-user', { permission: 'super_admin' }, async (ctx) => {

    const payload = validateCreateUserRequest(ctx.body);

    const fullName = buildFullName(payload.firstName, payload.lastName, payload.displayName);



    const flags = await loadFeatureFlags(ctx.adminClient);



    ctx.logger.info('Creating user', { actorId: ctx.actor.id, email: payload.email });



    let createdUserId: string | null = null;



    try {

      const { data: created, error: createError } = await ctx.adminClient.auth.admin.createUser({

        email: payload.email,

        password: payload.password,

        email_confirm: !payload.emailVerificationRequired,

        user_metadata: {

          full_name: fullName,

          first_name: payload.firstName,

          last_name: payload.lastName,

          role: payload.role,

          internal_notes: payload.internalNotes ?? null,

        },

      });



      if (createError || !created.user) {

        const message = createError?.message ?? 'Failed to create auth user';

        if (/already registered|already exists|duplicate/i.test(message)) {

          throw new ConflictError('A user with this email already exists');

        }

        throw new InternalError(message);

      }



      createdUserId = created.user.id;

      const profileStatus = await finalizeProfile(ctx.adminClient, createdUserId, payload, fullName);

      await assignRoleIfNeeded(ctx.userClient, createdUserId, payload.role, 'User created by Super Admin');



      const tempMeta = await setTemporaryPasswordMetadata(ctx.adminClient, createdUserId, ctx.actor.id, {

        forcePasswordChange: true,

        firstLoginRequired: true,

      });



      const response: CreateUserResponseData = {

        userId: createdUserId,

        email: payload.email,

        profileStatus,

        primaryRole: payload.role,

        temporaryPasswordStatus: {

          active: tempMeta.tempPasswordActive,

          expiresAt: tempMeta.tempPasswordExpiresAt,

          forcePasswordChange: tempMeta.forcePasswordChange,

          firstLoginRequired: tempMeta.firstLoginRequired,

        },

      };



      await emitDomainEventAndAudit(ctx, {

        eventType: 'UserCreated',

        payload: { userId: createdUserId, email: payload.email, role: payload.role },

        audit: {

          action: 'create',

          entity: 'user',

          targetId: createdUserId,

          targetType: 'user',

          afterState: response as unknown as Record<string, unknown>,

        },

        activity: {

          targetId: createdUserId,

          targetType: 'user',

          activityType: 'create',

          description: `User ${payload.email} created`,

        },

      });



      if (flags.EnableNotifications) {

        const email = renderEmailTemplate('welcome', {

          recipientEmail: payload.email,

          recipientName: fullName,

        });

        await sendNotification(ctx.adminClient, {

          userId: createdUserId,

          channel: 'email',

          category: 'account',

          title: email.subject,

          body: email.text,

        }, ctx.logger);

      }



      return jsonSuccess(response);

    } catch (error) {

      if (createdUserId) {

        ctx.logger.warn('Rolling back auth user', { userId: createdUserId });

        try {

          await deleteAuthUser(createAdminClient(), createdUserId);

        } catch (rollbackError) {

          ctx.logger.error('Rollback failed', {

            userId: createdUserId,

            message: rollbackError instanceof Error ? rollbackError.message : 'unknown',

          });

        }

      }

      throw error;

    }

  }),

);


