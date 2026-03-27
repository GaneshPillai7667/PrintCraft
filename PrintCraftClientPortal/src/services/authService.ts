import { webService } from './webservice';
import { getClientSession, saveClientSession } from './clientSession';
import type { ClientSession } from './clientSession';

export { getClientSession };

export async function loginClient(email: string, password: string): Promise<ClientSession> {
  const response = await webService<{
    accessToken?: string;
    AccessToken?: string;
    refreshToken?: string;
    RefreshToken?: string;
    expiresInSeconds?: number;
    ExpiresInSeconds?: number;
  }>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  const accessToken = response.data.accessToken ?? response.data.AccessToken ?? '';
  const refreshToken = response.data.refreshToken ?? response.data.RefreshToken;
  const expiresInSeconds = response.data.expiresInSeconds ?? response.data.ExpiresInSeconds;
  return saveClientSession({ accessToken, refreshToken, expiresInSeconds });
}

export async function registerClient(fullName: string, email: string, password: string): Promise<void> {
  await webService('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      fullName,
      email,
      password,
      role: 'Customer'
    })
  });
}
