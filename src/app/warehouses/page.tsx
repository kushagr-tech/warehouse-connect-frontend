import { fetchWarehouses } from '@/lib/api';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function WarehousesPage({ searchParams }: { searchParams: { 
  q?: string; 
  type?: string; 
  city?: string;
  min_price?: string;
  max_price?: string;
} }) {
  let warehouses: any[] = [];
  let error = null;

  try {
    // Build the query string for filtering
    const params = new URLSearchParams();
    if (searchParams.q) params.append('q', searchParams.q);
    if (searchParams.type) params.append('warehouse_type', searchParams.type);
    if (searchParams.city) params.append('city', searchParams.city);
    if (searchParams.min_price) params.append('min_price', searchParams.min_price);
    if (searchParams.max_price) params.append('max_price', searchParams.max_price);

    const res = await fetchWarehouses(params.toString());
    if (res.success) {
      warehouses = res.data;
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load warehouses.';
  }

  const warehouseTypes = ['dry_storage', 'cold_storage', 'open_yard', 'container_storage', 'bonded', 'hazmat', 'multi_use'];

  return (
    <main className="container" style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.025em' }}>Marketplace</h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>Discovery industrial spaces across India.</p>
        </div>
        <Link href="/" className="btn btn-outline" style={{ borderRadius: '999px' }}>
          &larr; Home
        </Link>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem', alignItems: 'start' }}>
        {/* Filters Sidebar */}
        <aside style={{ position: 'sticky', top: '2rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem' }}>🔍</span> Filters
            </h2>
            
            <form action="/warehouses" method="GET" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Search</label>
                <input 
                  type="text" 
                  name="q" 
                  defaultValue={searchParams.q || ''} 
                  placeholder="Name or keyword..."
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Warehouse Type</label>
                <select 
                  name="type" 
                  defaultValue={searchParams.type || ''}
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
                >
                  <option value="">All Types</option>
                  {warehouseTypes.map(t => (
                    <option key={t} value={t}>{t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Location</label>
                <input 
                  type="text" 
                  name="city" 
                  defaultValue={searchParams.city || ''} 
                  placeholder="City name..."
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>Price Range (₹)</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="number" name="min_price" placeholder="Min" defaultValue={searchParams.min_price} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', fontSize: '0.85rem' }} />
                  <span>-</span>
                  <input type="number" name="max_price" placeholder="Max" defaultValue={searchParams.max_price} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', fontSize: '0.85rem' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem' }}>Apply</button>
                <Link href="/warehouses" className="btn btn-outline" style={{ padding: '0.75rem' }}>Reset</Link>
              </div>
            </form>
          </div>
        </aside>

        {/* Results Area */}
        <section>
          {error && (
            <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
              ⚠️ {error}
            </div>
          )}

          {!error && warehouses.length === 0 && (
            <div style={{ textAlign: 'center', padding: '6rem 0', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏚️</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Spaces Found</h3>
              <p style={{ color: 'var(--muted)' }}>Try adjusting your filters or search terms.</p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {warehouses.map((w: any) => (
              <div key={w.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden', transition: 'transform 0.2s' }}>
                <div style={{ padding: '1.5rem', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{w.name}</h2>
                    {w.verified_badge && (
                      <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>VERIFIED</span>
                    )}
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>
                    {w.description}
                  </p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.5rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '4px' }}>
                      {w.warehouse_type.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.5rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '4px' }}>
                      📍 {w.city}
                    </span>
                    {w.is_bonded && (
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.5rem', background: '#dcfce7', color: '#166534', borderRadius: '4px' }}>
                        BONDED
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ padding: '1.25rem 1.5rem', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>Starting from</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)' }}>
                      ₹{Number(w.base_price || 0)}<span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--muted)' }}>/{w.pricing_unit === 'per_sqft' ? 'sq.ft' : 'unit'}</span>
                    </p>
                  </div>
                  <Link href={`/warehouses/${w.id}`} className="btn btn-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.875rem' }}>
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
