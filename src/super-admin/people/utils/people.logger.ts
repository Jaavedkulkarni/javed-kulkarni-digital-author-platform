const isDev = import.meta.env.DEV;

export function peopleLog(scope: string, message: string, payload?: unknown): void {
  if (!isDev) return;
  if (payload !== undefined) {
    console.debug(`[People:${scope}] ${message}`, payload);
  } else {
    console.debug(`[People:${scope}] ${message}`);
  }
}
