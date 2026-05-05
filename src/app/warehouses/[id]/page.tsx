import { fetchWarehouseById } from '@/lib/api';
import Link from 'next/link';
import EnquiryForm from './EnquiryForm';

export default async function WarehouseDetailPage({ params }: { params: { id: string } }) {
  let warehouse: any = null;
  let error = null;

  try {
    const res = await fetchWarehouseById(params.id);
    if (res.success) {
      warehouse = res.data;
    }
  } catch (err) {
    if (err instanceof Error) {
      error = err.message;
    } else {
      error = 'Failed to fetch warehouse';
    }
  }

  if (error || !warehouse) {
    return (
      <main className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--accent)', marginBottom: '1rem', fontSize: '2rem' }}>Oops!</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>{error || 'Warehouse not found'}</p>
        <Link href="/warehouses" className="btn btn-primary">Back to Search</Link>
      </main>
    );
  }

  const specs = [
    { label: 'Type', value: warehouse.warehouse_type?.replace(/_/g, ' ') },
    { label: 'Structure', value: warehouse.structure_type?.toUpperCase() || 'N/A' },
    { label: 'Total Area', value: warehouse.total_area_sqft ? `${Number(warehouse.total_area_sqft).toLocaleString()} sq.ft` : 'N/A' },
    { label: 'Available Area', value: warehouse.available_area_sqft ? `${Number(warehouse.available_area_sqft).toLocaleString()} sq.ft` : 'N/A' },
    { label: 'Clear Height', value: warehouse.clear_height_feet ? `${Number(warehouse.clear_height_feet)} ft` : 'N/A' },
    { label: 'Bonded Facility', value: warehouse.is_bonded ? 'Yes' : 'No' },
    { label: 'Available From', value: new Date(warehouse.available_from).toLocaleDateString() },
    { label: 'Price', value: warehouse.base_price ? `₹${Number(warehouse.base_price)} ${warehouse.pricing_unit?.replace(/_/g, ' ')} / ${warehouse.pricing_period}` : 'Contact for pricing' },
  ];

  return (
    <main className="container" style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <Link href="/warehouses" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--muted)' }}>
        &larr; Back to Warehouses
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem' }}>
        {/* Left Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>{warehouse.name}</h1>
            {warehouse.verified_badge && (
              <span className="badge badge-success">✓ Verified ({warehouse.compliance_score}/100)</span>
            )}
            {warehouse.is_featured && (
              <span className="badge badge-warning">⭐ Featured</span>
            )}
          </div>
          
          <p style={{ fontSize: '1.1rem', color: 'var(--muted)', marginBottom: '2rem' }}>
            📍 {warehouse.address_line1}, {warehouse.city}, {warehouse.state} - {warehouse.pincode}
          </p>

          {/* Map Placeholder */}
          <div style={{
            width: '100%', height: '250px', 
            background: 'linear-gradient(135deg, var(--surface), var(--background))', 
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '2.5rem',
            color: 'var(--muted)'
          }}>
            <p style={{ fontSize: '1rem' }}>🗺️ Map will appear when Google Maps API key is configured</p>
          </div>

          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontWeight: 700 }}>Overview</h2>
          <p style={{ lineHeight: 1.8, marginBottom: '2.5rem', color: 'var(--foreground)' }}>{warehouse.description}</p>

          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>Specifications</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2.5rem' }}>
            {specs.map(({ label, value }) => (
              <div key={label} style={{ background: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <strong style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>{label}</strong>
                <span style={{ fontSize: '0.95rem', textTransform: 'capitalize' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Connectivity */}
          {warehouse.connectivity && (
            <>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>Connectivity</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2.5rem' }}>
                <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <strong style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>Road Access</strong>
                  {warehouse.connectivity.road_type?.replace(/_/g, ' ')} {warehouse.connectivity.truck_access_24x7 ? '(24x7)' : ''}
                </div>
                {warehouse.connectivity.nearest_highway_name && (
                  <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <strong style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>Nearest Highway</strong>
                    {warehouse.connectivity.nearest_highway_name} ({Number(warehouse.connectivity.nearest_highway_km)} km)
                  </div>
                )}
                {warehouse.connectivity.nearest_port_name && (
                  <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <strong style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>Nearest Port</strong>
                    {warehouse.connectivity.nearest_port_name} ({Number(warehouse.connectivity.nearest_port_km)} km)
                  </div>
                )}
                {warehouse.connectivity.nearest_railway_station && (
                  <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <strong style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>Nearest Railway</strong>
                    {warehouse.connectivity.nearest_railway_station} ({Number(warehouse.connectivity.nearest_railway_station_km)} km)
                  </div>
                )}
              </div>
            </>
          )}

          {/* Utilities */}
          {warehouse.utilities && (
            <>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>Utilities & Amenities</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
                {warehouse.utilities.has_electricity && <span className="badge badge-success">⚡ Electricity</span>}
                {warehouse.utilities.has_backup_generator && <span className="badge badge-success">🔋 Backup Generator</span>}
                {warehouse.utilities.has_water_supply && <span className="badge badge-success">💧 Water Supply</span>}
                {warehouse.utilities.has_loading_dock && <span className="badge badge-success">🚛 Loading Dock ({warehouse.utilities.loading_dock_count})</span>}
                {warehouse.utilities.has_forklift && <span className="badge badge-success">🏗️ Forklift</span>}
                {warehouse.utilities.has_industrial_lighting && <span className="badge badge-success">💡 Industrial Lighting</span>}
                {warehouse.utilities.has_ventilation && <span className="badge badge-success">🌬️ Ventilation</span>}
              </div>
            </>
          )}

          {/* Compliance */}
          {warehouse.compliance_certificates?.length > 0 && (
            <>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>Compliance Certificates</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
                {warehouse.compliance_certificates.map((cert: any) => (
                  <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <div>
                      <p style={{ fontWeight: 600, textTransform: 'capitalize' }}>{cert.certificate_type.replace(/_/g, ' ')}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{cert.issuing_authority} · Expires: {new Date(cert.expiry_date).toLocaleDateString()}</p>
                    </div>
                    <span className={`badge ${cert.verification_status === 'verified' ? 'badge-success' : cert.verification_status === 'expired' ? 'badge-danger' : 'badge-warning'}`}>
                      {cert.verification_status}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Column */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Interested in this space?</h3>
            <EnquiryForm warehouseId={warehouse.id} />
          </div>
        </div>
      </div>
    </main>
  );
}
