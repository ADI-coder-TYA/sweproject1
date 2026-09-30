import React from 'react';
import { AlertCircle, X, CheckCircle2 } from 'lucide-react';

export default function ApologyModal({ isOpen, onClose, apologyData, onSelectCategory }) {
  if (!isOpen || !apologyData) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '580px', border: '1px solid #f43f5e' }}
      >
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(244, 63, 94, 0.25)',
          background: 'linear-gradient(180deg, rgba(244, 63, 94, 0.12) 0%, transparent 100%)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(244, 63, 94, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fb7185'
            }}>
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', color: '#fda4af' }}>
                Accommodation Apology
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                System Notification — Room Unavailability
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="btn-secondary" 
            style={{ padding: '6px', borderRadius: '50%', border: 'none' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Formal Apology Box */}
          <div className="apology-box" style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: '#ffe4e6', fontStyle: 'italic' }}>
              "{apologyData.apologyMessage || 'We sincerely apologize, but no rooms are currently available matching your requested criteria.'}"
            </p>
          </div>

          {/* Alternative Room Suggestions */}
          {apologyData.availableCategories && apologyData.availableCategories.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gold-light)', marginBottom: '12px' }}>
                Available Alternative Luxury Accommodations:
              </h4>

              <div style={{ display: 'grid', gap: '10px' }}>
                {apologyData.availableCategories.map((cat, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.95rem' }}>{cat.bedType} Bed Suite ({cat.acType})</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Tariff: ${cat.rate?.toFixed(2)}/night
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={cat.availableCount > 0 ? 'badge badge-available' : 'badge badge-occupied'}>
                        {cat.availableCount > 0 ? `${cat.availableCount} Available` : 'Fully Booked'}
                      </span>

                      {cat.availableCount > 0 && onSelectCategory && (
                        <button
                          type="button"
                          className="btn-gold"
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          onClick={() => {
                            onSelectCategory(cat.bedType, cat.acType);
                            onClose();
                          }}
                        >
                          <CheckCircle2 size={14} /> Select
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button id="btn-close-apology" className="btn-secondary" onClick={onClose}>
              Dismiss Apology
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
