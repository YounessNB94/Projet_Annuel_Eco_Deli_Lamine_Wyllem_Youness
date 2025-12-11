const DEFAULT_API_BASE_URL = 'http://localhost:3002/api/v1';
const DEFAULT_API_TIMEOUT = 10_000;

const parseNumber = (value: string | undefined, fallback: number) => {
  if (!value) {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const appConfig = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
    timeout: parseNumber(import.meta.env.VITE_API_TIMEOUT, DEFAULT_API_TIMEOUT),
  },
} as const;

type AppConfig = typeof appConfig;

export type AppConfigApi = AppConfig['api'];

export const getAppConfig = (): AppConfig => appConfig;
export const getApiConfig = (): AppConfigApi => appConfig.api;
