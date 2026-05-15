'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchOwnerWarehouses, fetchEnquiries, deleteWarehouse, BASE_URL } from '@/lib/api';
import LogoutButton from '@/components/LogoutButton';

export default function OwnerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      if (u.role !== 'warehouse_owner') {
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
      const [whRes, enqRes] = await Promise.all([
        fetchOwnerWarehouses(user.id),
        fetchEnquiries('warehouse_owner', user.id),
      ]);
      setWarehouses(whRes.data || []);
      setEnquiries(enqRes.data || []);
    } catch (err) {
      setError('Backend not reachable. Start the server with npm run dev in /backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this warehouse?')) {
      try {
        const res = await deleteWarehouse(id);
        if (res.success) {
          setWarehouses(warehouses.filter(w => w.id !== id));
        } else {
          alert('Failed to delete warehouse');
        }
      } catch (err) {
        alert('An error occurred while deleting');
      }
    }
  };

  if (loading) return <main className="container" style={{ padding: '2rem 0' }}>Loading...</main>;

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
          <LogoutButton className="btn btn-outline" />
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Recent Enquiries</h2>
        <Link href="/enquiries" className="btn btn-outline" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>View All Enquiries →</Link>
      </div>
      {enquiries.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', marginBottom: '3rem' }}>
          No enquiries yet. Listing more warehouses will increase visibility!
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '3rem' }}>
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
                    <td style={{ padding: '1rem', fontWeight: 500 }}><Link href={`/enquiries/${e.id}`} style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>{wh?.name || e.warehouse_id}</Link></td>
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
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>My Warehouses</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {warehouses.map((w: any) => (
          <div key={w.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h3 style={{ fontWeight: 700 }}>{w.name}</h3>
              <span className={`badge ${w.status === 'active' ? 'badge-success' : w.status === 'draft' ? 'badge-info' : w.status === 'delisted' ? 'badge-danger' : 'badge-warning'}`}>
                {w.status}
              </span>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              {w.city}, {w.state} · {w.warehouse_type?.replace(/_/g, ' ')}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <Link href={`/warehouses/${w.id}`} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem' }}>
                View Details
              </Link>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(w.status === 'draft') && (
                  <button onClick={async () => {
                    await fetch(`${BASE_URL}/warehouses/${w.id}/submit`, { method: 'POST' });
                    loadData();
                  }} className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>Submit for Review</button>
                )}
                <Link href={`/warehouses/${w.id}/edit`} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>Edit</Link>
                <button onClick={() => handleDelete(w.id)} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
