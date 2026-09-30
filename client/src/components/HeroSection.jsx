import React, { useState } from 'react';

export default function HeroSection({ onProceedToBooking, onShowApology, heroRef }) {
  const [arrivalDate, setArrivalDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(2);
  const [bedType, setBedType] = useState('Double');
  const [acType, setAcType] = useState('AC');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  const handleCheckAvailability = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setSearchResult(null);

    try {
      const res = await fetch('/api/rooms/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bedType, acType, duration }),
      });

      const data = await res.json();

      if (!data.available) {
        // Trigger apology modal (Sequence Diagram 1 & Use Case Diagram)
        if (onShowApology) {
          onShowApology(data);
        } else {
          alert(data.apologyMessage);
        }
      } else {
        setSearchResult(data);
      }
    } catch (err) {
      alert('Error querying room availability: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (onProceedToBooking) {
      onProceedToBooking({
        bedType,
        acType,
        durationOfStay: Number(duration),
        arrivalTime: `${arrivalDate} 14:00`,
      });
    }
  };

  return (
    <section ref={heroRef} style={{ position: 'relative', width: '100%', marginBottom: '48px' }}>
      {/* Cinematic Media Container */}
      <div style={{
        position: 'relative',
        height: '75vh',
        minHeight: '520px',
        maxHeight: '720px',
        overflow: 'hidden',
        background: '#E7DFD5'
      }}>
        <img
          src="/exterior.jpg"
          alt="The Grand Horizon Luxury Resort Architecture"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.92) contrast(1.02)'
          }}
        />

        {/* Quiet Editorial Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(28, 25, 23, 0.15) 0%, rgba(28, 25, 23, 0.45) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '60px 48px'
        }}>
          <div style={{ maxWidth: '900px' }}>
            <span className="eyebrow" style={{ color: '#FBF9F5', letterSpacing: '0.35em', marginBottom: '8px' }}>
              The 5-Star Sovereign Collection
            </span>
            <h2 className="font-serif" style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 4rem)',
              color: '#FFFFFF',
              fontWeight: '300',
              lineHeight: '1.1',
              marginBottom: '16px'
            }}>
              A Sanctuary of Unspoken Luxury & Refined Living
            </h2>
            <p style={{
              color: '#E5DFD5',
              fontSize: '0.95rem',
              maxWidth: '600px',
              lineHeight: '1.7',
              fontFamily: 'var(--font-sans)',
              fontWeight: '300'
            }}>
              Where architectural purity meets bespoke hospitality. Automating reservations, in-room culinary journeys, and dynamic seasonal tariffs with seamless precision.
            </p>
          </div>
        </div>
      </div>

      {/* Integrated Hair-Thin Horizontal Availability & Reservation Bar */}
      <div style={{
        maxWidth: '1240px',
        margin: '-40px auto 0 auto',
        position: 'relative',
        zIndex: 10,
        padding: '0 24px'
      }}>
        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-hairline)',
          padding: '28px 32px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto',
            gap: '24px',
            alignItems: 'flex-end'
          }}>
            {/* Check-In */}
            <div>
              <label className="form-label-editorial" style={{ display: 'block', marginBottom: '6px' }}>
                Arrival Schedule
              </label>
              <input
                id="hero-input-arrival"
                type="date"
                value={arrivalDate}
                onChange={(e) => { setArrivalDate(e.target.value); setSearchResult(null); }}
                className="editorial-input"
                style={{ border: 'none', borderBottom: '1px solid var(--border-subtle)', background: 'transparent', padding: '8px 0' }}
              />
            </div>

            {/* Stay Duration */}
            <div>
              <label className="form-label-editorial" style={{ display: 'block', marginBottom: '6px' }}>
                Stay Duration
              </label>
              <select
                id="hero-select-duration"
                value={duration}
                onChange={(e) => { setDuration(Number(e.target.value)); setSearchResult(null); }}
                className="editorial-select"
                style={{ border: 'none', borderBottom: '1px solid var(--border-subtle)', background: 'transparent', padding: '8px 0' }}
              >
                <option value="1">1 Night</option>
                <option value="2">2 Nights</option>
                <option value="3">3 Nights</option>
                <option value="5">5 Nights</option>
                <option value="7">7 Nights</option>
                <option value="14">14 Nights</option>
              </select>
            </div>

            {/* Bed Specification */}
            <div>
              <label className="form-label-editorial" style={{ display: 'block', marginBottom: '6px' }}>
                Suite Accommodation
              </label>
              <select
                id="hero-select-bed"
                value={bedType}
                onChange={(e) => { setBedType(e.target.value); setSearchResult(null); }}
                className="editorial-select"
                style={{ border: 'none', borderBottom: '1px solid var(--border-subtle)', background: 'transparent', padding: '8px 0' }}
              >
                <option value="Single">Single Bed Suite</option>
                <option value="Double">Double Bed Suite</option>
              </select>
            </div>

            {/* Climate Control */}
            <div>
              <label className="form-label-editorial" style={{ display: 'block', marginBottom: '6px' }}>
                Climate Control
              </label>
              <select
                id="hero-select-ac"
                value={acType}
                onChange={(e) => { setAcType(e.target.value); setSearchResult(null); }}
                className="editorial-select"
                style={{ border: 'none', borderBottom: '1px solid var(--border-subtle)', background: 'transparent', padding: '8px 0' }}
              >
                <option value="AC">Air Conditioned (AC)</option>
                <option value="Non-AC">Natural Air (Non-AC)</option>
              </select>
            </div>

            {/* Action Button */}
            <div>
              <button
                id="hero-btn-check-availability"
                onClick={handleCheckAvailability}
                className="btn-editorial-primary"
                style={{ height: '46px', width: '100%', whiteSpace: 'nowrap' }}
                disabled={loading}
              >
                {loading ? 'Checking...' : 'Check Availability'}
              </button>
            </div>
          </div>

          {/* Instant Availability Feedback Result */}
          {searchResult && searchResult.available && (
            <div style={{
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-hairline)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              background: 'var(--bg-surface-light)',
              padding: '16px 20px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge-editorial badge-available">
                    ✓ {searchResult.availableCount} Suites Available
                  </span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {searchResult.bedType} Bed Suite ({searchResult.acType})
                  </strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Rate: ${searchResult.rate.toFixed(2)} / night • Total Estimated for {duration} Night{duration > 1 ? 's' : ''}: 
                  <strong style={{ color: 'var(--text-primary)', marginLeft: '4px' }}>
                    ${searchResult.totalEstimated.toFixed(2)}
                  </strong>
                </div>
              </div>

              <div>
                <button
                  id="hero-btn-proceed-allotment"
                  onClick={handleProceed}
                  className="btn-editorial-primary"
                  style={{ padding: '10px 22px', fontSize: '0.72rem' }}
                >
                  Proceed to Allot Suite & Generate Token →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
