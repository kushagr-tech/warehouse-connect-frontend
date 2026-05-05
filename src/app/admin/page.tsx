import Link from 'next/link';
import { fetchAdminStats } from '@/lib/api';

export const dynamic = 'force-dynamic';

async function getStats() {
  try {
    const res = await fetchAdminStats();
    return res.success ? res.data : null;
  } catch { return null; }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = stats ? [
    { label: 'Total Users', value: stats.users?.total ?? 0, color: 'var(--primary)', icon: '👥' },
    { label: 'Active Warehouses', value: stats.warehouses?.byStatus?.active ?? 0, color: '#10b981', icon: '🏭' },
    { label: 'Pending Review', value: stats.warehouses?.byStatus?.pending_review ?? 0, color: 'var(--accent)', icon: '⏳' },
    { label: 'Active Enquiries', value: stats.enquiries?.activeCount ?? 0, color: 'var(--secondary)', icon: '📋' },
    { label: 'Pending Compliance', value: stats.compliance?.pending ?? 0, color: '#f59e0b', icon: '📄' },
    { label: 'Expiring Certs (30d)', value: stats.compliance?.expiringSoon ?? 0, color: '#ef4444', icon: '⚠️' },
  ] : [];

  return (
    <main className="container" style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin Portal</h1>
          <p style={{ color: 'var(--muted)' }}>Platform-wide management and oversight.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/admin/kyc" className="btn btn-outline" style={{ fontSize: '0.875rem' }}>KYC Queue</Link>
          <Link href="/admin/warehouses" className="btn btn-outline" style={{ fontSize: '0.875rem' }}>Warehouse Queue</Link>
          <Link href="/login" className="btn btn-primary" style={{ fontSize: '0.875rem' }}>Log out</Link>
        </div>
      </header>

      {!stats && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
          ⚠️ Backend not reachable — start the server with <code>npm run dev</code> in the <code>/backend</code> folder.
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        {statCards.map(({ label, value, color, icon }) => (
          <div key={label} className="card" style={{ borderTop: `4px solid ${color}`, textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
            <p style={{ fontSize: '2.25rem', fontWeight: 900, color }}>{value}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{label}</p>
          </div>
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
          <Link href="/admin/warehouses" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', textAlign: 'center' }}>
            Review Queue →
          </Link>
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
      </div>
    </main>
  );
}
