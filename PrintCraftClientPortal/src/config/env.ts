const fallbackApiUrl = 'https://localhost:7129';

export const env = {
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? fallbackApiUrl,
  tenantId: (import.meta.env.VITE_DEFAULT_TENANT_ID as string | undefined) ?? '11111111-1111-1111-1111-111111111111'
};
