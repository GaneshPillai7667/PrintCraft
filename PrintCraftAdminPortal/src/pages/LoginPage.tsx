import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react';
import { getSession, isAdminRole, saveSession } from '../auth/adminAuth';

type LoginPageProps = {
  onLogin: () => void;
};

const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7129';
const tenantId = import.meta.env.VITE_DEFAULT_TENANT_ID ?? '11111111-1111-1111-1111-111111111111';

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('admin@printcraft.local');
  const [password, setPassword] = useState('PrintCraft@123');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const session = getSession();
  if (session && isAdminRole(session.role)) {
    return <Navigate to="/" replace />;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${apiBase}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Id': tenantId
        },
        body: JSON.stringify({ email, password })
      });

      const payload = await res.json() as {
        success: boolean;
        message: string;
        data?: {
          accessToken: string;
          refreshToken?: string;
          expiresInSeconds?: number;
          AccessToken?: string;
          RefreshToken?: string;
          ExpiresInSeconds?: number;
        };
      };

      if (!res.ok || !payload.success || !payload.data) {
        throw new Error(payload.message || 'Login failed.');
      }

      const accessToken = payload.data.accessToken ?? payload.data.AccessToken ?? '';
      const refreshToken = payload.data.refreshToken ?? payload.data.RefreshToken;
      const expiresInSeconds = payload.data.expiresInSeconds ?? payload.data.ExpiresInSeconds;
      const nextSession = saveSession({ accessToken, refreshToken, expiresInSeconds });

      if (!isAdminRole(nextSession.role)) {
        throw new Error('Only admin accounts can access this portal.');
      }

      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to login right now.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
      <div className="panel w-full p-6">
        <h1 className="font-heading text-2xl font-black text-slate-900">Admin Login</h1>
        <p className="mt-1 text-sm text-slate-500">Login with TenantAdmin or SuperAdmin account.</p>

        <form className="mt-5 space-y-4" onSubmit={submit}>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-500">
              <Mail size={12} /> Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-500">
              <Lock size={12} /> Password
            </label>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                className="input-field pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition hover:text-slate-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            <LogIn size={14} /> {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
