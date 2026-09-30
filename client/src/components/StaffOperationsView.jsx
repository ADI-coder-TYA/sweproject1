import React, { useState } from 'react';
import ReceptionistPortal from './ReceptionistPortal';
import CateringPortal from './CateringPortal';
import ManagerPortal from './ManagerPortal';
import BillsLedger from './BillsLedger';

export default function StaffOperationsView({
  activeTab,
  setActiveTab,
  hotelData,
  onDataChange,
  onReturnToGuestView,
  activeCateringToken,
  onNavigateToCatering,
  preFillData
}) {
  const [showMetrics, setShowMetrics] = useState(false);

  const totalRooms = hotelData?.totalRooms || 24;
  const occupied = hotelData?.occupied || 0;
  const available = hotelData?.available || 0;
  const occupancyRate = hotelData?.occupancyRate || 0;

  const tabs = [
    { id: 'receptionist', label: '01. Allotment & Front Desk' },
    { id: 'catering', label: '02. In-Room Dining & Catering' },
    { id: 'manager', label: '03. Tariff & Occupancy Control' },
    { id: 'invoices', label: '04. Guest Folios & Audit' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Staff Administrative Header */}
      <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid var(--border-hairline)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Top Control Bar */}
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Brand & Staff Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div>
              <span className="eyebrow" style={{ fontSize: '0.62rem', letterSpacing: '0.25em', color: 'var(--accent-gold)' }}>
                Internal Operations
              </span>
              <h1 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: '400', letterSpacing: '0.04em', margin: 0 }}>
                THE GRAND HORIZON
              </h1>
            </div>
            <div style={{
              background: 'var(--bg-surface-light)',
              border: '1px solid var(--border-hairline)',
              padding: '4px 10px',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)'
            }}>
              Terminal System Active
            </div>
          </div>

          {/* Center Action: On-demand Statistics Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className="btn-editorial-secondary"
              style={{
                padding: '8px 16px',
                fontSize: '0.68rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: showMetrics ? 'var(--bg-surface-light)' : 'transparent'
              }}
              title="Toggle Live Operational & Occupancy Metrics"
            >
              <span>{showMetrics ? '▾ Hide Metrics' : '▸ Occupancy & Inventory Metrics'}</span>
              <span style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: occupancyRate > 0 ? 'var(--accent-pine)' : 'var(--text-muted)'
              }} />
            </button>
          </div>

          {/* Right Action: Return to Guest View */}
          <div>
            <button
              onClick={onReturnToGuestView}
              className="btn-editorial-secondary"
              style={{
                padding: '8px 16px',
                fontSize: '0.68rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>←</span>
              <span>Return to Guest Sanctuary</span>
            </button>
          </div>
        </div>

        {/* Expandable Live Metrics Ribbon (On-Demand) */}
        {showMetrics && (
          <div style={{
            background: 'var(--bg-surface-light)',
            borderTop: '1px solid var(--border-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '12px 32px',
            animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{
              maxWidth: '1440px',
              margin: '0 auto',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              fontSize: '0.72rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Total Inventory: </span>
                <strong style={{ color: 'var(--text-primary)' }}>{totalRooms} Suites</strong>
              </div>
              <div style={{ width: '1px', height: '14px', background: 'var(--border-hairline)' }} />
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Available for Allotment: </span>
                <strong style={{ color: 'var(--accent-pine)' }}>{available} Suites</strong>
              </div>
              <div style={{ width: '1px', height: '14px', background: 'var(--border-hairline)' }} />
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Occupied: </span>
                <strong style={{ color: 'var(--accent-clay)' }}>{occupied} Suites</strong>
              </div>
              <div style={{ width: '1px', height: '14px', background: 'var(--border-hairline)' }} />
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Current Month Occupancy: </span>
                <strong style={{ color: 'var(--accent-gold)' }}>{occupancyRate}%</strong>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation Strip */}
        <div style={{
          background: 'var(--bg-main)',
          borderTop: '1px solid var(--border-hairline)'
        }}>
          <div style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '0 32px',
            display: 'flex',
            overflowX: 'auto',
            gap: '32px'
          }}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: isActive ? '2px solid var(--text-primary)' : '2px solid transparent',
                    padding: '14px 0',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontWeight: isActive ? '600' : '400',
                    cursor: 'pointer',
                    transition: 'var(--transition-quiet)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Workstation Container */}
      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 32px 64px 32px' }}>
        {activeTab === 'receptionist' && (
          <ReceptionistPortal
            hotelData={hotelData}
            onDataChange={onDataChange}
            preFillData={preFillData}
            onNavigateToCatering={onNavigateToCatering}
          />
        )}

        {activeTab === 'catering' && (
          <CateringPortal
            hotelData={hotelData}
            onDataChange={onDataChange}
            selectedTokenProp={activeCateringToken}
          />
        )}

        {activeTab === 'manager' && (
          <ManagerPortal
            hotelData={hotelData}
            onDataChange={onDataChange}
          />
        )}

        {activeTab === 'invoices' && (
          <BillsLedger />
        )}
      </main>
    </div>
  );
}
