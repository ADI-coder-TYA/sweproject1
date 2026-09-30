import React from 'react';
import { Hotel, KeyRound, UtensilsCrossed, LineChart, Receipt, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, hotelData }) {
  const hotel = hotelData?.hotel || { name: 'The Grand Horizon Hotel & Luxury Suites' };
  const totalRooms = hotelData?.totalRooms || 24;
  const occupied = hotelData?.occupied || 0;
  const available = hotelData?.available || 0;
  const occupancyRate = hotelData?.occupancyRate || 0;

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(6, 10, 20, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Brand Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #c5a059 0%, #997b38 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(197, 160, 89, 0.4)'
          }}>
            <Hotel size={26} color="#060a14" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="font-serif gold-gradient-text" style={{ fontSize: '1.4rem', fontWeight: '700' }}>
                {hotel.name}
              </span>
              <span className="badge badge-vip" style={{ fontSize: '0.65rem' }}>
                <Sparkles size={12} /> 5-STAR AUTOMATION
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Luxury Hotel Management & Enterprise Automation System
            </div>
          </div>
        </div>

        {/* Live Hotel Metrics Summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '0.85rem'
          }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Total: </span>
              <strong>{totalRooms}</strong>
            </div>
            <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)' }} />
            <div>
              <span style={{ color: '#34d399' }}>Available: </span>
              <strong style={{ color: '#34d399' }}>{available}</strong>
            </div>
            <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)' }} />
            <div>
              <span style={{ color: '#fb7185' }}>Occupied: </span>
              <strong style={{ color: '#fb7185' }}>{occupied}</strong>
            </div>
            <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)' }} />
            <div>
              <span style={{ color: 'var(--gold-light)' }}>Occupancy: </span>
              <strong style={{ color: 'var(--gold-light)' }}>{occupancyRate}%</strong>
            </div>
          </div>
        </div>

        {/* Main Stakeholder Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', marginTop: '6px' }}>
          <button
            id="tab-receptionist"
            onClick={() => setActiveTab('receptionist')}
            className={activeTab === 'receptionist' ? 'btn-gold' : 'btn-secondary'}
            style={{ fontSize: '0.88rem', padding: '8px 16px' }}
          >
            <KeyRound size={17} /> Reception Desk & Room Allocation
          </button>

          <button
            id="tab-catering"
            onClick={() => setActiveTab('catering')}
            className={activeTab === 'catering' ? 'btn-gold' : 'btn-secondary'}
            style={{ fontSize: '0.88rem', padding: '8px 16px' }}
          >
            <UtensilsCrossed size={17} /> Catering Services
          </button>

          <button
            id="tab-manager"
            onClick={() => setActiveTab('manager')}
            className={activeTab === 'manager' ? 'btn-gold' : 'btn-secondary'}
            style={{ fontSize: '0.88rem', padding: '8px 16px' }}
          >
            <LineChart size={17} /> Hotel Manager & Tariff Control
          </button>

          <button
            id="tab-invoices"
            onClick={() => setActiveTab('invoices')}
            className={activeTab === 'invoices' ? 'btn-gold' : 'btn-secondary'}
            style={{ fontSize: '0.88rem', padding: '8px 16px' }}
          >
            <Receipt size={17} /> Bills Ledger & Loyalty
          </button>
        </nav>
      </div>
    </header>
  );
}
