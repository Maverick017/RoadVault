// frontend/src/utils/api.js

import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

// Upload image — unchanged
export const uploadImage = async (imageFile, address) => {
  const formData = new FormData()
  formData.append('image', imageFile)
  formData.append('address', address || '')
  const response = await api.post('/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

// Fetch images — now accepts page, limit, search
// These become URL query params: /api/images?page=1&limit=12&search=dhaka
export const fetchImages = async ({ page = 1, limit = 12, search = '' } = {}) => {
  const params = { page, limit }
  if (search) params.search = search
  const response = await api.get('/images', { params })
  return response.data
}

// Fetch single image — unchanged
export const fetchImageById = async (id) => {
  const response = await api.get(`/images/${id}`)
  return response.data
}