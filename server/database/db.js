const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db;

const initializeDatabase = () => {
  const dbPath = path.join(__dirname, 'mgnrega_data.db');
  
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to SQLite database');
      createTables();
    }
  });
};

const createTables = () => {
  // Districts table
  db.run(`
    CREATE TABLE IF NOT EXISTS districts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      district_code TEXT UNIQUE NOT NULL,
      district_name TEXT NOT NULL,
      state_name TEXT NOT NULL,
      state_code TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Performance data table
  db.run(`
    CREATE TABLE IF NOT EXISTS performance_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      district_code TEXT NOT NULL,
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      total_households INTEGER DEFAULT 0,
      total_persons INTEGER DEFAULT 0,
      total_work_days INTEGER DEFAULT 0,
      total_wages_paid REAL DEFAULT 0,
      total_material_cost REAL DEFAULT 0,
      total_expenditure REAL DEFAULT 0,
      works_completed INTEGER DEFAULT 0,
      works_ongoing INTEGER DEFAULT 0,
      works_sanctioned INTEGER DEFAULT 0,
      data_source TEXT DEFAULT 'api',
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(district_code, month, year)
    )
  `);

  // API cache table for fallback data
  db.run(`
    CREATE TABLE IF NOT EXISTS api_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      endpoint TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL
    )
  `);

  // Create indexes for better performance
  db.run(`CREATE INDEX IF NOT EXISTS idx_district_code ON performance_data(district_code)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_month_year ON performance_data(month, year)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_endpoint ON api_cache(endpoint)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_expires ON api_cache(expires_at)`);
};

const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

const closeDatabase = () => {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
    });
  }
};

module.exports = {
  initializeDatabase,
  getDatabase,
  closeDatabase
};
