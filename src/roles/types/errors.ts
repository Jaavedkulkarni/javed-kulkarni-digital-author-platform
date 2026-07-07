export class RoleManagementError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RoleManagementError';
  }
}

export class AuthenticationRequiredError extends RoleManagementError {
  constructor(message = 'Authentication required.') {
    super(message);
    this.name = 'AuthenticationRequiredError';
  }
}

export class RoleAssignmentError extends RoleManagementError {
  constructor(message: string) {
    super(message);
    this.name = 'RoleAssignmentError';
  }
}

export class InsufficientPermissionsError extends RoleManagementError {
  constructor(message = 'Insufficient permissions.') {
    super(message);
    this.name = 'InsufficientPermissionsError';
  }
}

export interface RoleOperationResult<T = void> {
  success: boolean;
  data?: T;
  errors?: string[];
  message?: string;
}
