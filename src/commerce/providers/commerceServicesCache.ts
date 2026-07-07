let cachedServices: import('../services').CommerceServices | null = null;

export function getCachedCommerceServices(
  factory: () => import('../services').CommerceServices
): import('../services').CommerceServices {
  if (!cachedServices) cachedServices = factory();
  return cachedServices;
}

export function resetCommerceServicesCache(): void {
  cachedServices = null;
}
