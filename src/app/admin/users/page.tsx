'use client';

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { BASE_URL as BASE } from '@/lib/api';

export default function AdminUsersPage() {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      if (u.role !== 'admin' && u.role !== 'super_admin') {
        window.location.href = '/login';
        return;
      }
      setUser(u);
    } else {
      window.location.href = '/login';
      return;
    }

    fetch(`${BASE}/admin/users`, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => { if (data.success) setUsers(data.data); else setError('Failed to load users.'); })
      .catch(() => setError('Backend not reachable.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSuspend = async (id: string) => {
    if (!confirm('Are you sure you want to suspend this user?')) return;
    try {
      const res = await fetch(`${BASE}/admin/users/${id}/suspend`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Admin action' }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'suspended' } : u));
      } else {
        alert(data.errors?.[0]?.message || 'Failed to suspend user');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleUnsuspend = async (id: string) => {
    if (!confirm('Are you sure you want to unsuspend this user?')) return;
    try {
      const res = await fetch(`${BASE}/admin/users/${id}/unsuspend`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Admin action' }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'active' } : u));
      } else {
        alert(data.errors?.[0]?.message || 'Failed to unsuspend user');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  if (loading) return <main className="container" style={{ padding: '2rem 0' }}>Loading...</main>;

  // Role filtering logic based on requester's role
  let viewableUsers = users;
  if (user?.role === 'admin') {
    viewableUsers = users.filter(u => u.role !== 'admin' && u.role !== 'super_admin');
  }

  const filtered = filterRole ? viewableUsers.filter(u => u.role === filterRole) : viewableUsers;

  const ROLE_COLORS: Record<string, string> = {
    super_admin: '#7c3aed',
    admin: '#1d4ed8',
    warehouse_owner: '#0369a1',
    customer: '#065f46',
  };

  const KYC_COLORS: Record<string, string> = {
    verified: '#166534',
    submitted: '#92400e',
    rejected: '#991b1b',
    not_started: '#6b7280',
    in_progress: '#1d4ed8',
  };

  return (
    <main className="container" style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>User Management</h1>
          <p style={{ color: 'var(--muted)' }}>{filtered.length} viewable user(s)</p>
        </div>
        <Link href="/admin" className="btn btn-outline">← Admin Portal</Link>
      </header>

      {error && <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['', 'super_admin', 'admin', 'warehouse_owner', 'customer'].map(r => {
          // Hide admin/super_admin filters for admin users
          if (user?.role === 'admin' && (r === 'admin' || r === 'super_admin')) return null;
          return (
            <button key={r} onClick={() => setFilterRole(r)} className={filterRole === r ? 'btn btn-primary' : 'btn btn-outline'} style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
              {r === '' ? 'All Roles' : r.replace(/_/g, ' ')}
            </button>
          )
        })}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface)', borderBottom: '2px solid var(--border)' }}>
              {['Email', 'Role', 'Status', 'KYC Status', 'Mobile', 'Actions'].map(h => (
                <th key={h} style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u: any) => (
              <Fragment key={u.id}>
                <tr style={{ borderBottom: expandedUserId === u.id ? 'none' : '1px solid var(--border)', background: expandedUserId === u.id ? 'var(--background)' : 'transparent' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>{u.email}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>ID: {u.id}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, background: ROLE_COLORS[u.role] + '20', color: ROLE_COLORS[u.role] }}>
                      {u.role?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, background: u.status === 'active' ? '#dcfce7' : '#fee2e2', color: u.status === 'active' ? '#166534' : '#991b1b' }}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, background: (KYC_COLORS[u.kyc_status] || '#6b7280') + '20', color: KYC_COLORS[u.kyc_status] || '#6b7280' }}>
                      {u.kyc_status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--muted)' }}>{u.mobile}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => setExpandedUserId(expandedUserId === u.id ? null : u.id)} 
                        className="btn btn-outline" 
                        style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}
                      >
                        {expandedUserId === u.id ? 'Hide Details' : 'View Details'}
                      </button>
                      
                      {/* Show Suspend/Unsuspend only if not self and requester is super_admin (or admins for non-admin users) */}
                      {user?.id !== u.id && u.role !== 'super_admin' && (
                        <>
                          {u.status === 'active' && (
                            <button onClick={() => handleSuspend(u.id)} className="btn btn-outline" style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem', color: '#ef4444', borderColor: '#ef4444' }}>
                              Suspend
                            </button>
                          )}
                          {u.status === 'suspended' && (
                            <button onClick={() => handleUnsuspend(u.id)} className="btn btn-outline" style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem', color: '#10b981', borderColor: '#10b981' }}>
                              Unsuspend
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedUserId === u.id && (
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--background)' }}>
                    <td colSpan={6} style={{ padding: '1.5rem', borderTop: '1px dashed var(--border)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        <div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>Mobile Verified</p>
                          <p style={{ fontSize: '0.875rem' }}>{u.mobile_verified ? '✅ Yes' : '❌ No'}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>Email Verified</p>
                          <p style={{ fontSize: '0.875rem' }}>{u.email_verified ? '✅ Yes' : '❌ No'}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>Failed Login Count</p>
                          <p style={{ fontSize: '0.875rem' }}>{u.failed_login_count}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>MFA Enabled</p>
                          <p style={{ fontSize: '0.875rem' }}>{u.mfa_enabled ? '✅ Yes' : '❌ No'}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>Last Login IP</p>
                          <p style={{ fontSize: '0.875rem' }}>{u.last_login_ip || 'N/A'}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>Last Login At</p>
                          <p style={{ fontSize: '0.875rem' }}>{u.last_login_at ? new Date(u.last_login_at).toLocaleString() : 'N/A'}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>Created At</p>
                          <p style={{ fontSize: '0.875rem' }}>{new Date(u.created_at).toLocaleString()}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>Updated At</p>
                          <p style={{ fontSize: '0.875rem' }}>{new Date(u.updated_at).toLocaleString()}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
