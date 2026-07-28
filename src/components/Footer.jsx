import React from 'react';
import { Plane, ShieldCheck, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div>
          <div className="brand-logo" style={{ marginBottom: '0.8rem' }}>
            <div className="brand-icon">
              <Plane size={20} />
            </div>
            <span>AeroX<span style={{ opacity: 0.6, fontWeight: 400 }}>Tech</span></span>
          </div>
          <p style={{ fontSize: '0.88rem', lineHeight: 1.6, maxWidth: '280px' }}>
            Premier store for high-performance FPV racing drones, long-range autonomous UAVs, and aviation telemetry hardware.
          </p>
        </div>

        <div>
          <h4 className="footer-col-title">Categories</h4>
          <ul className="footer-links">
            <li><a href="#">FPV Racing & Freestyle</a></li>
            <li><a href="#">Cinematic 4K UAVs</a></li>
            <li><a href="#">Fixed-Wing Aircraft</a></li>
            <li><a href="#">ExpressLRS & Radios</a></li>
            <li><a href="#">Digital FPV Goggles</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-col-title">Pilot Resources</h4>
          <ul className="footer-links">
            <li><a href="#">Betaflight Firmware Guides</a></li>
            <li><a href="#">MavLink & INAV Telemetry</a></li>
            <li><a href="#">FAA & EASA Drone Registration</a></li>
            <li><a href="#">ELRS Binding Manuals</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-col-title">Flight Club Newsletter</h4>
          <p style={{ fontSize: '0.85rem', marginBottom: '0.8rem' }}>
            Get exclusive drop alerts on new FPV frames & radio gear.
          </p>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <input
              type="email"
              placeholder="pilot@domain.com"
              className="search-input"
              style={{ fontSize: '0.85rem', padding: '0.5rem 0.8rem' }}
            />
            <button className="add-cart-m3-btn" style={{ borderRadius: 'var(--md-sys-shape-corner-small)', padding: '0.5rem 0.8rem' }}>
              <Mail size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} AeroX Tech Inc. All rights reserved.</span>
        <span>Designed with Material 3 & Powered by Vite + React</span>
      </div>
    </footer>
  );
};
