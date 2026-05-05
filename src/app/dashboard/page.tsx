import Link from 'next/link';

export const dynamic = 'force-dynamic';

import { fetchOwnerWarehouses, fetchEnquiries } from '@/lib/api';

async function getOwnerData() {
  try {
    const [whRes, enqRes] = await Promise.all([
      fetchOwnerWarehouses('user-2'),
      fetchEnquiries('warehouse_owner', 'user-2'),
    ]);
    const warehouses = whRes.data || [];
    const enquiries = enqRes.data || [];
    return { warehouses, enquiries, error: null };
  } catch (err) {
    return { warehouses: [], enquiries: [], error: 'Backend not reachable. Start the server with npm run dev in /backend.' };
  }
}

export default async function OwnerDashboard() {
  const { warehouses, enquiries, error } = await getOwnerData();

  const activeListings = warehouses.filter((w: any) => w.status === 'active').length;
  const avgCompliance = warehouses.length > 0
    ? Math.round(warehouses.reduce((s: number, w: any) => s + (w.compliance_score || 0), 0) / warehouses.length)
    : 0;

  return (
    <main className="container" style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Owner Dashboard</h1>
          <p style={{ color: 'var(--muted)' }}>Welcome back! Here is an overview of your properties.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/warehouses/new" className="btn btn-primary">+ New Listing</Link>
          <Link href="/kyc" className="btn btn-outline">KYC</Link>
          <Link href="/login" className="btn btn-outline">Log out</Link>
        </div>
      </header>

      {error && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Active Listings</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)' }}>{activeListings}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Total Warehouses</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)' }}>{warehouses.length}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Total Enquiries</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)' }}>{enquiries.length}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Avg. Compliance</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 900, color: avgCompliance >= 85 ? '#166534' : '#92400e' }}>{avgCompliance}%</p>
        </div>
      </div>

      {/* Recent Enquiries */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Recent Enquiries</h2>
      {enquiries.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
          No enquiries yet. Listing more warehouses will increase visibility!
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--surface)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 600 }}>Warehouse</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 600 }}>Area Needed</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 600 }}>Cargo</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 600 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e: any) => {
                const wh = warehouses.find((w: any) => w.id === e.warehouse_id);
                return (
                  <tr key={e.id} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => window.location.href = `/enquiries/${e.id}`}>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{wh?.name || e.warehouse_id}</td>
                    <td style={{ padding: '1rem' }}>{Number(e.required_area_sqft).toLocaleString()} sq.ft</td>
                    <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{e.cargo_type?.replace(/_/g, ' ')}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${e.status === 'submitted' ? 'badge-warning' : e.status === 'accepted' ? 'badge-success' : e.status === 'rejected' ? 'badge-danger' : 'badge-info'}`}>
                        {e.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.85rem' }}>{new Date(e.created_at).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* My Warehouses */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '3rem', marginBottom: '1rem' }}>My Warehouses</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {warehouses.map((w: any) => (
          <div key={w.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h3 style={{ fontWeight: 700 }}>{w.name}</h3>
              <span className={`badge ${w.status === 'active' ? 'badge-success' : w.status === 'draft' ? 'badge-info' : 'badge-warning'}`}>
                {w.status}
              </span>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              {w.city}, {w.state} · {w.warehouse_type?.replace(/_/g, ' ')}
            </p>
            <Link href={`/warehouses/${w.id}`} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem' }}>
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
