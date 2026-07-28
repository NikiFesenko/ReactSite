import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Sliders, Trash2 } from 'lucide-react';

export const CompareModal = () => {
  const { compareList, toggleCompare, isCompareOpen, setIsCompareOpen } = useShop();

  if (!isCompareOpen || compareList.length === 0) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsCompareOpen(false)}>
      <div
        className="modal-card-m3"
        style={{ maxWidth: '960px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sliders color="var(--md-sys-color-primary)" size={24} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              Drone & Tech Specs Comparison
            </h2>
          </div>
          <button className="icon-btn-m3" onClick={() => setIsCompareOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--md-sys-color-outline-variant)' }}>
                <th style={{ padding: '0.75rem', width: '20%' }}>Spec Category</th>
                {compareList.map((item) => (
                  <th key={item.id} style={{ padding: '0.75rem', width: `${80 / compareList.length}%` }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <span style={{ fontWeight: 700 }}>{item.title}</span>
                      <span style={{ color: 'var(--md-sys-color-primary)', fontWeight: 800 }}>
                        ${item.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => toggleCompare(item)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          color: '#ef4444',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          marginTop: '0.2rem'
                        }}
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700 }}>Flight Time</td>
                {compareList.map((item) => (
                  <td key={item.id} style={{ padding: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    {item.specs.flightTime}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid var(--md-sys-color-outline-variant)', background: 'var(--md-sys-color-surface-container-low)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700 }}>Max Speed</td>
                {compareList.map((item) => (
                  <td key={item.id} style={{ padding: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    {item.specs.maxSpeed}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700 }}>Operational Range</td>
                {compareList.map((item) => (
                  <td key={item.id} style={{ padding: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    {item.specs.range}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid var(--md-sys-color-outline-variant)', background: 'var(--md-sys-color-surface-container-low)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700 }}>Payload Capacity</td>
                {compareList.map((item) => (
                  <td key={item.id} style={{ padding: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    {item.specs.payload}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700 }}>RF Link Protocol</td>
                {compareList.map((item) => (
                  <td key={item.id} style={{ padding: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    {item.specs.protocol}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', fontWeight: 700 }}>Video System</td>
                {compareList.map((item) => (
                  <td key={item.id} style={{ padding: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    {item.specs.videoSystem}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
