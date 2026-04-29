// frontend/src/components/ImageCard.jsx

import { useState } from 'react'

export default function ImageCard({ image }) {
  // Track whether the image has loaded yet
  // Show a placeholder skeleton while it loads
  const [loaded, setLoaded] = useState(false)

  // Format the date nicely: "April 29, 2026"
  const formattedDate = new Date(image.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article style={{
      background: 'var(--white)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--paper-mid)',
      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      cursor: 'pointer',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 12px 32px rgba(15,14,13,0.1)'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = 'none'
    }}
    >
      {/* Image container with fixed aspect ratio */}
      <div style={{
        position: 'relative',
        paddingBottom: '66%', // 3:2 aspect ratio
        background: 'var(--paper-warm)',
        overflow: 'hidden',
      }}>
        {/* Skeleton shimmer shown while image loads */}
        {!loaded && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, var(--paper-warm) 25%, var(--paper-mid) 50%, var(--paper-warm) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }} />
        )}

        <img
          src={image.file_url}
          alt={image.address || 'Contributed photo'}
          onLoad={() => setLoaded(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Image dimensions badge */}
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: 'rgba(15,14,13,0.65)',
          color: '#fff',
          fontSize: '11px',
          padding: '3px 8px',
          borderRadius: '4px',
          fontFamily: 'var(--font-head)',
          backdropFilter: 'blur(4px)',
        }}>
          {image.width}×{image.height}
        </div>
      </div>

      {/* Card info section */}
      <div style={{ padding: 'var(--space-md)' }}>
        {/* Address — show placeholder if none provided */}
        <p style={{
          fontFamily: 'var(--font-head)',
          fontWeight: 600,
          fontSize: '15px',
          color: 'var(--ink)',
          marginBottom: 'var(--space-xs)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis', // Truncate long addresses with "..."
        }}>
          {image.address || 'No address provided'}
        </p>

        <p style={{
          fontSize: '12px',
          color: 'var(--ink-muted)',
        }}>
          {formattedDate}
        </p>
      </div>

      {/* Shimmer animation keyframe */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </article>
  )
}