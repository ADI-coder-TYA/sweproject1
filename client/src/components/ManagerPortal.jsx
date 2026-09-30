import React, { useState, useEffect } from 'react';
import { LineChart, Percent, TrendingUp, TrendingDown, DollarSign, Calendar, RefreshCw, CheckCircle2, BedDouble } from 'lucide-react';

export default function ManagerPortal({ hotelData, onDataChange }) {
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

  // Months labels
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

  // Execute Tariff Revision by Percentage
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Header */}
      <div>
        <h2 className="font-serif gold-gradient-text" style={{ fontSize: '1.7rem' }}>
          Executive Manager Control & Tariff Strategy
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Sequence Diagram 2 & Activity Diagram — Analyze monthly average occupancy rates and dynamically calibrate room tariffs upward or downward by percentage.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        
        {/* MONTHLY OCCUPANCY ANALYTICS CARD */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LineChart size={22} color="var(--gold-light)" />
              <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>
                Monthly Occupancy Analysis
              </h3>
            </div>
            <button
              className="btn-secondary"
              style={{ padding: '4px 10px', fontSize: '0.8rem' }}
              onClick={() => fetchOccupancy(selectedMonth, selectedYear)}
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {/* Month / Year Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px', marginBottom: '24px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Analysis Month</label>
              <select
                id="select-occupancy-month"
                className="form-select"
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

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Year</label>
              <input
                id="input-occupancy-year"
                type="number"
                className="form-input"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Large Gauge / Metric Box */}
          {occupancyData ? (
            <div style={{
              background: 'linear-gradient(135deg, rgba(14, 26, 53, 0.8) 0%, rgba(9, 15, 30, 0.9) 100%)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Average Occupancy Rate — {monthNames[selectedMonth - 1]} {selectedYear}
              </div>

              <div className="gold-gradient-text" style={{ fontSize: '3.2rem', fontWeight: '800', margin: '8px 0', fontFamily: 'var(--font-serif)' }}>
                {occupancyData.occupancyRate}%
              </div>

              {/* Progress bar visual */}
              <div style={{ height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '5px', overflow: 'hidden', margin: '14px 0' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, occupancyData.occupancyRate)}%`,
                  background: 'linear-gradient(90deg, #c5a059 0%, #34d399 100%)',
                  borderRadius: '5px',
                  transition: 'width 0.5s ease-out'
                }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Occupied: </span>
                  <strong style={{ color: '#fb7185' }}>{occupancyData.occupiedRooms} Rooms</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Inventory: </span>
                  <strong>{occupancyData.totalRooms} Rooms</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Status: </span>
                  <strong style={{ color: occupancyData.occupancyRate >= 75 ? '#34d399' : 'var(--gold-light)' }}>
                    {occupancyData.occupancyRate >= 80 ? 'Peak Season' : occupancyData.occupancyRate >= 60 ? 'Standard' : 'Off-Peak'}
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', padding: '20px 0' }}>Loading monthly metrics...</div>
          )}

          {/* Historical Trends Micro-Chart */}
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '10px' }}>
              Historical Monthly Occupancy Records
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '100px', padding: '10px 0' }}>
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
                    background: selectedMonth === h.month ? 'var(--gold-primary)' : 'rgba(197, 160, 89, 0.3)',
                    borderRadius: '3px 3px 0 0',
                    transition: 'var(--transition)'
                  }} />
                  <span style={{ fontSize: '0.65rem', color: selectedMonth === h.month ? 'var(--gold-light)' : 'var(--text-muted)', marginTop: '4px' }}>
                    {monthNames[h.month - 1]?.substring(0, 3)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DYNAMIC PERCENTAGE TARIFF REVISION CARD */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Percent size={22} color="var(--gold-light)" />
            <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>
              Dynamic Room Tariff Revision
            </h3>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
            Revise baseline room tariffs upward during high occupancy surges or downward to stimulate booking demand during off-peak periods.
          </p>

          <form onSubmit={handleReviseTariff}>
            {/* Target Category Selection */}
            <div className="form-group">
              <label className="form-label">Target Room Tariff Category</label>
              <select
                id="select-tariff-target"
                className="form-select"
                value={targetTariffId}
                onChange={(e) => setTargetTariffId(e.target.value)}
              >
                <option value="ALL">Apply Revision to All Room Categories</option>
                {tariffs.map((t) => (
                  <option key={t.tariffId} value={t.tariffId}>
                    {t.bedType} Bed Suite ({t.acType}) — Current: ${t.rate.toFixed(2)}/night
                  </option>
                ))}
              </select>
            </div>

            {/* Percentage Input & Quick Buttons */}
            <div className="form-group">
              <label className="form-label">Percentage Adjustment (%)</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  id="input-tariff-percentage"
                  type="number"
                  step="0.5"
                  className="form-input"
                  placeholder="+10 or -15"
                  value={percentage}
                  onChange={(e) => setPercentage(parseFloat(e.target.value) || 0)}
                  required
                />
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--gold-light)' }}>%</span>
              </div>

              {/* Quick Presets */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                  onClick={() => setPercentage(15)}
                >
                  <TrendingUp size={12} color="#34d399" /> +15% Peak
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                  onClick={() => setPercentage(10)}
                >
                  <TrendingUp size={12} color="#34d399" /> +10% High
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                  onClick={() => setPercentage(-5)}
                >
                  <TrendingDown size={12} color="#fb7185" /> -5% Discount
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                  onClick={() => setPercentage(-15)}
                >
                  <TrendingDown size={12} color="#fb7185" /> -15% Low Season
                </button>
              </div>
            </div>

            {/* Impact Calculation Preview */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px',
              marginBottom: '18px'
            }}>
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Projected Tariff Adjustments ({percentage > 0 ? `+${percentage}%` : `${percentage}%`})
              </div>

              <div style={{ display: 'grid', gap: '6px', fontSize: '0.85rem' }}>
                {tariffs
                  .filter(t => targetTariffId === 'ALL' || t.tariffId === targetTariffId)
                  .map(t => {
                    const newRate = Number((t.rate * (1 + percentage / 100)).toFixed(2));
                    return (
                      <div key={t.tariffId} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{t.bedType} Bed ({t.acType}):</span>
                        <span>
                          <s style={{ color: '#94a3b8', marginRight: '6px' }}>${t.rate.toFixed(2)}</s>
                          <strong style={{ color: percentage > 0 ? '#34d399' : '#fb7185' }}>
                            ${newRate.toFixed(2)}
                          </strong>
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {errorMsg && (
              <div style={{ color: '#fb7185', fontSize: '0.85rem', marginBottom: '14px' }}>
                {errorMsg}
              </div>
            )}

            <button
              id="btn-apply-tariff-revision"
              type="submit"
              className="btn-gold"
              style={{ width: '100%', padding: '12px' }}
              disabled={revising || percentage === 0}
            >
              {revising ? 'Updating Rates...' : `Execute ${percentage > 0 ? `+${percentage}%` : `${percentage}%`} Tariff Revision`}
            </button>
          </form>

          {/* Success Banner */}
          {revisionResult && (
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10b981',
              borderRadius: 'var(--radius-sm)',
              color: '#34d399',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <CheckCircle2 size={18} />
              <span>{revisionResult.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* CURRENT ACTIVE TARIFF MASTER TABLE */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 className="font-serif gold-gradient-text" style={{ fontSize: '1.3rem', marginBottom: '16px' }}>
          Official 5-Star Tariff Schedule & Inventory Allotment
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--gold-light)' }}>
                <th style={{ padding: '10px' }}>Category Code</th>
                <th style={{ padding: '10px' }}>Bed Type</th>
                <th style={{ padding: '10px' }}>Climate Control</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Active Tariff / Night</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Total Rooms</th>
              </tr>
            </thead>
            <tbody>
              {tariffs.map((t) => (
                <tr key={t.tariffId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 10px', fontFamily: 'monospace', color: 'var(--accent-blue)' }}>
                    {t.tariffId}
                  </td>
                  <td style={{ padding: '12px 10px', fontWeight: '500' }}>
                    {t.bedType} Bed Suite
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    {t.acType}
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '700', color: 'var(--text-gold)', fontSize: '1.05rem' }}>
                    ${t.rate.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                    6 Rooms
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
