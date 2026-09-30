import React, { useState, useEffect } from 'react';

export default function GuestBookingModal({ isOpen, onClose, initialData, onBookingComplete }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bedType, setBedType] = useState('Double');
  const [acType, setAcType] = useState('AC');
  const [duration, setDuration] = useState(2);
  const [arrivalDate, setArrivalDate] = useState(new Date().toISOString().split('T')[0]);
  const [advanceAmount, setAdvanceAmount] = useState(150);
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  // Sync initial criteria passed from Hero or Suite showcase
  useEffect(() => {
    if (initialData) {
      if (initialData.bedType) setBedType(initialData.bedType);
      if (initialData.acType) setAcType(initialData.acType);
      if (initialData.durationOfStay) setDuration(Number(initialData.durationOfStay));
      if (initialData.arrivalTime) {
        const datePart = initialData.arrivalTime.split(' ')[0];
        if (datePart) setArrivalDate(datePart);
      }
    }
    setErrorMsg('');
    setConfirmation(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please provide your full legal name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please provide a contact phone number.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim() || 'Guest Residence',
          bedType,
          acType,
          durationOfStay: Number(duration),
          arrivalTime: `${arrivalDate} 14:00`,
          advancePaid: Number(advanceAmount) || 0,
          reservationType: 'OnSpot'
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.apologyMessage) {
          setErrorMsg(data.apologyMessage);
        } else {
          setErrorMsg(data.error || 'Failed to complete reservation. Please try again.');
        }
        return;
      }

      setConfirmation(data);
      if (onBookingComplete) {
        onBookingComplete();
      }
    } catch (err) {
      setErrorMsg('Network error while processing booking: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 210,
      backgroundColor: 'rgba(28, 25, 23, 0.7)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      overflowY: 'auto'
    }}>
      <div style={{
        background: '#FFFFFF',
        maxWidth: confirmation ? '680px' : '620px',
        width: '100%',
        border: '1px solid var(--border-hairline)',
        padding: '36px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.12)',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px 8px'
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {!confirmation ? (
          /* Booking Form */
          <div>
            <div style={{ marginBottom: '24px' }}>
              <span className="eyebrow" style={{ color: 'var(--accent-gold)', marginBottom: '4px' }}>
                Sanctuary Reservations
              </span>
              <h2 className="font-serif" style={{ fontSize: '1.85rem', fontWeight: '300', color: 'var(--text-primary)' }}>
                Confirm Your Suite Reservation
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '4px' }}>
                Complete your details below. Your suite will be reserved and an automated guest token will be allocated upon confirmation.
              </p>
            </div>

            {errorMsg && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#991B1B',
                padding: '12px 16px',
                fontSize: '0.82rem',
                marginBottom: '20px'
              }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Selected Suite Summary */}
              <div style={{
                background: 'var(--bg-surface-light)',
                border: '1px solid var(--border-hairline)',
                padding: '16px 20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px',
                fontSize: '0.78rem'
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.15em' }}>
                    Accommodations
                  </span>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    {bedType} Bed • {acType}
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.15em' }}>
                    Arrival Date
                  </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{arrivalDate}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.15em' }}>
                    Stay Duration
                  </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{duration} Night{duration > 1 ? 's' : ''}</strong>
                </div>
              </div>

              {/* Guest Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label-editorial" style={{ display: 'block', marginBottom: '6px' }}>
                    Guest Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lord Julian Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="editorial-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label className="form-label-editorial" style={{ display: 'block', marginBottom: '6px' }}>
                    Telephone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 019-2834"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="editorial-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label-editorial" style={{ display: 'block', marginBottom: '6px' }}>
                  Permanent Residence / Billing Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. 14 Kensington Gardens, London W8 4PX"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="editorial-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              {/* Reservation Customization Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label-editorial" style={{ display: 'block', marginBottom: '6px' }}>
                    Bed Type
                  </label>
                  <select
                    value={bedType}
                    onChange={(e) => setBedType(e.target.value)}
                    className="editorial-select"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  >
                    <option value="Single">Single Bed Suite</option>
                    <option value="Double">Double Bed Suite</option>
                  </select>
                </div>
                <div>
                  <label className="form-label-editorial" style={{ display: 'block', marginBottom: '6px' }}>
                    Climate Control
                  </label>
                  <select
                    value={acType}
                    onChange={(e) => setAcType(e.target.value)}
                    className="editorial-select"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  >
                    <option value="AC">Air Conditioned (AC)</option>
                    <option value="Non-AC">Natural Air (Non-AC)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label-editorial" style={{ display: 'block', marginBottom: '6px' }}>
                    Stay Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="editorial-select"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  >
                    <option value="1">1 Night</option>
                    <option value="2">2 Nights</option>
                    <option value="3">3 Nights</option>
                    <option value="5">5 Nights</option>
                    <option value="7">7 Nights</option>
                    <option value="14">14 Nights</option>
                  </select>
                </div>
                <div>
                  <label className="form-label-editorial" style={{ display: 'block', marginBottom: '6px' }}>
                    Advance Deposit ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                    className="editorial-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                marginTop: '12px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-hairline)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '14px'
              }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-editorial-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-editorial-primary"
                  disabled={submitting}
                  style={{ minWidth: '180px' }}
                >
                  {submitting ? 'Confirming Allotment...' : 'Confirm Reservation →'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Voucher */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span className="eyebrow" style={{ color: 'var(--accent-pine)', letterSpacing: '0.3em', marginBottom: '6px' }}>
                ✓ Reservation Confirmed & Suite Allotted
              </span>
              <h2 className="font-serif" style={{ fontSize: '2.2rem', fontWeight: '300' }}>
                THE GRAND HORIZON
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Official Guest Stay Voucher & Catering Access Token
              </p>
            </div>

            {/* Token Badge */}
            <div style={{
              background: 'var(--bg-surface-light)',
              border: '1px solid var(--accent-gold)',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <span style={{
                fontSize: '0.68rem',
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                color: 'var(--accent-gold)',
                display: 'block',
                marginBottom: '4px'
              }}>
                Your In-Room Dining & Allotment Token
              </span>
              <div className="font-serif" style={{ fontSize: '2rem', fontWeight: '500', color: 'var(--text-primary)', letterSpacing: '0.08em' }}>
                {confirmation.token?.tokenNumber || `TKN-${confirmation.room?.roomNumber}`}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Please present this token for in-room catering and concierge services.
              </div>
            </div>

            {/* Voucher Details Grid */}
            <div style={{
              border: '1px solid var(--border-hairline)',
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '16px',
              fontSize: '0.82rem',
              marginBottom: '24px'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block' }}>
                  Guest Name
                </span>
                <strong style={{ color: 'var(--text-primary)' }}>{name}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block' }}>
                  Suite Assigned
                </span>
                <strong style={{ color: 'var(--accent-pine)' }}>
                  Room {confirmation.room?.roomNumber} ({bedType} • {acType})
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block' }}>
                  Duration
                </span>
                <strong style={{ color: 'var(--text-primary)' }}>{duration} Night{duration > 1 ? 's' : ''}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block' }}>
                  Advance Paid
                </span>
                <strong style={{ color: 'var(--text-primary)' }}>${Number(advanceAmount).toFixed(2)}</strong>
              </div>
            </div>

            {/* Print & Close Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handlePrint}
                className="btn-editorial-secondary"
                style={{ padding: '8px 18px', fontSize: '0.72rem' }}
              >
                🖨️ Print Voucher
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-editorial-primary"
                style={{ padding: '10px 24px', fontSize: '0.75rem' }}
              >
                Return to Sanctuary
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
