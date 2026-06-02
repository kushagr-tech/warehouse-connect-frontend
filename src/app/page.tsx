'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (savedUser) {setUser(JSON.parse(savedUser));}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    setUser(null);
  };

  return (
    <main className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>Warehouse Connect</h1>
        <nav style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/warehouses" className="btn btn-outline">Browse</Link>
          {user ? (
            <>
              <Link href={['super_admin', 'admin'].includes(user.role) ? '/admin' : '/dashboard'} className="btn btn-primary">Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-outline">Logout</button>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary">Login</Link>
          )}
        </nav>
      </header>

      <section style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '4rem 0'
      }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.1 }}>
          The Premier Network for<br />
          <span style={{ color: 'var(--primary)' }}>Industrial Storage.</span>
        </h2>
        <p style={{ fontSize: '1.25rem', color: 'var(--muted)', maxWidth: '600px', marginBottom: '2.5rem' }}>
          Connect with high-quality warehouse space owners instantly. From cold storage to bonded facilities, find your perfect industrial space with complete transparency.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/warehouses" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
            Find Space
          </Link>
          <Link href="/warehouses/new" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
            List Your Warehouse
          </Link>
        </div>
      </section>
      
      <section style={{ padding: '4rem 0', borderTop: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>Why Choose Warehouse Connect?</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🛡️</div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Verified Compliance</h4>
            <p style={{ color: 'var(--muted)' }}>Every facility is rigorously checked for safety, legal, and operational compliance before listing.</p>
          </div>
          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Instant Connections</h4>
            <p style={{ color: 'var(--muted)' }}>Direct messaging and streamlined enquiry process removes brokers and unnecessary delays.</p>
          </div>
          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❄️</div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Specialized Spaces</h4>
            <p style={{ color: 'var(--muted)' }}>Easily filter for cold-chain, bonded, or hazmat-compliant facilities tailored to your cargo.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
