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

const ENV_PREFIX = 'FEATURE_';

export function resolveFeatureFlag(
  flagId: EnterpriseFeatureFlagId,
  dbEnabled: boolean,
): boolean {
  const envKey = `${ENV_PREFIX}${flagId.replace(/^Enable/, '').toUpperCase()}`;
  const envValue = Deno.env.get(envKey);
  if (envValue === 'true') return true;
  if (envValue === 'false') return false;
  return dbEnabled;
}
