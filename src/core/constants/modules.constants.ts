import type { CoreModuleId, ModuleMetadata } from '../types/module.types';

export const MODULE_DEFINITIONS: Record<CoreModuleId, ModuleMetadata> = {
  authentication: {
    id: 'authentication',
    name: 'Authentication',
    description: 'Identity, sessions, and role-based access',
    version: '1.0.0',
    dependencies: [],
  },
  cms: {
    id: 'cms',
    name: 'CMS',
    description: 'Content management for books, authors, and publishers',
    version: '1.0.0',
    dependencies: ['authentication', 'storage'],
  },
  reader: {
    id: 'reader',
    name: 'Reader',
    description: 'Reader library, wishlist, and reading experience',
    version: '1.0.0',
    dependencies: ['authentication', 'storage'],
  },
  storage: {
    id: 'storage',
    name: 'Storage',
    description: 'File storage and signed URL infrastructure',
    version: '1.0.0',
    dependencies: [],
  },
  analytics: {
    id: 'analytics',
    name: 'Analytics',
    description: 'Usage analytics and event tracking',
    version: '1.0.0',
    dependencies: ['authentication'],
  },
  payments: {
    id: 'payments',
    name: 'Payments',
    description: 'Orders, checkout, and payment processing',
    version: '1.0.0',
    dependencies: ['authentication', 'reader'],
  },
  'hav-ai': {
    id: 'hav-ai',
    name: 'HAV AI',
    description: 'AI-assisted authoring and content tools',
    version: '1.0.0',
    dependencies: ['authentication', 'cms'],
  },
  blog: {
    id: 'blog',
    name: 'Blog',
    description: 'Blog publishing and content pages',
    version: '1.0.0',
    dependencies: ['authentication', 'cms'],
  },
};

export const MODULE_BOOTSTRAP_ORDER: CoreModuleId[] = [
  'storage',
  'authentication',
  'cms',
  'reader',
  'analytics',
  'payments',
  'hav-ai',
  'blog',
];
