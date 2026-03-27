export type ClientSession = {
  accessToken: string;
  refreshToken?: string;
  expiresInSeconds?: number;
  email: string;
};

const SESSION_KEY = 'printcraft_client_session';

function parseJwt(token: string): Record<string, unknown> {
  try {
    const payload = token.split('.')[1];
    if (!payload) return {};
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(normalizedPayload.length + ((4 - normalizedPayload.length % 4) % 4), '=');
    const decoded = atob(paddedPayload);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function getClientSession(): ClientSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) as ClientSession : null;
  } catch {
    return null;
  }
}

export function getClientToken(): string | null {
  return getClientSession()?.accessToken ?? null;
}

export function saveClientSession(tokens: { accessToken: string; refreshToken?: string; expiresInSeconds?: number }): ClientSession {
  const claims = parseJwt(tokens.accessToken);
  const email = (claims.email ??
    claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ??
    '') as string;

  const session: ClientSession = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresInSeconds: tokens.expiresInSeconds,
    email
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event('client-auth-changed'));
  return session;
}
