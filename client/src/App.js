import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

import Header from './components/Header';
import Home from './pages/Home';
import DistrictPerformance from './pages/DistrictPerformance';
import CompareDistricts from './pages/CompareDistricts';
import About from './pages/About';

function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyDistrict, setNearbyDistrict] = useState(null);

  useEffect(() => {
    // Try to get user's location for automatic district detection
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          // In a real implementation, you would reverse geocode to find the district
          // For now, we'll use a simple approximation
          findNearbyDistrict(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.log('Location access denied or failed:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    }
  }, []);

  const findNearbyDistrict = (lat, lng) => {
    // Simple approximation for Bihar districts
    // In production, you would use a proper geocoding service
    const biharDistricts = [
      { code: 'BI001', name: 'Patna', lat: 25.5941, lng: 85.1376 },
      { code: 'BI002', name: 'Gaya', lat: 24.7960, lng: 85.0039 },
      { code: 'BI003', name: 'Muzaffarpur', lat: 26.1209, lng: 85.3647 },
      { code: 'BI004', name: 'Bhagalpur', lat: 25.2445, lng: 86.9718 },
      { code: 'BI005', name: 'Darbhanga', lat: 26.1667, lng: 85.9000 }
    ];

    let closestDistrict = null;
    let minDistance = Infinity;

    biharDistricts.forEach(district => {
      const distance = Math.sqrt(
        Math.pow(lat - district.lat, 2) + Math.pow(lng - district.lng, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestDistrict = district;
      }
    });

    if (minDistance < 0.5) { // Within ~50km
      setNearbyDistrict(closestDistrict);
    }
  };

  return (
    <Router>
      <div className="App">
        <Header userLocation={userLocation} nearbyDistrict={nearbyDistrict} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home nearbyDistrict={nearbyDistrict} />} />
            <Route path="/district/:districtCode" element={<DistrictPerformance />} />
            <Route path="/compare" element={<CompareDistricts />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              fontSize: '16px',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
