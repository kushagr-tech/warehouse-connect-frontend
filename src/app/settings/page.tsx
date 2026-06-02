'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BASE_URL } from '@/lib/api';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [otpSent, setOtpSent] = useState<'email' | 'mobile' | null>(null);
  const [otp, setOtp] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setLoading(false);
    } else {
      window.location.href = '/login';
    }
  }, []);

  const handleSendOtp = (type: 'email' | 'mobile') => {
    // Show mock OTP in alert for development
    alert(`[DEV] OTP for ${type} is: 123456`);
    setOtpSent(type);
  };

  const handleVerifyOtp = async (type: 'email' | 'mobile') => {
    try {
      const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, otp })
      });
      const data = await res.json();
      if (data.success) {
        const updatedUser = { ...user, [`${type}_verified`]: true };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert(`${type} verified successfully!`);
        setOtpSent(null);
        setOtp('');
      } else {
        alert(data.errors?.[0]?.message || 'OTP verification failed');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const current_password = formData.get('current_password');
    const new_password = formData.get('new_password');
    
    try {
      const res = await fetch(`${BASE_URL}/users/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, current_password, new_password })
      });
      const data = await res.json();
      if (data.success) {
        alert('Password updated successfully');
        (e.target as HTMLFormElement).reset();
      } else {
        alert(data.errors?.[0]?.message || 'Failed to change password');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  if (loading) return <main className="container" style={{ padding: '2rem 0' }}>Loading...</main>;

  return (
    <main className="container" style={{ padding: '2rem 0', minHeight: '100vh', maxWidth: '800px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Settings</h1>
          <p style={{ color: 'var(--muted)' }}>Account security and preferences</p>
        </div>
        <Link href="/profile" className="btn btn-outline">← Back to Profile</Link>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Verification Section */}
        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Account Verification</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600 }}>Email Address</span>
                {user.email_verified ? (
                  <span className="badge badge-success">Verified</span>
                ) : (
                  <span className="badge badge-warning">Unverified</span>
                )}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '1rem' }}>{user.email}</p>
              {!user.email_verified && otpSent !== 'email' && (
                <button onClick={() => handleSendOtp('email')} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Send Verification Code</button>
              )}
              {otpSent === 'email' && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} style={{ padding: '0.4rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                  <button onClick={() => handleVerifyOtp('email')} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Verify</button>
                </div>
              )}
            </div>

            <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600 }}>Phone Number</span>
                {user.mobile_verified ? (
                  <span className="badge badge-success">Verified</span>
                ) : (
                  <span className="badge badge-warning">Unverified</span>
                )}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '1rem' }}>{user.mobile || 'Not provided'}</p>
              {!user.mobile_verified && otpSent !== 'mobile' && user.mobile && (
                <button onClick={() => handleSendOtp('mobile')} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Send Verification Code</button>
              )}
              {otpSent === 'mobile' && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} style={{ padding: '0.4rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                  <button onClick={() => handleVerifyOtp('mobile')} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Verify</button>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* Change Password */}
        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Change Password</h2>
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Current Password</label>
              <input name="current_password" type="password" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>New Password</label>
              <input name="new_password" type="password" required minLength={8} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>Update Password</button>
          </form>
        </section>

        {/* Notification Preferences */}
        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Email Notifications</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span>Receive enquiry alerts</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span>Receive compliance expiration alerts</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span>Marketing and product updates</span>
            </label>
          </div>
        </section>

      </div>
    </main>
  );
}
