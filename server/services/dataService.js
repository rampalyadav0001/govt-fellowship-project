const axios = require('axios');
const { getDatabase } = require('../database/db');

// MGNREGA API endpoints (these would be actual endpoints from data.gov.in)
const API_BASE_URL = 'https://api.data.gov.in/resource';
const API_KEY = process.env.DATA_GOV_API_KEY || 'your-api-key-here';

// Fallback data for when API is unavailable
const FALLBACK_DATA = {
  'bihar': {
    districts: [
      { code: 'BI001', name: 'Patna', state: 'Bihar' },
      { code: 'BI002', name: 'Gaya', state: 'Bihar' },
      { code: 'BI003', name: 'Muzaffarpur', state: 'Bihar' },
      { code: 'BI004', name: 'Bhagalpur', state: 'Bihar' },
      { code: 'BI005', name: 'Darbhanga', state: 'Bihar' }
    ],
    performance: {
      'BI001': [
        { month: 1, year: 2024, households: 12500, persons: 45000, workDays: 180000, wages: 45000000, worksCompleted: 45 },
        { month: 2, year: 2024, households: 13200, persons: 48000, workDays: 192000, wages: 48000000, worksCompleted: 52 },
        { month: 3, year: 2024, households: 12800, persons: 46000, workDays: 184000, wages: 46000000, worksCompleted: 48 }
      ]
    }
  }
};

const fetchFromAPI = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      params: {
        'api-key': API_KEY,
        format: 'json',
        ...params
      },
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error.message);
    throw error;
  }
};

const getCachedData = async (endpoint) => {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT data FROM api_cache WHERE endpoint = ? AND expires_at > datetime("now")',
      [endpoint],
      (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(JSON.parse(row.data));
        } else {
          resolve(null);
        }
      }
    );
  });
};

const setCachedData = async (endpoint, data, ttlHours = 6) => {
  const db = getDatabase();
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
  
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT OR REPLACE INTO api_cache (endpoint, data, expires_at) VALUES (?, ?, ?)',
      [endpoint, JSON.stringify(data), expiresAt.toISOString()],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
};

const fetchDistricts = async () => {
  try {
    // Try to get from cache first
    let data = await getCachedData('districts');
    if (data) {
      return data;
    }

    // Try API
    try {
      data = await fetchFromAPI('/mgnrega-districts');
      await setCachedData('districts', data);
      return data;
    } catch (apiError) {
      console.log('API unavailable, using fallback data for districts');
      return FALLBACK_DATA.bihar.districts;
    }
  } catch (error) {
    console.error('Error fetching districts:', error);
    return FALLBACK_DATA.bihar.districts;
  }
};

const fetchPerformanceData = async (districtCode, year = 2024) => {
  try {
    // Try to get from cache first
    let data = await getCachedData(`performance_${districtCode}_${year}`);
    if (data) {
      return data;
    }

    // Try API
    try {
      data = await fetchFromAPI('/mgnrega-performance', {
        district_code: districtCode,
        year: year
      });
      await setCachedData(`performance_${districtCode}_${year}`, data);
      return data;
    } catch (apiError) {
      console.log(`API unavailable, using fallback data for district ${districtCode}`);
      return FALLBACK_DATA.bihar.performance[districtCode] || [];
    }
  } catch (error) {
    console.error(`Error fetching performance data for ${districtCode}:`, error);
    return FALLBACK_DATA.bihar.performance[districtCode] || [];
  }
};

const storeDistricts = async (districts) => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO districts (district_code, district_name, state_name, state_code)
      VALUES (?, ?, ?, ?)
    `);
    
    districts.forEach(district => {
      stmt.run([
        district.code,
        district.name,
        district.state,
        district.stateCode || 'BI'
      ]);
    });
    
    stmt.finalize((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const storePerformanceData = async (districtCode, performanceData) => {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO performance_data 
      (district_code, month, year, total_households, total_persons, total_work_days, 
       total_wages_paid, total_material_cost, total_expenditure, works_completed, 
       works_ongoing, works_sanctioned, data_source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    performanceData.forEach(data => {
      stmt.run([
        districtCode,
        data.month,
        data.year,
        data.households || 0,
        data.persons || 0,
        data.workDays || 0,
        data.wages || 0,
        data.materialCost || 0,
        data.expenditure || 0,
        data.worksCompleted || 0,
        data.worksOngoing || 0,
        data.worksSanctioned || 0,
        'api'
      ]);
    });
    
    stmt.finalize((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const fetchAndCacheData = async () => {
  try {
    console.log('Starting data fetch and cache process...');
    
    // Fetch and store districts
    const districts = await fetchDistricts();
    await storeDistricts(districts);
    console.log(`Stored ${districts.length} districts`);
    
    // Fetch and store performance data for each district
    for (const district of districts) {
      const performanceData = await fetchPerformanceData(district.code);
      if (performanceData.length > 0) {
        await storePerformanceData(district.code, performanceData);
        console.log(`Stored performance data for ${district.name}`);
      }
    }
    
    console.log('Data fetch and cache process completed');
  } catch (error) {
    console.error('Error in fetchAndCacheData:', error);
    throw error;
  }
};

module.exports = {
  fetchDistricts,
  fetchPerformanceData,
  fetchAndCacheData
};
