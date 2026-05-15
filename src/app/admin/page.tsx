'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BASE_URL as BASE } from '@/lib/api';
import LogoutButton from '@/components/LogoutButton';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

    fetch(`${BASE}/admin/dashboard`, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => { if (data.success) setStats(data.data); else setError('Failed to load stats.'); })
      .catch(() => setError('Backend not reachable. Start the server.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main className="container" style={{ padding: '2rem 0' }}>Loading...</main>;

  const isSuperAdmin = user?.role === 'super_admin';

  const statCards = stats ? [
    { label: 'Total Users', value: stats.users?.total ?? 0, color: 'var(--primary)', icon: '👥', href: '/admin/users' },
    { label: 'Active Warehouses', value: stats.warehouses?.byStatus?.active ?? 0, color: '#10b981', icon: '🏭', href: '/admin/warehouses/active' },
    { label: 'Pending Review', value: stats.warehouses?.byStatus?.pending_review ?? 0, color: 'var(--accent)', icon: '⏳', href: '/admin/warehouses' },
    { label: 'Active Enquiries', value: stats.enquiries?.activeCount ?? 0, color: 'var(--secondary)', icon: '📋', href: '/admin/enquiries' },
    { label: 'Pending Compliance', value: stats.compliance?.pending ?? 0, color: '#f59e0b', icon: '📄', href: '/admin/compliance' },
    { label: 'Expiring Certs (30d)', value: stats.compliance?.expiringSoon ?? 0, color: '#ef4444', icon: '⚠️', href: '/admin/compliance' },
  ] : [];

  return (
    <main className="container" style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              {isSuperAdmin ? '🛡️ Super Admin Portal' : '⚙️ Admin Portal'}
            </h1>
            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, background: isSuperAdmin ? '#7c3aed' : '#1d4ed8', color: 'white' }}>
              {isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN'}
            </span>
          </div>
          <p style={{ color: 'var(--muted)' }}>Platform-wide management and oversight.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Link href="/admin/kyc" className="btn btn-outline" style={{ fontSize: '0.875rem' }}>KYC Queue</Link>
          <Link href="/admin/warehouses" className="btn btn-outline" style={{ fontSize: '0.875rem' }}>Warehouse Queue</Link>
          {isSuperAdmin && <Link href="/admin/users" className="btn btn-outline" style={{ fontSize: '0.875rem' }}>Manage Users</Link>}
          <LogoutButton className="btn btn-primary" style={{ fontSize: '0.875rem' }} />
        </div>
      </header>

      {error && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        {statCards.map(({ label, value, color, icon, href }) => (
          <a href={href} key={label} className="card" style={{ borderTop: `4px solid ${color}`, textAlign: 'center', textDecoration: 'none', color: 'inherit', display: 'block', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
            <p style={{ fontSize: '2.25rem', fontWeight: 900, color }}>{value}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{label}</p>
          </a>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Warehouse Breakdown */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Warehouses by Status</h2>
          {stats && Object.entries(stats.warehouses?.byStatus ?? {}).map(([status, count]) => (
            <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{status.replace(/_/g, ' ')}</span>
              <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>{String(count)}</span>
            </div>
          ))}
          <a href="/admin/warehouses" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', textAlign: 'center', display: 'block' }}>
            Review Queue →
          </a>
        </div>

        {/* Enquiry Breakdown */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Enquiries by Status</h2>
          {stats && Object.entries(stats.enquiries?.byStatus ?? {}).map(([status, count]) => (
            <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{status}</span>
              <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>{String(count)}</span>
            </div>
          ))}
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Total Listed Area</p>
            <p style={{ fontWeight: 900, fontSize: '1.5rem' }}>{(stats?.warehouses?.totalAreaListed ?? 0).toLocaleString()} sq.ft</p>
          </div>
        </div>

        {/* Users by Role (Super Admin only) */}
        {isSuperAdmin && stats && (
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Users by Role</h2>
            {Object.entries(stats.users?.byRole ?? {}).map(([role, count]) => (
              <div key={role} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{role.replace(/_/g, ' ')}</span>
                <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>{String(count)}</span>
              </div>
            ))}
            <a href="/admin/users" className="btn btn-outline" style={{ width: '100%', marginTop: '1.5rem', textAlign: 'center', display: 'block' }}>
              Manage Users →
            </a>
          </div>
        )}

        {/* KYC Queue Summary */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>KYC Queue</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, padding: '1rem', background: '#fef3c7', borderRadius: 'var(--radius)', textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', color: '#92400e', fontWeight: 600 }}>Pending</p>
              <p style={{ fontSize: '2rem', fontWeight: 900, color: '#92400e' }}>{stats?.kyc?.pending ?? '—'}</p>
            </div>
            <div style={{ flex: 1, padding: '1rem', background: '#dcfce7', borderRadius: 'var(--radius)', textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>Verified</p>
              <p style={{ fontSize: '2rem', fontWeight: 900, color: '#166534' }}>{stats?.kyc?.verified ?? '—'}</p>
            </div>
          </div>
          <a href="/admin/kyc" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', textAlign: 'center', display: 'block' }}>
            Review KYC →
          </a>
        </div>
      </div>
    </main>
  );
}
