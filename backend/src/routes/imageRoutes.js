const express = require('express');
const router = express.Router();
const { upload, processImage } = require('../middleware/upload');
const { uploadImage, getAllImages, getImageById } = require('../controllers/imageController');

// POST /api/images
// Middleware chain: upload (multer) → processImage (sharp) → uploadImage (save to DB)
router.post('/', upload.single('image'), processImage, uploadImage);

// GET /api/images
router.get('/', getAllImages);

// GET /api/images/:id
router.get('/:id', getImageById);

module.exports = router;