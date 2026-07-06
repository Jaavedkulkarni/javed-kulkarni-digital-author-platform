export type OrganizationOperationResult<T = void> = {
  success: boolean;
  data?: T;
  errors?: string[];
};

export type EntityStatus = 'active' | 'inactive' | 'suspended' | 'archived';
