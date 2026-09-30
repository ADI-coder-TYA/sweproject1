import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import SuiteShowcase from './components/SuiteShowcase';
import StaffRoleModal from './components/StaffRoleModal';
import GuestBookingModal from './components/GuestBookingModal';
import StaffOperationsView from './components/StaffOperationsView';
import ApologyModal from './components/ApologyModal';

export default function App() {
  // Top-level view mode: 'guest' (public luxury site) or 'staff' (hotel operations terminal)
  const [viewMode, setViewMode] = useState('guest');
  const [activeTab, setActiveTab] = useState('receptionist');
  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingCriteria, setBookingCriteria] = useState(null);
  const [heroApologyData, setHeroApologyData] = useState(null);
  const [showHeroApology, setShowHeroApology] = useState(false);

  // Cross-portal state
  const [activeCateringToken, setActiveCateringToken] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');

  const heroRef = useRef(null);

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

  // Open the guest booking modal with search criteria
  const handleProceedToBooking = (criteria) => {
    setBookingCriteria(criteria);
    setShowBookingModal(true);
  };

  // Open booking modal when selecting a suite from the showcase
  const handleSelectSuite = (bed, ac) => {
    setBookingCriteria({ bedType: bed, acType: ac, durationOfStay: 2 });
    setShowBookingModal(true);
  };

  // Open booking modal with default values from navbar "Reserve Suite"
  const handleOpenReserveDirectly = () => {
    setBookingCriteria({ bedType: 'Double', acType: 'AC', durationOfStay: 2 });
    setShowBookingModal(true);
  };

  // Handle apology modal trigger
  const handleShowApology = (data) => {
    setHeroApologyData(data);
    setShowHeroApology(true);
  };

  // Switch to Staff Operations View at a specific terminal
  const handleSelectTerminal = (terminalId) => {
    setActiveTab(terminalId);
    setViewMode('staff');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cross-terminal handoff to catering
  const handleNavigateToCatering = (tokenNum) => {
    setActiveCateringToken(tokenNum);
    setActiveTab('catering');
    setViewMode('staff');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return to public guest view
  const handleReturnToGuestView = () => {
    setViewMode('guest');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If viewing the internal staff operations terminal
  if (viewMode === 'staff') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <StaffOperationsView
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hotelData={hotelData}
          onDataChange={fetchHotelData}
          onReturnToGuestView={handleReturnToGuestView}
          activeCateringToken={activeCateringToken}
          onNavigateToCatering={handleNavigateToCatering}
          preFillData={bookingCriteria}
        />
      </div>
    );
  }

  // Public Guest Sanctuary View
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* Top Editorial Minimalist Navbar */}
      <Navbar
        onStaffClick={() => setShowStaffModal(true)}
        onBookClick={handleOpenReserveDirectly}
      />

      {/* Cinematic Hero Container with Integrated Availability Search Bar */}
      <HeroSection
        heroRef={heroRef}
        onProceedToBooking={handleProceedToBooking}
        onShowApology={handleShowApology}
      />

      {/* Main Luxury Suite Showcase Container */}
      <main style={{ flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '0 32px 64px 32px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
            <span className="eyebrow" style={{ marginBottom: '8px' }}>Initializing System</span>
            <div className="font-serif" style={{ fontSize: '1.6rem' }}>The Grand Horizon Collection</div>
          </div>
        ) : (
          <SuiteShowcase
            onSelectSuite={handleSelectSuite}
            tariffs={hotelData?.tariffs || []}
          />
        )}
      </main>

      {/* Role Selection Modal for Authorized Hotel Staff */}
      <StaffRoleModal
        isOpen={showStaffModal}
        onClose={() => setShowStaffModal(false)}
        onSelectTerminal={handleSelectTerminal}
      />

      {/* Refined Guest Reservation Modal */}
      <GuestBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        initialData={bookingCriteria}
        onBookingComplete={fetchHotelData}
      />

      {/* Global Apology Modal for Full Occupancy */}
      <ApologyModal
        isOpen={showHeroApology}
        onClose={() => setShowHeroApology(false)}
        apologyData={heroApologyData}
        onSelectCategory={(bed, ac) => {
          setBookingCriteria({ bedType: bed, acType: ac, durationOfStay: 2 });
          setShowHeroApology(false);
          setShowBookingModal(true);
        }}
      />

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
            <p style={{ color: '#A8A29E', fontSize: '0.85rem', lineHeight: '1.8', maxWidth: '340px' }}>
              A sanctuary of peace, travertine architecture, and quiet luxury. Offering tailored suites, bespoke in-room culinary journeys, and uncompromised hospitality.
            </p>
          </div>

          <div>
            <span className="eyebrow" style={{ color: '#A8A29E', marginBottom: '14px' }}>
              Hospitality Services
            </span>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem', color: '#D6D3D1', padding: 0 }}>
              <li style={{ cursor: 'pointer' }} onClick={handleOpenReserveDirectly}>
                Private Suite Accommodations
              </li>
              <li style={{ cursor: 'pointer' }} onClick={handleOpenReserveDirectly}>
                Advance Sanctuary Reservations
              </li>
              <li style={{ cursor: 'pointer' }} onClick={() => setShowStaffModal(true)}>
                Concierge & In-Room Dining Service
              </li>
              <li style={{ cursor: 'pointer', color: 'var(--accent-gold)' }} onClick={() => setShowStaffModal(true)}>
                Staff & Operations Terminal Login →
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
                value={inquiryEmail}
                onChange={(e) => setInquiryEmail(e.target.value)}
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
                onClick={() => {
                  if (!inquiryEmail || !inquiryEmail.includes('@')) {
                    alert('Please enter a valid email address to receive private suite inquiries.');
                    return;
                  }
                  alert(`Thank you for your private inquiry. Our concierge will be in touch with you at ${inquiryEmail} shortly.`);
                  setInquiryEmail('');
                }}
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
            Strictly conforming to UML Sequence Diagrams 1–3, Statechart, Use Case & Class Diagrams.
          </div>
        </div>
      </footer>
    </div>
  );
}
