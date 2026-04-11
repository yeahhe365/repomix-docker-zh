export interface ApiBaseUrlEnv {
  PROD?: boolean;
  VITE_REPOMIX_API_BASE_URL?: string;
}

export interface RuntimeLocationLike {
  origin: string;
  hostname: string;
}

function isLoopbackHost(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0' || hostname === '::1';
}

function isLoopbackUrl(value: string): boolean {
  try {
    return isLoopbackHost(new URL(value, 'http://localhost').hostname);
  } catch {
    return false;
  }
}

export function resolveApiBaseUrl(
  env: ApiBaseUrlEnv,
  runtimeLocation: RuntimeLocationLike | undefined = globalThis.location,
): string {
  const override = env.VITE_REPOMIX_API_BASE_URL?.trim();

  if (env.PROD && runtimeLocation && isLoopbackHost(runtimeLocation.hostname) && (!override || isLoopbackUrl(override))) {
    return runtimeLocation.origin;
  }

  if (override) {
    return override;
  }

  return env.PROD ? 'https://api.repomix.com' : 'http://localhost:8080';
}
