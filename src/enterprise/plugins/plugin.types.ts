/**
 * Plugin foundation — extension points for future modules.
 */

export interface EnterprisePluginContext {
  registerEventHandler: (type: string, handler: (payload: Record<string, unknown>) => void) => () => void;
  registerHealthCheck: (name: string, check: () => Promise<{ status: string; message: string }>) => void;
}

export interface EnterprisePlugin {
  id: string;
  name: string;
  version: string;
  initialize(context: EnterprisePluginContext): void | Promise<void>;
}

export class EnterprisePluginRegistry {
  private plugins = new Map<string, EnterprisePlugin>();

  register(plugin: EnterprisePlugin): void {
    this.plugins.set(plugin.id, plugin);
  }

  get(id: string): EnterprisePlugin | undefined {
    return this.plugins.get(id);
  }

  list(): EnterprisePlugin[] {
    return Array.from(this.plugins.values());
  }

  async initializeAll(context: EnterprisePluginContext): Promise<void> {
    for (const plugin of this.plugins.values()) {
      await plugin.initialize(context);
    }
  }
}

let registry: EnterprisePluginRegistry | null = null;

export function getEnterprisePluginRegistry(): EnterprisePluginRegistry {
  if (!registry) registry = new EnterprisePluginRegistry();
  return registry;
}

export function createEnterprisePluginContext(
  handlers: EnterprisePluginContext,
): EnterprisePluginContext {
  return handlers;
}
