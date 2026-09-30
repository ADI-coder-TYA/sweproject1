import React, { useState, useEffect } from 'react';

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

  // Record food consumption
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
        setSuccessMessage(`Order logged: ${data.quantity}x ${data.itemName} ($${data.amount.toFixed(2)}) for Token ${data.tokenNumber}`);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      
      {/* Editorial Header */}
      <div style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '24px' }}>
        <span className="eyebrow" style={{ marginBottom: '8px' }}>
          Culinary Logistics • Sequence Diagram 2
        </span>
        <h2 className="font-serif" style={{ fontSize: '2.4rem', fontWeight: '300' }}>
          In-Room Dining & Catering Management
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '680px', marginTop: '6px' }}>
          Record gourmet culinary consumption against the guest's unique token. All orders are automatically integrated into the guest's departure folio.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '32px' }}>
        
        {/* LOG FOOD ORDER */}
        <div className="editorial-card" style={{ padding: '36px' }}>
          <div style={{ marginBottom: '28px', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '16px' }}>
            <span className="eyebrow">Order Entry</span>
            <h3 className="font-serif" style={{ fontSize: '1.4rem' }}>Log Guest Food Consumption</h3>
          </div>

          <form onSubmit={handleRecordConsumption}>
            {/* Token Selector */}
            <div className="form-group-editorial">
              <label className="form-label-editorial">Guest Stay Token Number *</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  id="select-catering-token"
                  className="editorial-select"
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value)}
                  required
                >
                  <option value="">-- Select In-House Stay --</option>
                  {hotelData?.activeTokens?.map((t) => (
                    <option key={t.tokenNumber} value={t.tokenNumber}>
                      {t.tokenNumber} — {t.guestName} (Suite {t.roomNumber})
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Or Enter Token"
                  className="editorial-input"
                  style={{ maxWidth: '150px' }}
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value)}
                />
              </div>

              {activeGuest && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  In-House: {activeGuest.guestName} • Suite {activeGuest.roomNumber} ({activeGuest.bedType}, {activeGuest.acType})
                </div>
              )}
            </div>

            {/* Food Item Selection */}
            <div className="form-group-editorial">
              <label className="form-label-editorial">Select Food Item *</label>
              <select
                id="select-food-item"
                className="editorial-select"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group-editorial">
                <label className="form-label-editorial">Quantity</label>
                <input
                  id="input-food-quantity"
                  type="number"
                  min="1"
                  max="20"
                  className="editorial-input"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  required
                />
              </div>

              <div className="form-group-editorial">
                <label className="form-label-editorial">Date</label>
                <input
                  id="input-food-date"
                  type="date"
                  className="editorial-input"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-editorial">
                <label className="form-label-editorial">Time</label>
                <input
                  id="input-food-time"
                  type="time"
                  className="editorial-input"
                  value={orderTime}
                  onChange={(e) => setOrderTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Price Preview */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-hairline)',
              padding: '14px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Item Price: ${selectedItem?.price?.toFixed(2) || '0.00'} × {quantity}
              </span>
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-secondary)', marginRight: '8px' }}>
                  Total:
                </span>
                <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                  ${totalCharge}
                </strong>
              </div>
            </div>

            {errorMessage && (
              <div style={{ color: 'var(--accent-clay)', fontSize: '0.82rem', marginBottom: '16px' }}>
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div style={{ color: 'var(--accent-pine)', fontSize: '0.82rem', marginBottom: '16px' }}>
                ✓ {successMessage}
              </div>
            )}

            <button
              id="btn-record-catering"
              type="submit"
              className="btn-editorial-primary"
              style={{ width: '100%', padding: '14px' }}
              disabled={submitting || !selectedToken}
            >
              {submitting ? 'Recording Order...' : 'Log Order Against Token'}
            </button>
          </form>
        </div>

        {/* TOKEN CONSUMPTION LEDGER */}
        <div className="editorial-card" style={{ padding: '36px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '16px' }}>
            <div>
              <span className="eyebrow">Guest Ledger</span>
              <h3 className="font-serif" style={{ fontSize: '1.4rem' }}>Token Dining History</h3>
            </div>
            {selectedToken && (
              <span className="badge-editorial badge-token">
                {selectedToken}
              </span>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '380px' }}>
            {loadingOrders ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading token records...</div>
            ) : activeTokenOrders.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-hairline)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '10px 4px' }}>Time</th>
                    <th style={{ padding: '10px 4px' }}>Item</th>
                    <th style={{ padding: '10px 4px', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '10px 4px', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTokenOrders.map((ord, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                      <td style={{ padding: '12px 4px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        {ord.date} {ord.time}
                      </td>
                      <td style={{ padding: '12px 4px' }}>
                        <strong>{ord.itemName}</strong>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          ${ord.unitPrice?.toFixed(2)} each
                        </div>
                      </td>
                      <td style={{ padding: '12px 4px', textAlign: 'center' }}>{ord.quantity}</td>
                      <td style={{ padding: '12px 4px', textAlign: 'right', fontWeight: '500', color: 'var(--text-primary)' }}>
                        ${ord.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', padding: '24px 0' }}>
                {selectedToken 
                  ? 'No culinary orders recorded for this token yet.'
                  : 'Select an active token to review its dining orders.'}
              </div>
            )}
          </div>

          {activeTokenOrders.length > 0 && (
            <div style={{
              borderTop: '1px solid var(--border-hairline)',
              paddingTop: '16px',
              marginTop: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                Accrued Dining Total:
              </span>
              <strong style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                ${activeTokenOrders.reduce((sum, o) => sum + o.amount, 0).toFixed(2)}
              </strong>
            </div>
          )}
        </div>
      </div>

      {/* CULINARY CATALOG */}
      <div className="editorial-card" style={{ padding: '36px' }}>
        <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '16px' }}>
          <span className="eyebrow">The Culinary Master Collection</span>
          <h3 className="font-serif" style={{ fontSize: '1.6rem' }}>In-Room Gourmet Catalog</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {menu.map((item) => (
            <div
              key={item.itemId}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-hairline)',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <span className="eyebrow" style={{ fontSize: '0.6rem', color: 'var(--accent-gold)' }}>
                  {item.category}
                </span>
                <div style={{ fontWeight: '500', fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {item.itemName}
                </div>
              </div>

              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginLeft: '16px' }}>
                ${item.price.toFixed(2)}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
