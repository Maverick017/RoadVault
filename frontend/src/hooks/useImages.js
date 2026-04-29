// frontend/src/hooks/useImages.js

import { useState, useEffect } from 'react'
import { fetchImages } from '../utils/api'

// Custom hook — reusable logic for fetching images
// Any component that needs the image list just calls useImages()
export const useImages = () => {
  const [images, setImages] = useState([])      // The list of images
  const [loading, setLoading] = useState(true)  // Is data being fetched?
  const [error, setError] = useState(null)      // Any error that occurred

  const loadImages = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchImages()
      setImages(data.images || [])
    } catch (err) {
      setError('Failed to load images. Is the backend running?')
      console.error(err)
    } finally {
      setLoading(false) // Always stop the loading spinner, success or fail
    }
  }

  // useEffect with [] runs loadImages once when the component first mounts
  useEffect(() => {
    loadImages()
  }, [])

  // Return everything the component needs, plus a refetch function
  return { images, loading, error, refetch: loadImages }
}