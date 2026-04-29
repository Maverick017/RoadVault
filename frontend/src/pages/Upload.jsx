// frontend/src/pages/Upload.jsx

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import { uploadImage } from '../utils/api'

export default function Upload() {
  const navigate = useNavigate()

  // State variables — each piece of information the page needs to track
  const [file, setFile]           = useState(null)      // The selected image file
  const [preview, setPreview]     = useState(null)      // Preview URL for display
  const [address, setAddress]     = useState('')         // Text typed in address field
  const [uploading, setUploading] = useState(false)     // Is upload in progress?
  const [error, setError]         = useState(null)      // Any error message
  const [success, setSuccess]     = useState(false)     // Did upload succeed?

  // useCallback prevents this function from being recreated on every render
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError(null)

    if (rejectedFiles.length > 0) {
      setError('File rejected. Please use JPEG, PNG, WebP, or GIF under 10MB.')
      return
    }

    const selected = acceptedFiles[0]
    setFile(selected)

    // Create a temporary URL so we can show a preview immediately
    // (This URL only exists in the browser — the file isn't uploaded yet)
    const objectUrl = URL.createObjectURL(selected)
    setPreview(objectUrl)
  }, [])

  // Configure react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'] },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,            // Only one file at a time
  })

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select an image first.')
      return
    }

    try {
      setUploading(true)
      setError(null)

      await uploadImage(file, address)

      setSuccess(true)

      // Wait 1.5 seconds then redirect to gallery
      setTimeout(() => navigate('/gallery'), 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setAddress('')
    setError(null)
    setSuccess(false)
  }

  return (
    <main style={{
      minHeight: '100vh',
      paddingTop: 'calc(var(--nav-height) + var(--space-2xl))',
      paddingBottom: 'var(--space-3xl)',
    }}>
      <div className="container" style={{ maxWidth: '640px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <h1 style={{
            fontFamily: 'var(--font-head)',
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 800,
            letterSpacing: '-2px',
            marginBottom: 'var(--space-sm)',
          }}>
            Contribute a photo
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: '16px' }}>
            Drop your image below, add a location, and it goes straight into the archive.
          </p>
        </div>

        {/* Success state */}
        {success && (
          <div className="status-success" style={{ marginBottom: 'var(--space-lg)', fontSize: '16px' }}>
            ✓ Photo uploaded successfully! Redirecting to gallery...
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="status-error" style={{ marginBottom: 'var(--space-lg)' }}>
            {error}
          </div>
        )}

        {/* ── Drop zone ── */}
        {!preview ? (
          // Show drop zone when no file is selected
          <div
            {...getRootProps()}
            style={{
              border: `2px dashed ${isDragActive ? 'var(--accent)' : 'var(--paper-mid)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-3xl) var(--space-lg)',
              textAlign: 'center',
              cursor: 'pointer',
              background: isDragActive ? 'rgba(200,80,42,0.04)' : 'var(--white)',
              transition: 'all 0.2s ease',
            }}
          >
            {/* getRootProps and getInputProps wire up all the drag/drop events automatically */}
            <input {...getInputProps()} />

            {/* Upload icon */}
            <div style={{ fontSize: '48px', marginBottom: 'var(--space-md)' }}>
              {isDragActive ? '📂' : '🖼️'}
            </div>

            <p style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 700,
              fontSize: '20px',
              color: 'var(--ink)',
              marginBottom: 'var(--space-sm)',
            }}>
              {isDragActive ? 'Drop it here!' : 'Drag & drop your photo'}
            </p>
            <p style={{ color: 'var(--ink-muted)', fontSize: '14px', marginBottom: 'var(--space-lg)' }}>
              or click to browse your files
            </p>
            <div style={{
              display: 'inline-block',
              background: 'var(--paper-warm)',
              border: '1px solid var(--paper-mid)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 20px',
              fontSize: '13px',
              color: 'var(--ink-muted)',
            }}>
              JPEG, PNG, WebP, GIF · Max 10MB
            </div>
          </div>
        ) : (
          // Show preview once file is selected
          <div style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--paper-mid)',
            background: 'var(--white)',
          }}>
            <div style={{ position: 'relative' }}>
              <img
                src={preview}
                alt="Preview"
                style={{ width: '100%', maxHeight: '360px', objectFit: 'cover', display: 'block' }}
              />
              {/* Remove button */}
              <button
                onClick={handleReset}
                style={{
                  position: 'absolute', top: 12, right: 12,
                  background: 'rgba(15,14,13,0.7)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32, height: 32,
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(4px)',
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: 'var(--space-md)' }}>
              <p style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
                {file?.name} · {(file?.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        )}

        {/* ── Address input ── */}
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-head)',
            fontWeight: 600,
            fontSize: '15px',
            marginBottom: 'var(--space-sm)',
            color: 'var(--ink)',
          }}>
            Location / Address
            <span style={{ color: 'var(--ink-muted)', fontWeight: 400, marginLeft: 6 }}>
              (optional)
            </span>
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. Agrabad, Chattogram, Bangladesh"
            style={{
              width: '100%',
              padding: '14px var(--space-md)',
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
            onBlur={e => e.target.style.borderColor = 'var(--paper-mid)'}
          />
          <p style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: 6 }}>
            A city, neighborhood, or full address — whatever you know.
          </p>
        </div>

        {/* ── Submit button ── */}
        <button
          onClick={handleSubmit}
          disabled={!file || uploading || success}
          className="btn btn-primary"
          style={{
            width: '100%',
            justifyContent: 'center',
            marginTop: 'var(--space-lg)',
            padding: '16px',
            fontSize: '16px',
            opacity: (!file || uploading || success) ? 0.5 : 1,
            cursor: (!file || uploading || success) ? 'not-allowed' : 'pointer',
          }}
        >
          {uploading ? 'Uploading...' : success ? 'Uploaded ✓' : 'Upload to archive →'}
        </button>
      </div>
    </main>
  )
}