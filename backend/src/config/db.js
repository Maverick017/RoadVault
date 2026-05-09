// backend/src/config/db.js

require('dotenv').config()
const { Pool } = require('pg')

// Neon (production) gives a single DATABASE_URL string
// Local development uses individual variables from .env
// This checks which one exists and uses the right format automatically
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // required by Neon's cloud PostgreSQL
      }
    : {
        host:     process.env.DB_HOST,
        port:     process.env.DB_PORT,
        database: process.env.DB_NAME,
        user:     process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      }
)

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message)
  } else {
    console.log('✅ Connected to PostgreSQL database')
    release()
  }
})

module.exports = pool