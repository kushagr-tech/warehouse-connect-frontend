'use client';

import { useState } from 'react';
import Link from 'next/link';
import { register, verifyOtp } from '@/lib/api';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('warehouse_owner');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Register, 2: OTP
  const [userId, setUserId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await register({ email, mobile, password, role });
      if (res.success) {
        setUserId(res.data.userId);
        setStep(2);
        alert('[DEV] OTP is: 123456');
      } else {
        setError(res.errors?.[0]?.message || 'Registration failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await verifyOtp({ userId, otp });
      if (res.success) {
        window.location.href = '/login?registered=true';
      } else {
        setError(res.errors?.[0]?.message || 'OTP verification failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', 
    background: 'var(--background)', color: 'var(--foreground)'
  };
  const labelStyle: React.CSSProperties = { fontSize: '0.875rem', fontWeight: 600 };

  return (
    <main className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem', color: 'var(--primary)' }}>Warehouse Connect</h1>
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '2rem' }}>
          {step === 1 ? 'Create a new account' : 'Verify your mobile number'}
        </p>

        {error && (
          <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" style={inputStyle} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Mobile Number</label>
              <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} required pattern="^[0-9]{10,15}$" style={inputStyle} placeholder="e.g. 9876543210" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  style={{ ...inputStyle, width: '100%', paddingRight: '2.5rem' }} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--muted)' }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>I want to...</label>
              <select value={role} onChange={e => setRole(e.target.value)} style={inputStyle}>
                <option value="warehouse_owner">List my warehouse space</option>
                <option value="customer">Find and rent warehouse space</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              {loading ? 'Registering...' : 'Create Account'}
            </button>

            <p style={{ fontSize: '0.875rem', textAlign: 'center', marginTop: '1rem', color: 'var(--muted)' }}>
              Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ padding: '0.75rem', background: '#e0f2fe', color: '#0369a1', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>
              An OTP has been sent to your mobile number. (Use any 6-digit number for this demo, e.g., 123456)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Enter 6-digit OTP</label>
              <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required maxLength={6} style={inputStyle} placeholder="123456" />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
