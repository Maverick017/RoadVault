// frontend/src/pages/Gallery.jsx

import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useImages } from '../hooks/useImages'
import ImageCard from '../components/ImageCard'

// How many images per page
const PAGE_SIZE = 12

export default function Gallery() {
  const [page,        setPage]        = useState(1)
  const [searchInput, setSearchInput] = useState('')  // what's typed in the box
  const [activeSearch, setActiveSearch] = useState('') // what's actually being searched

  // Hook re-fetches automatically whenever page or activeSearch changes
  const { images, pagination, loading, error, refetch } = useImages({
    page,
    limit: PAGE_SIZE,
    search: activeSearch,
  })

  // When user submits the search form
  const handleSearch = useCallback((e) => {
    e.preventDefault()           // prevent page reload
    setPage(1)                   // always reset to page 1 on new search
    setActiveSearch(searchInput.trim())
  }, [searchInput])

  // Clear search and go back to full gallery
  const handleClearSearch = useCallback(() => {
    setSearchInput('')
    setActiveSearch('')
    setPage(1)
  }, [])

  const handlePageChange = (newPage) => {
    setPage(newPage)
    // Scroll back to top of gallery smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main style={{
      minHeight: '100vh',
      paddingTop: 'calc(var(--nav-height) + var(--space-2xl))',
      paddingBottom: 'var(--space-3xl)',
    }}>
      <div className="container">

        {/* ── Header ── */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-xl)',
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
              {loading
                ? 'Loading...'
                : pagination
                  ? `${pagination.totalImages} road photo${pagination.totalImages !== 1 ? 's' : ''}${activeSearch ? ` matching "${activeSearch}"` : ''}`
                  : ''}
            </p>
          </div>
          <Link to="/upload" className="btn btn-primary">+ Submit photo</Link>
        </div>

        {/* ── Search bar ── */}
        <form
          onSubmit={handleSearch}
          style={{
            display: 'flex',
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-xl)',
            maxWidth: '560px',
          }}
        >
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search by location — city, road name, area..."
            style={{
              flex: 1,
              padding: '12px var(--space-md)',
              border: '1.5px solid var(--paper-mid)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              background: 'var(--white)',
              color: 'var(--ink)',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e  => e.target.style.borderColor = 'var(--paper-mid)'}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '12px 20px', whiteSpace: 'nowrap' }}>
            Search
          </button>
          {/* Show clear button only when a search is active */}
          {activeSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="btn btn-outline"
              style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}
            >
              Clear
            </button>
          )}
        </form>

        {/* Active search indicator */}
        {activeSearch && !loading && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--paper-warm)',
            border: '1px solid var(--paper-mid)',
            borderRadius: '100px',
            padding: '6px 14px',
            fontSize: '13px',
            color: 'var(--ink-soft)',
            marginBottom: 'var(--space-lg)',
          }}>
            Showing results for: <strong>"{activeSearch}"</strong>
            <button
              onClick={handleClearSearch}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', fontSize: '14px', lineHeight: 1, padding: 0 }}
            >
              ✕
            </button>
          </div>
        )}

        {/* ── Loading ── */}
        {loading && <div className="spinner" />}

        {/* ── Error ── */}
        {error && (
          <div className="status-error" style={{ marginBottom: 'var(--space-lg)' }}>
            {error}
            <button onClick={refetch} style={{
              marginLeft: 'var(--space-md)', background: 'none', border: 'none',
              color: 'var(--danger)', textDecoration: 'underline', cursor: 'pointer', fontSize: '14px',
            }}>
              Try again
            </button>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && images.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-3xl) var(--space-lg)',
            border: '1px dashed var(--paper-mid)',
            borderRadius: 'var(--radius-lg)',
          }}>
            <p style={{ fontSize: '40px', marginBottom: 'var(--space-md)' }}>
              {activeSearch ? '🔍' : '🛣️'}
            </p>
            <h3 style={{
              fontFamily: 'var(--font-head)', fontSize: '24px',
              fontWeight: 700, marginBottom: 'var(--space-sm)',
            }}>
              {activeSearch ? `No results for "${activeSearch}"` : 'The archive is empty'}
            </h3>
            <p style={{ color: 'var(--ink-muted)', marginBottom: 'var(--space-lg)' }}>
              {activeSearch
                ? 'Try a different location name or clear the search.'
                : 'Be the first to submit a road photo.'}
            </p>
            {activeSearch
              ? <button onClick={handleClearSearch} className="btn btn-outline">Clear search</button>
              : <Link to="/upload" className="btn btn-primary">Submit now →</Link>
            }
          </div>
        )}

        {/* ── Image grid ── */}
        {!loading && images.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-lg)',
          }}>
            {images.map(image => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && pagination && pagination.totalPages > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-sm)',
            marginTop: 'var(--space-2xl)',
            flexWrap: 'wrap',
          }}>

            {/* Previous button */}
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={!pagination.hasPrevPage}
              style={{
                padding: '10px 20px',
                border: '1.5px solid var(--paper-mid)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--white)',
                color: pagination.hasPrevPage ? 'var(--ink)' : 'var(--ink-muted)',
                cursor: pagination.hasPrevPage ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-head)',
                fontWeight: 600,
                fontSize: '14px',
                transition: 'all 0.15s',
              }}
            >
              ← Prev
            </button>

            {/* Page number buttons */}
            {buildPageNumbers(pagination.currentPage, pagination.totalPages).map((item, idx) =>
              item === '...' ? (
                <span key={`ellipsis-${idx}`} style={{
                  padding: '10px 6px', color: 'var(--ink-muted)', fontSize: '14px',
                }}>
                  …
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => handlePageChange(item)}
                  style={{
                    width: 40, height: 40,
                    border: item === page ? '2px solid var(--accent)' : '1.5px solid var(--paper-mid)',
                    borderRadius: 'var(--radius-sm)',
                    background: item === page ? 'var(--accent)' : 'var(--white)',
                    color: item === page ? '#fff' : 'var(--ink)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-head)',
                    fontWeight: 600,
                    fontSize: '14px',
                    transition: 'all 0.15s',
                  }}
                >
                  {item}
                </button>
              )
            )}

            {/* Next button */}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={!pagination.hasNextPage}
              style={{
                padding: '10px 20px',
                border: '1.5px solid var(--paper-mid)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--white)',
                color: pagination.hasNextPage ? 'var(--ink)' : 'var(--ink-muted)',
                cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-head)',
                fontWeight: 600,
                fontSize: '14px',
                transition: 'all 0.15s',
              }}
            >
              Next →
            </button>
          </div>
        )}

        {/* Page info text */}
        {!loading && pagination && pagination.totalPages > 1 && (
          <p style={{
            textAlign: 'center',
            fontSize: '13px',
            color: 'var(--ink-muted)',
            marginTop: 'var(--space-md)',
          }}>
            Page {pagination.currentPage} of {pagination.totalPages}
            &nbsp;·&nbsp; {pagination.totalImages} total photos
          </p>
        )}

      </div>
    </main>
  )
}

// Builds the page number array with ellipsis for large page counts
// e.g. for page 5 of 20: [1, '...', 4, 5, 6, '...', 20]
function buildPageNumbers(current, total) {
  if (total <= 7) {
    // Few enough pages — show all of them
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages = []

  // Always show first page
  pages.push(1)

  // Left ellipsis — only if current page is far from start
  if (current > 3) pages.push('...')

  // Pages around current
  const start = Math.max(2, current - 1)
  const end   = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  // Right ellipsis — only if current page is far from end
  if (current < total - 2) pages.push('...')

  // Always show last page
  pages.push(total)

  return pages
}