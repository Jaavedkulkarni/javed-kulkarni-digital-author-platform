export type CoreModuleId =
  | 'authentication'
  | 'cms'
  | 'reader'
  | 'storage'
  | 'analytics'
  | 'payments'
  | 'hav-ai'
  | 'blog';

export interface ModuleMetadata {
  id: CoreModuleId;
  name: string;
  description: string;
  version: string;
  dependencies: CoreModuleId[];
}

export interface ModuleRegistration extends ModuleMetadata {
  registeredAt: string;
  initialize?: () => void | Promise<void>;
  dispose?: () => void | Promise<void>;
}

export interface ModuleRegistryState {
  modules: ReadonlyMap<CoreModuleId, ModuleRegistration>;
  initialized: ReadonlySet<CoreModuleId>;
}
