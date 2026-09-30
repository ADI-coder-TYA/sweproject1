import React, { useState, useEffect } from 'react';
import { 
  KeyRound, BedDouble, Wind, UserCheck, ShieldCheck, 
  CheckCircle2, DollarSign, Calendar, Clock, Search, LogOut, FileText 
} from 'lucide-react';
import ApologyModal from './ApologyModal';
import InvoiceModal from './InvoiceModal';

export default function ReceptionistPortal({ onDataChange, hotelData }) {
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
        // Reset form partially
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="font-serif gold-gradient-text" style={{ fontSize: '1.7rem' }}>
            Front Desk & Room Allocation Terminal
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Reserve advance or spot accommodations, issue unique tokens, and process departures.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <span className="badge badge-available">
            {rooms.filter(r => r.status === 'Available').length} Rooms Available
          </span>
          <span className="badge badge-token">
            {hotelData?.activeTokens?.length || 0} Active Guest Tokens
          </span>
        </div>
      </div>

      {/* Grid: Check-In Form (Left) & Active Stays / Checkout Terminal (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        
        {/* CHECK-IN & RESERVATION CARD */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <KeyRound size={22} color="var(--gold-light)" />
              <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>
                New Guest Registration & Allotment
              </h3>
            </div>
            
            {/* Advance vs On-Spot Selector */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: 'var(--radius-sm)' }}>
              <button
                type="button"
                className={formData.reservationType === 'OnSpot' ? 'btn-gold' : 'btn-secondary'}
                style={{ padding: '4px 10px', fontSize: '0.78rem', border: 'none' }}
                onClick={() => setFormData({ ...formData, reservationType: 'OnSpot' })}
              >
                On-Spot
              </button>
              <button
                type="button"
                className={formData.reservationType === 'Advance' ? 'btn-gold' : 'btn-secondary'}
                style={{ padding: '4px 10px', fontSize: '0.78rem', border: 'none' }}
                onClick={() => setFormData({ ...formData, reservationType: 'Advance' })}
              >
                Advance
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleReservationSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Guest Full Name *</label>
                <input
                  id="input-guest-name"
                  type="text"
                  required
                  placeholder="e.g. Lord Alexander Wright"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  id="input-guest-phone"
                  type="text"
                  placeholder="+1 (555) 019-2834"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Arrival Date & Time</label>
                <input
                  id="input-arrival-time"
                  type="datetime-local"
                  required
                  className="form-input"
                  value={formData.arrivalTime}
                  onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Duration of Stay (Nights) *</label>
                <input
                  id="input-duration"
                  type="number"
                  min="1"
                  max="60"
                  required
                  className="form-input"
                  value={formData.durationOfStay}
                  onChange={(e) => setFormData({ ...formData, durationOfStay: e.target.value })}
                />
              </div>
            </div>

            {/* Room Type Preferences */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Bed Type *</label>
                <select
                  id="select-bed-type"
                  className="form-select"
                  value={formData.bedType}
                  onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
                >
                  <option value="Single">Single Bed</option>
                  <option value="Double">Double Bed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">AC Type *</label>
                <select
                  id="select-ac-type"
                  className="form-select"
                  value={formData.acType}
                  onChange={(e) => setFormData({ ...formData, acType: e.target.value })}
                >
                  <option value="AC">Air Conditioned (AC)</option>
                  <option value="Non-AC">Non-AC</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Advance Paid ($)</label>
                <input
                  id="input-advance-paid"
                  type="number"
                  min="0"
                  step="10"
                  className="form-input"
                  value={formData.advancePaid}
                  onChange={(e) => setFormData({ ...formData, advancePaid: e.target.value })}
                />
              </div>
            </div>

            {/* Frequent Guest ID (Loyalty Requirement) */}
            <div className="form-group" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Frequent Guest Identity Number (Optional)</label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-gold)' }}>
                  Try VIP-777, VIP-888, VIP-999, GOLD-101
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  id="input-frequent-guest-id"
                  type="text"
                  placeholder="e.g. VIP-777"
                  className="form-input"
                  value={formData.frequentGuestId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, frequentGuestId: val });
                    if (!val) setFrequentGuestInfo(null);
                  }}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '0 14px', fontSize: '0.85rem' }}
                  onClick={() => verifyFrequentGuest(formData.frequentGuestId)}
                  disabled={verifyingFG || !formData.frequentGuestId}
                >
                  Verify
                </button>
              </div>

              {/* Loyalty Feedback Status */}
              {frequentGuestInfo && (
                <div style={{ marginTop: '8px', fontSize: '0.85rem' }}>
                  {frequentGuestInfo.notFound ? (
                    <span style={{ color: '#fb7185' }}>
                      Guest ID not recognized. Proceeding as Standard Guest.
                    </span>
                  ) : (
                    <span className="badge badge-vip">
                      <ShieldCheck size={14} /> VIP Recognized: {frequentGuestInfo.name} ({frequentGuestInfo.discountPercentage}% Discount)
                    </span>
                  )}
                </div>
              )}
            </div>

            {message && <div style={{ color: '#fb7185', fontSize: '0.9rem', marginBottom: '14px' }}>{message}</div>}

            <button
              id="btn-allot-room"
              type="submit"
              className="btn-gold"
              style={{ width: '100%', padding: '12px', marginTop: '10px' }}
              disabled={loading}
            >
              <KeyRound size={18} /> {loading ? 'Checking Availability...' : 'Check Availability & Allot Room'}
            </button>
          </form>

          {/* Success Banner when Room is Allotted */}
          {allotmentResult && allotmentResult.success && (
            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid #10b981',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#34d399', fontWeight: '600' }}>
                <CheckCircle2 size={20} />
                <span>Room Successfully Allocated!</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px', fontSize: '0.88rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Room Number: </span>
                  <strong style={{ color: 'var(--text-gold)', fontSize: '1.1rem' }}>
                    #{allotmentResult.room.roomNumber}
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Unique Token: </span>
                  <strong style={{ color: 'var(--accent-blue)', fontSize: '1.1rem' }}>
                    {allotmentResult.token.tokenNumber}
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Room Rate: </span>
                  <strong>${allotmentResult.room.rate}/night</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Guest: </span>
                  <strong>{allotmentResult.guest.name}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ACTIVE TOKENS & CHECKOUT DESK */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LogOut size={22} color="var(--gold-light)" />
              <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>
                Guest Departure & Final Settlement
              </h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Sequence Diagram 3
            </span>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '14px' }}>
            Select an active staying guest or enter their unique token to aggregate room charges, catering consumption, frequent guest discounts, and calculate balance due.
          </p>

          {/* Quick Token Search / Entry */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
              id="input-checkout-token"
              type="text"
              placeholder="Enter Guest Token (e.g. TKN-8421)"
              className="form-input"
              value={checkoutToken}
              onChange={(e) => setCheckoutToken(e.target.value)}
            />
            <button
              id="btn-fetch-bill"
              className="btn-gold"
              style={{ whiteSpace: 'nowrap', padding: '0 16px' }}
              onClick={() => handlePreviewBill(checkoutToken)}
              disabled={!checkoutToken}
            >
              <Search size={16} /> Fetch Bill
            </button>
          </div>

          {/* Active Tokens Quick-List */}
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '200px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Active In-House Stays ({hotelData?.activeTokens?.length || 0})
            </div>

            {hotelData?.activeTokens && hotelData.activeTokens.length > 0 ? (
              hotelData.activeTokens.map((t) => (
                <div 
                  key={t.tokenNumber}
                  style={{
                    background: checkoutToken === t.tokenNumber ? 'rgba(197, 160, 89, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: checkoutToken === t.tokenNumber ? '1px solid var(--gold-primary)' : '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                  onClick={() => handlePreviewBill(t.tokenNumber)}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '0.9rem' }}>{t.guestName}</strong>
                      <span className="badge badge-token" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>
                        {t.tokenNumber}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Room {t.roomNumber} ({t.bedType}, {t.acType}) • Adv: ${t.advancePaid}
                    </div>
                  </div>

                  <button 
                    className="btn-secondary" 
                    style={{ fontSize: '0.78rem', padding: '4px 10px' }}
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
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', padding: '10px 0' }}>
                No guests currently in-house. Allot a room to generate a token!
              </div>
            )}
          </div>

          {/* Bill Preview Box if Loaded */}
          {billPreview && (
            <div style={{
              background: 'rgba(12, 20, 38, 0.95)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginTop: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px', marginBottom: '10px' }}>
                <span style={{ fontWeight: '600', color: 'var(--gold-light)' }}>
                  Checkout Summary for {billPreview.guest.name}
                </span>
                <span className="badge badge-token">{billPreview.token.tokenNumber}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem', marginBottom: '12px' }}>
                <div>Room ({billPreview.duration} nights): <strong>${billPreview.roomCharges.toFixed(2)}</strong></div>
                <div>Catering ({billPreview.consumptions.length} orders): <strong>${billPreview.foodCharges.toFixed(2)}</strong></div>
                <div>Frequent Guest Discount: <strong style={{ color: '#fbbf24' }}>-${billPreview.discount.toFixed(2)}</strong></div>
                <div>Advance Deducted: <strong style={{ color: '#34d399' }}>-${billPreview.advancePaid.toFixed(2)}</strong></div>
              </div>

              <div style={{
                background: 'rgba(197, 160, 89, 0.1)',
                border: '1px solid var(--gold-primary)',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <span style={{ fontWeight: '600', color: 'var(--text-gold)' }}>Balance Payable:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
                  ${billPreview.balanceAmount.toFixed(2)}
                </span>
              </div>

              <button
                id="btn-finalize-checkout"
                className="btn-gold"
                style={{ width: '100%', padding: '10px' }}
                onClick={handleFinalizeCheckout}
                disabled={loading}
              >
                <FileText size={16} /> Finalize Checkout & Print Bill
              </button>
            </div>
          )}
        </div>
      </div>

      {/* LIVE ROOM INVENTORY MATRIX */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
          <div>
            <h3 className="font-serif gold-gradient-text" style={{ fontSize: '1.3rem' }}>
              Live Room Matrix & Status Monitor
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              All 24 luxury suites categorized across Single/Double and AC/Non-AC types.
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
              value={filterBed}
              onChange={(e) => setFilterBed(e.target.value)}
            >
              <option value="All">All Beds</option>
              <option value="Single">Single Bed</option>
              <option value="Double">Double Bed</option>
            </select>

            <select
              className="form-select"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
              value={filterAc}
              onChange={(e) => setFilterAc(e.target.value)}
            >
              <option value="All">All AC Types</option>
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
            </select>

            <select
              className="form-select"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available Only</option>
              <option value="Occupied">Occupied Only</option>
            </select>
          </div>
        </div>

        {/* Room Cards Grid */}
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
                  background: isAvail ? 'rgba(16, 185, 129, 0.04)' : 'rgba(244, 63, 94, 0.05)',
                  border: isAvail ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(244, 63, 94, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: '700', fontFamily: 'var(--font-serif)' }}>
                    #{room.roomNumber}
                  </span>
                  <span className={isAvail ? 'badge badge-available' : 'badge badge-occupied'} style={{ padding: '2px 8px' }}>
                    {room.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {room.bedType} Bed • {room.acType}
                </div>

                <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-gold)', marginTop: '4px' }}>
                  ${room.rate?.toFixed(2)}/night
                </div>

                {isAvail ? (
                  <button
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '4px 8px', marginTop: '6px' }}
                    onClick={() => {
                      setFormData({
                        ...formData,
                        bedType: room.bedType,
                        acType: room.acType,
                      });
                      window.scrollTo({ top: 100, behavior: 'smooth' });
                    }}
                  >
                    Quick Book
                  </button>
                ) : (
                  <div style={{ fontSize: '0.72rem', color: '#fb7185', marginTop: '4px' }}>
                    Occupied by Guest
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Apology Modal Component */}
      <ApologyModal
        isOpen={showApology}
        onClose={() => setShowApology(false)}
        apologyData={apologyData}
        onSelectCategory={(bed, ac) => {
          setFormData({ ...formData, bedType: bed, acType: ac });
        }}
      />

      {/* Official Invoice Modal Component */}
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        billData={finalInvoice}
      />
    </div>
  );
}
