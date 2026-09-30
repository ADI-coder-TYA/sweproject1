import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import SuiteShowcase from './components/SuiteShowcase';
import ReceptionistPortal from './components/ReceptionistPortal';
import CateringPortal from './components/CateringPortal';
import ManagerPortal from './components/ManagerPortal';
import BillsLedger from './components/BillsLedger';

export default function App() {
  const [activeTab, setActiveTab] = useState('receptionist');
  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef(null);
  const portalRef = useRef(null);

  // Fetch hotel overview
  const fetchHotelData = async () => {
    try {
      const res = await fetch('/api/hotel');
      if (res.ok) {
        const data = await res.json();
        setHotelData(data);
      }
    } catch (err) {
      console.error('Failed to load hotel data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelData();
  }, []);

  const scrollToWorkstation = () => {
    if (portalRef.current) {
      portalRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSuite = (bed, ac) => {
    setActiveTab('receptionist');
    scrollToWorkstation();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* Top Editorial Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        hotelData={hotelData} 
        onBookClick={scrollToWorkstation}
      />

      {/* Cinematic Hero Container with Integrated Availability Bar */}
      <HeroSection 
        heroRef={heroRef}
        onSearchAvailability={scrollToWorkstation} 
      />

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '0 32px 64px 32px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
            <span className="eyebrow" style={{ marginBottom: '8px' }}>Initializing System</span>
            <div className="font-serif" style={{ fontSize: '1.6rem' }}>The Grand Horizon Collection</div>
          </div>
        ) : (
          <>
            {/* Architectural Suite Showcase */}
            <SuiteShowcase 
              onSelectSuite={handleSelectSuite} 
              tariffs={hotelData?.tariffs || []} 
            />

            {/* Operational Workstation Section */}
            <div ref={portalRef} style={{ paddingTop: '32px' }}>
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
            </div>
          </>
        )}
      </main>

      {/* Editorial Charcoal Footer */}
      <footer style={{
        background: 'var(--bg-dark)',
        color: 'var(--text-inverted)',
        padding: '80px 32px 48px 32px',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '48px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          paddingBottom: '48px',
          marginBottom: '32px'
        }}>
          <div>
            <span className="eyebrow" style={{ color: '#A8A29E', marginBottom: '8px' }}>
              The Sanctuary
            </span>
            <h3 className="font-serif" style={{ fontSize: '1.8rem', fontWeight: '300', color: '#FFFFFF', marginBottom: '14px' }}>
              THE GRAND HORIZON
            </h3>
            <p style={{ color: '#A8A29E', fontSize: '0.85rem', lineHeight: '1.8', maxWidth: '320px' }}>
              A sanctuary of peace, travertine architecture, and quiet luxury. 24 private suites, automated allocation, and bespoke in-room dining.
            </p>
          </div>

          <div>
            <span className="eyebrow" style={{ color: '#A8A29E', marginBottom: '14px' }}>
              Operational Terminals
            </span>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', color: '#D6D3D1' }}>
              <li style={{ cursor: 'pointer' }} onClick={() => { setActiveTab('receptionist'); scrollToWorkstation(); }}>
                01. Allotment & Front Desk Terminal
              </li>
              <li style={{ cursor: 'pointer' }} onClick={() => { setActiveTab('catering'); scrollToWorkstation(); }}>
                02. In-Room Dining & Catering Logger
              </li>
              <li style={{ cursor: 'pointer' }} onClick={() => { setActiveTab('manager'); scrollToWorkstation(); }}>
                03. Dynamic Occupancy & Tariff Control
              </li>
              <li style={{ cursor: 'pointer' }} onClick={() => { setActiveTab('invoices'); scrollToWorkstation(); }}>
                04. Settled Folios & Frequent Guest Directory
              </li>
            </ul>
          </div>

          <div>
            <span className="eyebrow" style={{ color: '#A8A29E', marginBottom: '14px' }}>
              Private Inquiries
            </span>
            <p style={{ color: '#A8A29E', fontSize: '0.82rem', marginBottom: '16px' }}>
              Receive seasonal tariff updates and discreet suite availability notices.
            </p>
            <div style={{ display: 'flex', borderBottom: '1px solid #78716C', paddingBottom: '8px' }}>
              <input
                type="email"
                placeholder="Enter email address"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  outline: 'none',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-sans)',
                  flex: 1
                }}
              />
              <button
                type="button"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#D4C5B9',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                Inquire
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          fontSize: '0.75rem',
          color: '#78716C'
        }}>
          <div>
            The Grand Horizon Hotel Automation • Academic Software Engineering System
          </div>
          <div>
            Fully strictly aligned with UML Sequence Diagrams 1–3, Statechart, Use Case & Class Diagrams.
          </div>
        </div>
      </footer>
    </div>
  );
}
