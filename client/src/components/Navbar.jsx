import React from 'react';

export default function Navbar({ onStaffClick, onBookClick }) {
  return (
    <header style={{
      background: '#FFFFFF',
      borderBottom: '1px solid var(--border-hairline)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Refined Minimalist Top Bar */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Brand */}
        <div>
          <span className="eyebrow" style={{ fontSize: '0.62rem', letterSpacing: '0.35em', marginBottom: '2px', display: 'block' }}>
            A Sanctuary of Quiet Elegance
          </span>
          <h1 className="font-serif" style={{ fontSize: '1.75rem', fontWeight: '400', letterSpacing: '0.04em', margin: 0 }}>
            THE GRAND HORIZON
          </h1>
        </div>

        {/* Right-Aligned Minimal Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            id="nav-btn-staff-portal"
            onClick={onStaffClick}
            className="btn-editorial-secondary"
            style={{
              padding: '10px 18px',
              fontSize: '0.68rem',
              letterSpacing: '0.15em'
            }}
          >
            Staff Portal
          </button>

          <button
            id="nav-btn-reserve-suite"
            onClick={onBookClick}
            className="btn-editorial-primary"
            style={{
              padding: '10px 22px',
              fontSize: '0.68rem',
              letterSpacing: '0.15em'
            }}
          >
            Reserve Suite
          </button>
        </div>
      </div>
    </header>
  );
}
