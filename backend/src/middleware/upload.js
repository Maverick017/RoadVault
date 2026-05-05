// backend/src/middleware/upload.js

const multer  = require('multer')
const sharp   = require('sharp')
const path    = require('path')
const { v4: uuidv4 } = require('uuid')
const fs      = require('fs')

// Ensure uploads directory exists
const uploadDir = process.env.UPLOAD_PATH || './uploads'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Store incoming file in memory — Sharp will handle writing to disk
const storage = multer.memoryStorage()

// Only accept image file types
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, WebP, GIF)'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
})

// Sharp processing middleware
// Runs after multer places the file in memory (req.file.buffer)
const processImage = async (req, res, next) => {
  if (!req.file) return next()

  try {
    const uniqueFilename = `${uuidv4()}.webp`
    const outputPath     = path.join(uploadDir, uniqueFilename)

    // cover — resizes so the image fully covers 600×600
    //         then crops the excess from center outward
    // This guarantees exactly 600×600 every time, no exceptions
    // position 'centre' — keeps the most visually important part of the image
    const imageInfo = await sharp(req.file.buffer)
      .resize(600, 600, {
        fit:      'cover',   // fills the 600×600 box completely, crops overflow
        position: 'centre',  // crop from the center of the image
      })
      .webp({ quality: 85 })
      .toFile(outputPath)

    req.processedFile = {
      filename:     uniqueFilename,
      path:         outputPath,
      url:          `/uploads/${uniqueFilename}`,
      width:        imageInfo.width,   // will always be 600
      height:       imageInfo.height,  // will always be 600
      size:         imageInfo.size,
      originalName: req.file.originalname,
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = { upload, processImage }