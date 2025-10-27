# MGNREGA Data Sources Integration Guide

## 📊 Current Data Architecture

Your app currently uses:
- **Primary**: `data.gov.in` API (placeholder endpoints)
- **Fallback**: Sample Bihar district data
- **Database**: SQLite with demo data

## 🔗 Real Government Data Sources

### 1. **Official MGNREGA Portal**
- **URL**: https://nregarep1.nic.in/netnrega/
- **Data**: Real-time MGNREGA data
- **Format**: Web scraping required (no direct API)

### 2. **Data.gov.in APIs**
- **URL**: https://data.gov.in/
- **API Key**: Register at https://data.gov.in/user/register
- **Format**: JSON APIs available

### 3. **Ministry of Rural Development**
- **URL**: https://rural.nic.in/
- **Data**: Official MGNREGA statistics
- **Format**: Reports and datasets

## 🚀 How to Get Real Data

### Step 1: Register for Data.gov.in API Key

1. **Go to**: https://data.gov.in/user/register
2. **Create account** with your details
3. **Get API key** from your dashboard
4. **Update environment variable**:
   ```env
   DATA_GOV_API_KEY=your-actual-api-key-here
   ```

### Step 2: Find Real MGNREGA Datasets

Visit these data.gov.in datasets:
- **MGNREGA Job Cards**: https://data.gov.in/catalog/mgnrega-job-cards
- **MGNREGA Works**: https://data.gov.in/catalog/mgnrega-works
- **MGNREGA Expenditure**: https://data.gov.in/catalog/mgnrega-expenditure
- **MGNREGA Performance**: https://data.gov.in/catalog/mgnrega-performance

### Step 3: Update API Endpoints

Replace placeholder endpoints with real ones:

```javascript
// Real data.gov.in endpoints
const API_ENDPOINTS = {
  districts: '/mgnrega-districts-v1',
  jobCards: '/mgnrega-job-cards-v1', 
  works: '/mgnrega-works-v1',
  expenditure: '/mgnrega-expenditure-v1',
  performance: '/mgnrega-performance-v1'
};
```

## 🔧 Implementation Options

### Option 1: Direct API Integration (Recommended)

Update your `dataService.js` with real endpoints:

```javascript
const fetchFromAPI = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`https://api.data.gov.in/resource${endpoint}`, {
      params: {
        'api-key': API_KEY,
        format: 'json',
        limit: 1000,
        ...params
      },
      timeout: 15000
    });
    return response.data;
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error.message);
    throw error;
  }
};
```

### Option 2: Web Scraping (Alternative)

For data not available via API:

```javascript
const puppeteer = require('puppeteer');

const scrapeMGNREGAData = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://nregarep1.nic.in/netnrega/');
  // Scrape data from the portal
  
  await browser.close();
};
```

### Option 3: CSV/Excel Import

Download datasets and import:

```javascript
const csv = require('csv-parser');
const fs = require('fs');

const importCSVData = (filePath) => {
  const results = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // Process and store data
    });
};
```

## 📋 Real Data Structure

### MGNREGA Job Cards Data
```json
{
  "state_name": "Bihar",
  "district_name": "Patna", 
  "block_name": "Patna Sadar",
  "panchayat_name": "XYZ Panchayat",
  "job_card_number": "BI001123456789",
  "household_id": "HH001",
  "person_id": "P001",
  "person_name": "Ram Kumar",
  "gender": "Male",
  "age": 35,
  "job_card_date": "2024-01-15",
  "status": "Active"
}
```

### MGNREGA Works Data
```json
{
  "state_name": "Bihar",
  "district_name": "Patna",
  "block_name": "Patna Sadar", 
  "panchayat_name": "XYZ Panchayat",
  "work_id": "W001",
  "work_name": "Road Construction",
  "work_category": "Rural Connectivity",
  "sanction_date": "2024-01-01",
  "completion_date": "2024-03-31",
  "total_cost": 500000,
  "person_days": 1000,
  "status": "Completed"
}
```

## 🎯 Recommended Implementation

### Phase 1: API Integration
1. **Get data.gov.in API key**
2. **Update endpoints** with real URLs
3. **Test API responses**
4. **Update data models**

### Phase 2: Data Enhancement
1. **Add more data sources**
2. **Implement data validation**
3. **Add data freshness checks**
4. **Create data quality metrics**

### Phase 3: Real-time Updates
1. **Set up scheduled data refresh**
2. **Implement change detection**
3. **Add data versioning**
4. **Create data audit logs**

## 🔍 Testing Real Data

### Test API Connection
```javascript
const testAPI = async () => {
  try {
    const response = await axios.get('https://api.data.gov.in/resource/mgnrega-districts-v1', {
      params: {
        'api-key': process.env.DATA_GOV_API_KEY,
        format: 'json',
        limit: 10
      }
    });
    console.log('API Response:', response.data);
  } catch (error) {
    console.error('API Test Failed:', error.message);
  }
};
```

### Validate Data Quality
```javascript
const validateData = (data) => {
  const requiredFields = ['state_name', 'district_name', 'data_year'];
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
  
  return true;
};
```

## 🚨 Important Considerations

### Data Privacy & Compliance
- ✅ **Public data only** - MGNREGA data is public
- ✅ **No personal information** - Use aggregated data
- ✅ **Respect rate limits** - Don't overload APIs
- ✅ **Cache data** - Reduce API calls

### Data Accuracy
- ✅ **Verify sources** - Cross-check with official portals
- ✅ **Handle missing data** - Graceful fallbacks
- ✅ **Data validation** - Check for anomalies
- ✅ **Regular updates** - Keep data fresh

### Performance
- ✅ **Caching strategy** - Cache API responses
- ✅ **Batch processing** - Process data in chunks
- ✅ **Error handling** - Robust error management
- ✅ **Monitoring** - Track API health

## 🎉 Benefits of Real Data

- ✅ **Accurate insights** - Real MGNREGA performance
- ✅ **Up-to-date information** - Current data
- ✅ **Transparency** - Government accountability
- ✅ **Citizen empowerment** - Informed decisions
- ✅ **Policy impact** - Data-driven governance

## 📞 Next Steps

1. **Register for data.gov.in API key**
2. **Update environment variables**
3. **Replace sample data with real APIs**
4. **Test data integration**
5. **Deploy with real data**

Your MGNREGA Performance Tracker will then provide **real, accurate data** to help rural citizens monitor government program performance! 🇮🇳
