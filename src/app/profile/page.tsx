'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BASE_URL } from '@/lib/api';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setLoading(false);
    } else {
      window.location.href = '/login';
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Mock save
    setTimeout(() => {
      setSaving(false);
      alert('Profile details updated successfully.');
    }, 800);
  };

  if (loading) return <main className="container" style={{ padding: '2rem 0' }}>Loading...</main>;

  return (
    <main className="container" style={{ padding: '2rem 0', minHeight: '100vh', maxWidth: '800px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Profile</h1>
          <p style={{ color: 'var(--muted)' }}>Manage your personal information</p>
        </div>
        <Link href="/" className="btn btn-outline">Home</Link>
      </header>

      <div className="card">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email Address (Read-only)</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input 
                type="email" 
                value={user.email} 
                disabled 
                style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', opacity: 0.7 }} 
              />
              {user.email_verified ? (
                <span className="badge badge-success">Verified</span>
              ) : (
                <Link href="/settings" className="badge badge-warning">Verify in Settings</Link>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>Email changes require admin approval.</p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Phone Number (Read-only)</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input 
                type="text" 
                value={user.mobile || ''} 
                disabled 
                style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', opacity: 0.7 }} 
              />
              {user.mobile_verified ? (
                <span className="badge badge-success">Verified</span>
              ) : (
                <Link href="/settings" className="badge badge-warning">Verify in Settings</Link>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>Phone number changes require OTP verification.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>First Name</label>
              <input type="text" placeholder="e.g. John" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Last Name</label>
              <input type="text" placeholder="e.g. Doe" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Role</label>
              <input type="text" value={user.role.replace(/_/g, ' ')} disabled style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', textTransform: 'capitalize', opacity: 0.7 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>KYC Status</label>
              <input type="text" value={user.kyc_status.replace(/_/g, ' ')} disabled style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', textTransform: 'capitalize', opacity: 0.7 }} />
            </div>
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link href="/settings" className="btn btn-outline">Go to Settings</Link>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
