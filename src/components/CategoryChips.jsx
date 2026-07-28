import React from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/products';
import { Sparkles, Zap, Camera, Plane, Radio, Eye, Cpu, BatteryCharging } from 'lucide-react';

const iconMap = {
  Sparkles,
  Zap,
  Camera,
  Plane,
  Radio,
  Eye,
  Cpu,
  BatteryCharging
};

export const CategoryChips = () => {
  const { activeCategory, setActiveCategory } = useShop();

  return (
    <div className="category-filter-bar">
      <div className="category-chips-container">
        {CATEGORIES.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Sparkles;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              className={`m3-filter-chip ${isActive ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <IconComponent size={16} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
