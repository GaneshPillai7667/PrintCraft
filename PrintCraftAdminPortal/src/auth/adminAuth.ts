export type AdminSession = {
  accessToken: string;
  refreshToken?: string;
  expiresInSeconds?: number;
  email: string;
  role: string;
};

const SESSION_KEY = 'printcraft_admin_session';

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

export function getSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  return getSession()?.accessToken ?? null;
}

export function saveSession(tokens: { accessToken: string; refreshToken?: string; expiresInSeconds?: number }): AdminSession {
  const claims = parseJwt(tokens.accessToken);
  const roleRaw = (claims.role ??
    claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
    'Unknown') as string;
  const emailRaw = (claims.email ??
    claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ??
    '') as string;

  const session: AdminSession = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresInSeconds: tokens.expiresInSeconds,
    email: emailRaw,
    role: roleRaw
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event('admin-auth-changed'));
  return session;
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event('admin-auth-changed'));
}

export function isAdminRole(role?: string): boolean {
  if (!role) return false;
  return role === 'TenantAdmin' || role === 'SuperAdmin';
}
