'use client';

import { useState } from 'react';

export default function LogoutButton({ className, style }: { className?: string, style?: React.CSSProperties }) {
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)} 
        className={className || "btn btn-primary"} 
        style={style}
      >
        Log out
      </button>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card" style={{ maxWidth: '400px', width: '90%', margin: '0 auto', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Confirm Logout</h3>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Are you sure you want to log out of your account?</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
              <button onClick={handleLogout} className="btn btn-primary" style={{ flex: 1, background: '#ef4444', borderColor: '#ef4444' }}>Log out</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
