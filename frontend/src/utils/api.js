// frontend/src/utils/api.js

import axios from 'axios'

// Development: Vite proxy handles /api → localhost:5000
// Production: requests go directly to Render backend
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

const api = axios.create({
  baseURL,
  timeout: 30000,
})

export const uploadImage = async (imageFile, address) => {
  const formData = new FormData()
  formData.append('image', imageFile)
  formData.append('address', address || '')
  const response = await api.post('/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const fetchImages = async ({ page = 1, limit = 12, search = '' } = {}) => {
  const params = { page, limit }
  if (search) params.search = search
  const response = await api.get('/images', { params })
  return response.data
}

export const fetchImageById = async (id) => {
  const response = await api.get(`/images/${id}`)
  return response.data
}

// Wakes up Render's free tier server on first page load
// Render sleeps after 15 min of inactivity — this fires immediately
// so the server is warm by the time the user clicks anything
export const pingBackend = async () => {
  try {
    await api.get('/health')
  } catch {
    // silent — this is just a warm-up call
  }
}