import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, DollarSign, CheckCircle, Calendar, MapPin } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';

const DistrictPerformance = () => {
  const { districtCode } = useParams();
  const [district, setDistrict] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2024);

  useEffect(() => {
    if (districtCode) {
      fetchDistrictData();
    }
  }, [districtCode, selectedYear]);

  const fetchDistrictData = async () => {
    try {
      setLoading(true);
      
      // Fetch district summary
      const summaryResponse = await axios.get(`/api/district/${districtCode}/summary?year=${selectedYear}`);
      setDistrict(summaryResponse.data.district);
      setSummary(summaryResponse.data.summary);
      
      // Fetch monthly performance data
      const performanceResponse = await axios.get(`/api/performance/${districtCode}?year=${selectedYear}`);
      setPerformanceData(performanceResponse.data);
      
    } catch (error) {
      console.error('Error fetching district data:', error);
      toast.error('Failed to load district data');
    } finally {
      setLoading(false);
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

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1] || '';
  };

  const prepareChartData = () => {
    return performanceData.map(item => ({
      month: getMonthName(item.month),
      households: item.total_households,
      persons: item.total_persons,
      workDays: item.total_work_days,
      wages: item.total_wages_paid,
      works: item.works_completed
    }));
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!district) {
    return (
      <div className="card">
        <h2>District Not Found</h2>
        <p>The requested district could not be found.</p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={20} />
          Back to Home
        </Link>
      </div>
    );
  }

  const chartData = prepareChartData();

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
              {district.district_name}
            </h1>
            <p style={{ opacity: 0.9, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} />
              {district.state_name}
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

      {/* Summary Stats */}
      {summary && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={20} />
            </div>
            <div className="stat-number">
              {formatNumber(summary.total_households || 0)}
            </div>
            <div className="stat-label">Total Households</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={20} />
            </div>
            <div className="stat-number">
              {formatNumber(summary.total_work_days || 0)}
            </div>
            <div className="stat-label">Work Days Generated</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <DollarSign size={20} />
            </div>
            <div className="stat-number">
              {formatCurrency(summary.total_wages_paid || 0)}
            </div>
            <div className="stat-label">Total Wages Paid</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <CheckCircle size={20} />
            </div>
            <div className="stat-number">
              {formatNumber(summary.works_completed || 0)}
            </div>
            <div className="stat-label">Works Completed</div>
          </div>
        </div>
      )}

      {/* Monthly Trends */}
      {chartData.length > 0 && (
        <div className="grid grid-2">
          <div className="chart-container">
            <h3 className="chart-title">Households & Persons (Monthly)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    formatNumber(value), 
                    name === 'households' ? 'Households' : 'Persons'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="households" 
                  stroke="#667eea" 
                  strokeWidth={3}
                  name="households"
                />
                <Line 
                  type="monotone" 
                  dataKey="persons" 
                  stroke="#28a745" 
                  strokeWidth={3}
                  name="persons"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3 className="chart-title">Work Days Generated</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [formatNumber(value), 'Work Days']}
                />
                <Bar dataKey="workDays" fill="#17a2b8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Performance Indicators */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Performance Indicators</h3>
        <div className="grid grid-3">
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#28a745',
              marginBottom: '0.5rem'
            }}>
              {summary?.avg_households_per_month ? Math.round(summary.avg_households_per_month) : 'N/A'}
            </div>
            <div style={{ color: '#6c757d' }}>Avg Households/Month</div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#17a2b8',
              marginBottom: '0.5rem'
            }}>
              {summary?.avg_persons_per_month ? Math.round(summary.avg_persons_per_month) : 'N/A'}
            </div>
            <div style={{ color: '#6c757d' }}>Avg Persons/Month</div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#ffc107',
              marginBottom: '0.5rem'
            }}>
              {summary?.total_expenditure ? formatCurrency(summary.total_expenditure) : 'N/A'}
            </div>
            <div style={{ color: '#6c757d' }}>Total Expenditure</div>
          </div>
        </div>
      </div>

      {/* Monthly Data Table */}
      {performanceData.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Monthly Performance Data</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Month</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Households</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Persons</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Work Days</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Wages Paid</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Works Completed</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '0.75rem' }}>{getMonthName(item.month)}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatNumber(item.total_households)}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatNumber(item.total_persons)}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatNumber(item.total_work_days)}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatCurrency(item.total_wages_paid)}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatNumber(item.works_completed)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/compare" className="btn btn-primary">
            Compare with Other Districts
          </Link>
          <Link to="/" className="btn btn-outline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DistrictPerformance;
