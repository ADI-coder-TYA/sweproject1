import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Plus, Clock, Calendar, CheckCircle2, Search, Coffee, Wine, Cake, DollarSign } from 'lucide-react';

export default function CateringPortal({ hotelData, onDataChange }) {
  const [menu, setMenu] = useState([]);
  const [selectedToken, setSelectedToken] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [orderTime, setOrderTime] = useState(new Date().toTimeString().split(' ')[0].substring(0, 5));

  const [activeTokenOrders, setActiveTokenOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch catering menu items
  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/catering/menu');
      const data = await res.json();
      setMenu(data);
      if (data.length > 0) setSelectedItemId(data[0].itemId);
    } catch (err) {
      console.error('Failed to fetch catering menu:', err);
    }
  };

  useEffect(() => {
    fetchMenu();
    // Default to first active token if available
    if (hotelData?.activeTokens && hotelData.activeTokens.length > 0 && !selectedToken) {
      setSelectedToken(hotelData.activeTokens[0].tokenNumber);
    }
  }, [hotelData]);

  // Fetch orders for currently selected token
  const fetchTokenOrders = async (tokenNum) => {
    if (!tokenNum) return;
    setLoadingOrders(true);
    try {
      const res = await fetch(`/api/catering/orders/${encodeURIComponent(tokenNum)}`);
      const data = await res.json();
      setActiveTokenOrders(data);
    } catch (err) {
      console.error('Failed to fetch token orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (selectedToken) {
      fetchTokenOrders(selectedToken);
    }
  }, [selectedToken]);

  // Record food consumption (Sequence Diagram 2)
  const handleRecordConsumption = async (e) => {
    e.preventDefault();
    if (!selectedToken || !selectedItemId) {
      setErrorMessage('Please select a valid guest token and food item.');
      return;
    }

    setSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await fetch('/api/catering/consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenNumber: selectedToken.trim(),
          itemId: selectedItemId,
          quantity: Number(quantity),
          date: orderDate,
          time: orderTime,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage(`Recorded ${data.quantity}x ${data.itemName} ($${data.amount.toFixed(2)}) for Token ${data.tokenNumber}`);
        fetchTokenOrders(selectedToken);
        if (onDataChange) onDataChange();
      } else {
        setErrorMessage(data.error || 'Failed to record consumption.');
      }
    } catch (err) {
      setErrorMessage('Error recording consumption: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedItem = menu.find(i => i.itemId === selectedItemId);
  const totalCharge = selectedItem ? (selectedItem.price * quantity).toFixed(2) : '0.00';
  const activeGuest = hotelData?.activeTokens?.find(t => t.tokenNumber === selectedToken);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Header */}
      <div>
        <h2 className="font-serif gold-gradient-text" style={{ fontSize: '1.7rem' }}>
          5-Star Catering & Room Dining Management
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Sequence Diagram 2 — Log gourmet food & beverage consumption against the guest's unique token.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        
        {/* ORDER ENTRY FORM */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <UtensilsCrossed size={22} color="var(--gold-light)" />
            <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>
              Record Food Consumption
            </h3>
          </div>

          <form onSubmit={handleRecordConsumption}>
            {/* Guest Token Selection */}
            <div className="form-group">
              <label className="form-label">Guest Stay Token Number *</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  id="select-catering-token"
                  className="form-select"
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value)}
                  required
                >
                  <option value="">-- Select Active Guest Token --</option>
                  {hotelData?.activeTokens?.map((t) => (
                    <option key={t.tokenNumber} value={t.tokenNumber}>
                      {t.tokenNumber} — {t.guestName} (Room {t.roomNumber})
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Or Manual TKN-XXXX"
                  className="form-input"
                  style={{ maxWidth: '160px' }}
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value)}
                />
              </div>

              {activeGuest && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-gold)', marginTop: '4px' }}>
                  Active Stay: {activeGuest.guestName} in Room {activeGuest.roomNumber} ({activeGuest.bedType} Bed, {activeGuest.acType})
                </div>
              )}
            </div>

            {/* Food Item Selection */}
            <div className="form-group">
              <label className="form-label">Select Gourmet Food Item *</label>
              <select
                id="select-food-item"
                className="form-select"
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                required
              >
                {menu.map((item) => (
                  <option key={item.itemId} value={item.itemId}>
                    [{item.category}] {item.itemName} — ${item.price.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity, Date, Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input
                  id="input-food-quantity"
                  type="number"
                  min="1"
                  max="20"
                  className="form-input"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  id="input-food-date"
                  type="date"
                  className="form-input"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time</label>
                <input
                  id="input-food-time"
                  type="time"
                  className="form-input"
                  value={orderTime}
                  onChange={(e) => setOrderTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Amount Preview Box */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Item Price: ${selectedItem?.price?.toFixed(2) || '0.00'} × {quantity}
              </span>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '6px' }}>Total Amount:</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--gold-light)' }}>
                  ${totalCharge}
                </strong>
              </div>
            </div>

            {errorMessage && (
              <div style={{ color: '#fb7185', fontSize: '0.85rem', marginBottom: '14px' }}>
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div style={{
                color: '#34d399',
                fontSize: '0.85rem',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} /> {successMessage}
              </div>
            )}

            <button
              id="btn-record-catering"
              type="submit"
              className="btn-gold"
              style={{ width: '100%', padding: '12px' }}
              disabled={submitting || !selectedToken}
            >
              <Plus size={18} /> {submitting ? 'Recording Order...' : 'Record Consumption Against Token'}
            </button>
          </form>
        </div>

        {/* TOKEN ORDER HISTORY / TAB SHEET */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>
              Token Consumption Ledger
            </h3>
            {selectedToken && (
              <span className="badge badge-token">
                {selectedToken}
              </span>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '380px' }}>
            {loadingOrders ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading token consumption history...</div>
            ) : activeTokenOrders.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--gold-light)' }}>
                    <th style={{ padding: '8px 4px' }}>Time</th>
                    <th style={{ padding: '8px 4px' }}>Item</th>
                    <th style={{ padding: '8px 4px', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '8px 4px', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTokenOrders.map((ord, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '10px 4px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {ord.date} {ord.time}
                      </td>
                      <td style={{ padding: '10px 4px' }}>
                        <strong>{ord.itemName}</strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          ${ord.unitPrice?.toFixed(2)} each
                        </div>
                      </td>
                      <td style={{ padding: '10px 4px', textAlign: 'center' }}>{ord.quantity}</td>
                      <td style={{ padding: '10px 4px', textAlign: 'right', fontWeight: '600', color: 'var(--text-gold)' }}>
                        ${ord.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontStyle: 'italic', padding: '20px 0' }}>
                {selectedToken 
                  ? 'No catering consumption has been recorded for this token yet.'
                  : 'Select an active token from the form to view its dining orders.'}
              </div>
            )}
          </div>

          {activeTokenOrders.length > 0 && (
            <div style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '14px',
              marginTop: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Total Catering Accrued:
              </span>
              <strong style={{ fontSize: '1.2rem', color: 'var(--gold-light)' }}>
                ${activeTokenOrders.reduce((sum, o) => sum + o.amount, 0).toFixed(2)}
              </strong>
            </div>
          )}
        </div>
      </div>

      {/* FULL CATERING MENU REFERENCE */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 className="font-serif gold-gradient-text" style={{ fontSize: '1.3rem', marginBottom: '16px' }}>
          5-Star Room Dining Catalog
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
          {menu.map((item) => (
            <div
              key={item.itemId}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--gold-light)', letterSpacing: '0.05em' }}>
                  {item.category}
                </span>
                <div style={{ fontWeight: '500', fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '2px' }}>
                  {item.itemName}
                </div>
              </div>

              <strong style={{ color: 'var(--text-gold)', fontSize: '1rem', marginLeft: '12px' }}>
                ${item.price.toFixed(2)}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
