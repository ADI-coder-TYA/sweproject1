import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ReceptionistPortal from './components/ReceptionistPortal';
import CateringPortal from './components/CateringPortal';
import ManagerPortal from './components/ManagerPortal';
import BillsLedger from './components/BillsLedger';

export default function App() {
  const [activeTab, setActiveTab] = useState('receptionist');
  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial hotel data & stats
  const fetchHotelData = async () => {
    try {
      const res = await fetch('/api/hotel');
      if (res.ok) {
        const data = await res.json();
        setHotelData(data);
      }
    } catch (err) {
      console.error('Failed to load hotel overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelData();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Luxury Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        hotelData={hotelData} 
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-gold)', fontSize: '1.2rem' }}>
            <div className="font-serif">Establishing Grand Horizon Hotel Network...</div>
          </div>
        ) : (
          <>
            {activeTab === 'receptionist' && (
              <ReceptionistPortal 
                hotelData={hotelData} 
                onDataChange={fetchHotelData} 
              />
            )}

            {activeTab === 'catering' && (
              <CateringPortal 
                hotelData={hotelData} 
                onDataChange={fetchHotelData} 
              />
            )}

            {activeTab === 'manager' && (
              <ManagerPortal 
                hotelData={hotelData} 
                onDataChange={fetchHotelData} 
              />
            )}

            {activeTab === 'invoices' && (
              <BillsLedger />
            )}
          </>
        )}
      </main>

      {/* Luxury Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(6, 10, 20, 0.95)',
        padding: '24px',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
          <div>
            <span className="font-serif" style={{ color: 'var(--gold-light)', fontWeight: '600' }}>
              The Grand Horizon Hotel Automation System
            </span>
            {' • '}
            <span>Academic Software Engineering Project</span>
          </div>
          <div style={{ fontSize: '0.8rem' }}>
            Implemented strictly conforming to UML Sequence Diagrams 1–3, Statechart, Use Case & Class Diagrams.
          </div>
        </div>
      </footer>
    </div>
  );
}
