import React, { useState, useEffect } from 'react';
import { Receipt, Award, Search, Printer, ShieldCheck, DollarSign, Calendar } from 'lucide-react';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Header */}
      <div>
        <h2 className="font-serif gold-gradient-text" style={{ fontSize: '1.7rem' }}>
          Settled Accounts Ledger & Frequent Guest Registry
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Audit trail of finalized departures, itemized bills, and frequent guest discount profiles.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        
        {/* FREQUENT GUESTS DIRECTORY */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Award size={22} color="var(--gold-light)" />
            <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>
              Frequent Guest Loyalty Directory
            </h3>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
            Guests with registered identity numbers receive automated discounts upon checkout.
          </p>

          <div style={{ display: 'grid', gap: '10px' }}>
            {frequentGuests.map((fg) => (
              <div 
                key={fg.frequentGuestId}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(251, 191, 36, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{fg.name}</strong>
                    <span className="badge badge-vip">
                      {fg.frequentGuestId}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Total Recorded Visits: {fg.totalVisits}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--gold-light)' }}>
                    {fg.discountPercentage}% OFF
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Room Tariff Discount
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SETTLED BILLS SEARCH & AUDIT LOG */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Receipt size={22} color="var(--gold-light)" />
              <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>
                Archived Guest Folios ({bills.length})
              </h3>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search by Bill #, Guest Name, or Token..."
                className="form-input"
                style={{ paddingLeft: '36px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {filteredBills.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--gold-light)' }}>
                    <th style={{ padding: '8px 4px' }}>Bill & Token</th>
                    <th style={{ padding: '8px 4px' }}>Guest</th>
                    <th style={{ padding: '8px 4px', textAlign: 'right' }}>Balance Settled</th>
                    <th style={{ padding: '8px 4px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.map((b) => (
                    <tr key={b.billNumber} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '10px 4px' }}>
                        <strong style={{ color: 'var(--text-main)' }}>{b.billNumber}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-blue)' }}>{b.tokenNumber}</div>
                      </td>
                      <td style={{ padding: '10px 4px' }}>
                        <div>{b.guestName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.generatedAt}</div>
                      </td>
                      <td style={{ padding: '10px 4px', textAlign: 'right', fontWeight: '700', color: '#34d399' }}>
                        ${b.balanceAmount?.toFixed(2)}
                      </td>
                      <td style={{ padding: '10px 4px', textAlign: 'center' }}>
                        <button
                          className="btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          onClick={() => openBillModal(b.tokenNumber)}
                        >
                          <Printer size={13} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontStyle: 'italic', padding: '20px 0' }}>
                {bills.length === 0 ? 'No bills settled yet. Checkout active guests from the Reception Desk.' : 'No bills matched your search.'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        billData={selectedBill}
      />
    </div>
  );
}
