// backend/src/app.js

require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const helmet  = require('helmet')
const path    = require('path')

const imageRoutes = require('./routes/imageRoutes')

const app  = express()
const PORT = process.env.PORT || 5000

// --- Security ---
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

// CORS:
// Development → allow localhost Vite dev server
// Production  → allow only your Vercel frontend URL
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:5173', 'http://localhost:3000'],
  methods:      ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}))

// --- Body parsing ---
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// --- Static files (local dev only) ---
// In production images are on Cloudinary, not the local disk
// This line does no harm in production — the uploads/ folder is just empty
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// --- Routes ---
app.use('/api/images', imageRoutes)

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({
    status:      'ok',
    message:     'RoadVault API is running',
    timestamp:   new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
})

// --- 404 ---
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` })
})

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message)

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' })
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Unexpected field. Use "image" as the field name.' })
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// --- Start ---
app.listen(PORT, () => {
  console.log(`🚀 RoadVault API running on http://localhost:${PORT}`)
  console.log(`📁 Environment: ${process.env.NODE_ENV}`)
})