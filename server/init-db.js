const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'mgnrega_data.db');

// Ensure database directory exists
const fs = require('fs');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    } else {
        console.log('Connected to SQLite database');
        createTables();
    }
});

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
    `, (err) => {
        if (err) {
            console.error('Error creating districts table:', err);
        } else {
            console.log('Districts table created successfully');
        }
    });

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
    `, (err) => {
        if (err) {
            console.error('Error creating performance_data table:', err);
        } else {
            console.log('Performance data table created successfully');
        }
    });

    // API cache table for fallback data
    db.run(`
        CREATE TABLE IF NOT EXISTS api_cache (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            endpoint TEXT NOT NULL,
            data TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Error creating api_cache table:', err);
        } else {
            console.log('API cache table created successfully');
        }
    });

    // Create indexes for better performance
    db.run(`CREATE INDEX IF NOT EXISTS idx_district_code ON performance_data(district_code)`, (err) => {
        if (err) console.error('Error creating index:', err);
    });
    
    db.run(`CREATE INDEX IF NOT EXISTS idx_month_year ON performance_data(month, year)`, (err) => {
        if (err) console.error('Error creating index:', err);
    });
    
    db.run(`CREATE INDEX IF NOT EXISTS idx_endpoint ON api_cache(endpoint)`, (err) => {
        if (err) console.error('Error creating index:', err);
    });
    
    db.run(`CREATE INDEX IF NOT EXISTS idx_expires ON api_cache(expires_at)`, (err) => {
        if (err) console.error('Error creating index:', err);
    });

    // Insert sample data
    insertSampleData();
};

const insertSampleData = () => {
    // Insert sample districts
    const districts = [
        { code: 'BI001', name: 'Patna', state: 'Bihar', stateCode: 'BI' },
        { code: 'BI002', name: 'Gaya', state: 'Bihar', stateCode: 'BI' },
        { code: 'BI003', name: 'Muzaffarpur', state: 'Bihar', stateCode: 'BI' },
        { code: 'BI004', name: 'Bhagalpur', state: 'Bihar', stateCode: 'BI' },
        { code: 'BI005', name: 'Darbhanga', state: 'Bihar', stateCode: 'BI' }
    ];

    const stmt = db.prepare(`
        INSERT OR REPLACE INTO districts (district_code, district_name, state_name, state_code)
        VALUES (?, ?, ?, ?)
    `);

    districts.forEach(district => {
        stmt.run([district.code, district.name, district.state, district.stateCode]);
    });

    stmt.finalize();

    // Insert sample performance data
    const performanceData = [
        // Patna data
        { districtCode: 'BI001', month: 1, year: 2024, households: 12500, persons: 45000, workDays: 180000, wages: 45000000, worksCompleted: 45 },
        { districtCode: 'BI001', month: 2, year: 2024, households: 13200, persons: 48000, workDays: 192000, wages: 48000000, worksCompleted: 52 },
        { districtCode: 'BI001', month: 3, year: 2024, households: 12800, persons: 46000, workDays: 184000, wages: 46000000, worksCompleted: 48 },
        
        // Gaya data
        { districtCode: 'BI002', month: 1, year: 2024, households: 9800, persons: 35000, workDays: 140000, wages: 35000000, worksCompleted: 38 },
        { districtCode: 'BI002', month: 2, year: 2024, households: 10200, persons: 37000, workDays: 148000, wages: 37000000, worksCompleted: 42 },
        { districtCode: 'BI002', month: 3, year: 2024, households: 9500, persons: 34000, workDays: 136000, wages: 34000000, worksCompleted: 35 },
        
        // Muzaffarpur data
        { districtCode: 'BI003', month: 1, year: 2024, households: 11000, persons: 40000, workDays: 160000, wages: 40000000, worksCompleted: 41 },
        { districtCode: 'BI003', month: 2, year: 2024, households: 11500, persons: 42000, workDays: 168000, wages: 42000000, worksCompleted: 46 },
        { districtCode: 'BI003', month: 3, year: 2024, households: 10800, persons: 39000, workDays: 156000, wages: 39000000, worksCompleted: 39 },
        
        // Bhagalpur data
        { districtCode: 'BI004', month: 1, year: 2024, households: 8500, persons: 30000, workDays: 120000, wages: 30000000, worksCompleted: 32 },
        { districtCode: 'BI004', month: 2, year: 2024, households: 8800, persons: 32000, workDays: 128000, wages: 32000000, worksCompleted: 35 },
        { districtCode: 'BI004', month: 3, year: 2024, households: 8200, persons: 29000, workDays: 116000, wages: 29000000, worksCompleted: 28 },
        
        // Darbhanga data
        { districtCode: 'BI005', month: 1, year: 2024, households: 9200, persons: 33000, workDays: 132000, wages: 33000000, worksCompleted: 36 },
        { districtCode: 'BI005', month: 2, year: 2024, households: 9600, persons: 35000, workDays: 140000, wages: 35000000, worksCompleted: 40 },
        { districtCode: 'BI005', month: 3, year: 2024, households: 8900, persons: 32000, workDays: 128000, wages: 32000000, worksCompleted: 33 }
    ];

    const perfStmt = db.prepare(`
        INSERT OR REPLACE INTO performance_data 
        (district_code, month, year, total_households, total_persons, total_work_days, 
         total_wages_paid, total_material_cost, total_expenditure, works_completed, 
         works_ongoing, works_sanctioned, data_source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    performanceData.forEach(data => {
        perfStmt.run([
            data.districtCode,
            data.month,
            data.year,
            data.households,
            data.persons,
            data.workDays,
            data.wages,
            data.materialCost || 0,
            data.expenditure || data.wages,
            data.worksCompleted,
            data.worksOngoing || 0,
            data.worksSanctioned || 0,
            'sample'
        ]);
    });

    perfStmt.finalize();

    console.log('Sample data inserted successfully');
    console.log('Database initialization completed!');
    
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed');
        }
    });
};
