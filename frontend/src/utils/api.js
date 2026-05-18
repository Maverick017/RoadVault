// frontend/src/utils/api.js

import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

const api = axios.create({ baseURL, timeout: 30000 })

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

// Delete one or multiple images
// ids is always an array e.g. ['uuid1'] or ['uuid1','uuid2','uuid3']
export const deleteImages = async (ids) => {
  const response = await api.delete('/images', { data: { ids } })
  return response.data
}

export const pingBackend = async () => {
  try { await api.get('/health') } catch { /* silent */ }
}