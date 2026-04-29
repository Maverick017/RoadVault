// frontend/src/pages/Gallery.jsx

import { Link } from 'react-router-dom'
import { useImages } from '../hooks/useImages'
import ImageCard from '../components/ImageCard'

export default function Gallery() {
  const { images, loading, error, refetch } = useImages()

  return (
    <main style={{
      minHeight: '100vh',
      paddingTop: 'calc(var(--nav-height) + var(--space-2xl))',
      paddingBottom: 'var(--space-3xl)',
    }}>
      <div className="container">

        {/* Header row */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-2xl)',
        }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-head)',
              fontSize: 'clamp(36px, 6vw, 56px)',
              fontWeight: 800,
              letterSpacing: '-2px',
              marginBottom: 'var(--space-xs)',
            }}>
              The archive
            </h1>
            <p style={{ color: 'var(--ink-muted)', fontSize: '16px' }}>
              {loading ? 'Loading...' : `${images.length} photo${images.length !== 1 ? 's' : ''} contributed`}
            </p>
          </div>

          <Link to="/upload" className="btn btn-primary">
            + Add yours
          </Link>
        </div>

        {/* Loading state */}
        {loading && <div className="spinner" />}

        {/* Error state */}
        {error && (
          <div className="status-error" style={{ marginBottom: 'var(--space-lg)' }}>
            {error}
            <button
              onClick={refetch}
              style={{
                marginLeft: 'var(--space-md)',
                background: 'none',
                border: 'none',
                color: 'var(--danger)',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && images.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-3xl) var(--space-lg)',
            border: '1px dashed var(--paper-mid)',
            borderRadius: 'var(--radius-lg)',
          }}>
            <p style={{ fontSize: '40px', marginBottom: 'var(--space-md)' }}>🌍</p>
            <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '24px', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>
              The archive is empty
            </h3>
            <p style={{ color: 'var(--ink-muted)', marginBottom: 'var(--space-lg)' }}>
              Be the first to contribute a photo.
            </p>
            <Link to="/upload" className="btn btn-primary">
              Contribute now →
            </Link>
          </div>
        )}

        {/* Image grid */}
        {!loading && images.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-lg)',
          }}>
            {images.map((image) => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}