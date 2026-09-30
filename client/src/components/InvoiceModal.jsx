import React from 'react';

export default function InvoiceModal({ isOpen, onClose, billData }) {
  if (!isOpen || !billData) return null;

  const {
    billNumber = 'FOLIO-PREVIEW',
    generatedAt = new Date().toLocaleString(),
    guest = {},
    room = {},
    token = {},
    duration = 1,
    roomCharges = 0,
    foodCharges = 0,
    consumptions = [],
    discount = 0,
    advancePaid = 0,
    totalAmount = 0,
    balanceAmount = 0,
    frequentGuest = null,
  } = billData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '800px', padding: '0', background: '#FFFFFF' }}
      >
        {/* Controls Bar (Hidden in Print) */}
        <div className="no-print" style={{
          padding: '16px 32px',
          borderBottom: '1px solid var(--border-hairline)',
          background: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <span className="eyebrow" style={{ color: 'var(--accent-pine)', marginBottom: '2px' }}>
              Folio Settled & Room Released
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Folio Ref: #{billNumber}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              id="btn-print-bill"
              onClick={handlePrint} 
              className="btn-editorial-primary" 
              style={{ padding: '8px 20px', fontSize: '0.68rem' }}
            >
              Print Folio
            </button>
            <button 
              onClick={onClose} 
              className="btn-editorial-secondary" 
              style={{ padding: '8px 16px', fontSize: '0.68rem' }}
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable Folio Document */}
        <div style={{ padding: '48px 48px' }}>
          {/* Folio Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid var(--border-hairline)',
            paddingBottom: '24px',
            marginBottom: '32px'
          }}>
            <div>
              <span className="eyebrow" style={{ letterSpacing: '0.35em', marginBottom: '6px' }}>
                Official Guest Folio
              </span>
              <h1 className="font-serif" style={{ fontSize: '2.2rem', fontWeight: '400', letterSpacing: '0.04em' }}>
                THE GRAND HORIZON
              </h1>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                100 Royal Crest Promenade • reservations@grandhorizon.com
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div className="font-serif" style={{ fontSize: '1.4rem', fontWeight: '400' }}>
                FOLIO #{billNumber}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Settlement Date: {generatedAt}
              </div>
            </div>
          </div>

          {/* Guest Stay Metadata */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
            border: '1px solid var(--border-hairline)',
            padding: '20px 24px',
            background: 'var(--bg-surface-light)',
            marginBottom: '32px'
          }}>
            <div>
              <span className="eyebrow" style={{ fontSize: '0.6rem' }}>Guest Name</span>
              <div style={{ fontSize: '1.05rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginTop: '2px' }}>
                {guest.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{guest.phone}</div>
            </div>

            <div>
              <span className="eyebrow" style={{ fontSize: '0.6rem' }}>Suite Allotment</span>
              <div style={{ fontSize: '1.05rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginTop: '2px' }}>
                Suite {room.roomNumber} ({room.bedType} Bed, {room.acType})
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Rate: ${room.rate?.toFixed(2)}/night
              </div>
            </div>

            <div>
              <span className="eyebrow" style={{ fontSize: '0.6rem' }}>Stay Token & Length</span>
              <div style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-primary)', marginTop: '2px' }}>
                {token.tokenNumber || 'TKN-0000'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Stay: {duration} Night{duration > 1 ? 's' : ''}
              </div>
            </div>

            <div>
              <span className="eyebrow" style={{ fontSize: '0.6rem' }}>Guest Status</span>
              {frequentGuest || guest.frequentGuestId ? (
                <div style={{ marginTop: '2px' }}>
                  <span className="badge-editorial badge-vip">
                    VIP Frequent Guest
                  </span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', marginTop: '4px' }}>
                    ID: {guest.frequentGuestId} ({frequentGuest?.discountPercentage || 15}% Benefit)
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Standard Guest
                </div>
              )}
            </div>
          </div>

          {/* Itemized Charges Table */}
          <div style={{ marginBottom: '32px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-hairline)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '10px 8px', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.7rem' }}>Description</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.7rem' }}>Nights / Qty</th>
                  <th style={{ padding: '10px 8px', textAlign: 'right', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.7rem' }}>Rate</th>
                  <th style={{ padding: '10px 8px', textAlign: 'right', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.7rem' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                  <td style={{ padding: '14px 8px' }}>
                    <div style={{ fontWeight: '500' }}>Suite Accommodation Charges</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {room.bedType} Bed Suite ({room.acType}) — Suite {room.roomNumber}
                    </div>
                  </td>
                  <td style={{ padding: '14px 8px', textAlign: 'center' }}>{duration}</td>
                  <td style={{ padding: '14px 8px', textAlign: 'right' }}>${room.rate?.toFixed(2)}</td>
                  <td style={{ padding: '14px 8px', textAlign: 'right', fontWeight: '500' }}>
                    ${roomCharges.toFixed(2)}
                  </td>
                </tr>

                {consumptions.length > 0 ? (
                  consumptions.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                      <td style={{ padding: '12px 8px' }}>
                        <div>{item.itemName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          In-Room Dining • {item.date} {item.time}
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'right' }}>${item.unitPrice?.toFixed(2)}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'right' }}>${item.amount.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                    <td colSpan={4} style={{ padding: '10px 8px', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.78rem' }}>
                      No additional in-room dining logged during stay.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Net Settlement Balance */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
            <div style={{ width: '320px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>Suite Charges:</span>
                <span style={{ color: 'var(--text-primary)' }}>${roomCharges.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>In-Room Dining:</span>
                <span style={{ color: 'var(--text-primary)' }}>${foodCharges.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.85rem', color: 'var(--accent-gold)' }}>
                  <span>Loyalty Discount:</span>
                  <span>- ${discount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid var(--border-hairline)', fontSize: '0.95rem', fontWeight: '500' }}>
                <span>Gross Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.85rem', color: 'var(--accent-pine)' }}>
                <span>Advance Paid:</span>
                <span>- ${advancePaid.toFixed(2)}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '14px 18px',
                marginTop: '10px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-hairline)'
              }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '500' }}>
                  Net Balance Settled:
                </span>
                <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', fontWeight: '600' }}>
                  ${balanceAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            borderTop: '1px solid var(--border-hairline)',
            paddingTop: '24px',
            textAlign: 'center',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)'
          }}>
            <p>We thank you for gracing The Grand Horizon with your stay.</p>
            <p style={{ marginTop: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Automated 5-Star Hotel Folio • Settled in Full
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
