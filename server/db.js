import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isPostgres = !!process.env.DATABASE_URL;
let pgPool = null;
let sqliteDb = null;

if (isPostgres) {
  console.log('Database: Using PostgreSQL');
  pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true'
      ? { rejectUnauthorized: false } 
      : false
  });
} else {
  // Only load sqlite3 when actually needed (avoids native compilation issues in production)
  try {
    const sqlite3Module = await import('sqlite3');
    const sqlite3 = sqlite3Module.default;
    const dbPath = path.resolve(__dirname, '../planner.db');
    console.log(`Database: Using SQLite at ${dbPath}`);
    sqliteDb = new sqlite3.Database(dbPath);
  } catch (err) {
    console.error('SQLite3 not available. Install sqlite3 for local development or set DATABASE_URL for PostgreSQL.');
    console.error(err.message);
  }
}

// Wrapper for query execution to make it DB-agnostic
export const query = (text, params = []) => {
  return new Promise((resolve, reject) => {
    if (isPostgres) {
      pgPool.query(text, params, (err, res) => {
        if (err) return reject(err);
        resolve({ rows: res.rows });
      });
    } else if (sqliteDb) {
      // Translate Postgres parameters ($1, $2) to SQLite (?)
      const sqliteText = text.replace(/\$\d+/g, '?');
      
      // Determine if query is a SELECT or modifying
      const isSelect = sqliteText.trim().toUpperCase().startsWith('SELECT');
      
      if (isSelect) {
        sqliteDb.all(sqliteText, params, (err, rows) => {
          if (err) return reject(err);
          resolve({ rows });
        });
      } else {
        sqliteDb.run(sqliteText, params, function(err) {
          if (err) return reject(err);
          resolve({ rows: [{ id: this.lastID }], lastID: this.lastID, changes: this.changes });
        });
      }
    } else {
      reject(new Error('No database available. Set DATABASE_URL or install sqlite3.'));
    }
  });
};

// Database schema initialization
export const initDb = async () => {
  const userPrimaryKey = isPostgres 
    ? 'id SERIAL PRIMARY KEY' 
    : 'id INTEGER PRIMARY KEY AUTOINCREMENT';
  
  const defaultTimestamp = 'DEFAULT CURRENT_TIMESTAMP';

  try {
    // 1. Users Table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        ${userPrimaryKey},
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        settings_json TEXT,
        created_at TIMESTAMP ${defaultTimestamp}
      )
    `);

    // 2. Focus Plans Table
    await query(`
      CREATE TABLE IF NOT EXISTS focus_plans (
        id VARCHAR(100) PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        icon VARCHAR(100) NOT NULL,
        color VARCHAR(50) NOT NULL,
        target REAL NOT NULL,
        unit VARCHAR(50) NOT NULL,
        timeframe_type VARCHAR(50) NOT NULL,
        timeframe_value VARCHAR(100) NOT NULL,
        created_at VARCHAR(50) NOT NULL
      )
    `);

    // 3. Focus Plan Sessions Table
    await query(`
      CREATE TABLE IF NOT EXISTS focus_sessions (
        id VARCHAR(100) PRIMARY KEY,
        plan_id VARCHAR(100) REFERENCES focus_plans(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        date VARCHAR(50) NOT NULL,
        value REAL NOT NULL,
        details TEXT,
        notes TEXT
      )
    `);

    // 4. Transactions Table
    await query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(100) PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        date VARCHAR(50) NOT NULL,
        type VARCHAR(50) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        amount REAL NOT NULL,
        payment_method VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL
      )
    `);

    // 5. Habits Table
    await query(`
      CREATE TABLE IF NOT EXISTS habits (
        id VARCHAR(100) PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        frequency VARCHAR(50) NOT NULL,
        target REAL NOT NULL,
        unit VARCHAR(50) NOT NULL,
        logs_json TEXT
      )
    `);

    // 6. Calendar Events Table
    await query(`
      CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(100) PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        date VARCHAR(50) NOT NULL,
        time VARCHAR(50) NOT NULL,
        activity_type VARCHAR(100) NOT NULL,
        description TEXT,
        status VARCHAR(50) NOT NULL
      )
    `);

    // 7. CRM Prospects Table
    await query(`
      CREATE TABLE IF NOT EXISTS prospects (
        id VARCHAR(100) PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        contact VARCHAR(255),
        phone VARCHAR(100),
        email VARCHAR(255),
        need TEXT,
        service_offered TEXT,
        value_proposed REAL NOT NULL,
        status VARCHAR(100) NOT NULL,
        next_step TEXT,
        follow_up_date VARCHAR(50),
        notes TEXT
      )
    `);

    // 8. Roadmaps Table
    await query(`
      CREATE TABLE IF NOT EXISTS roadmaps (
        id INTEGER NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        objectives_json TEXT,
        outcome TEXT,
        notes TEXT,
        PRIMARY KEY (user_id, id)
      )
    `);

    // 9. Weekend Plans Table
    await query(`
      CREATE TABLE IF NOT EXISTS weekend_plans (
        id VARCHAR(100) NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        saturday_json TEXT,
        sunday_json TEXT,
        reflection_json TEXT,
        PRIMARY KEY (user_id, id)
      )
    `);

    console.log('Database tables successfully initialized/verified.');
  } catch (err) {
    console.error('Error initializing database tables:', err);
    throw err;
  }
};
