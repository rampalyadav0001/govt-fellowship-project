const express = require('express');
const { getDatabase } = require('../database/db');

const setupRoutes = (app) => {
  const router = express.Router();

  // Get all districts
  router.get('/api/districts', async (req, res) => {
    try {
      const db = getDatabase();
      db.all('SELECT * FROM districts ORDER BY district_name', (err, rows) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
      });
    } catch (error) {
      console.error('Error fetching districts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get performance data for a district
  router.get('/api/performance/:districtCode', async (req, res) => {
    try {
      const { districtCode } = req.params;
      const { year = 2024 } = req.query;
      
      const db = getDatabase();
      db.all(
        'SELECT * FROM performance_data WHERE district_code = ? AND year = ? ORDER BY month',
        [districtCode, year],
        (err, rows) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
          }
          res.json(rows);
        }
      );
    } catch (error) {
      console.error('Error fetching performance data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get district summary
  router.get('/api/district/:districtCode/summary', async (req, res) => {
    try {
      const { districtCode } = req.params;
      const { year = 2024 } = req.query;
      
      const db = getDatabase();
      
      // Get district info
      db.get('SELECT * FROM districts WHERE district_code = ?', [districtCode], (err, district) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (!district) {
          return res.status(404).json({ error: 'District not found' });
        }
        
        // Get performance summary
        db.get(`
          SELECT 
            SUM(total_households) as total_households,
            SUM(total_persons) as total_persons,
            SUM(total_work_days) as total_work_days,
            SUM(total_wages_paid) as total_wages_paid,
            SUM(total_expenditure) as total_expenditure,
            SUM(works_completed) as works_completed,
            AVG(total_households) as avg_households_per_month,
            AVG(total_persons) as avg_persons_per_month
          FROM performance_data 
          WHERE district_code = ? AND year = ?
        `, [districtCode, year], (err, summary) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
          }
          
          res.json({
            district,
            summary: summary || {},
            year: parseInt(year)
          });
        });
      });
    } catch (error) {
      console.error('Error fetching district summary:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get comparative data for multiple districts
  router.get('/api/compare', async (req, res) => {
    try {
      const { districts, year = 2024 } = req.query;
      
      if (!districts) {
        return res.status(400).json({ error: 'Districts parameter is required' });
      }
      
      const districtList = districts.split(',');
      const db = getDatabase();
      
      const placeholders = districtList.map(() => '?').join(',');
      db.all(`
        SELECT 
          d.district_name,
          d.district_code,
          SUM(p.total_households) as total_households,
          SUM(p.total_persons) as total_persons,
          SUM(p.total_work_days) as total_work_days,
          SUM(p.total_wages_paid) as total_wages_paid,
          SUM(p.works_completed) as works_completed
        FROM districts d
        LEFT JOIN performance_data p ON d.district_code = p.district_code
        WHERE d.district_code IN (${placeholders}) AND p.year = ?
        GROUP BY d.district_code, d.district_name
        ORDER BY total_households DESC
      `, [...districtList, year], (err, rows) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
      });
    } catch (error) {
      console.error('Error fetching comparative data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get state-wise summary
  router.get('/api/state-summary', async (req, res) => {
    try {
      const { year = 2024 } = req.query;
      const db = getDatabase();
      
      db.all(`
        SELECT 
          d.state_name,
          COUNT(DISTINCT d.district_code) as total_districts,
          SUM(p.total_households) as total_households,
          SUM(p.total_persons) as total_persons,
          SUM(p.total_work_days) as total_work_days,
          SUM(p.total_wages_paid) as total_wages_paid,
          SUM(p.works_completed) as works_completed
        FROM districts d
        LEFT JOIN performance_data p ON d.district_code = p.district_code
        WHERE p.year = ?
        GROUP BY d.state_name
        ORDER BY total_households DESC
      `, [year], (err, rows) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
      });
    } catch (error) {
      console.error('Error fetching state summary:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Manual data refresh endpoint
  router.post('/api/refresh-data', async (req, res) => {
    try {
      const { fetchAndCacheData } = require('../services/dataService');
      await fetchAndCacheData();
      res.json({ message: 'Data refresh initiated successfully' });
    } catch (error) {
      console.error('Error refreshing data:', error);
      res.status(500).json({ error: 'Failed to refresh data' });
    }
  });

  app.use(router);
};

module.exports = { setupRoutes };
