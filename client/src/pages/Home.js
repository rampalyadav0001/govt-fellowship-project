import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, TrendingUp, Users, DollarSign, CheckCircle, ArrowRight } from 'lucide-react';
import api from '../config/api';
import toast from 'react-hot-toast';

const Home = ({ nearbyDistrict }) => {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [loading, setLoading] = useState(true);
  const [stateSummary, setStateSummary] = useState(null);

  useEffect(() => {
    fetchDistricts();
    fetchStateSummary();
  }, []);

  const fetchDistricts = async () => {
    try {
      const response = await api.get('/api/districts');
      setDistricts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching districts:', error);
      toast.error('Failed to load districts');
      setLoading(false);
    }
  };

  const fetchStateSummary = async () => {
    try {
      const response = await api.get('/api/state-summary');
      if (response.data.length > 0) {
        setStateSummary(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching state summary:', error);
    }
  };

  const handleDistrictSelect = (districtCode) => {
    setSelectedDistrict(districtCode);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
            MGNREGA Performance Tracker
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
            Track your district's performance in the world's largest employment guarantee program
          </p>
          
          {nearbyDistrict && (
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '1rem', 
              borderRadius: '10px', 
              marginBottom: '2rem',
              display: 'inline-block'
            }}>
              <MapPin size={24} style={{ marginRight: '0.5rem' }} />
              <span style={{ fontSize: '1.1rem' }}>
                We detected you're near <strong>{nearbyDistrict.name}</strong>
              </span>
            </div>
          )}
          
          <Link 
            to={nearbyDistrict ? `/district/${nearbyDistrict.code}` : '/compare'} 
            className="btn btn-primary"
            style={{ 
              background: 'white', 
              color: '#667eea',
              fontSize: '1.1rem',
              padding: '1rem 2rem'
            }}
          >
            {nearbyDistrict ? `View ${nearbyDistrict.name} Performance` : 'Compare Districts'}
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* State Summary */}
      {stateSummary && (
        <div className="card">
          <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Bihar State Overview (2024)</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Users size={20} />
              </div>
              <div className="stat-number">
                {stateSummary.total_households?.toLocaleString() || 'N/A'}
              </div>
              <div className="stat-label">Total Households</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp size={20} />
              </div>
              <div className="stat-number">
                {stateSummary.total_work_days?.toLocaleString() || 'N/A'}
              </div>
              <div className="stat-label">Work Days Generated</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <DollarSign size={20} />
              </div>
              <div className="stat-number">
                ₹{(stateSummary.total_wages_paid / 10000000).toFixed(1)}Cr
              </div>
              <div className="stat-label">Wages Paid</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <CheckCircle size={20} />
              </div>
              <div className="stat-number">
                {stateSummary.works_completed?.toLocaleString() || 'N/A'}
              </div>
              <div className="stat-label">Works Completed</div>
            </div>
          </div>
        </div>
      )}

      {/* District Selection */}
      <div className="card">
        <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Select Your District</h2>
        <div className="form-group">
          <label className="form-label">Choose District:</label>
          <select 
            className="form-select"
            value={selectedDistrict}
            onChange={(e) => handleDistrictSelect(e.target.value)}
          >
            <option value="">Select a district...</option>
            {districts.map(district => (
              <option key={district.district_code} value={district.district_code}>
                {district.district_name}
              </option>
            ))}
          </select>
        </div>
        
        {selectedDistrict && (
          <div style={{ marginTop: '1rem' }}>
            <Link 
              to={`/district/${selectedDistrict}`}
              className="btn btn-primary"
            >
              View Performance Details
              <ArrowRight size={20} />
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Compare Districts</h3>
          <p style={{ marginBottom: '1rem', color: '#6c757d' }}>
            Compare performance between different districts to see how your district is doing.
          </p>
          <Link to="/compare" className="btn btn-outline">
            Start Comparison
            <ArrowRight size={20} />
          </Link>
        </div>
        
        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>About MGNREGA</h3>
          <p style={{ marginBottom: '1rem', color: '#6c757d' }}>
            Learn more about the Mahatma Gandhi National Rural Employment Guarantee Act.
          </p>
          <Link to="/about" className="btn btn-outline">
            Learn More
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-3">
        <div className="card">
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              background: '#28a745', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 1rem',
              color: 'white'
            }}>
              <Users size={30} />
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>12.15 Crore</h4>
            <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
              Rural Indians benefited in 2025
            </p>
          </div>
        </div>
        
        <div className="card">
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              background: '#17a2b8', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 1rem',
              color: 'white'
            }}>
              <TrendingUp size={30} />
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>100 Days</h4>
            <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
              Guaranteed employment per household
            </p>
          </div>
        </div>
        
        <div className="card">
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              background: '#ffc107', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 1rem',
              color: 'white'
            }}>
              <CheckCircle size={30} />
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>World's Largest</h4>
            <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
              Employment guarantee program
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
