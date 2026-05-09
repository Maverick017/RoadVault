// backend/src/controllers/imageController.js

const pool = require('../config/db')

// POST /api/images
const uploadImage = async (req, res) => {
  try {
    if (!req.processedFile) {
      return res.status(400).json({ error: 'No image file provided' })
    }

    const { address } = req.body
    const { filename, url, width, height, size, originalName } = req.processedFile

    // url is now a full Cloudinary HTTPS URL, not a local path
    const result = await pool.query(
      `INSERT INTO images
        (original_filename, stored_filename, file_url, address, width, height, file_size)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [originalName, filename, url, address || null, width, height, size]
    )

    res.status(201).json({
      message: 'Image uploaded successfully',
      image:   result.rows[0],
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Failed to upload image' })
  }
}

// GET /api/images — pagination + search (unchanged)
const getAllImages = async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page)  || 1)
    const limit  = Math.min(48, parseInt(req.query.limit) || 12)
    const search = (req.query.search || '').trim()
    const offset = (page - 1) * limit

    let countQuery, dataQuery, params

    if (search) {
      countQuery = `SELECT COUNT(*) FROM images WHERE address ILIKE $1`
      dataQuery  = `
        SELECT * FROM images
        WHERE address ILIKE $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `
      params = [`%${search}%`, limit, offset]
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
        currentPage: page,
        totalPages,
        totalImages,
        limit,
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

// GET /api/images/:id
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

module.exports = { uploadImage, getAllImages, getImageById }