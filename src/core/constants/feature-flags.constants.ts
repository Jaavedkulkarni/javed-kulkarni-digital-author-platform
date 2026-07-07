export const ENTERPRISE_FEATURE_FLAGS = [
  'EnableUserInvites',
  'EnableAvatarUpload',
  'EnableBulkImport',
  'EnableBulkExport',
  'EnableMarketplace',
  'EnablePayments',
  'EnableMFA',
  'EnableAI',
  'EnableAuthors',
  'EnablePublishers',
  'EnableReaderPortal',
  'EnableNotifications',
  'EnableCMS',
  'EnableERP',
] as const;

export type EnterpriseFeatureFlagId = (typeof ENTERPRISE_FEATURE_FLAGS)[number];

export const DEFAULT_ENTERPRISE_FLAG_STATE: Record<EnterpriseFeatureFlagId, boolean> = {
  EnableUserInvites: false,
  EnableAvatarUpload: true,
  EnableBulkImport: false,
  EnableBulkExport: false,
  EnableMarketplace: false,
  EnablePayments: false,
  EnableMFA: false,
  EnableAI: false,
  EnableAuthors: true,
  EnablePublishers: true,
  EnableReaderPortal: true,
  EnableNotifications: true,
  EnableCMS: true,
  EnableERP: false,
};
