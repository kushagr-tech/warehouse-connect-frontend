'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BASE_URL as BASE } from '@/lib/api';

export default function AdminActiveWarehousesPage() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BASE}/admin/warehouses/active`, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => { if (data.success) setWarehouses(data.data); else setError('Failed to load active warehouses.'); })
      .catch(() => setError('Backend not reachable.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main className="container" style={{ padding: '2rem 0' }}>Loading...</main>;

  return (
    <main className="container" style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Active Warehouses</h1>
          <p style={{ color: 'var(--muted)' }}>{warehouses.length} live warehouse(s)</p>
        </div>
        <Link href="/admin" className="btn btn-outline">← Admin Portal</Link>
      </header>

      {error && <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>{error}</div>}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface)', borderBottom: '2px solid var(--border)' }}>
              {['Name', 'Type', 'City', 'Total Area', 'Base Price', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {warehouses.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>No active warehouses found.</td></tr>
            )}
            {warehouses.map((w: any) => (
              <tr key={w.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem', fontWeight: 600 }}>{w.name}</td>
                <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{w.warehouse_type?.replace(/_/g, ' ')}</td>
                <td style={{ padding: '1rem' }}>{w.city}, {w.state}</td>
                <td style={{ padding: '1rem' }}>{w.total_area_sqft} sqft</td>
                <td style={{ padding: '1rem' }}>{w.base_price} {w.currency}/{w.pricing_unit}</td>
                <td style={{ padding: '1rem' }}>
                  <span className="badge badge-success">{w.status}</span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <Link href={`/warehouses/${w.id}`} className="btn btn-outline" style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}>View Live</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
