import React from 'react';

export default function Navbar({ activeTab, setActiveTab, hotelData, onBookClick }) {
  const hotel = hotelData?.hotel || { name: 'The Grand Horizon' };
  const totalRooms = hotelData?.totalRooms || 24;
  const occupied = hotelData?.occupied || 0;
  const available = hotelData?.available || 0;
  const occupancyRate = hotelData?.occupancyRate || 0;

  return (
    <header style={{
      background: '#FFFFFF',
      borderBottom: '1px solid var(--border-hairline)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Top Header Bar */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        {/* Brand */}
        <div>
          <span className="eyebrow" style={{ fontSize: '0.62rem', letterSpacing: '0.35em', marginBottom: '2px' }}>
            A Sanctuary of Quiet Elegance
          </span>
          <h1 className="font-serif" style={{ fontSize: '1.75rem', fontWeight: '400', letterSpacing: '0.04em' }}>
            THE GRAND HORIZON
          </h1>
        </div>

        {/* Quiet Live Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Inventory: </span>
            <strong style={{ color: 'var(--text-primary)' }}>{totalRooms} Suites</strong>
          </div>
          <div style={{ width: '1px', height: '14px', background: 'var(--border-hairline)' }} />
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Available: </span>
            <strong style={{ color: 'var(--accent-pine)' }}>{available}</strong>
          </div>
          <div style={{ width: '1px', height: '14px', background: 'var(--border-hairline)' }} />
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Occupied: </span>
            <strong style={{ color: 'var(--accent-clay)' }}>{occupied}</strong>
          </div>
          <div style={{ width: '1px', height: '14px', background: 'var(--border-hairline)' }} />
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Occupancy: </span>
            <strong style={{ color: 'var(--accent-gold)' }}>{occupancyRate}%</strong>
          </div>
        </div>

        {/* Quiet Action */}
        <div>
          <button
            onClick={onBookClick}
            className="btn-editorial-primary"
            style={{ padding: '10px 20px', fontSize: '0.68rem' }}
          >
            Reserve Suite
          </button>
        </div>
      </div>

      {/* Discrete Tracked Operational Tabs */}
      <div style={{
        borderTop: '1px solid var(--border-hairline)',
        background: 'var(--bg-main)',
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          overflowX: 'auto',
          gap: '32px'
        }}>
          {[
            { id: 'receptionist', label: '01. Allotment & Front Desk' },
            { id: 'catering', label: '02. In-Room Dining & Catering' },
            { id: 'manager', label: '03. Tariff & Occupancy Control' },
            { id: 'invoices', label: '04. Guest Folios & Audit' },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--text-primary)' : '2px solid transparent',
                  padding: '16px 0',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: isActive ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'var(--transition-quiet)',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
