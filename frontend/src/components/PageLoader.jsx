// frontend/src/components/PageLoader.jsx

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function PageLoader() {
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    // Every time the route changes, run the progress bar animation
    setVisible(true)
    setWidth(0)

    // Jump to 80% quickly, then pause — simulates loading
    const t1 = setTimeout(() => setWidth(80), 50)
    // Complete and hide after a short delay
    const t2 = setTimeout(() => setWidth(100), 400)
    const t3 = setTimeout(() => setVisible(false), 600)

    // Cleanup: cancel timers if the component unmounts mid-animation
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [location.pathname]) // Re-run whenever the URL path changes

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      height: '3px',
      width: `${width}%`,
      background: 'var(--accent)',
      zIndex: 9999,
      transition: 'width 0.35s ease',
      borderRadius: '0 2px 2px 0',
    }} />
  )
}