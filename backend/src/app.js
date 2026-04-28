require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const imageRoutes = require('./routes/imageRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---

// Helmet adds security headers automatically
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow frontend to load images
}));

// CORS — allow requests from the React frontend (port 5173 is Vite's default)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

// Parse incoming JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
// A request to /uploads/filename.webp will return the file from disk
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- Routes ---
app.use('/api/images', imageRoutes);

// Health check endpoint — useful for testing if server is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PixelVault API is running' });
});

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});