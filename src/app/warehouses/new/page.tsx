'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { BASE_URL as BASE } from '@/lib/api';

const WH_TYPES = ['dry_storage', 'cold_storage', 'open_yard', 'container_storage', 'bonded', 'hazmat', 'multi_use', 'liquid_storage'];
const PRICING_UNITS = ['per_sqft', 'per_pallet', 'per_container', 'per_cbm'];
const PRICING_PERIODS = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];

export default function NewWarehousePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', description: '', warehouse_type: 'dry_storage',
    address_line1: '', address_line2: '', city: '', state: '', pincode: '',
    total_area_sqft: '', available_area_sqft: '', minimum_rentable_sqft: '',
    occupied_area_sqft: '', occupied_until: '',
    base_price: '', pricing_unit: 'per_sqft', pricing_period: 'monthly',
    is_bonded: false, customs_license_number: '', cold_storage_min_temp: '', cold_storage_max_temp: '',
    structure_type: 'peb', flooring_type: 'concrete',
  });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const pendingForm = sessionStorage.getItem('pendingWarehouse');
    if (pendingForm) {
      setForm(JSON.parse(pendingForm));
      sessionStorage.removeItem('pendingWarehouse');
    }
  }, []);

  const update = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)',
    border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)',
  };
  const labelStyle: React.CSSProperties = { fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      sessionStorage.setItem('pendingWarehouse', JSON.stringify(form));
      window.location.href = '/login?redirect=/warehouses/new';
      return;
    }
    
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${BASE}/warehouses`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, owner_id: user.id }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.errors?.[0]?.message || 'Failed to create');
      setSuccess(data.data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <main className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }} className="card">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏭</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary)' }}>Warehouse Created!</h1>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
            Your warehouse has been saved as a <strong>draft</strong>. Complete connectivity & utilities info, then submit for admin review.
          </p>
          <Link href={`/warehouses/${success}`} className="btn btn-primary">View Warehouse →</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: '2rem 0', minHeight: '100vh', maxWidth: 720 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>List a Warehouse</h1>
          <p style={{ color: 'var(--muted)' }}>Add your facility to the Warehouse Connect marketplace.</p>
        </div>
        <Link href="/dashboard" className="btn btn-outline">← Dashboard</Link>
      </div>

      {error && <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Basic Info */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>Basic Information</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={labelStyle}>Warehouse Name *</label>
            <input required style={inputStyle} value={form.name} onChange={e => update('name', e.target.value)} placeholder="Prime Logistics Hub" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={labelStyle}>Description</label>
            <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={form.description} onChange={e => update('description', e.target.value)} placeholder="Describe your facility, key features, nearby landmarks..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={labelStyle}>Warehouse Type *</label>
              <select required style={inputStyle} value={form.warehouse_type} onChange={e => update('warehouse_type', e.target.value)}>
                {WH_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={labelStyle}>Structure Type</label>
              <select style={inputStyle} value={form.structure_type} onChange={e => update('structure_type', e.target.value)}>
                {['peb', 'rcc', 'shed', 'open_yard', 'temporary'].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
              </select>
            </div>
          </div>

          {/* Bonded */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_bonded} onChange={e => update('is_bonded', e.target.checked)} style={{ width: 18, height: 18 }} />
            <span style={{ fontWeight: 600 }}>This is a customs-bonded warehouse</span>
          </label>
          {form.is_bonded && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={labelStyle}>Customs License Number *</label>
              <input required style={inputStyle} value={form.customs_license_number} onChange={e => update('customs_license_number', e.target.value)} />
            </div>
          )}

          {/* Cold storage */}
          {form.warehouse_type === 'cold_storage' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', background: '#eff6ff', borderRadius: 'var(--radius)', border: '1px solid #bfdbfe' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ ...labelStyle, color: '#1d4ed8' }}>Min Temp (°C) *</label>
                <input required type="number" style={inputStyle} value={form.cold_storage_min_temp} onChange={e => update('cold_storage_min_temp', e.target.value)} placeholder="-18" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ ...labelStyle, color: '#1d4ed8' }}>Max Temp (°C) *</label>
                <input required type="number" style={inputStyle} value={form.cold_storage_max_temp} onChange={e => update('cold_storage_max_temp', e.target.value)} placeholder="4" />
              </div>
            </div>
          )}
        </div>

        {/* Area & Pricing */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>Area & Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            {[['Total Area (sq.ft)', 'total_area_sqft'], ['Available Area (sq.ft)', 'available_area_sqft'], ['Min Rentable (sq.ft)', 'minimum_rentable_sqft']].map(([lbl, key]) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={labelStyle}>{lbl}</label>
                <input type="number" style={inputStyle} value={(form as any)[key]} onChange={e => update(key, e.target.value)} placeholder="0" />
              </div>
            ))}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={labelStyle}>Occupied Area (sq.ft) <span style={{fontWeight: 400, color: 'var(--muted)'}}>(if currently taken)</span></label>
              <input type="number" style={inputStyle} value={form.occupied_area_sqft} onChange={e => update('occupied_area_sqft', e.target.value)} placeholder="0" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={labelStyle}>Occupied Until <span style={{fontWeight: 400, color: 'var(--muted)'}}>(date)</span></label>
              <input type="date" style={inputStyle} value={form.occupied_until} onChange={e => update('occupied_until', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={labelStyle}>Base Price (₹) *</label>
              <input required type="number" style={inputStyle} value={form.base_price} onChange={e => update('base_price', e.target.value)} placeholder="22" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={labelStyle}>Pricing Unit *</label>
              <select required style={inputStyle} value={form.pricing_unit} onChange={e => update('pricing_unit', e.target.value)}>
                {PRICING_UNITS.map(u => <option key={u} value={u}>{u.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={labelStyle}>Pricing Period *</label>
              <select required style={inputStyle} value={form.pricing_period} onChange={e => update('pricing_period', e.target.value)}>
                {PRICING_PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>Location</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={labelStyle}>Address Line 1 *</label>
            <input required style={inputStyle} value={form.address_line1} onChange={e => update('address_line1', e.target.value)} placeholder="Plot No., Street, Area" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={labelStyle}>Address Line 2</label>
            <input style={inputStyle} value={form.address_line2} onChange={e => update('address_line2', e.target.value)} placeholder="Landmark, MIDC, Phase, etc." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            {[['City *', 'city'], ['State *', 'state'], ['Pincode *', 'pincode']].map(([lbl, key]) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={labelStyle}>{lbl}</label>
                <input required style={inputStyle} value={(form as any)[key]} onChange={e => update(key, e.target.value)} placeholder={lbl.replace(' *', '')} />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem' }}>
          {loading ? 'Creating...' : '🏭 Create Warehouse Listing'}
        </button>
      </form>
    </main>
  );
}
