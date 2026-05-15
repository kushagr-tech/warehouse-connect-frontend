import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { BASE_URL as BASE } from '@/lib/api';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getKycProfile(userId: string) {
  try {
    const res = await fetch(`${BASE}/admin/kyc/${userId}`, { cache: 'no-store' });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch { return null; }
}

export default async function KycDetail({ params }: { params: { id: string } }) {
  const profile = await getKycProfile(params.id);

  if (!profile) {
    return (
      <main className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Profile not found</h1>
        <Link href="/admin/kyc" className="btn btn-primary" style={{ marginTop: '2rem' }}>Back to Queue</Link>
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: '2rem 0', minHeight: '100vh', maxWidth: 800 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>KYC Review: {profile.legal_entity_name}</h1>
          <p style={{ color: 'var(--muted)' }}>User ID: {params.id}</p>
        </div>
        <Link href="/admin/kyc" className="btn btn-outline">← Back to Queue</Link>
      </header>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Company Details</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div><span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Entity Name</span><p style={{ fontWeight: 600 }}>{profile.legal_entity_name}</p></div>
          <div><span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Ownership Type</span><p style={{ fontWeight: 600 }}>{profile.ownership_type}</p></div>
          <div><span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Land Type</span><p style={{ fontWeight: 600 }}>{profile.land_type}</p></div>
          {profile.lease_expiry_date && <div><span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Lease Expiry</span><p style={{ fontWeight: 600 }}>{new Date(profile.lease_expiry_date).toLocaleDateString()}</p></div>}
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginTop: '1rem' }}>Legal Numbers</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div><span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>GST</span><p style={{ fontWeight: 600 }}>{profile.gst_number || 'N/A'}</p></div>
          <div><span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>PAN</span><p style={{ fontWeight: 600 }}>{profile.pan_number || 'N/A'}</p></div>
          <div><span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>CIN</span><p style={{ fontWeight: 600 }}>{profile.cin_number || 'N/A'}</p></div>
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginTop: '1rem' }}>Registered Address</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: 'span 2' }}><span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Address Line 1</span><p style={{ fontWeight: 600 }}>{profile.registered_address_line1}</p></div>
          <div><span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>City</span><p style={{ fontWeight: 600 }}>{profile.city}</p></div>
          <div><span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>State & Pincode</span><p style={{ fontWeight: 600 }}>{profile.state} - {profile.pincode}</p></div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem', background: 'var(--surface)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Decision</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <form action={async () => {
            'use server';
            await fetch(`${BASE}/admin/kyc/${params.id}/approve`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: '{}' });
            revalidatePath('/admin/kyc');
            redirect('/admin/kyc');
          }} style={{ flex: 1 }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>✅ Approve KYC</button>
          </form>

          <form action={async (fd) => {
            'use server';
            const reason = fd.get('reason');
            await fetch(`${BASE}/admin/kyc/${params.id}/reject`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason }) });
            revalidatePath('/admin/kyc');
            redirect('/admin/kyc');
          }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input name="reason" placeholder="Reason for rejection (required)" required style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
            <button type="submit" className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444', width: '100%', padding: '0.75rem' }}>❌ Reject KYC</button>
          </form>
        </div>
      </div>
    </main>
  );
}
