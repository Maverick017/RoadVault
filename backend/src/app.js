// backend/src/app.js

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')

const imageRoutes = require('./routes/imageRoutes')

const app = express()
const PORT = process.env.PORT || 5000

// --- Security middleware ---
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}))

// --- Body parsing ---
// Limit JSON body size to 1mb (images come via multipart, not JSON)
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// --- Static files ---
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// --- Routes ---
app.use('/api/images', imageRoutes)

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PixelVault API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
})

// --- 404 handler (no route matched) ---
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` })
})

// --- Global error handler ---
// Express recognizes a 4-argument function as an error handler automatically
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message)

  // Multer-specific errors (file too large, wrong type)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' })
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Unexpected field name. Use "image" as the field name.' })
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    // Only show stack trace in development — never expose internals in production
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// --- Start ---
app.listen(PORT, () => {
  console.log(`🚀 PixelVault API running on http://localhost:${PORT}`)
  console.log(`📁 Environment: ${process.env.NODE_ENV}`)
})