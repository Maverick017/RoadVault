// backend/src/middleware/upload.js

const multer     = require('multer')
const sharp      = require('sharp')
const cloudinary = require('cloudinary').v2
const { v4: uuidv4 } = require('uuid')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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

const processImage = async (req, res, next) => {
  if (!req.file) return next()

  try {
    // Detect the original format from mimetype
    // image/jpeg → jpeg, image/png → png, image/webp → webp, image/gif → gif
    const mimeToFormat = {
      'image/jpeg': 'jpeg',
      'image/jpg':  'jpeg',
      'image/png':  'png',
      'image/webp': 'webp',
      'image/gif':  'gif',
    }

    const format = mimeToFormat[req.file.mimetype] || 'jpeg'

    // Resize to exactly 600×600 keeping original format
    // toFormat() preserves the original — no forced WebP conversion
    const processedBuffer = await sharp(req.file.buffer)
      .resize(600, 600, {
        fit:      'cover',
        position: 'centre',
      })
      .toFormat(format, { quality: 90 })
      .toBuffer()

    // Upload to Cloudinary preserving the original format
    const cloudinaryResult = await new Promise((resolve, reject) => {
      const uniquePublicId = `roadvault/${uuidv4()}`

      const stream = cloudinary.uploader.upload_stream(
        {
          public_id:     uniquePublicId,
          resource_type: 'image',
          format:        format,   // tell Cloudinary to store in original format
          overwrite:     false,
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )

      stream.end(processedBuffer)
    })

    req.processedFile = {
      filename:     cloudinaryResult.public_id,
      url:          cloudinaryResult.secure_url,
      width:        cloudinaryResult.width,
      height:       cloudinaryResult.height,
      size:         cloudinaryResult.bytes,
      originalName: req.file.originalname,
      format:       format,
    }

    next()
  } catch (error) {
    console.error('Image processing error:', error)
    next(error)
  }
}

module.exports = { upload, processImage }