import Link from 'next/link';
import { BASE_URL as BASE } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

async function getEnquiryDetail(id: string) {
  try {
    const res = await fetch(`${BASE}/enquiries/${id}`, { cache: 'no-store' });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch { return null; }
}

async function getMessages(id: string) {
  try {
    const res = await fetch(`${BASE}/enquiries/${id}/messages`, { cache: 'no-store' });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch { return []; }
}

export default async function EnquiryDetailPage({ params }: { params: { id: string } }) {
  const enquiry = await getEnquiryDetail(params.id);
  const messages = await getMessages(params.id);

  if (!enquiry) {
    return (
      <main className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Enquiry not found</h1>
        <Link href="/dashboard" className="btn btn-primary" style={{ marginTop: '2rem' }}>Back to Dashboard</Link>
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span className={`badge ${enquiry.status === 'submitted' ? 'badge-warning' : enquiry.status === 'accepted' ? 'badge-success' : 'badge-info'}`}>
              {enquiry.status.toUpperCase()}
            </span>
            <span style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>ID: {enquiry.id}</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900 }}>{enquiry.warehouse_name || 'Warehouse Enquiry'}</h1>
        </div>
        <Link href="/dashboard" className="btn btn-outline">← Dashboard</Link>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
        {/* Chat / Timeline Area */}
        <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '70vh' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Conversation</h2>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--muted)', marginTop: '4rem' }}>
                <p>No messages yet. Send a message to start negotiating.</p>
              </div>
            ) : (
              messages.map((m: any) => (
                <div key={m.id} style={{ 
                  alignSelf: m.sender_id === 'system' ? 'center' : (m.sender_id === 'user-2' ? 'flex-end' : 'flex-start'),
                  maxWidth: m.sender_id === 'system' ? '100%' : '80%',
                }}>
                  {m.sender_id === 'system' ? (
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', background: 'var(--background)', padding: '0.25rem 0.75rem', borderRadius: '99px', border: '1px solid var(--border)' }}>
                      {m.metadata?.event?.replace(/_/g, ' ') || 'System Event'} · {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  ) : (
                    <div style={{ 
                      padding: '0.75rem 1rem', 
                      borderRadius: '1rem', 
                      background: m.sender_id === 'user-2' ? 'var(--primary)' : 'var(--surface)', 
                      color: m.sender_id === 'user-2' ? 'white' : 'var(--foreground)',
                      border: m.sender_id === 'user-2' ? 'none' : '1px solid var(--border)',
                      borderBottomRightRadius: m.sender_id === 'user-2' ? '0.25rem' : '1rem',
                      borderBottomLeftRadius: m.sender_id === 'user-2' ? '1rem' : '0.25rem',
                    }}>
                      <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{m.body}</p>
                      <p style={{ fontSize: '0.65rem', marginTop: '0.25rem', opacity: 0.8, textAlign: 'right' }}>
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
            <form action={async (fd) => {
              'use server';
              const body = fd.get('message');
              if (!body) return;
              await fetch(`${BASE}/enquiries/${params.id}/messages`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ body, sender_id: 'user-2', message_type: 'text' })
              });
              revalidatePath(`/enquiries/${params.id}`);
            }} style={{ display: 'flex', gap: '0.75rem' }}>
              <input 
                name="message"
                placeholder="Type your message..." 
                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '999px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
              />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '999px', padding: '0 1.5rem' }}>Send</button>
            </form>
          </div>
        </div>

        {/* Sidebar Info & Actions */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Enquiry Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                ['Required Area', `${Number(enquiry.required_area_sqft).toLocaleString()} sq.ft`],
                ['Cargo Type', enquiry.cargo_type?.replace(/_/g, ' ')],
                ['Start Date', new Date(enquiry.start_date).toLocaleDateString()],
                ['Duration', enquiry.duration_months ? `${enquiry.duration_months} months` : 'Not specified'],
              ].map(([lbl, val]) => (
                <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--muted)' }}>{lbl}</span>
                  <span style={{ fontWeight: 600 }}>{val}</span>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700 }}>Proposed Rate</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>
                {enquiry.proposed_price ? `₹${Number(enquiry.proposed_price)}` : 'Not offered'}
                <span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 500 }}> /sq.ft</span>
              </p>
            </div>
          </div>

          <div className="card" style={{ background: 'var(--surface)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {enquiry.status === 'submitted' || enquiry.status === 'viewed' ? (
                <>
                  <form action={async () => {
                    'use server';
                    await fetch(`${BASE}/enquiries/${params.id}/respond`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: '{}' });
                    revalidatePath(`/enquiries/${params.id}`);
                  }}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Accept Interest</button>
                  </form>
                  <form action={async () => {
                    'use server';
                    await fetch(`${BASE}/enquiries/${params.id}/reject`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: '{}' });
                    revalidatePath(`/enquiries/${params.id}`);
                  }}>
                    <button type="submit" className="btn btn-outline" style={{ width: '100%', color: '#ef4444', borderColor: '#ef4444' }}>Decline Lead</button>
                  </form>
                </>
              ) : (
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', textAlign: 'center', fontStyle: 'italic' }}>
                  Lead is in {enquiry.status} status.
                </p>
              )}
            </div>
          </div>

          <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: 'var(--radius)', border: '1px solid #bfdbfe' }}>
            <p style={{ fontSize: '0.8rem', color: '#1d4ed8', lineHeight: 1.5 }}>
              <strong>Tip:</strong> Respond within 24 hours to increase your chance of closing this lead by 40%.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
