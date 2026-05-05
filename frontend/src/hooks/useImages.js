// frontend/src/hooks/useImages.js

import { useState, useEffect, useCallback } from 'react'
import { fetchImages } from '../utils/api'

export const useImages = ({ page = 1, limit = 12, search = '' } = {}) => {
  const [images,     setImages]     = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  const loadImages = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchImages({ page, limit, search })
      setImages(data.images     || [])
      setPagination(data.pagination || null)
    } catch (err) {
      setError('Failed to load images. Is the backend running?')
      console.error(err)
    } finally {
      setLoading(false)
    }
  // Re-fetch whenever page, limit, or search changes
  }, [page, limit, search])

  useEffect(() => {
    loadImages()
  }, [loadImages])

  return { images, pagination, loading, error, refetch: loadImages }
}