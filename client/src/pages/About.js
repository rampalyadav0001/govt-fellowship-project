import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Target, Shield, Heart, Globe, Award } from 'lucide-react';

const About = () => {
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
              About MGNREGA
            </h1>
            <p style={{ opacity: 0.9 }}>
              Understanding the world's largest employment guarantee program
            </p>
          </div>
        </div>
      </div>

      {/* What is MGNREGA */}
      <div className="card">
        <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>What is MGNREGA?</h2>
        <p style={{ marginBottom: '1rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
          The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) is India's flagship 
          social security and employment generation program. It guarantees 100 days of wage employment 
          in a financial year to every rural household whose adult members volunteer to do unskilled manual work.
        </p>
        
        <div className="grid grid-2">
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>Key Features</h4>
            <ul style={{ paddingLeft: '1.5rem', color: '#6c757d' }}>
              <li>100 days guaranteed employment per household</li>
              <li>Unskilled manual work in rural areas</li>
              <li>Minimum wage payment within 15 days</li>
              <li>Focus on asset creation and rural development</li>
            </ul>
          </div>
          
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>Impact</h4>
            <ul style={{ paddingLeft: '1.5rem', color: '#6c757d' }}>
              <li>12.15 crore rural Indians benefited in 2025</li>
              <li>World's largest employment guarantee program</li>
              <li>Significant rural infrastructure development</li>
              <li>Poverty alleviation and social security</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Program Objectives */}
      <div className="card">
        <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Program Objectives</h2>
        <div className="grid grid-3">
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
              <Users size={30} />
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>Employment</h4>
            <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
              Provide guaranteed wage employment to rural households
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
              <Target size={30} />
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>Development</h4>
            <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
              Create durable assets and strengthen rural infrastructure
            </p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '1rem' }}>
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
              <Shield size={30} />
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>Security</h4>
            <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
              Provide social security and reduce rural-urban migration
            </p>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="card">
        <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>How MGNREGA Works</h2>
        <div className="grid grid-2">
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#2c3e50' }}>For Rural Households</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: '#667eea', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>1</div>
                <div>
                  <strong>Registration:</strong> Apply for job card at Gram Panchayat
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: '#667eea', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>2</div>
                <div>
                  <strong>Work Demand:</strong> Submit application for work when needed
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: '#667eea', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>3</div>
                <div>
                  <strong>Work Assignment:</strong> Get work within 15 days of application
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: '#667eea', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>4</div>
                <div>
                  <strong>Payment:</strong> Receive wages within 15 days of work completion
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Types of Works</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ padding: '0.75rem', background: '#e3f2fd', borderRadius: '5px' }}>
                <strong>Water Conservation:</strong> Ponds, wells, irrigation channels
              </div>
              <div style={{ padding: '0.75rem', background: '#e8f5e8', borderRadius: '5px' }}>
                <strong>Rural Roads:</strong> Village roads, footpaths
              </div>
              <div style={{ padding: '0.75rem', background: '#fff3e0', borderRadius: '5px' }}>
                <strong>Land Development:</strong> Soil conservation, afforestation
              </div>
              <div style={{ padding: '0.75rem', background: '#f3e5f5', borderRadius: '5px' }}>
                <strong>Flood Control:</strong> Embankments, drainage systems
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Tracking */}
      <div className="card">
        <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Why Track Performance?</h2>
        <div className="grid grid-3">
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
              <Heart size={30} />
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>Transparency</h4>
            <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
              Citizens can see how their district is performing and hold officials accountable
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
              <Globe size={30} />
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>Awareness</h4>
            <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
              Understanding program impact helps citizens make informed decisions
            </p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '1rem' }}>
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
              <Award size={30} />
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>Improvement</h4>
            <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
              Data-driven insights help improve program implementation
            </p>
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="card">
        <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>MGNREGA by Numbers</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#28a745' }}>
              <Users size={20} />
            </div>
            <div className="stat-number">12.15 Cr</div>
            <div className="stat-label">Rural Indians Benefited (2025)</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#17a2b8' }}>
              <Target size={20} />
            </div>
            <div className="stat-number">100 Days</div>
            <div className="stat-label">Guaranteed Employment</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#ffc107' }}>
              <Award size={20} />
            </div>
            <div className="stat-number">World's Largest</div>
            <div className="stat-label">Employment Program</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#667eea' }}>
              <Globe size={20} />
            </div>
            <div className="stat-number">₹3.5L Cr</div>
            <div className="stat-label">Budget Allocation (2024-25)</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', color: 'white', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Ready to Explore?</h2>
        <p style={{ marginBottom: '2rem', opacity: 0.9, fontSize: '1.1rem' }}>
          Discover how your district is performing in the MGNREGA program
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>
            View Your District
          </Link>
          <Link to="/compare" className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>
            Compare Districts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
