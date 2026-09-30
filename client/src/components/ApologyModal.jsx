import React from 'react';

export default function ApologyModal({ isOpen, onClose, apologyData, onSelectCategory }) {
  if (!isOpen || !apologyData) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '580px', padding: '40px' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span className="eyebrow" style={{ color: 'var(--accent-clay)', marginBottom: '8px' }}>
            Reservation Notification
          </span>
          <h3 className="font-serif" style={{ fontSize: '1.8rem', fontWeight: '300' }}>
            Accommodation Availability Notice
          </h3>
        </div>

        {/* Apology Message Content */}
        <div className="apology-box-editorial" style={{ marginBottom: '28px' }}>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.2rem',
            fontStyle: 'italic',
            lineHeight: '1.6',
            color: 'var(--text-primary)'
          }}>
            "{apologyData.apologyMessage || 'We sincerely apologize, but no suites are currently available matching your requested configuration.'}"
          </p>
        </div>

        {/* Available Alternatives */}
        {apologyData.availableCategories && apologyData.availableCategories.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <span className="eyebrow" style={{ marginBottom: '12px' }}>
              Alternative Suites Available for Allotment:
            </span>

            <div style={{ display: 'grid', gap: '8px' }}>
              {apologyData.availableCategories.map((cat, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-hairline)',
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {cat.bedType} Bed Suite ({cat.acType})
                    </strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Tariff: ${cat.rate?.toFixed(2)} / night
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className={cat.availableCount > 0 ? 'badge-editorial badge-available' : 'badge-editorial badge-occupied'}>
                      {cat.availableCount > 0 ? `${cat.availableCount} Available` : 'Fully Allocated'}
                    </span>

                    {cat.availableCount > 0 && onSelectCategory && (
                      <button
                        type="button"
                        className="btn-editorial-primary"
                        style={{ padding: '6px 14px', fontSize: '0.65rem' }}
                        onClick={() => {
                          onSelectCategory(cat.bedType, cat.acType);
                          onClose();
                        }}
                      >
                        Select
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button id="btn-close-apology" className="btn-editorial-secondary" onClick={onClose}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
