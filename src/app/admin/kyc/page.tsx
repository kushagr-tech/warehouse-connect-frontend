import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

import { BASE_URL as BASE } from '@/lib/api';

async function getKycQueue() {
  try {
    const res = await fetch(`${BASE}/admin/kyc/queue`, { cache: 'no-store' });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch { return []; }
}

export default async function KYCQueuePage() {
  const queue = await getKycQueue();

  return (
    <main className="container" style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>KYC Review Queue</h1>
          <p style={{ color: 'var(--muted)' }}>{queue.length} submission(s) pending review.</p>
        </div>
        <Link href="/admin" className="btn btn-outline">← Admin Portal</Link>
      </div>

      {queue.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>✅</p>
          <p style={{ color: 'var(--muted)' }}>All KYC submissions have been reviewed.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {queue.map((k: any) => (
            <div key={k.id} className="card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{k.legal_entity_name}</h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {k.city}, {k.state} · {k.ownership_type} · GST: {k.gst_number || '—'} · PAN: {k.pan_number || '—'}
                </p>
                <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--muted)' }}>
                  Submitted: {new Date(k.kyc_submitted_at).toLocaleDateString()}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <KycActionButton userId={k.user_id} action="approve" />
                <KycActionButton userId={k.user_id} action="reject" />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function KycActionButton({ userId, action }: { userId: string; action: 'approve' | 'reject' }) {
  const isApprove = action === 'approve';
  return (
    <form action={async () => {
      'use server';
      const body: any = isApprove ? {} : { reason: 'Documents incomplete or illegible' };
      await fetch(`${BASE}/admin/kyc/${userId}/${action}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      revalidatePath('/admin/kyc');
    }}>
      <button type="submit" className={isApprove ? 'btn btn-primary' : 'btn btn-outline'} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: isApprove ? undefined : '#ef4444', borderColor: isApprove ? undefined : '#ef4444' }}>
        {isApprove ? '✓ Approve' : '✗ Reject'}
      </button>
    </form>
  );
}
