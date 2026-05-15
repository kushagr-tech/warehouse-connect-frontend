'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchEnquiries, fetchOwnerWarehouses } from '@/lib/api';

export default function EnquiriesPage() {
  const [user, setUser] = useState<any>(null);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
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
      const [enqRes, whRes] = await Promise.all([
        fetchEnquiries(user.role, user.id),
        user.role === 'warehouse_owner' ? fetchOwnerWarehouses(user.id) : Promise.resolve({ data: [] }),
      ]);
      setEnquiries(enqRes.data || []);
      setWarehouses(whRes.data || []);
    } catch (err) {
      setError('Failed to load enquiries.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <main className="container" style={{ padding: '2rem 0' }}>Loading...</main>;

  return (
    <main className="container" style={{ padding: '2rem 0', minHeight: '100vh', maxWidth: 1000 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>All Enquiries</h1>
          <p style={{ color: 'var(--muted)' }}>Manage your space requests and negotiations.</p>
        </div>
        <Link href={user?.role === 'customer' ? '/customer-dashboard' : '/dashboard'} className="btn btn-outline">
          ← Back to Dashboard
        </Link>
      </div>

      {error && <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>{error}</div>}

      {enquiries.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--muted)' }}>
          You have no enquiries at the moment.
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--surface)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 600 }}>Warehouse ID</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 600 }}>Area Needed</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 600 }}>Cargo</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e: any) => {
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
                    <td style={{ padding: '1rem' }}>
                      <Link href={`/enquiries/${e.id}`} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                        View
                      </Link>
                    </td>
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
