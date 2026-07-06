let cachedServices: import('../services').OrganizationServices | null = null;

export function getCachedOrganizationServices(
  factory: () => import('../services').OrganizationServices
): import('../services').OrganizationServices {
  if (!cachedServices) cachedServices = factory();
  return cachedServices;
}

export function resetOrganizationServicesCache(): void {
  cachedServices = null;
}
