const pool = require('../config/db');

// POST /api/images — Upload a new image
const uploadImage = async (req, res) => {
  try {
    // Check that the image was processed successfully
    if (!req.processedFile) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Get address from the request body (optional field)
    const { address } = req.body;
    const { filename, url, width, height, size, originalName } = req.processedFile;

    // Save image metadata to the database
    // $1, $2, etc. are placeholders — pg fills them in safely (prevents SQL injection)
    const result = await pool.query(
      `INSERT INTO images 
        (original_filename, stored_filename, file_url, address, width, height, file_size)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [originalName, filename, url, address || null, width, height, size]
    );

    // Return the newly created image record
    res.status(201).json({
      message: 'Image uploaded successfully',
      image: result.rows[0],
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

// GET /api/images — Fetch all images for the gallery
const getAllImages = async (req, res) => {
  try {
    // Fetch all images, newest first
    const result = await pool.query(
      'SELECT * FROM images ORDER BY created_at DESC'
    );

    res.status(200).json({
      count: result.rows.length,
      images: result.rows,
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

// GET /api/images/:id — Fetch a single image by ID
const getImageById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM images WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.status(200).json({ image: result.rows[0] });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
};

module.exports = { uploadImage, getAllImages, getImageById };