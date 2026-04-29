// frontend/src/utils/api.js

import axios from 'axios'

// Create an axios instance with shared config
// baseURL means every call automatically starts with /api
const api = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30 seconds — image uploads can be slow
})

// Upload a new image with address
// FormData is how you send files over HTTP — like filling an HTML form
export const uploadImage = async (imageFile, address) => {
  const formData = new FormData()
  formData.append('image', imageFile)      // 'image' must match upload.single('image') in backend
  formData.append('address', address || '')

  const response = await api.post('/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Tell the server this is a file upload
    },
  })
  return response.data
}

// Fetch all images for the gallery
export const fetchImages = async () => {
  const response = await api.get('/images')
  return response.data
}

// Fetch a single image by its ID
export const fetchImageById = async (id) => {
  const response = await api.get(`/images/${id}`)
  return response.data
}