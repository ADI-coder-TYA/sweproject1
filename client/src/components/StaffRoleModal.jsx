import React from 'react';

export default function StaffRoleModal({ isOpen, onClose, onSelectTerminal }) {
  if (!isOpen) return null;

  const terminals = [
    {
      id: 'receptionist',
      num: '01',
      title: 'Front Desk & Allotment',
      category: 'Concierge Operations',
      desc: 'Guest registration, advance & spot reservations, room allotment, token generation, and checkouts.',
      icon: '🏛️'
    },
    {
      id: 'catering',
      num: '02',
      title: 'Culinary & In-Room Dining',
      category: 'Food & Beverage',
      desc: 'Token-based dining orders, gourmet menu selection, food consumption logging, and charge aggregation.',
      icon: '🍷'
    },
    {
      id: 'manager',
      num: '03',
      title: 'General Management',
      category: 'Tariff & Occupancy',
      desc: 'Monthly average occupancy calculations, dynamic percentage-based tariff adjustments (+% / -%), and analytics.',
      icon: '📊'
    },
    {
      id: 'invoices',
      num: '04',
      title: 'Finance & Folio Audit',
      category: 'Audit & Loyalty',
      desc: 'Complete ledger of settled guest folios, Frequent Guest ID loyalty discounts, and printable tax invoices.',
      icon: '📜'
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      backgroundColor: 'rgba(28, 25, 23, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        background: '#FFFFFF',
        maxWidth: '820px',
        width: '100%',
        border: '1px solid var(--border-hairline)',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px 8px'
          }}
          aria-label="Close Modal"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '32px' }}>
          <span className="eyebrow" style={{ color: 'var(--accent-gold)', marginBottom: '6px' }}>
            Authorized Personnel Only
          </span>
          <h2 className="font-serif" style={{ fontSize: '2rem', fontWeight: '300', color: 'var(--text-primary)' }}>
            Select Operational Terminal
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px', maxWidth: '580px' }}>
            Access the automated hotel management system. Choose your designated operational workstation to begin.
          </p>
        </div>

        {/* 2x2 Grid of Terminals */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {terminals.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectTerminal(item.id);
                onClose();
              }}
              style={{
                border: '1px solid var(--border-hairline)',
                padding: '24px',
                background: 'var(--bg-surface-light)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--text-primary)';
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-hairline)';
                e.currentTarget.style.background = 'var(--bg-surface-light)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--accent-gold)',
                    fontWeight: '600'
                  }}>
                    {item.category}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1rem',
                    color: 'var(--text-muted)'
                  }}>
                    {item.num}
                  </span>
                </div>
                <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: '400', marginBottom: '8px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {item.desc}
                </p>
              </div>

              <div style={{
                marginTop: '20px',
                paddingTop: '14px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.72rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}>
                <span>Launch Terminal</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer Note */}
        <div style={{
          marginTop: '28px',
          paddingTop: '18px',
          borderTop: '1px solid var(--border-hairline)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.72rem',
          color: 'var(--text-muted)'
        }}>
          <span>Hotel Automation System • Conforming strictly to UML specifications</span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.72rem'
            }}
          >
            Cancel and return to guest view
          </button>
        </div>
      </div>
    </div>
  );
}
