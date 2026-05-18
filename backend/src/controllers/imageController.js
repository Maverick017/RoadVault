// backend/src/controllers/imageController.js

const pool       = require('../config/db')
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// POST /api/images — upload
const uploadImage = async (req, res) => {
  try {
    if (!req.processedFile) {
      return res.status(400).json({ error: 'No image file provided' })
    }
    const { address } = req.body
    const { filename, url, width, height, size, originalName } = req.processedFile

    const result = await pool.query(
      `INSERT INTO images
        (original_filename, stored_filename, file_url, address, width, height, file_size)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [originalName, filename, url, address || null, width, height, size]
    )
    res.status(201).json({ message: 'Image uploaded successfully', image: result.rows[0] })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Failed to upload image' })
  }
}

// GET /api/images — fetch all with pagination + search
const getAllImages = async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page)  || 1)
    const limit  = Math.min(48, parseInt(req.query.limit) || 12)
    const search = (req.query.search || '').trim()
    const offset = (page - 1) * limit

    let countQuery, dataQuery, params

    if (search) {
      countQuery = `SELECT COUNT(*) FROM images WHERE address ILIKE $1`
      dataQuery  = `SELECT * FROM images WHERE address ILIKE $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`
      params     = [`%${search}%`, limit, offset]
    } else {
      countQuery = `SELECT COUNT(*) FROM images`
      dataQuery  = `SELECT * FROM images ORDER BY created_at DESC LIMIT $1 OFFSET $2`
      params     = [limit, offset]
    }

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, search ? [`%${search}%`] : []),
      pool.query(dataQuery, params),
    ])

    const totalImages = parseInt(countResult.rows[0].count)
    const totalPages  = Math.ceil(totalImages / limit)

    res.status(200).json({
      images: dataResult.rows,
      pagination: {
        currentPage: page, totalPages, totalImages, limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      search: search || null,
    })
  } catch (error) {
    console.error('Fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch images' })
  }
}

// GET /api/images/:id — fetch single
const getImageById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM images WHERE id = $1', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' })
    }
    res.status(200).json({ image: result.rows[0] })
  } catch (error) {
    console.error('Fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch image' })
  }
}

// DELETE /api/images — delete one or multiple images
// Body: { ids: ['uuid1', 'uuid2', ...] }
const deleteImages = async (req, res) => {
  try {
    const { ids } = req.body

    // Validate input
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Provide an array of image IDs to delete' })
    }

    // Fetch all matching rows from DB first
    // $1, $2, $3... placeholders built dynamically for any number of IDs
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ')
    const findResult   = await pool.query(
      `SELECT id, stored_filename FROM images WHERE id IN (${placeholders})`,
      ids
    )

    if (findResult.rows.length === 0) {
      return res.status(404).json({ error: 'No matching images found' })
    }

    const found = findResult.rows

    // Delete all found images from Cloudinary in parallel
    await Promise.all(
      found.map(img =>
        cloudinary.uploader.destroy(img.stored_filename, { resource_type: 'image' })
          .catch(err => console.warn('Cloudinary delete warning:', err.message))
      )
    )

    // Delete all rows from Neon in one query
    const deleteResult = await pool.query(
      `DELETE FROM images WHERE id IN (${placeholders}) RETURNING id`,
      ids
    )

    res.status(200).json({
      message: `${deleteResult.rows.length} image(s) deleted successfully`,
      deleted: deleteResult.rows.map(r => r.id),
    })
  } catch (error) {
    console.error('Delete error:', error)
    res.status(500).json({ error: 'Failed to delete images' })
  }
}

module.exports = { uploadImage, getAllImages, getImageById, deleteImages }