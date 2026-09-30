import React, { useState, useEffect } from 'react';
import InvoiceModal from './InvoiceModal';

export default function BillsLedger() {
  const [bills, setBills] = useState([]);
  const [frequentGuests, setFrequentGuests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch settled bills & frequent guests
  const fetchData = async () => {
    setLoading(true);
    try {
      const [billsRes, fgRes] = await Promise.all([
        fetch('/api/bills'),
        fetch('/api/frequent-guests')
      ]);
      const billsData = await billsRes.json();
      const fgData = await fgRes.json();
      setBills(billsData);
      setFrequentGuests(fgData);
    } catch (err) {
      console.error('Failed to load ledger data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openBillModal = async (tokenNum) => {
    try {
      const res = await fetch(`/api/billing/calculate/${encodeURIComponent(tokenNum)}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedBill(data);
        setShowModal(true);
      }
    } catch (err) {
      console.error('Failed to fetch detailed bill:', err);
    }
  };

  const filteredBills = bills.filter(b => 
    b.billNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.tokenNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      
      {/* Editorial Header */}
      <div style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '24px' }}>
        <span className="eyebrow" style={{ marginBottom: '8px' }}>
          Historical Records & Privileges • Sequence Diagram 3
        </span>
        <h2 className="font-serif" style={{ fontSize: '2.4rem', fontWeight: '300' }}>
          Guest Folios & Loyalty Registry
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '680px', marginTop: '6px' }}>
          Review archived guest folios, settle balances, and inspect the registered frequent guest identity directory.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '32px' }}>
        
        {/* FREQUENT GUEST DIRECTORY */}
        <div className="editorial-card" style={{ padding: '36px' }}>
          <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '16px' }}>
            <span className="eyebrow">Loyalty Privileges</span>
            <h3 className="font-serif" style={{ fontSize: '1.4rem' }}>Frequent Guest Directory</h3>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
            Guests assigned identity numbers receive automated loyalty deductions on their room tariffs upon departure.
          </p>

          <div style={{ display: 'grid', gap: '12px' }}>
            {frequentGuests.map((fg) => (
              <div
                key={fg.frequentGuestId}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--border-hairline)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{fg.name}</strong>
                    <span className="badge-editorial badge-vip">
                      {fg.frequentGuestId}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Recorded In-House Stays: {fg.totalVisits}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                    {fg.discountPercentage}% OFF
                  </div>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                    Room Tariff Benefit
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SETTLED BILLS ARCHIVE */}
        <div className="editorial-card" style={{ padding: '36px' }}>
          <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '16px' }}>
            <span className="eyebrow">Settled Departures</span>
            <h3 className="font-serif" style={{ fontSize: '1.4rem' }}>Archived Guest Folios ({bills.length})</h3>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search by Folio #, Guest Name, or Token..."
              className="editorial-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {filteredBills.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-hairline)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '10px 4px' }}>Folio / Token</th>
                    <th style={{ padding: '10px 4px' }}>Guest Name</th>
                    <th style={{ padding: '10px 4px', textAlign: 'right' }}>Settled Balance</th>
                    <th style={{ padding: '10px 4px', textAlign: 'center' }}>Folio</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.map((b) => (
                    <tr key={b.billNumber} style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                      <td style={{ padding: '12px 4px' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{b.billNumber}</strong>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{b.tokenNumber}</div>
                      </td>
                      <td style={{ padding: '12px 4px' }}>
                        <div>{b.guestName}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{b.generatedAt}</div>
                      </td>
                      <td style={{ padding: '12px 4px', textAlign: 'right', fontWeight: '500', color: 'var(--accent-pine)' }}>
                        ${b.balanceAmount?.toFixed(2)}
                      </td>
                      <td style={{ padding: '12px 4px', textAlign: 'center' }}>
                        <button
                          className="btn-editorial-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.65rem' }}
                          onClick={() => openBillModal(b.tokenNumber)}
                        >
                          View Folio
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', padding: '24px 0' }}>
                {bills.length === 0 ? 'No settled guest folios in archive.' : 'No folios matched your query.'}
              </div>
            )}
          </div>
        </div>
      </div>

      <InvoiceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        billData={selectedBill}
      />
    </div>
  );
}
