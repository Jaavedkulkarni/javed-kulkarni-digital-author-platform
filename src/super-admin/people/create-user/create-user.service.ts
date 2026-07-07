import { invokeEdgeFunction } from '../../../lib/edge-functions';
import { createIdempotencyKey } from '../../../enterprise/idempotency/idempotency-key';
import type { CreateUserFormValues } from './create-user.schema';
import {
  mapCreateUserFormToApiRequest,
  type CreateUserApiResponse,
} from './create-user.api.types';

export class CreateUserService {
  async createUser(values: CreateUserFormValues): Promise<CreateUserApiResponse> {
    const body = mapCreateUserFormToApiRequest(values);
    return invokeEdgeFunction('create-user', body as unknown as Record<string, unknown>, {
      idempotencyKey: createIdempotencyKey('create-user'),
    });
  }
}

let createUserService: CreateUserService | null = null;

export function getCreateUserService(): CreateUserService {
  if (!createUserService) {
    createUserService = new CreateUserService();
  }
  return createUserService;
}

export default CreateUserService;
