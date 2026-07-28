import React from 'react';
import { ShieldCheck, Zap, ArrowRight, Activity, Compass, Cpu } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const HeroBanner = () => {
  const { setActiveCategory } = useShop();

  return (
    <div className="hero-banner">
      <div className="hero-content">
        <div>
          <div className="hero-tag">
            <Zap size={14} />
            <span>Next-Gen Autonomous & FPV Hardware</span>
          </div>
          <h1 className="hero-title">
            Engineering Precision <br /> For High-Speed Flight.
          </h1>
          <p className="hero-description">
            Explore cutting-edge FPV freestyle quads, long-range fixed-wing mapping UAVs, 
            ExpressLRS transmitters, and digital 4K video systems crafted for aviation geeks and pilots.
          </p>
          <button 
            className="hero-cta-btn"
            onClick={() => setActiveCategory('fpv-quads')}
          >
            <span>Explore FPV Collection</span>
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="hero-telemetry-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={18} color="#38bdf8" /> Live Drone Telemetry Preview
            </span>
            <span style={{ fontSize: '0.75rem', background: '#0284c7', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>
              ONLINE
            </span>
          </div>

          <div className="telemetry-row">
            <span>Link Quality (LQ)</span>
            <span className="telemetry-val">100% (ELRS 500Hz)</span>
          </div>
          <div className="telemetry-row">
            <span>Peak Speed</span>
            <span className="telemetry-val">168.4 km/h</span>
          </div>
          <div className="telemetry-row">
            <span>Flight Controller</span>
            <span className="telemetry-val">STM32F722 MCU</span>
          </div>
          <div className="telemetry-row">
            <span>Video Latency</span>
            <span className="telemetry-val">18ms @ 1080p 100fps</span>
          </div>
        </div>
      </div>
    </div>
  );
};
