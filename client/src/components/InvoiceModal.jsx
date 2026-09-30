import React from 'react';
import { Printer, CheckCircle2, X, Award, Utensils, BedDouble, Calendar } from 'lucide-react';

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
        style={{ maxWidth: '780px', border: '1px solid var(--gold-primary)' }}
      >
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print" style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-available">
              <CheckCircle2 size={13} /> Checkout Finalized
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Bill #{billNumber}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              id="btn-print-bill"
              onClick={handlePrint} 
              className="btn-gold" 
              style={{ padding: '6px 16px', fontSize: '0.85rem' }}
            >
              <Printer size={15} /> Print / Save Invoice
            </button>
            <button 
              onClick={onClose} 
              className="btn-secondary" 
              style={{ padding: '6px', borderRadius: '50%', border: 'none' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Folio / Invoice Section */}
        <div id="printable-invoice" className="print-invoice" style={{ padding: '36px', background: '#09101f' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--gold-primary)', paddingBottom: '20px', marginBottom: '24px' }}>
            <div>
              <h1 className="font-serif gold-gradient-text" style={{ fontSize: '1.8rem', marginBottom: '4px' }}>
                The Grand Horizon
              </h1>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                5-STAR LUXURY HOTEL & PRIVATE SUITES
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                100 Royal Crest Boulevard, Central Oasis • reservations@grandhorizon.com
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div className="font-serif" style={{ fontSize: '1.3rem', color: 'var(--gold-light)' }}>
                OFFICIAL GUEST FOLIO
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', marginTop: '4px' }}>
                Bill No: <span style={{ color: 'var(--text-main)' }}>{billNumber}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Date: {generatedAt}
              </div>
            </div>
          </div>

          {/* Guest & Stay Metadata Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(197, 160, 89, 0.2)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Guest Name</div>
              <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)', marginTop: '2px' }}>
                {guest.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{guest.phone}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Room Number & Type</div>
              <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-gold)', marginTop: '2px' }}>
                Room {room.roomNumber} ({room.bedType} Bed, {room.acType})
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Rate: ${room.rate?.toFixed(2)}/night
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Token & Duration</div>
              <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--accent-blue)', marginTop: '2px' }}>
                {token.tokenNumber || 'TKN-0000'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Stay: {duration} Night{duration > 1 ? 's' : ''}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Guest Category</div>
              {frequentGuest || guest.frequentGuestId ? (
                <div style={{ marginTop: '2px' }}>
                  <span className="badge badge-vip">
                    <Award size={12} /> VIP Frequent Guest
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-gold)', marginTop: '4px' }}>
                    ID: {guest.frequentGuestId} ({frequentGuest?.discountPercentage || 15}% Discount)
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '4px' }}>
                  Standard Guest
                </div>
              )}
            </div>
          </div>

          {/* Charges Itemization Table */}
          <div style={{ marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--gold-light)' }}>
                  <th style={{ padding: '10px 8px' }}>Description</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center' }}>Qty / Nights</th>
                  <th style={{ padding: '10px 8px', textAlign: 'right' }}>Unit Rate</th>
                  <th style={{ padding: '10px 8px', textAlign: 'right' }}>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {/* Room Tariff Row */}
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ fontWeight: '500' }}>Room Accommodation Charges</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {room.bedType} Bed Suite ({room.acType}) — Room {room.roomNumber}
                    </div>
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>{duration}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>${room.rate?.toFixed(2)}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>
                    ${roomCharges.toFixed(2)}
                  </td>
                </tr>

                {/* Catering Consumptions Rows */}
                {consumptions.length > 0 ? (
                  consumptions.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '10px 8px' }}>
                        <div>{item.itemName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Catering • {item.date} {item.time}
                        </div>
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'right' }}>${item.unitPrice?.toFixed(2)}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'right' }}>${item.amount.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td colSpan={4} style={{ padding: '8px', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.8rem' }}>
                      No additional catering consumed during this stay.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals & Net Balance Section */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '24px'
          }}>
            <div style={{ width: '320px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span>Room Charges:</span>
                <span style={{ color: 'var(--text-main)' }}>${roomCharges.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span>Catering & Food:</span>
                <span style={{ color: 'var(--text-main)' }}>${foodCharges.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.9rem', color: '#fbbf24' }}>
                  <span>Frequent Guest Discount:</span>
                  <span>- ${discount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--border-subtle)', fontWeight: '600', fontSize: '1rem' }}>
                <span>Total Bill Amount:</span>
                <span style={{ color: 'var(--gold-light)' }}>${totalAmount.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.9rem', color: '#34d399' }}>
                <span>Advance Paid at Check-in:</span>
                <span>- ${advancePaid.toFixed(2)}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 14px',
                marginTop: '8px',
                background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.15) 0%, rgba(197, 160, 89, 0.05) 100%)',
                border: '1px solid var(--gold-primary)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: '700',
                fontSize: '1.15rem'
              }}>
                <span style={{ color: 'var(--gold-light)' }}>Balance Amount Payable:</span>
                <span style={{ color: balanceAmount <= 0 ? '#34d399' : '#fff' }}>
                  ${balanceAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div style={{
            borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
            paddingTop: '16px',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            <p>Thank you for choosing The Grand Horizon. We look forward to welcoming you back on your next visit.</p>
            <p style={{ marginTop: '4px', fontSize: '0.72rem' }}>
              Automated System Generated Folio • Valid without physical signature • Payment received in full.
            </p>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="no-print" style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <button onClick={onClose} className="btn-secondary">
            Close Folio
          </button>
          <button onClick={handlePrint} className="btn-gold">
            <Printer size={16} /> Print Official Bill
          </button>
        </div>
      </div>
    </div>
  );
}
