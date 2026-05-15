'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { BASE_URL as BASE } from '@/lib/api';

const STEPS = ['Company Details', 'Legal Numbers', 'Property Info', 'Review & Submit'];

export default function KYCPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    legal_entity_name: '', ownership_type: 'owned', land_type: 'industrial',
    gst_number: '', pan_number: '', cin_number: '',
    registered_address_line1: '', city: '', state: '', pincode: '',
    lease_expiry_date: '',
  });
  const [existingProfile, setExistingProfile] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      // Try to fetch existing KYC profile
      fetch(`${BASE}/admin/kyc/${u.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setExistingProfile(data.data);
            setForm(data.data);
            setSubmitted(true);
          }
        })
        .catch(console.error);
    } else {
      window.location.href = '/login?redirect=/kyc';
    }
  }, []);

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)',
    border: '1px solid var(--border)', background: 'var(--background)',
    color: 'var(--foreground)', fontSize: '1rem',
  };
  const labelStyle: React.CSSProperties = { fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' };
  const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.25rem' };

  const handleSubmit = async () => {
    setLoading(true); setError(null);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || 'user-3';
      
      const profileRes = await fetch(`${BASE}/kyc/profile`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, user_id: userId }),
      });
      const profileData = await profileRes.json();
      if (!profileData.success) throw new Error(profileData.errors?.[0]?.message || 'Failed to save profile');

      const submitRes = await fetch(`${BASE}/kyc/submit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      const submitData = await submitRes.json();
      if (!submitData.success) throw new Error(submitData.errors?.[0]?.message || 'Failed to submit');
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <main className="container" style={{ padding: '2rem 0', minHeight: '100vh', maxWidth: 680 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>KYC Profile</h1>
          <Link href="/dashboard" className="btn btn-outline" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
            ← Back to Dashboard
          </Link>
        </div>
        <div style={{ padding: '1rem', background: '#eff6ff', color: '#1e3a8a', borderRadius: 'var(--radius)', marginBottom: '2rem', border: '1px solid #bfdbfe' }}>
          ℹ️ Your KYC details have been submitted and are locked for review.
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Submitted Details</h2>
          {[
            ['Company', form.legal_entity_name],
            ['Ownership', form.ownership_type],
            ['Land Type', form.land_type],
            ['GST', form.gst_number || '—'],
            ['PAN', form.pan_number || '—'],
            ['CIN', form.cin_number || '—'],
            ['Address', form.registered_address_line1],
            ['City', form.city],
            ['State', form.state],
            ['Pincode', form.pincode],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{k}</span>
              <strong style={{ fontSize: '0.875rem' }}>{v as string}</strong>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: '2rem 0', minHeight: '100vh', maxWidth: 680 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>KYC Verification</h1>
        <Link href="/dashboard" className="btn btn-outline" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
          ← Back to Dashboard
        </Link>
      </div>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Complete verification to list your warehouse.</p>

      {/* Step Indicator */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              height: 4, borderRadius: 2, marginBottom: '0.5rem',
              background: i <= step ? 'var(--primary)' : 'var(--border)',
              transition: 'background 0.3s',
            }} />
            <span style={{ fontSize: '0.75rem', color: i <= step ? 'var(--primary)' : 'var(--border)', fontWeight: i === step ? 700 : 400 }}>{s}</span>
          </div>
        ))}
      </div>

      {error && <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>{error}</div>}

      <div className="card">
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Company Details</h2>
            <div style={fieldStyle}>
              <label style={labelStyle}>Legal Entity Name *</label>
              <input style={inputStyle} value={form.legal_entity_name} onChange={e => update('legal_entity_name', e.target.value)} placeholder="e.g. Acme Warehousing Pvt Ltd" />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Ownership Type *</label>
              <select style={inputStyle} value={form.ownership_type} onChange={e => update('ownership_type', e.target.value)}>
                <option value="owned">Owned</option>
                <option value="leased">Leased</option>
              </select>
            </div>
            {form.ownership_type === 'leased' && (
              <div style={fieldStyle}>
                <label style={labelStyle}>Lease Expiry Date * (required for leased)</label>
                <input type="date" style={inputStyle} value={form.lease_expiry_date} onChange={e => update('lease_expiry_date', e.target.value)} />
              </div>
            )}
            <div style={fieldStyle}>
              <label style={labelStyle}>Land Type</label>
              <select style={inputStyle} value={form.land_type} onChange={e => update('land_type', e.target.value)}>
                <option value="industrial">Industrial</option>
                <option value="commercial">Commercial</option>
                <option value="agricultural">Agricultural</option>
                <option value="special_economic_zone">Special Economic Zone</option>
              </select>
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Legal Numbers</h2>
            <div style={fieldStyle}>
              <label style={labelStyle}>GST Number</label>
              <input style={inputStyle} value={form.gst_number} onChange={e => update('gst_number', e.target.value.toUpperCase())} placeholder="e.g. 27AABCU9603R1ZX" />
              <small style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Format: 27AABCU9603R1ZX</small>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>PAN Number</label>
              <input style={inputStyle} value={form.pan_number} onChange={e => update('pan_number', e.target.value.toUpperCase())} placeholder="e.g. AABCU9603R" />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>CIN Number (Company)</label>
              <input style={inputStyle} value={form.cin_number} onChange={e => update('cin_number', e.target.value.toUpperCase())} placeholder="e.g. U63090MH2020PTC340000" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Registered Address</h2>
            <div style={fieldStyle}>
              <label style={labelStyle}>Address Line 1 *</label>
              <input style={inputStyle} value={form.registered_address_line1} onChange={e => update('registered_address_line1', e.target.value)} placeholder="Street, Building, Area" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>City *</label>
                <input style={inputStyle} value={form.city} onChange={e => update('city', e.target.value)} placeholder="Mumbai" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>State *</label>
                <input style={inputStyle} value={form.state} onChange={e => update('state', e.target.value)} placeholder="Maharashtra" />
              </div>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Pincode *</label>
              <input style={inputStyle} value={form.pincode} onChange={e => update('pincode', e.target.value)} placeholder="400001" maxLength={6} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Review & Submit</h2>
            {[
              ['Company', form.legal_entity_name],
              ['Ownership', form.ownership_type],
              ['GST', form.gst_number || '—'],
              ['PAN', form.pan_number || '—'],
              ['City', form.city],
              ['State', form.state],
              ['Pincode', form.pincode],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{k}</span>
                <strong style={{ fontSize: '0.875rem' }}>{v}</strong>
              </div>
            ))}
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
              By submitting, you confirm all information is accurate and consent to verification under the DPDP Act 2023.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0} className="btn btn-outline">
            ← Back
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} className="btn btn-primary">
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="btn btn-primary">
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
