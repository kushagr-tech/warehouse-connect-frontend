'use client';

import { useState } from 'react';
import { submitEnquiry } from '@/lib/api';

export default function EnquiryForm({ warehouseId }: { warehouseId: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      warehouse_id: warehouseId,
      required_area_sqft: Number(formData.get('area')),
      cargo_type: formData.get('cargo'),
      start_date: formData.get('date'),
    };

    try {
      const res = await submitEnquiry(payload);
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.errors?.[0]?.message || 'Failed to submit enquiry');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', background: '#dcfce7', borderRadius: 'var(--radius)' }}>
        <h3 style={{ color: '#166534', marginBottom: '0.5rem' }}>Success!</h3>
        <p style={{ color: '#166534' }}>Your enquiry has been submitted to the owner. They will contact you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '1rem' }}>
        Submit an enquiry to connect directly with the owner.
      </p>

      {error && (
        <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Required Area (sq.ft)</label>
        <input name="area" type="number" placeholder="e.g. 5000" required style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Cargo Type</label>
        <select name="cargo" required style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}>
          <option value="general">General</option>
          <option value="cold_chain">Cold Chain</option>
          <option value="hazmat">Hazmat</option>
          <option value="bonded">Bonded</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Expected Start Date</label>
        <input name="date" type="date" required style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }} />
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem' }}>
        {loading ? 'Submitting...' : 'Submit Enquiry'}
      </button>
    </form>
  );
}
