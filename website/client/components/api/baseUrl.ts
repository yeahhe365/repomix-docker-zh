export interface ApiBaseUrlEnv {
  PROD?: boolean;
  VITE_REPOMIX_API_BASE_URL?: string;
}

export function resolveApiBaseUrl(env: ApiBaseUrlEnv): string {
  const override = env.VITE_REPOMIX_API_BASE_URL?.trim();
  if (override) {
    return override;
  }

  return env.PROD ? 'https://api.repomix.com' : 'http://localhost:8080';
}
