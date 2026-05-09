// backend/src/middleware/upload.js

const multer     = require('multer')
const sharp      = require('sharp')
const cloudinary = require('cloudinary').v2
const { v4: uuidv4 } = require('uuid')

// Configure Cloudinary using values from .env
// This runs once when the server starts
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Multer stores the incoming file in memory as a Buffer
// We never write to disk at all anymore — Sharp processes in memory,
// then sends the result directly to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed (JPEG, PNG, WebP, GIF)'), false)
    }
  },
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024,
  },
})

// Sharp + Cloudinary middleware
// Runs after multer places the raw file in req.file.buffer
const processImage = async (req, res, next) => {
  if (!req.file) return next()

  try {
    // Step 1 — Sharp processes the raw buffer
    // Resize and crop to exactly 600×600, convert to WebP
    const processedBuffer = await sharp(req.file.buffer)
      .resize(600, 600, {
        fit:      'cover',   // fills 600×600, crops overflow from center
        position: 'centre',
      })
      .webp({ quality: 85 })
      .toBuffer() // returns a Buffer instead of writing to disk

    // Step 2 — Upload the processed buffer to Cloudinary
    // We wrap it in a Promise because Cloudinary's upload_stream uses callbacks
    const cloudinaryResult = await new Promise((resolve, reject) => {
      const uniquePublicId = `roadvault/${uuidv4()}` // folder/filename in Cloudinary

      // upload_stream accepts a Buffer via .end()
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id:     uniquePublicId,
          resource_type: 'image',
          format:        'webp',       // force WebP storage on Cloudinary too
          overwrite:     false,
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )

      // Feed the Sharp-processed buffer into the Cloudinary stream
      stream.end(processedBuffer)
    })

    // Step 3 — Attach the Cloudinary result to the request
    // cloudinaryResult.secure_url is the permanent HTTPS URL
    // e.g. https://res.cloudinary.com/yourcloud/image/upload/v123/roadvault/abc.webp
    req.processedFile = {
      filename:     cloudinaryResult.public_id,
      url:          cloudinaryResult.secure_url, // permanent CDN URL
      width:        cloudinaryResult.width,      // always 600
      height:       cloudinaryResult.height,     // always 600
      size:         cloudinaryResult.bytes,
      originalName: req.file.originalname,
    }

    next()
  } catch (error) {
    console.error('Image processing error:', error)
    next(error)
  }
}

module.exports = { upload, processImage }