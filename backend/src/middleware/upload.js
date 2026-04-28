const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer to store files in memory temporarily
// (sharp will then process and save them to disk)
const storage = multer.memoryStorage();

// File filter — only accept image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, WebP, GIF)'), false);
  }
};

// Create the multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
});

// Sharp processing middleware — runs AFTER multer stores file in memory
// This resizes the image and converts it to WebP format
const processImage = async (req, res, next) => {
  // If no file was uploaded, skip processing
  if (!req.file) return next();

  try {
    // Generate a unique filename to prevent collisions
    const uniqueFilename = `${uuidv4()}.webp`;
    const outputPath = path.join(uploadDir, uniqueFilename);

    // Process the image with sharp:
    // - resize to max 1200x800 (maintains aspect ratio, never upscales)
    // - convert to WebP format (modern, smaller file size)
    // - quality 85 (good balance of quality vs file size)
    const imageInfo = await sharp(req.file.buffer)
      .resize(1200, 800, {
        fit: 'inside',        // Maintain aspect ratio
        withoutEnlargement: true, // Don't upscale small images
      })
      .webp({ quality: 85 })
      .toFile(outputPath);

    // Attach processed file info to the request for the controller to use
    req.processedFile = {
      filename: uniqueFilename,
      path: outputPath,
      url: `/uploads/${uniqueFilename}`,
      width: imageInfo.width,
      height: imageInfo.height,
      size: imageInfo.size,
      originalName: req.file.originalname,
    };

    next(); // Move on to the controller
  } catch (error) {
    next(error); // Pass error to Express error handler
  }
};

module.exports = { upload, processImage };