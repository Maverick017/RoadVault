// frontend/src/pages/Gallery.jsx

import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useImages } from '../hooks/useImages'
import ImageCard from '../components/ImageCard'
import Lightbox from '../components/Lightbox'
import { deleteImages } from '../utils/api'

const PAGE_SIZE = 12

export default function Gallery() {
  const [page,          setPage]          = useState(1)
  const [searchInput,   setSearchInput]   = useState('')
  const [activeSearch,  setActiveSearch]  = useState('')

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState(null) // null = closed

  // Select/delete state
  const [selectMode,    setSelectMode]    = useState(false)
  const [selectedIds,   setSelectedIds]   = useState(new Set())
  const [deleting,      setDeleting]      = useState(false)
  const [deleteError,   setDeleteError]   = useState(null)

  const { images, pagination, loading, error, refetch } = useImages({
    page, limit: PAGE_SIZE, search: activeSearch,
  })

  // ── Search ──────────────────────────────────────────────────
  const handleSearch = useCallback((e) => {
    e.preventDefault()
    setPage(1)
    setActiveSearch(searchInput.trim())
  }, [searchInput])

  const handleClearSearch = useCallback(() => {
    setSearchInput(''); setActiveSearch(''); setPage(1)
  }, [])

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Lightbox ────────────────────────────────────────────────
  const openLightbox  = (index) => setLightboxIndex(index)
  const closeLightbox = ()      => setLightboxIndex(null)
  const prevImage     = ()      => setLightboxIndex(i => Math.max(0, i - 1))
  const nextImage     = ()      => setLightboxIndex(i => Math.min(images.length - 1, i + 1))

  // ── Select mode ─────────────────────────────────────────────
  const toggleSelectMode = () => {
    setSelectMode(prev => !prev)
    setSelectedIds(new Set()) // clear selection when toggling
    setDeleteError(null)
  }

  const toggleSelectId = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    setSelectedIds(new Set(images.map(img => img.id)))
  }

  const clearSelection = () => setSelectedIds(new Set())

  // ── Delete ──────────────────────────────────────────────────
  const handleDelete = async () => {
    if (selectedIds.size === 0) return

    const confirmed = window.confirm(
      `Permanently delete ${selectedIds.size} image(s)?\nThis cannot be undone.`
    )
    if (!confirmed) return

    try {
      setDeleting(true)
      setDeleteError(null)
      await deleteImages([...selectedIds])
      setSelectedIds(new Set())
      setSelectMode(false)
      refetch() // refresh gallery after deletion
    } catch (err) {
      setDeleteError('Delete failed. Please try again.')
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <main style={{
      minHeight:     '100vh',
      paddingTop:    'calc(var(--nav-height) + var(--space-2xl))',
      paddingBottom: 'var(--space-3xl)',
    }}>
      <div className="container">

        {/* ── Header ── */}
        <div style={{
          display:        'flex',
          alignItems:     'flex-end',
          justifyContent: 'space-between',
          flexWrap:       'wrap',
          gap:            'var(--space-md)',
          marginBottom:   'var(--space-xl)',
        }}>
          <div>
            <h1 style={{
              fontFamily:   'var(--font-head)',
              fontSize:     'clamp(36px, 6vw, 56px)',
              fontWeight:   800,
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

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
            {/* Select / Cancel button */}
            <button
              onClick={toggleSelectMode}
              className="btn btn-outline"
              style={{ padding: '10px 20px', fontSize: '14px' }}
            >
              {selectMode ? 'Cancel' : 'Select'}
            </button>

            {/* Delete button — only visible in select mode */}
            {selectMode && (
              <button
                onClick={handleDelete}
                disabled={selectedIds.size === 0 || deleting}
                style={{
                  padding:      '10px 20px',
                  fontSize:     '14px',
                  fontFamily:   'var(--font-head)',
                  fontWeight:   600,
                  border:       '2px solid var(--danger)',
                  borderRadius: 'var(--radius-sm)',
                  background:   selectedIds.size > 0 ? 'var(--danger)' : 'transparent',
                  color:        selectedIds.size > 0 ? '#fff' : 'var(--danger)',
                  cursor:       selectedIds.size > 0 ? 'pointer' : 'not-allowed',
                  opacity:      deleting ? 0.6 : 1,
                  transition:   'all 0.2s',
                }}
              >
                {deleting
                  ? 'Deleting...'
                  : `Delete${selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}`
                }
              </button>
            )}

            {!selectMode && (
              <Link to="/upload" className="btn btn-primary">
                + Submit photo
              </Link>
            )}
          </div>
        </div>

        {/* Select mode toolbar */}
        {selectMode && (
          <div style={{
            display:        'flex',
            alignItems:     'center',
            gap:            'var(--space-md)',
            background:     'var(--paper-warm)',
            border:         '1px solid var(--paper-mid)',
            borderRadius:   'var(--radius-sm)',
            padding:        '10px var(--space-lg)',
            marginBottom:   'var(--space-lg)',
            flexWrap:       'wrap',
          }}>
            <span style={{ fontSize: '14px', color: 'var(--ink-soft)', fontFamily: 'var(--font-head)', fontWeight: 600 }}>
              {selectedIds.size} selected
            </span>
            <button
              onClick={selectAll}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '14px', fontFamily: 'var(--font-head)', fontWeight: 600 }}
            >
              Select all on page
            </button>
            {selectedIds.size > 0 && (
              <button
                onClick={clearSelection}
                style={{ background: 'none', border: 'none', color: 'var(--ink-muted)', cursor: 'pointer', fontSize: '14px' }}
              >
                Clear selection
              </button>
            )}
            <span style={{ fontSize: '13px', color: 'var(--ink-muted)', marginLeft: 'auto' }}>
              Click images to select · Click Delete to remove
            </span>
          </div>
        )}

        {/* Delete error */}
        {deleteError && (
          <div className="status-error" style={{ marginBottom: 'var(--space-lg)' }}>
            {deleteError}
          </div>
        )}

        {/* ── Search bar ── */}
        {!selectMode && (
          <form
            onSubmit={handleSearch}
            style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)', maxWidth: '560px' }}
          >
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search by location — city, road name, area..."
              style={{
                flex:         1,
                padding:      '12px var(--space-md)',
                border:       '1.5px solid var(--paper-mid)',
                borderRadius: 'var(--radius-sm)',
                fontFamily:   'var(--font-body)',
                fontSize:     '15px',
                background:   'var(--white)',
                color:        'var(--ink)',
                outline:      'none',
                transition:   'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e  => e.target.style.borderColor = 'var(--paper-mid)'}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 20px' }}>
              Search
            </button>
            {activeSearch && (
              <button type="button" onClick={handleClearSearch} className="btn btn-outline" style={{ padding: '12px 16px' }}>
                Clear
              </button>
            )}
          </form>
        )}

        {/* Active search pill */}
        {activeSearch && !loading && !selectMode && (
          <div style={{
            display:      'inline-flex',
            alignItems:   'center',
            gap:          8,
            background:   'var(--paper-warm)',
            border:       '1px solid var(--paper-mid)',
            borderRadius: '100px',
            padding:      '6px 14px',
            fontSize:     '13px',
            color:        'var(--ink-soft)',
            marginBottom: 'var(--space-lg)',
          }}>
            Showing results for: <strong>"{activeSearch}"</strong>
            <button onClick={handleClearSearch} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', fontSize: '14px', padding: 0 }}>
              ✕
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && <div className="spinner" />}

        {/* Error */}
        {error && (
          <div className="status-error" style={{ marginBottom: 'var(--space-lg)' }}>
            {error}
            <button onClick={refetch} style={{ marginLeft: 'var(--space-md)', background: 'none', border: 'none', color: 'var(--danger)', textDecoration: 'underline', cursor: 'pointer', fontSize: '14px' }}>
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && images.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--space-3xl) var(--space-lg)', border: '1px dashed var(--paper-mid)', borderRadius: 'var(--radius-lg)' }}>
            <p style={{ fontSize: '40px', marginBottom: 'var(--space-md)' }}>
              {activeSearch ? '🔍' : '🛣️'}
            </p>
            <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '24px', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>
              {activeSearch ? `No results for "${activeSearch}"` : 'The archive is empty'}
            </h3>
            <p style={{ color: 'var(--ink-muted)', marginBottom: 'var(--space-lg)' }}>
              {activeSearch ? 'Try a different location or clear the search.' : 'Be the first to submit a road photo.'}
            </p>
            {activeSearch
              ? <button onClick={handleClearSearch} className="btn btn-outline">Clear search</button>
              : <Link to="/upload" className="btn btn-primary">Submit now →</Link>
            }
          </div>
        )}

        {/* Image grid */}
        {!loading && images.length > 0 && (
          <div style={{
            display:               'grid',
            gridTemplateColumns:   'repeat(auto-fill, minmax(260px, 1fr))',
            gap:                   'var(--space-lg)',
          }}>
            {images.map((image, index) => (
              <ImageCard
                key={image.id}
                image={image}
                onClick={() => openLightbox(index)}
                selectMode={selectMode}
                selected={selectedIds.has(image.id)}
                onSelect={toggleSelectId}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && pagination && pagination.totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-sm)', marginTop: 'var(--space-2xl)', flexWrap: 'wrap' }}>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={!pagination.hasPrevPage}
              style={{ padding: '10px 20px', border: '1.5px solid var(--paper-mid)', borderRadius: 'var(--radius-sm)', background: 'var(--white)', color: pagination.hasPrevPage ? 'var(--ink)' : 'var(--ink-muted)', cursor: pagination.hasPrevPage ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '14px' }}
            >
              ← Prev
            </button>

            {buildPageNumbers(pagination.currentPage, pagination.totalPages).map((item, idx) =>
              item === '...' ? (
                <span key={`e${idx}`} style={{ padding: '10px 6px', color: 'var(--ink-muted)', fontSize: '14px' }}>…</span>
              ) : (
                <button
                  key={item}
                  onClick={() => handlePageChange(item)}
                  style={{ width: 40, height: 40, border: item === page ? '2px solid var(--accent)' : '1.5px solid var(--paper-mid)', borderRadius: 'var(--radius-sm)', background: item === page ? 'var(--accent)' : 'var(--white)', color: item === page ? '#fff' : 'var(--ink)', cursor: 'pointer', fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '14px' }}
                >
                  {item}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={!pagination.hasNextPage}
              style={{ padding: '10px 20px', border: '1.5px solid var(--paper-mid)', borderRadius: 'var(--radius-sm)', background: 'var(--white)', color: pagination.hasNextPage ? 'var(--ink)' : 'var(--ink-muted)', cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '14px' }}
            >
              Next →
            </button>
          </div>
        )}

        {!loading && pagination && pagination.totalPages > 1 && (
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--ink-muted)', marginTop: 'var(--space-md)' }}>
            Page {pagination.currentPage} of {pagination.totalPages} · {pagination.totalImages} total photos
          </p>
        )}
      </div>

      {/* ── Lightbox — rendered outside the grid so it overlays everything ── */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </main>
  )
}

function buildPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [1]
  if (current > 3) pages.push('...')
  const start = Math.max(2, current - 1)
  const end   = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
}