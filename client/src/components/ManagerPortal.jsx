import React, { useState, useEffect, useRef } from 'react';

export default function ManagerPortal({ hotelData, onDataChange }) {
  const tariffFormRef = useRef(null);

  const currentMonthNum = new Date().getMonth() + 1;
  const currentYearNum = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonthNum);
  const [selectedYear, setSelectedYear] = useState(currentYearNum);
  const [occupancyData, setOccupancyData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingOcc, setLoadingOcc] = useState(false);

  // Tariff revision state
  const [percentage, setPercentage] = useState(10);
  const [targetTariffId, setTargetTariffId] = useState('ALL');
  const [revisionResult, setRevisionResult] = useState(null);
  const [revising, setRevising] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Fetch Occupancy
  const fetchOccupancy = async (m, y) => {
    setLoadingOcc(true);
    try {
      const res = await fetch(`/api/manager/occupancy?month=${m}&year=${y}`);
      const data = await res.json();
      setOccupancyData(data.current);
      setHistory(data.history || []);
    } catch (err) {
      console.error('Failed to fetch occupancy:', err);
    } finally {
      setLoadingOcc(false);
    }
  };

  useEffect(() => {
    fetchOccupancy(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  // Execute Tariff Revision
  const handleReviseTariff = async (e) => {
    e.preventDefault();
    setRevising(true);
    setErrorMsg('');
    setRevisionResult(null);

    try {
      const res = await fetch('/api/manager/revise-tariff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          percentage: Number(percentage),
          tariffId: targetTariffId === 'ALL' ? null : targetTariffId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setRevisionResult(data);
        if (onDataChange) onDataChange();
      } else {
        setErrorMsg(data.error || 'Failed to revise tariff.');
      }
    } catch (err) {
      setErrorMsg('Error revising tariff: ' + err.message);
    } finally {
      setRevising(false);
    }
  };

  const tariffs = hotelData?.tariffs || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      
      {/* Editorial Header */}
      <div style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '24px' }}>
        <span className="eyebrow" style={{ marginBottom: '8px' }}>
          Executive Suite Strategy • Sequence Diagram 2 & Activity Diagram
        </span>
        <h2 className="font-serif" style={{ fontSize: '2.4rem', fontWeight: '300' }}>
          Occupancy Intelligence & Dynamic Tariff Control
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '680px', marginTop: '6px' }}>
          Monitor monthly average occupancy trends and calibrate baseline room tariffs upward or downward by exact percentages to maximize revenue efficiency.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '32px' }}>
        
        {/* MONTHLY OCCUPANCY ANALYTICS CARD */}
        <div className="editorial-card" style={{ padding: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '16px' }}>
            <div>
              <span className="eyebrow">Occupancy Audit</span>
              <h3 className="font-serif" style={{ fontSize: '1.4rem' }}>Monthly Occupancy Rate</h3>
            </div>
            <button
              className="btn-editorial-secondary"
              style={{ padding: '6px 12px', fontSize: '0.65rem' }}
              onClick={() => fetchOccupancy(selectedMonth, selectedYear)}
            >
              Recalculate
            </button>
          </div>

          {/* Month / Year Pickers */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div className="form-group-editorial" style={{ margin: 0 }}>
              <label className="form-label-editorial">Select Month</label>
              <select
                id="select-occupancy-month"
                className="editorial-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {monthNames.map((name, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group-editorial" style={{ margin: 0 }}>
              <label className="form-label-editorial">Select Year</label>
              <input
                id="input-occupancy-year"
                type="number"
                className="editorial-input"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Clean Metric Box */}
          {occupancyData ? (
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-hairline)',
              padding: '28px',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <span className="eyebrow" style={{ fontSize: '0.65rem', marginBottom: '6px' }}>
                Average Monthly Occupancy • {monthNames[selectedMonth - 1]} {selectedYear}
              </span>

              <div className="font-serif" style={{ fontSize: '3.6rem', fontWeight: '300', margin: '4px 0', color: 'var(--text-primary)' }}>
                {occupancyData.occupancyRate}%
              </div>

              {/* Minimalist Progress Line */}
              <div style={{ height: '3px', background: 'var(--border-hairline)', margin: '18px 0', position: 'relative' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, occupancyData.occupancyRate)}%`,
                  background: 'var(--text-primary)',
                  transition: 'width 0.6s ease'
                }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-secondary)' }}>
                <div>
                  Occupied: <strong style={{ color: 'var(--text-primary)' }}>{occupancyData.occupiedRooms} Suites</strong>
                </div>
                <div>
                  Capacity: <strong style={{ color: 'var(--text-primary)' }}>{occupancyData.totalRooms} Suites</strong>
                </div>
                <div>
                  Season: <strong style={{ color: 'var(--text-primary)' }}>
                    {occupancyData.occupancyRate >= 80 ? 'Peak' : occupancyData.occupancyRate >= 60 ? 'Standard' : 'Off-Peak'}
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', padding: '24px 0' }}>Calculating monthly occupancy...</div>
          )}

          {/* Historical Bars */}
          <div>
            <span className="eyebrow" style={{ fontSize: '0.62rem', marginBottom: '12px' }}>
              Historical Monthly Occupancy Records
            </span>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '110px', paddingTop: '10px' }}>
              {history.map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setSelectedMonth(h.month);
                    setSelectedYear(h.year);
                  }}
                  title={`${monthNames[h.month - 1]}: ${h.occupancyRate}%`}
                >
                  <div style={{
                    width: '100%',
                    height: `${h.occupancyRate}%`,
                    background: selectedMonth === h.month ? 'var(--text-primary)' : 'var(--border-subtle)',
                    transition: 'var(--transition-quiet)'
                  }} />
                  <span style={{ fontSize: '0.62rem', color: selectedMonth === h.month ? 'var(--text-primary)' : 'var(--text-muted)', marginTop: '6px' }}>
                    {monthNames[h.month - 1]?.substring(0, 3)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DYNAMIC PERCENTAGE TARIFF REVISION CARD */}
        <div ref={tariffFormRef} className="editorial-card" style={{ padding: '36px' }}>
          <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '16px' }}>
            <span className="eyebrow">Tariff Calibration</span>
            <h3 className="font-serif" style={{ fontSize: '1.4rem' }}>Dynamic Rate Revision Engine</h3>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
            Revise suite tariffs upward to capitalize on peak seasonal occupancy, or downward to stimulate bookings during off-peak periods.
          </p>

          <form onSubmit={handleReviseTariff}>
            {/* Category Selector */}
            <div className="form-group-editorial">
              <label className="form-label-editorial">Target Suite Category</label>
              <select
                id="select-tariff-target"
                className="editorial-select"
                value={targetTariffId}
                onChange={(e) => setTargetTariffId(e.target.value)}
              >
                <option value="ALL">Apply Revision Across All 4 Suite Categories</option>
                {tariffs.map((t) => (
                  <option key={t.tariffId} value={t.tariffId}>
                    {t.bedType} Bed Suite ({t.acType}) — Current: ${t.rate.toFixed(2)}/night
                  </option>
                ))}
              </select>
            </div>

            {/* Percentage Input */}
            <div className="form-group-editorial">
              <label className="form-label-editorial">Adjustment Percentage (%)</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  id="input-tariff-percentage"
                  type="number"
                  step="0.5"
                  className="editorial-input"
                  placeholder="+10 or -15"
                  value={percentage}
                  onChange={(e) => setPercentage(parseFloat(e.target.value) || 0)}
                  required
                />
                <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>%</span>
              </div>

              {/* Minimal Presets */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                {[
                  { label: '+15% Peak', val: 15 },
                  { label: '+10% High', val: 10 },
                  { label: '-5% Shoulder', val: -5 },
                  { label: '-15% Off-Peak', val: -15 },
                ].map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    className="btn-editorial-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.65rem' }}
                    onClick={() => setPercentage(preset.val)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Projected Impact Preview */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-hairline)',
              padding: '16px 20px',
              marginBottom: '20px'
            }}>
              <span className="eyebrow" style={{ fontSize: '0.62rem', marginBottom: '8px' }}>
                Projected Rate Schedule ({percentage > 0 ? `+${percentage}%` : `${percentage}%`})
              </span>

              <div style={{ display: 'grid', gap: '6px', fontSize: '0.82rem' }}>
                {tariffs
                  .filter(t => targetTariffId === 'ALL' || t.tariffId === targetTariffId)
                  .map(t => {
                    const newRate = Number((t.rate * (1 + percentage / 100)).toFixed(2));
                    return (
                      <div key={t.tariffId} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{t.bedType} Bed ({t.acType}):</span>
                        <span>
                          <s style={{ color: 'var(--text-muted)', marginRight: '8px' }}>${t.rate.toFixed(2)}</s>
                          <strong style={{ color: 'var(--text-primary)' }}>
                            ${newRate.toFixed(2)}
                          </strong>
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {errorMsg && (
              <div style={{ color: 'var(--accent-clay)', fontSize: '0.82rem', marginBottom: '16px' }}>
                {errorMsg}
              </div>
            )}

            <button
              id="btn-apply-tariff-revision"
              type="submit"
              className="btn-editorial-primary"
              style={{ width: '100%', padding: '14px' }}
              disabled={revising || percentage === 0}
            >
              {revising ? 'Updating Rates...' : `Execute ${percentage > 0 ? `+${percentage}%` : `${percentage}%`} Tariff Calibration`}
            </button>
          </form>

          {revisionResult && (
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              background: 'var(--accent-pine-bg)',
              border: '1px solid #D6E4DB',
              color: 'var(--accent-pine)',
              fontSize: '0.82rem'
            }}>
              ✓ {revisionResult.message}
            </div>
          )}
        </div>
      </div>

      {/* ACTIVE TARIFF SCHEDULE */}
      <div className="editorial-card" style={{ padding: '36px' }}>
        <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '16px' }}>
          <span className="eyebrow">Rate Master</span>
          <h3 className="font-serif" style={{ fontSize: '1.6rem' }}>Official 5-Star Tariff Schedule</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-hairline)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 10px' }}>Category Code</th>
                <th style={{ padding: '12px 10px' }}>Bed Type</th>
                <th style={{ padding: '12px 10px' }}>Climate Control</th>
                <th style={{ padding: '12px 10px', textAlign: 'right' }}>Active Tariff / Night</th>
                <th style={{ padding: '12px 10px', textAlign: 'center' }}>Room Allotment</th>
                <th style={{ padding: '12px 10px', textAlign: 'center' }}>Calibration</th>
              </tr>
            </thead>
            <tbody>
              {tariffs.map((t) => (
                <tr key={t.tariffId} style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                  <td style={{ padding: '14px 10px', color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                    {t.tariffId}
                  </td>
                  <td style={{ padding: '14px 10px', fontWeight: '500' }}>
                    {t.bedType} Bed Suite
                  </td>
                  <td style={{ padding: '14px 10px' }}>
                    {t.acType}
                  </td>
                  <td style={{ padding: '14px 10px', textAlign: 'right', fontWeight: '500', fontSize: '1.05rem' }}>
                    ${t.rate.toFixed(2)}
                  </td>
                  <td style={{ padding: '14px 10px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    6 Suites
                  </td>
                  <td style={{ padding: '14px 10px', textAlign: 'center' }}>
                    <button
                      type="button"
                      className="btn-editorial-secondary"
                      style={{ fontSize: '0.62rem', padding: '4px 10px' }}
                      onClick={() => {
                        setTargetTariffId(t.tariffId);
                        tariffFormRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Calibrate Rate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
