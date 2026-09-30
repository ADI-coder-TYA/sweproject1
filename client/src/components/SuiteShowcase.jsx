import React from 'react';

export default function SuiteShowcase({ onSelectSuite, tariffs = [] }) {
  const getRate = (bed, ac, fallback) => {
    const t = tariffs.find(item => item.bedType === bed && item.acType === ac);
    return t ? t.rate.toFixed(2) : fallback;
  };

  const suiteList = [
    {
      bedType: 'Single',
      acType: 'Non-AC',
      name: 'Travertine Single Pavilion',
      specs: '48 sqm • King Single • Private Courtyard',
      rate: getRate('Single', 'Non-AC', '120.00'),
    },
    {
      bedType: 'Single',
      acType: 'AC',
      name: 'Sovereign Single Suite',
      specs: '56 sqm • King Single • Dual Climate Control',
      rate: getRate('Single', 'AC', '180.00'),
    },
    {
      bedType: 'Double',
      acType: 'Non-AC',
      name: 'Horizon Double Pavilion',
      specs: '78 sqm • Grand Master King • Natural Breeze',
      rate: getRate('Double', 'Non-AC', '220.00'),
    },
    {
      bedType: 'Double',
      acType: 'AC',
      name: 'Grand Sovereign Double Suite',
      specs: '95 sqm • Grand Master King • Panoramic Glazing',
      rate: getRate('Double', 'AC', '320.00'),
    },
  ];

  return (
    <section style={{ marginBottom: '64px' }}>
      {/* 50/50 Editorial Split Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '48px',
        alignItems: 'center',
        marginBottom: '48px'
      }}>
        {/* Narrative Side */}
        <div>
          <span className="eyebrow" style={{ marginBottom: '8px' }}>
            The Architecture of Slumber
          </span>
          <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: '300', marginBottom: '20px' }}>
            Designed for Contemplation & Uninterrupted Peace
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.92rem',
            lineHeight: '1.8',
            marginBottom: '0'
          }}>
            Every suite at The Grand Horizon is conceived as a self-contained sanctuary. Floor-to-ceiling architectural glazing frames panoramic vistas of the surrounding terrain, while natural travertine stone, tactile linens, and handcrafted joinery foster an atmosphere of effortless tranquility.
          </p>
        </div>

        {/* Photography Container with Micro-interaction Scale */}
        <div className="image-zoom-frame" style={{
          height: '420px',
          background: 'var(--bg-surface)'
        }}>
          <img
            src="/suite.jpg"
            alt="Interior view of The Grand Horizon Master Suite"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Suite Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px'
      }}>
        {suiteList.map((suite, idx) => (
          <div
            key={idx}
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-hairline)',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'var(--transition-quiet)'
            }}
          >
            <div>
              <span className="eyebrow" style={{ fontSize: '0.62rem', color: 'var(--accent-gold)', marginBottom: '4px' }}>
                {suite.bedType} Bed • {suite.acType}
              </span>
              <h3 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: '400', marginBottom: '8px' }}>
                {suite.name}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
                {suite.specs}
              </p>
            </div>

            <div style={{
              borderTop: '1px solid var(--border-hairline)',
              paddingTop: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline'
            }}>
              <div>
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                  From
                </span>
                <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', fontWeight: '500' }}>
                  ${suite.rate} <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-sans)', color: 'var(--text-muted)', fontWeight: '400' }}>/ night</span>
                </div>
              </div>

              <button
                className="btn-editorial-secondary"
                style={{ padding: '6px 14px', fontSize: '0.65rem' }}
                onClick={() => onSelectSuite(suite.bedType, suite.acType)}
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
