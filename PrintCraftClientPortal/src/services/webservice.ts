import { env } from '../config/env';
import { getClientToken } from './clientSession';

export type ServiceResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
};

async function parseResponse<T>(response: Response): Promise<ServiceResponse<T>> {
  const payload = (await response.json()) as ServiceResponse<T>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Request failed.');
  }

  return payload;
}

export async function webService<T>(endpoint: string, options?: RequestInit): Promise<ServiceResponse<T>> {
  try {
    const token = getClientToken();
    const response = await fetch(`${env.apiBaseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-Id': env.tenantId,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options?.headers ?? {})
      }
    });

    return await parseResponse<T>(response);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Unexpected network error.');
  }
}
