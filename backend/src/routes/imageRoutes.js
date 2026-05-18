// backend/src/routes/imageRoutes.js

const express = require('express')
const router  = express.Router()
const { upload, processImage }                              = require('../middleware/upload')
const { uploadImage, getAllImages, getImageById, deleteImages } = require('../controllers/imageController')

router.post('/',        upload.single('image'), processImage, uploadImage)
router.get('/',         getAllImages)
router.get('/:id',      getImageById)
router.delete('/',      deleteImages)   // DELETE /api/images  body: { ids: [...] }

module.exports = router