'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchEnquiries, fetchWarehouses } from '@/lib/api';

export default function CustomerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      if (u.role !== 'customer') {
        window.location.href = '/login';
        return;
      }
      setUser(u);
    } else {
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      // In a real app we would only fetch the warehouses related to the enquiries,
      // but for this mock we fetch all and find the match.
      const [enqRes, whRes] = await Promise.all([
        fetchEnquiries('customer', user.id),
        fetchWarehouses()
      ]);
      setEnquiries(enqRes.data || []);
      setWarehouses(whRes.data || []);
    } catch (err) {
      setError('Backend not reachable.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <main className="container" style={{ padding: '2rem 0' }}>Loading...</main>;

  return (
    <main className="container" style={{ padding: '2rem 0', minHeight: '100vh', maxWidth: 1000 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Customer Dashboard</h1>
          <p style={{ color: 'var(--muted)' }}>Manage your warehouse space requirements.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/warehouses" className="btn btn-primary">Find Space</Link>
          <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/login'; }} className="btn btn-outline">Log out</button>
        </div>
      </header>

      {error && <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>{error}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>My Enquiries</h2>
        <Link href="/enquiries" className="btn btn-outline" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>View All →</Link>
      </div>

      {enquiries.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--muted)' }}>
          You haven't submitted any enquiries yet.
          <div style={{ marginTop: '1rem' }}>
            <Link href="/warehouses" className="btn btn-primary">Browse Warehouses</Link>
          </div>
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
              {enquiries.slice(0, 5).map((e: any) => {
                const wh = warehouses.find((w: any) => w.id === e.warehouse_id);
                return (
                  <tr key={e.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>
                      <Link href={`/enquiries/${e.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {wh?.name || e.warehouse_id}
                      </Link>
                    </td>
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
    </main>
  );
}
