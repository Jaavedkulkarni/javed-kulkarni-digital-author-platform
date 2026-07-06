import type { CoreModuleId, ModuleRegistration } from '../types/module.types';
import { MODULE_BOOTSTRAP_ORDER, MODULE_DEFINITIONS } from '../constants/modules.constants';
import { auditLogger } from './auditLogger';
import { globalLogger } from './globalLogger';
import { CORE_LOG_SCOPES, AUDIT_ACTIONS } from '../constants/app.constants';
import { getGlobalErrorHandler } from './globalErrorHandler';

export class ModuleRegistry {
  private modules = new Map<CoreModuleId, ModuleRegistration>();
  private initialized = new Set<CoreModuleId>();

  register(registration: Omit<ModuleRegistration, 'registeredAt'>): ModuleRegistration {
    const entry: ModuleRegistration = {
      ...registration,
      registeredAt: new Date().toISOString(),
    };
    this.modules.set(entry.id, entry);
    auditLogger.log(AUDIT_ACTIONS.moduleRegistered, { moduleId: entry.id });
    globalLogger.info(CORE_LOG_SCOPES.registry, `Registered module: ${entry.id}`);
    return entry;
  }

  registerDefaults(): void {
    for (const moduleId of MODULE_BOOTSTRAP_ORDER) {
      if (this.modules.has(moduleId)) continue;
      const definition = MODULE_DEFINITIONS[moduleId];
      this.register(definition);
    }
  }

  get(moduleId: CoreModuleId): ModuleRegistration | undefined {
    return this.modules.get(moduleId);
  }

  getAll(): ModuleRegistration[] {
    return [...this.modules.values()].sort(
      (a, b) => MODULE_BOOTSTRAP_ORDER.indexOf(a.id) - MODULE_BOOTSTRAP_ORDER.indexOf(b.id)
    );
  }

  isRegistered(moduleId: CoreModuleId): boolean {
    return this.modules.has(moduleId);
  }

  isInitialized(moduleId: CoreModuleId): boolean {
    return this.initialized.has(moduleId);
  }

  async initialize(moduleId: CoreModuleId): Promise<void> {
    const module = this.modules.get(moduleId);
    if (!module) {
      throw new Error(`Module "${moduleId}" is not registered.`);
    }
    if (this.initialized.has(moduleId)) return;

    for (const dependency of module.dependencies) {
      if (!this.initialized.has(dependency)) {
        await this.initialize(dependency);
      }
    }

    try {
      await module.initialize?.();
      this.initialized.add(moduleId);
      auditLogger.log(AUDIT_ACTIONS.moduleInitialized, { moduleId });
      globalLogger.info(CORE_LOG_SCOPES.registry, `Initialized module: ${moduleId}`);
    } catch (error) {
      getGlobalErrorHandler().handle(error, {
        scope: CORE_LOG_SCOPES.registry,
        operation: `module.initialize.${moduleId}`,
      });
      throw error;
    }
  }

  async initializeAll(): Promise<void> {
    for (const moduleId of MODULE_BOOTSTRAP_ORDER) {
      if (this.modules.has(moduleId)) {
        await this.initialize(moduleId);
      }
    }
  }

  async dispose(moduleId: CoreModuleId): Promise<void> {
    const module = this.modules.get(moduleId);
    if (!module) return;
    await module.dispose?.();
    this.initialized.delete(moduleId);
  }

  reset(): void {
    this.modules.clear();
    this.initialized.clear();
  }
}

let moduleRegistryInstance: ModuleRegistry | null = null;

export function getModuleRegistry(): ModuleRegistry {
  if (!moduleRegistryInstance) {
    moduleRegistryInstance = new ModuleRegistry();
  }
  return moduleRegistryInstance;
}

export function resetModuleRegistry(): void {
  moduleRegistryInstance = null;
}

export function createModuleRegistry(): ModuleRegistry {
  return new ModuleRegistry();
}
