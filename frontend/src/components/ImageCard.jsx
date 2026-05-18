// frontend/src/components/ImageCard.jsx

import { useState } from 'react'

export default function ImageCard({ image, onClick, selectMode, selected, onSelect }) {
  const [loaded, setLoaded] = useState(false)

  const formattedDate = new Date(image.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const handleClick = () => {
    if (selectMode) {
      // In select mode clicking card toggles the checkbox
      onSelect(image.id)
    } else {
      // Normal mode — open lightbox
      onClick()
    }
  }

  return (
    <article
      onClick={handleClick}
      style={{
        background:   'var(--white)',
        borderRadius: 'var(--radius-md)',
        overflow:     'hidden',
        border:       selected
          ? '2px solid var(--accent)'
          : '1px solid var(--paper-mid)',
        transition:   'transform 0.25s ease, box-shadow 0.25s ease',
        cursor:       'pointer',
        position:     'relative',
        // Slight scale when selected
        transform:    selected ? 'scale(0.97)' : 'scale(1)',
      }}
      onMouseEnter={e => {
        if (!selected) {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(15,14,13,0.1)'
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      {/* Checkbox — only visible in select mode */}
      {selectMode && (
        <div style={{
          position:        'absolute',
          top:             10,
          left:            10,
          zIndex:          10,
          width:           24,
          height:          24,
          borderRadius:    '6px',
          background:      selected ? 'var(--accent)' : 'rgba(255,255,255,0.9)',
          border:          selected ? '2px solid var(--accent)' : '2px solid var(--paper-mid)',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          color:           '#fff',
          fontSize:        '14px',
          fontWeight:      700,
          backdropFilter:  'blur(4px)',
          transition:      'all 0.15s',
        }}>
          {selected ? '✓' : ''}
        </div>
      )}

      {/* Image area */}
      <div style={{
        position:     'relative',
        paddingBottom: '100%', // 1:1 square ratio for 600×600 images
        background:   'var(--paper-warm)',
        overflow:     'hidden',
      }}>
        {/* Skeleton shimmer */}
        {!loaded && (
          <div style={{
            position:   'absolute',
            inset:      0,
            background: 'linear-gradient(90deg, var(--paper-warm) 25%, var(--paper-mid) 50%, var(--paper-warm) 75%)',
            backgroundSize: '200% 100%',
            animation:  'shimmer 1.5s infinite',
          }} />
        )}

        <img
          src={image.file_url}
          alt={image.address || 'Road photo'}
          onLoad={() => setLoaded(true)}
          style={{
            position:   'absolute',
            inset:      0,
            width:      '100%',
            height:     '100%',
            objectFit:  'cover',
            opacity:    loaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      </div>

      {/* Info */}
      <div style={{ padding: 'var(--space-md)' }}>
        <p style={{
          fontFamily:     'var(--font-head)',
          fontWeight:     600,
          fontSize:       '15px',
          color:          'var(--ink)',
          marginBottom:   'var(--space-xs)',
          whiteSpace:     'nowrap',
          overflow:       'hidden',
          textOverflow:   'ellipsis',
        }}>
          {image.address || 'No address provided'}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
          {formattedDate}
        </p>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </article>
  )
}