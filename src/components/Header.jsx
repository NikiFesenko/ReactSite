import React from 'react';
import { useShop } from '../context/ShopContext';
import { Search, ShoppingBag, Heart, Sliders, Plane, Sun, Moon } from 'lucide-react';

export const Header = () => {
  const {
    searchQuery,
    setSearchQuery,
    cartItemCount,
    setIsCartOpen,
    wishlist,
    compareList,
    setIsCompareOpen,
    themeMode,
    toggleTheme
  } = useShop();

  return (
    <header className="top-app-bar">
      <div className="top-bar-content">
        <a href="#" className="brand-logo">
          <div className="brand-icon">
            <Plane size={22} />
          </div>
          <span>AeroX<span style={{ opacity: 0.6, fontWeight: 400 }}>Tech</span></span>
        </a>

        <div className="search-bar-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search FPV drones, ExpressLRS, 4K cameras, sensors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="header-actions">
          <button
            className="icon-btn-m3"
            onClick={toggleTheme}
            title="Toggle Light/Dark Theme"
          >
            {themeMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button
            className="icon-btn-m3"
            onClick={() => compareList.length > 0 && setIsCompareOpen(true)}
            title="Compare Drones"
          >
            <Sliders size={20} />
            {compareList.length > 0 && <span className="badge-m3">{compareList.length}</span>}
          </button>

          <button className="icon-btn-m3" title="Wishlist">
            <Heart size={20} />
            {wishlist.length > 0 && <span className="badge-m3">{wishlist.length}</span>}
          </button>

          <button
            className="icon-btn-m3"
            onClick={() => setIsCartOpen(true)}
            title="Shopping Cart"
          >
            <ShoppingBag size={20} />
            {cartItemCount > 0 && <span className="badge-m3">{cartItemCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
};
