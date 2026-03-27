import { useEffect, useMemo, useState } from 'react';
import { Search, Shield, User2 } from 'lucide-react';
import { getAccessToken } from '../auth/adminAuth';

type UserRow = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAtUtc: string;
};

const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7129';
const tenantId = import.meta.env.VITE_DEFAULT_TENANT_ID ?? '11111111-1111-1111-1111-111111111111';

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function loadUsers() {
      setLoading(true);
      setError('');
      try {
        const token = getAccessToken();
        if (!token) throw new Error('Missing admin token.');

        const res = await fetch(`${apiBase}/api/v1/auth/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Tenant-Id': tenantId
          }
        });
        const payload = await res.json() as {
          success: boolean;
          message: string;
          data?: Array<{
            id?: string;
            Id?: string;
            fullName?: string;
            FullName?: string;
            email?: string;
            Email?: string;
            role?: string;
            Role?: string;
            isActive?: boolean;
            IsActive?: boolean;
            createdAtUtc?: string;
            CreatedAtUtc?: string;
          }>;
        };

        if (!res.ok || !payload.success || !payload.data) {
          throw new Error(payload.message || 'Unable to fetch users.');
        }

        const mapped = payload.data.map((u) => ({
          id: u.id ?? u.Id ?? '',
          fullName: u.fullName ?? u.FullName ?? '',
          email: u.email ?? u.Email ?? '',
          role: u.role ?? u.Role ?? 'Unknown',
          isActive: u.isActive ?? u.IsActive ?? false,
          createdAtUtc: u.createdAtUtc ?? u.CreatedAtUtc ?? ''
        }));

        if (mounted) setUsers(mapped);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : 'Unable to load users.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadUsers();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(
    () => users.filter((u) => {
      const q = query.toLowerCase();
      return !q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
    }),
    [users, query]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-black text-slate-900">Users</h1>
          <p className="text-sm text-slate-500">Admin view of all tenant users and roles.</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="input-field pl-9"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="panel overflow-hidden p-0">
        {loading && <div className="p-6 text-sm text-slate-400">Loading users...</div>}
        {!loading && error && <div className="p-6 text-sm text-red-500">{error}</div>}
        {!loading && !error && (
          <table className="admin-table">
            <thead>
              <tr>
                <th className="px-5 pt-4">Name</th>
                <th className="pt-4">Email</th>
                <th className="pt-4">Role</th>
                <th className="pt-4">Status</th>
                <th className="pt-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td className="px-5 primary">
                    <span className="inline-flex items-center gap-2">
                      <User2 size={13} className="text-slate-500" />
                      {u.fullName}
                    </span>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">
                      <Shield size={10} /> {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{u.createdAtUtc ? new Date(u.createdAtUtc).toLocaleString() : '-'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="px-5 py-6 text-slate-500" colSpan={5}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
