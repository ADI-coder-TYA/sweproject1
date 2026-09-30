import React, { useState, useEffect, useRef } from 'react';
import ApologyModal from './ApologyModal';
import InvoiceModal from './InvoiceModal';

export default function ReceptionistPortal({ onDataChange, hotelData, preFillData, onNavigateToCatering }) {
  const formRef = useRef(null);
  const guestNameInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    arrivalTime: new Date().toISOString().slice(0, 16),
    durationOfStay: 2,
    advancePaid: 100,
    bedType: 'Single',
    acType: 'AC',
    frequentGuestId: '',
    reservationType: 'OnSpot',
  });

  // Auto-populate when preFillData is received from Hero bar or Suite Showcase
  useEffect(() => {
    if (preFillData) {
      setFormData(prev => ({
        ...prev,
        ...preFillData
      }));
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => guestNameInputRef.current?.focus(), 150);
    }
  }, [preFillData]);

  // Frequent Guest Verification State
  const [frequentGuestInfo, setFrequentGuestInfo] = useState(null);
  const [verifyingFG, setVerifyingFG] = useState(false);

  // Modals & Results State
  const [allotmentResult, setAllotmentResult] = useState(null);
  const [apologyData, setApologyData] = useState(null);
  const [showApology, setShowApology] = useState(false);

  // Checkout State
  const [checkoutToken, setCheckoutToken] = useState('');
  const [billPreview, setBillPreview] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [finalInvoice, setFinalInvoice] = useState(null);

  // Room Grid Filters
  const [rooms, setRooms] = useState([]);
  const [filterBed, setFilterBed] = useState('All');
  const [filterAc, setFilterAc] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch Rooms
  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/rooms');
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Handle Frequent Guest ID verification
  const verifyFrequentGuest = async (id) => {
    if (!id || id.trim() === '') {
      setFrequentGuestInfo(null);
      return;
    }
    setVerifyingFG(true);
    try {
      const res = await fetch(`/api/frequent-guests/${encodeURIComponent(id.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setFrequentGuestInfo(data);
      } else {
        setFrequentGuestInfo({ notFound: true });
      }
    } catch {
      setFrequentGuestInfo({ notFound: true });
    } finally {
      setVerifyingFG(false);
    }
  };

  // Submit Reservation / Check-In
  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setAllotmentResult(null);

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 409 || !data.success) {
        // Apology Flow (Sequence Diagram 1 & Use Case Apology Message)
        setApologyData(data);
        setShowApology(true);
      } else {
        // Success Flow: Room allotted & unique token generated
        setAllotmentResult(data);
        setFormData({
          ...formData,
          name: '',
          phone: '',
          advancePaid: 100,
          frequentGuestId: '',
        });
        setFrequentGuestInfo(null);
        fetchRooms();
        if (onDataChange) onDataChange();
      }
    } catch (err) {
      setMessage(`Connection Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Preview Bill for Checkout (Sequence Diagram 3)
  const handlePreviewBill = async (tokenNum) => {
    if (!tokenNum) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/billing/calculate/${encodeURIComponent(tokenNum)}`);
      if (res.ok) {
        const data = await res.json();
        setBillPreview(data);
        setCheckoutToken(tokenNum);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to calculate bill for this token.');
      }
    } catch (err) {
      alert('Error fetching bill preview: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Finalize Checkout (Sequence Diagram 3 & Statechart PaymentDue -> CheckedOut)
  const handleFinalizeCheckout = async () => {
    if (!checkoutToken) return;
    setLoading(true);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenNumber: checkoutToken }),
      });
      const data = await res.json();
      if (res.ok) {
        setFinalInvoice(data);
        setShowInvoiceModal(true);
        setBillPreview(null);
        setCheckoutToken('');
        fetchRooms();
        if (onDataChange) onDataChange();
      } else {
        alert(data.error || 'Checkout failed.');
      }
    } catch (err) {
      alert('Checkout error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtered rooms
  const filteredRooms = rooms.filter(r => {
    if (filterBed !== 'All' && r.bedType !== filterBed) return false;
    if (filterAc !== 'All' && r.acType !== filterAc) return false;
    if (filterStatus !== 'All' && r.status !== filterStatus) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      
      {/* Editorial Header */}
      <div style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '24px' }}>
        <span className="eyebrow" style={{ marginBottom: '8px' }}>
          Front Desk Terminal • Sequence Diagram 1 & 3
        </span>
        <h2 className="font-serif" style={{ fontSize: '2.4rem', fontWeight: '300' }}>
          Guest Registration & Room Allotment
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '680px', marginTop: '6px' }}>
          Register advance or on-spot reservations, allocate suites with unique digital tokens, or process final checkout folios.
        </p>
      </div>

      {/* Main Grid: Registration Form (Left) & Active Departures (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '32px' }}>
        
        {/* REGISTRATION & ALLOTMENT CARD */}
        <div ref={formRef} className="editorial-card" style={{ padding: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '16px' }}>
            <div>
              <span className="eyebrow">Suite Allocation</span>
              <h3 className="font-serif" style={{ fontSize: '1.4rem' }}>New Guest Registration</h3>
            </div>

            {/* Advance / On-Spot Selector */}
            <div style={{ display: 'flex', border: '1px solid var(--border-hairline)' }}>
              <button
                type="button"
                style={{
                  padding: '6px 14px',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  border: 'none',
                  background: formData.reservationType === 'OnSpot' ? 'var(--text-primary)' : 'transparent',
                  color: formData.reservationType === 'OnSpot' ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
                onClick={() => setFormData({ ...formData, reservationType: 'OnSpot' })}
              >
                On-Spot
              </button>
              <button
                type="button"
                style={{
                  padding: '6px 14px',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  border: 'none',
                  background: formData.reservationType === 'Advance' ? 'var(--text-primary)' : 'transparent',
                  color: formData.reservationType === 'Advance' ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
                onClick={() => setFormData({ ...formData, reservationType: 'Advance' })}
              >
                Advance
              </button>
            </div>
          </div>

          <form onSubmit={handleReservationSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group-editorial">
                <label className="form-label-editorial">Guest Full Name *</label>
                <input
                  ref={guestNameInputRef}
                  id="input-guest-name"
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  className="editorial-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group-editorial">
                <label className="form-label-editorial">Contact Phone</label>
                <input
                  id="input-guest-phone"
                  type="text"
                  placeholder="+1 (555) 019-2834"
                  className="editorial-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group-editorial">
                <label className="form-label-editorial">Arrival Date & Time</label>
                <input
                  id="input-arrival-time"
                  type="datetime-local"
                  required
                  className="editorial-input"
                  value={formData.arrivalTime}
                  onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                />
              </div>

              <div className="form-group-editorial">
                <label className="form-label-editorial">Duration of Stay (Nights) *</label>
                <input
                  id="input-duration"
                  type="number"
                  min="1"
                  max="60"
                  required
                  className="editorial-input"
                  value={formData.durationOfStay}
                  onChange={(e) => setFormData({ ...formData, durationOfStay: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group-editorial">
                <label className="form-label-editorial">Bed Type *</label>
                <select
                  id="select-bed-type"
                  className="editorial-select"
                  value={formData.bedType}
                  onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
                >
                  <option value="Single">Single Bed</option>
                  <option value="Double">Double Bed</option>
                </select>
              </div>

              <div className="form-group-editorial">
                <label className="form-label-editorial">AC Type *</label>
                <select
                  id="select-ac-type"
                  className="editorial-select"
                  value={formData.acType}
                  onChange={(e) => setFormData({ ...formData, acType: e.target.value })}
                >
                  <option value="AC">Air Conditioned (AC)</option>
                  <option value="Non-AC">Natural Air (Non-AC)</option>
                </select>
              </div>

              <div className="form-group-editorial">
                <label className="form-label-editorial">Advance Paid ($)</label>
                <input
                  id="input-advance-paid"
                  type="number"
                  min="0"
                  step="10"
                  className="editorial-input"
                  value={formData.advancePaid}
                  onChange={(e) => setFormData({ ...formData, advancePaid: e.target.value })}
                />
              </div>
            </div>

            {/* Frequent Guest ID */}
            <div className="form-group-editorial">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label-editorial">Frequent Guest ID (Optional)</label>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                  e.g. VIP-777, VIP-888, VIP-999, GOLD-101
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  id="input-frequent-guest-id"
                  type="text"
                  placeholder="Enter VIP / Loyalty ID"
                  className="editorial-input"
                  value={formData.frequentGuestId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, frequentGuestId: val });
                    if (!val) setFrequentGuestInfo(null);
                  }}
                />
                <button
                  type="button"
                  className="btn-editorial-secondary"
                  style={{ whiteSpace: 'nowrap', padding: '0 16px' }}
                  onClick={() => verifyFrequentGuest(formData.frequentGuestId)}
                  disabled={verifyingFG || !formData.frequentGuestId}
                >
                  Verify
                </button>
              </div>

              {frequentGuestInfo && (
                <div style={{ marginTop: '8px', fontSize: '0.78rem' }}>
                  {frequentGuestInfo.notFound ? (
                    <span style={{ color: 'var(--accent-clay)' }}>
                      Guest ID not found in registry. Standard tariff applies.
                    </span>
                  ) : (
                    <span className="badge-editorial badge-vip">
                      Verified Loyalty: {frequentGuestInfo.name} ({frequentGuestInfo.discountPercentage}% Discount)
                    </span>
                  )}
                </div>
              )}
            </div>

            {message && (
              <div style={{ color: 'var(--accent-clay)', fontSize: '0.85rem', marginBottom: '16px' }}>
                {message}
              </div>
            )}

            <button
              id="btn-allot-room"
              type="submit"
              className="btn-editorial-primary"
              style={{ width: '100%', padding: '14px', marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? 'Checking Availability...' : 'Check Availability & Allot Suite'}
            </button>
          </form>

          {/* Allotment Success Confirmation */}
          {allotmentResult && allotmentResult.success && (
            <div style={{
              marginTop: '24px',
              padding: '20px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-hairline)'
            }}>
              <span className="eyebrow" style={{ color: 'var(--accent-pine)', marginBottom: '4px' }}>
                Allotment Confirmed
              </span>
              <h4 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>
                Suite Allocated & Token Issued
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.82rem' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Suite Number: </span>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>
                    #{allotmentResult.room.roomNumber}
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Unique Token: </span>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '1rem', letterSpacing: '0.05em' }}>
                    {allotmentResult.token.tokenNumber}
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Tariff: </span>
                  <strong>${allotmentResult.room.rate}/night</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Guest: </span>
                  <strong>{allotmentResult.guest.name}</strong>
                </div>
              </div>

              {/* Action Handlers */}
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-hairline)', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-editorial-secondary"
                  style={{ fontSize: '0.68rem', padding: '6px 12px' }}
                  onClick={() => onNavigateToCatering && onNavigateToCatering(allotmentResult.token.tokenNumber)}
                >
                  Order In-Room Dining for this Token →
                </button>
                <button
                  type="button"
                  className="btn-editorial-secondary"
                  style={{ fontSize: '0.68rem', padding: '6px 12px' }}
                  onClick={() => handlePreviewBill(allotmentResult.token.tokenNumber)}
                >
                  Preview Folio & Departure →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CHECKOUT & DEPARTURE TERMINAL */}
        <div className="editorial-card" style={{ padding: '36px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '16px' }}>
            <span className="eyebrow">Settlement & Departure</span>
            <h3 className="font-serif" style={{ fontSize: '1.4rem' }}>Guest Departure & Folio Settlement</h3>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
            Select an active in-house stay or enter their unique token to aggregate room charges, in-room dining, apply frequent guest discounts, and calculate final balance due.
          </p>

          {/* Token Search */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <input
              id="input-checkout-token"
              type="text"
              placeholder="Enter Stay Token (e.g. TKN-8421)"
              className="editorial-input"
              value={checkoutToken}
              onChange={(e) => setCheckoutToken(e.target.value)}
            />
            <button
              id="btn-fetch-bill"
              className="btn-editorial-primary"
              style={{ whiteSpace: 'nowrap', padding: '0 20px' }}
              onClick={() => handlePreviewBill(checkoutToken)}
              disabled={!checkoutToken}
            >
              Retrieve Folio
            </button>
          </div>

          {/* In-House Stays Quick List */}
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '200px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="eyebrow" style={{ fontSize: '0.62rem' }}>
              Current In-House Stays ({hotelData?.activeTokens?.length || 0})
            </span>

            {hotelData?.activeTokens && hotelData.activeTokens.length > 0 ? (
              hotelData.activeTokens.map((t) => (
                <div
                  key={t.tokenNumber}
                  style={{
                    background: checkoutToken === t.tokenNumber ? 'var(--bg-surface)' : '#FFFFFF',
                    border: checkoutToken === t.tokenNumber ? '1px solid var(--text-primary)' : '1px solid var(--border-hairline)',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                  onClick={() => handlePreviewBill(t.tokenNumber)}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '0.85rem' }}>{t.guestName}</strong>
                      <span className="badge-editorial badge-token">
                        {t.tokenNumber}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Suite {t.roomNumber} ({t.bedType}, {t.acType}) • Advance: ${t.advancePaid}
                    </div>
                  </div>

                  <button
                    className="btn-editorial-secondary"
                    style={{ fontSize: '0.65rem', padding: '4px 10px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviewBill(t.tokenNumber);
                    }}
                  >
                    Select
                  </button>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', padding: '12px 0' }}>
                No active in-house guests at present.
              </div>
            )}
          </div>

          {/* Bill Calculation Preview */}
          {billPreview && (
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              padding: '20px',
              marginTop: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '10px', marginBottom: '12px' }}>
                <span className="font-serif" style={{ fontSize: '1.15rem' }}>
                  Folio: {billPreview.guest.name}
                </span>
                <span className="badge-editorial badge-token">{billPreview.token.tokenNumber}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem', marginBottom: '14px' }}>
                <div>Suite ({billPreview.duration} nights): <strong>${billPreview.roomCharges.toFixed(2)}</strong></div>
                <div>In-Room Dining: <strong>${billPreview.foodCharges.toFixed(2)}</strong></div>
                <div>Frequent Guest Discount: <strong style={{ color: 'var(--accent-gold)' }}>-${billPreview.discount.toFixed(2)}</strong></div>
                <div>Advance Deducted: <strong style={{ color: 'var(--accent-pine)' }}>-${billPreview.advancePaid.toFixed(2)}</strong></div>
              </div>

              <div style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-hairline)',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '14px'
              }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-secondary)' }}>
                  Net Balance Due:
                </span>
                <span style={{ fontSize: '1.3rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                  ${billPreview.balanceAmount.toFixed(2)}
                </span>
              </div>

              <button
                id="btn-finalize-checkout"
                className="btn-editorial-primary"
                style={{ width: '100%', padding: '12px' }}
                onClick={handleFinalizeCheckout}
                disabled={loading}
              >
                Settle Account & Print Folio
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SUITE INVENTORY DIRECTORY */}
      <div className="editorial-card" style={{ padding: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '16px' }}>
          <div>
            <span className="eyebrow">Inventory Matrix</span>
            <h3 className="font-serif" style={{ fontSize: '1.6rem' }}>The Sovereign Suites (24 Total)</h3>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <select
              className="editorial-select"
              style={{ width: 'auto', padding: '6px 14px', fontSize: '0.78rem' }}
              value={filterBed}
              onChange={(e) => setFilterBed(e.target.value)}
            >
              <option value="All">All Bed Types</option>
              <option value="Single">Single Bed</option>
              <option value="Double">Double Bed</option>
            </select>

            <select
              className="editorial-select"
              style={{ width: 'auto', padding: '6px 14px', fontSize: '0.78rem' }}
              value={filterAc}
              onChange={(e) => setFilterAc(e.target.value)}
            >
              <option value="All">All Climate Types</option>
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
            </select>

            <select
              className="editorial-select"
              style={{ width: 'auto', padding: '6px 14px', fontSize: '0.78rem' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available Only</option>
              <option value="Occupied">Occupied Only</option>
            </select>
          </div>
        </div>

        {/* Room Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '14px'
        }}>
          {filteredRooms.map((room) => {
            const isAvail = room.status === 'Available';
            return (
              <div
                key={room.roomNumber}
                style={{
                  background: isAvail ? '#FFFFFF' : 'var(--bg-surface)',
                  border: isAvail ? '1px solid var(--border-hairline)' : '1px solid #EADCD9',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="font-serif" style={{ fontSize: '1.2rem', fontWeight: '400' }}>
                    Suite {room.roomNumber}
                  </span>
                  <span className={isAvail ? 'badge-editorial badge-available' : 'badge-editorial badge-occupied'}>
                    {room.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {room.bedType} Bed • {room.acType}
                </div>

                <div style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-primary)', marginTop: '4px' }}>
                  ${room.rate?.toFixed(2)} <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>/ night</span>
                </div>

                {isAvail ? (
                  <button
                    className="btn-editorial-secondary"
                    style={{ fontSize: '0.65rem', padding: '6px 8px', marginTop: '8px' }}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        bedType: room.bedType,
                        acType: room.acType,
                      }));
                      formRef.current?.scrollIntoView({ behavior: 'smooth' });
                      setTimeout(() => guestNameInputRef.current?.focus(), 150);
                    }}
                  >
                    Quick Reserve
                  </button>
                ) : (
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-clay)', marginTop: '8px' }}>
                    Occupied by In-House Guest
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Apology Modal */}
      <ApologyModal
        isOpen={showApology}
        onClose={() => setShowApology(false)}
        apologyData={apologyData}
        onSelectCategory={(bed, ac) => {
          setFormData({ ...formData, bedType: bed, acType: ac });
        }}
      />

      {/* Official Folio Invoice Modal */}
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        billData={finalInvoice}
      />
    </div>
  );
}
