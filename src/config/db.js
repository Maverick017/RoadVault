// Load environment variables from .env file
require('dotenv').config();

// Import the pg library's Pool class
// A "pool" manages multiple database connections efficiently
const { Pool } = require('pg');

// Create a connection pool using values from .env
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test the connection when the server starts
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Connected to PostgreSQL database');
    release(); // Return the connection back to the pool
  }
});

// Export the pool so other files can use it to query the database
module.exports = pool;