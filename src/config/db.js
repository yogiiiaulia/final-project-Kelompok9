'use strict';
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});
// Test connection on startup
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    console.error('   Check DATABASE_URL in your .env file');
  } else {
    console.log('✅ PostgreSQL connected successfully');
  }
});
module.exports = pool;

