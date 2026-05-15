'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BASE_URL as BASE } from '@/lib/api';

export default function AdminCompliancePage() {
  const [compliances, setCompliances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BASE}/admin/compliance/pending`, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => { if (data.success) setCompliances(data.data); else setError('Failed to load compliance records.'); })
      .catch(() => setError('Backend not reachable.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main className="container" style={{ padding: '2rem 0' }}>Loading...</main>;

  return (
    <main className="container" style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Pending Compliance</h1>
          <p style={{ color: 'var(--muted)' }}>{compliances.length} certificate(s) requiring review</p>
        </div>
        <Link href="/admin" className="btn btn-outline">← Admin Portal</Link>
      </header>

      {error && <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>{error}</div>}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface)', borderBottom: '2px solid var(--border)' }}>
              {['Warehouse ID', 'Cert Type', 'Issuer', 'Expiry', 'Status', 'Submitted'].map(h => (
                <th key={h} style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compliances.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>No pending compliance records found.</td></tr>
            )}
            {compliances.map((c: any) => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem', fontWeight: 600 }}>{c.warehouse_id}</td>
                <td style={{ padding: '1rem' }}>{c.certificate_type?.replace(/_/g, ' ')}</td>
                <td style={{ padding: '1rem' }}>{c.issued_by}</td>
                <td style={{ padding: '1rem' }}>{new Date(c.expiry_date).toLocaleDateString()}</td>
                <td style={{ padding: '1rem' }}>
                  <span className="badge badge-warning">{c.verification_status}</span>
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
