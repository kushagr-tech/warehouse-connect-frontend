import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

import { BASE_URL as BASE } from '@/lib/api';

async function getQueue() {
  try {
    const res = await fetch(`${BASE}/admin/warehouses/queue`, { cache: 'no-store' });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch { return []; }
}

export default async function WarehouseQueuePage() {
  const queue = await getQueue();

  return (
    <main className="container" style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Warehouse Review Queue</h1>
          <p style={{ color: 'var(--muted)' }}>{queue.length} warehouse(s) pending approval.</p>
        </div>
        <Link href="/admin" className="btn btn-outline">← Admin Portal</Link>
      </div>

      {queue.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>✅</p>
          <p style={{ color: 'var(--muted)' }}>No warehouses pending review.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {queue.map((w: any) => (
            <div key={w.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{w.name}</h2>
                  <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {w.warehouse_type.replace(/_/g, ' ')} · {w.city}, {w.state} · {w.address_line1}
                  </p>
                </div>
                <span style={{ background: '#fef3c7', color: '#92400e', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
                  PENDING REVIEW
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>{w.description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {[
                  ['Total Area', `${Number(w.total_area_sqft || 0).toLocaleString()} sq.ft`],
                  ['Price', `₹${Number(w.base_price || 0)} ${w.pricing_unit?.replace(/_/g, ' ')}`],
                  ['Bonded', w.is_bonded ? 'Yes' : 'No'],
                  ['Compliance Score', `${w.compliance_score}/100`],
                ].map(([lbl, val]) => (
                  <div key={lbl} style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>{lbl}</p>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{val}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <WarehouseApproveForm warehouseId={w.id} />
                <WarehouseRejectForm warehouseId={w.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function WarehouseApproveForm({ warehouseId }: { warehouseId: string }) {
  return (
    <form action={async () => {
      'use server';
      await fetch(`${BASE}/admin/warehouses/${warehouseId}/approve`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      revalidatePath('/admin/warehouses');
    }}>
      <button type="submit" className="btn btn-primary">✓ Approve & Publish</button>
    </form>
  );
}

function WarehouseRejectForm({ warehouseId }: { warehouseId: string }) {
  return (
    <form action={async () => {
      'use server';
      await fetch(`${BASE}/admin/warehouses/${warehouseId}/reject`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Insufficient documentation or listing details' }),
      });
      revalidatePath('/admin/warehouses');
    }}>
      <button type="submit" className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444' }}>✗ Reject</button>
    </form>
  );
}
