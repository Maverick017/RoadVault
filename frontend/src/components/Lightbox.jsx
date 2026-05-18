// frontend/src/components/Lightbox.jsx

import { useEffect, useCallback } from 'react'

export default function Lightbox({ images, currentIndex, onClose, onPrev, onNext }) {
  const image = images[currentIndex]

  // Close on ESC key, navigate with arrow keys
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape')     onClose()
    if (e.key === 'ArrowLeft')  onPrev()
    if (e.key === 'ArrowRight') onNext()
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    // Attach keyboard listener when lightbox opens
    document.addEventListener('keydown', handleKey)
    // Prevent background scrolling while lightbox is open
    document.body.style.overflow = 'hidden'

    return () => {
      // Clean up when lightbox closes
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (!image) return null

  const formattedDate = new Date(image.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    // Backdrop — clicking outside the image closes the lightbox
    <div
      onClick={onClose}
      style={{
        position:        'fixed',
        inset:           0,
        zIndex:          1000,
        background:      'rgba(15, 14, 13, 0.92)',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        padding:         '20px',
        backdropFilter:  'blur(6px)',
      }}
    >
      {/* Content box — stop clicks from bubbling to backdrop */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position:      'relative',
          maxWidth:      '900px',
          width:         '100%',
          background:    'var(--white)',
          borderRadius:  'var(--radius-lg)',
          overflow:      'hidden',
          display:       'flex',
          flexDirection: 'column',
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', background: '#000' }}>
          <img
            src={image.file_url}
            alt={image.address || 'Road photo'}
            style={{
              width:      '100%',
              maxHeight:  '70vh',
              objectFit:  'contain',  // contain so full image is always visible
              display:    'block',
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position:       'absolute',
              top:            12,
              right:          12,
              background:     'rgba(15,14,13,0.7)',
              color:          '#fff',
              border:         'none',
              borderRadius:   '50%',
              width:          36,
              height:         36,
              cursor:         'pointer',
              fontSize:       '18px',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)',
              zIndex:         10,
            }}
          >
            ✕
          </button>

          {/* Image counter */}
          <div style={{
            position:       'absolute',
            top:            12,
            left:           12,
            background:     'rgba(15,14,13,0.65)',
            color:          '#fff',
            fontSize:       '12px',
            padding:        '4px 10px',
            borderRadius:   '100px',
            fontFamily:     'var(--font-head)',
            backdropFilter: 'blur(4px)',
          }}>
            {currentIndex + 1} / {images.length}
          </div>

          {/* Prev button */}
          {currentIndex > 0 && (
            <button
              onClick={onPrev}
              style={{
                position:       'absolute',
                left:           12,
                top:            '50%',
                transform:      'translateY(-50%)',
                background:     'rgba(15,14,13,0.7)',
                color:          '#fff',
                border:         'none',
                borderRadius:   '50%',
                width:          40,
                height:         40,
                cursor:         'pointer',
                fontSize:       '18px',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)',
              }}
            >
              ←
            </button>
          )}

          {/* Next button */}
          {currentIndex < images.length - 1 && (
            <button
              onClick={onNext}
              style={{
                position:       'absolute',
                right:          12,
                top:            '50%',
                transform:      'translateY(-50%)',
                background:     'rgba(15,14,13,0.7)',
                color:          '#fff',
                border:         'none',
                borderRadius:   '50%',
                width:          40,
                height:         40,
                cursor:         'pointer',
                fontSize:       '18px',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)',
              }}
            >
              →
            </button>
          )}
        </div>

        {/* Info panel below image */}
        <div style={{
          padding:         'var(--space-lg)',
          display:         'flex',
          justifyContent:  'space-between',
          alignItems:      'center',
          flexWrap:        'wrap',
          gap:             'var(--space-sm)',
          borderTop:       '1px solid var(--paper-mid)',
        }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 700,
              fontSize:   '16px',
              color:      'var(--ink)',
              marginBottom: 4,
            }}>
              {image.address || 'No location provided'}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
              {formattedDate} · {image.width}×{image.height}px
            </p>
          </div>

          {/* Direct image link */}
            <a
            href={image.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{ padding: '8px 18px', fontSize: '13px' }}
          >
            Open full size ↗
          </a>
        </div>
      </div>
    </div>
  )
}