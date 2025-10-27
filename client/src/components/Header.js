import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Home, BarChart3, Info } from 'lucide-react';

const Header = ({ userLocation, nearbyDistrict }) => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <div className="logo-icon">M</div>
          <span>MGNREGA Tracker</span>
        </Link>
        
        <nav className="nav">
          <Link to="/">
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link to="/compare">
            <BarChart3 size={20} />
            <span>Compare</span>
          </Link>
          <Link to="/about">
            <Info size={20} />
            <span>About</span>
          </Link>
        </nav>
        
        {nearbyDistrict && (
          <div className="location-info">
            <MapPin size={16} />
            <span>Nearby: {nearbyDistrict.name}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
