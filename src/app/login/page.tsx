'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { login } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@warehouseconnect.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await login({ email, password });
      if (res.success) {
        const userStr = JSON.stringify(res.data.user);
        if (rememberMe) {
          localStorage.setItem('user', userStr);
        } else {
          sessionStorage.setItem('user', userStr);
        }
        setSuccess(true);
        setTimeout(() => {
          const role = res.data.user.role;
          const redirect = new URLSearchParams(window.location.search).get('redirect');
          if (redirect) {
            window.location.href = redirect;
          } else if (role === 'super_admin' || role === 'admin') {
            window.location.href = '/admin';
          } else if (role === 'customer') {
            window.location.href = '/customer-dashboard';
          } else {
            window.location.href = '/dashboard';
          }
        }, 1000);
      } else {
        setError(res.errors?.[0]?.message || 'Login failed');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem', color: 'var(--primary)' }}>Warehouse Connect</h1>
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '2rem' }}>Sign in to your account</p>

        {error && (
          <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '0.75rem', background: '#dcfce7', color: '#166534', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>
            Login successful. Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Password</label>
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ width: '100%', padding: '0.75rem', paddingRight: '2.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }} 
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

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
            Remember me
          </label>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'center', marginBottom: '0.75rem' }}>Quick Test Login</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-outline" style={{ flex: '1 1 45%', fontSize: '0.7rem', padding: '0.5rem' }} onClick={() => { setEmail('superadmin@warehouseconnect.com'); setPassword('password'); }}>Super Admin</button>
              <button type="button" className="btn btn-outline" style={{ flex: '1 1 45%', fontSize: '0.7rem', padding: '0.5rem' }} onClick={() => { setEmail('admin@warehouseconnect.com'); setPassword('password'); }}>Admin</button>
              <button type="button" className="btn btn-outline" style={{ flex: '1 1 45%', fontSize: '0.7rem', padding: '0.5rem' }} onClick={() => { setEmail('owner@example.com'); setPassword('password'); }}>Owner</button>
              <button type="button" className="btn btn-outline" style={{ flex: '1 1 45%', fontSize: '0.7rem', padding: '0.5rem' }} onClick={() => { setEmail('customer@example.com'); setPassword('password'); }}>Customer</button>
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', textAlign: 'center', marginTop: '0.5rem', color: 'var(--muted)' }}>
            Don't have an account? <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create an account</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
