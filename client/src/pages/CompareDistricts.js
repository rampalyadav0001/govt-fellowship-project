import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, DollarSign, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';

const CompareDistricts = () => {
  const [districts, setDistricts] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2024);

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (selectedDistricts.length > 0) {
      fetchComparisonData();
    }
  }, [selectedDistricts, selectedYear]);

  const fetchDistricts = async () => {
    try {
      const response = await axios.get('/api/districts');
      setDistricts(response.data);
    } catch (error) {
      console.error('Error fetching districts:', error);
      toast.error('Failed to load districts');
    }
  };

  const fetchComparisonData = async () => {
    try {
      setLoading(true);
      const districtCodes = selectedDistricts.join(',');
      const response = await axios.get(`/api/compare?districts=${districtCodes}&year=${selectedYear}`);
      setComparisonData(response.data);
    } catch (error) {
      console.error('Error fetching comparison data:', error);
      toast.error('Failed to load comparison data');
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictSelect = (districtCode) => {
    if (selectedDistricts.includes(districtCode)) {
      setSelectedDistricts(selectedDistricts.filter(code => code !== districtCode));
    } else if (selectedDistricts.length < 5) {
      setSelectedDistricts([...selectedDistricts, districtCode]);
    } else {
      toast.error('You can compare up to 5 districts at a time');
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  const formatNumber = (num) => {
    if (num >= 100000) {
      return `${(num / 100000).toFixed(1)}L`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const prepareChartData = () => {
    return comparisonData.map(item => ({
      name: item.district_name,
      households: item.total_households || 0,
      persons: item.total_persons || 0,
      workDays: item.total_work_days || 0,
      wages: item.total_wages_paid || 0,
      works: item.works_completed || 0
    }));
  };

  return (
    <div>
      {/* Header */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Link to="/" className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>
            <ArrowLeft size={20} />
            Back
          </Link>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              Compare Districts
            </h1>
            <p style={{ opacity: 0.9 }}>
              Compare MGNREGA performance between different districts
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ fontWeight: '500' }}>Year:</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{ 
              padding: '0.5rem', 
              borderRadius: '5px', 
              border: 'none',
              background: 'rgba(255,255,255,0.2)',
              color: 'white'
            }}
          >
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
          </select>
        </div>
      </div>

      {/* District Selection */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Select Districts to Compare</h3>
        <p style={{ marginBottom: '1rem', color: '#6c757d' }}>
          Choose up to 5 districts to compare their performance. Selected: {selectedDistricts.length}/5
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          {districts.map(district => (
            <div 
              key={district.district_code}
              onClick={() => handleDistrictSelect(district.district_code)}
              style={{
                padding: '1rem',
                border: selectedDistricts.includes(district.district_code) 
                  ? '2px solid #667eea' 
                  : '2px solid #e9ecef',
                borderRadius: '8px',
                cursor: 'pointer',
                background: selectedDistricts.includes(district.district_code) 
                  ? '#f8f9ff' 
                  : 'white',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ 
                fontWeight: '500', 
                color: selectedDistricts.includes(district.district_code) 
                  ? '#667eea' 
                  : '#2c3e50'
              }}>
                {district.district_name}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                {district.state_name}
              </div>
            </div>
          ))}
        </div>
        
        {selectedDistricts.length > 0 && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              onClick={() => setSelectedDistricts([])}
              className="btn btn-secondary"
            >
              Clear Selection
            </button>
            <span style={{ color: '#6c757d' }}>
              {selectedDistricts.length} district{selectedDistricts.length > 1 ? 's' : ''} selected
            </span>
          </div>
        )}
      </div>

      {/* Comparison Results */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      )}

      {comparisonData.length > 0 && (
        <div>
          {/* Summary Cards */}
          <div className="stats-grid">
            {comparisonData.map((district, index) => (
              <div key={district.district_code} className="stat-card">
                <div className="stat-icon" style={{ background: `hsl(${index * 60}, 70%, 50%)` }}>
                  <Users size={20} />
                </div>
                <div className="stat-number">
                  {formatNumber(district.total_households || 0)}
                </div>
                <div className="stat-label">{district.district_name}</div>
                <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '0.5rem' }}>
                  Total Households
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-2">
            <div className="chart-container">
              <h3 className="chart-title">Total Households Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={prepareChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatNumber(value), 'Households']}
                  />
                  <Bar dataKey="households" fill="#667eea" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3 className="chart-title">Work Days Generated</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={prepareChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatNumber(value), 'Work Days']}
                  />
                  <Bar dataKey="workDays" fill="#28a745" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Comparison Table */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Detailed Comparison</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>District</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Households</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Persons</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Work Days</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Wages Paid</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Works Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((district, index) => (
                    <tr key={district.district_code} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '500' }}>{district.district_name}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatNumber(district.total_households || 0)}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatNumber(district.total_persons || 0)}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatNumber(district.total_work_days || 0)}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatCurrency(district.total_wages_paid || 0)}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatNumber(district.works_completed || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Rankings */}
          <div className="grid grid-2">
            <div className="card">
              <h4 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Top Performers</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {comparisonData
                  .sort((a, b) => (b.total_households || 0) - (a.total_households || 0))
                  .slice(0, 3)
                  .map((district, index) => (
                    <div key={district.district_code} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '0.5rem',
                      background: index === 0 ? '#d4edda' : '#f8f9fa',
                      borderRadius: '5px'
                    }}>
                      <span style={{ fontWeight: '500' }}>
                        #{index + 1} {district.district_name}
                      </span>
                      <span style={{ color: '#6c757d' }}>
                        {formatNumber(district.total_households || 0)} households
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="card">
              <h4 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Key Insights</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ padding: '0.5rem', background: '#e3f2fd', borderRadius: '5px' }}>
                  <strong>Best Work Days:</strong> {comparisonData
                    .sort((a, b) => (b.total_work_days || 0) - (a.total_work_days || 0))[0]?.district_name}
                </div>
                <div style={{ padding: '0.5rem', background: '#f3e5f5', borderRadius: '5px' }}>
                  <strong>Highest Wages:</strong> {comparisonData
                    .sort((a, b) => (b.total_wages_paid || 0) - (a.total_wages_paid || 0))[0]?.district_name}
                </div>
                <div style={{ padding: '0.5rem', background: '#e8f5e8', borderRadius: '5px' }}>
                  <strong>Most Works:</strong> {comparisonData
                    .sort((a, b) => (b.works_completed || 0) - (a.works_completed || 0))[0]?.district_name}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {selectedDistricts.length === 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>How to Compare Districts</h3>
          <div className="grid grid-3">
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: '#667eea', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 1rem',
                color: 'white'
              }}>
                <Users size={30} />
              </div>
              <h4 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>1. Select Districts</h4>
              <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                Click on district cards to select up to 5 districts for comparison
              </p>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1rem' }}>
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
                <TrendingUp size={30} />
              </div>
              <h4 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>2. View Analysis</h4>
              <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                See charts, rankings, and detailed performance metrics
              </p>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1rem' }}>
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
                <CheckCircle size={30} />
              </div>
              <h4 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>3. Get Insights</h4>
              <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                Understand which districts are performing better and why
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareDistricts;
