// frontend/src/pages/Upload.jsx

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import { uploadImage } from '../utils/api'

export default function Upload() {
  const navigate = useNavigate()
  const [file, setFile]           = useState(null)
  const [preview, setPreview]     = useState(null)
  const [address, setAddress]     = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState(null)
  const [success, setSuccess]     = useState(false)

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError(null)
    if (rejectedFiles.length > 0) {
      setError('File rejected. Use JPEG, PNG, WebP, or GIF under 10MB.')
      return
    }
    const selected = acceptedFiles[0]
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  })

  const handleSubmit = async () => {
    if (!file) { setError('Please select a road image first.'); return }
    try {
      setUploading(true)
      setError(null)
      await uploadImage(file, address)
      setSuccess(true)
      setTimeout(() => navigate('/gallery'), 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleReset = () => {
    setFile(null); setPreview(null)
    setAddress(''); setError(null); setSuccess(false)
  }

  return (
    <main style={{
      minHeight: '100vh',
      paddingTop: 'calc(var(--nav-height) + var(--space-2xl))',
      paddingBottom: 'var(--space-3xl)',
    }}>
      <div className="container" style={{ maxWidth: '640px' }}>

        {/* Header */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h1 style={{
            fontFamily: 'var(--font-head)',
            fontSize: 'clamp(34px, 6vw, 52px)',
            fontWeight: 800,
            letterSpacing: '-2px',
            marginBottom: 'var(--space-sm)',
          }}>
            Submit a road photo
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: '16px', lineHeight: 1.6 }}>
            Photos must show a road, street, highway, or pavement surface.
            We do not accept off-topic images.
          </p>
        </div>

        {/* Road guideline banner */}
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fcd34d',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--space-md) var(--space-lg)',
          marginBottom: 'var(--space-lg)',
          fontSize: '14px',
          color: '#92400e',
          lineHeight: 1.6,
        }}>
          <strong>Submission guidelines:</strong> photograph the road surface from
          ground level. Potholes, cracks, road markings, and surface textures
          are all welcome. Keep the road as the main subject.
        </div>

        {/* Status messages */}
        {success && (
          <div className="status-success" style={{ marginBottom: 'var(--space-lg)' }}>
            ✓ Road photo submitted successfully! Redirecting to archive...
          </div>
        )}
        {error && (
          <div className="status-error" style={{ marginBottom: 'var(--space-lg)' }}>
            {error}
          </div>
        )}

        {/* Drop zone */}
        {!preview ? (
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
            <input {...getInputProps()} />
            <div style={{ fontSize: '48px', marginBottom: 'var(--space-md)' }}>
              {isDragActive ? '📂' : '🛣️'}
            </div>
            <p style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 700,
              fontSize: '20px',
              color: 'var(--ink)',
              marginBottom: 'var(--space-sm)',
            }}>
              {isDragActive ? 'Drop your road photo here' : 'Drag & drop your road photo'}
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
              JPEG · PNG · WebP · GIF &nbsp;·&nbsp; Max 10MB
            </div>
          </div>
        ) : (
          <div style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--paper-mid)',
            background: 'var(--white)',
          }}>
            <div style={{ position: 'relative' }}>
              <img
                src={preview}
                alt="Road preview"
                style={{ width: '100%', maxHeight: '360px', objectFit: 'cover', display: 'block' }}
              />
              <button
                onClick={handleReset}
                style={{
                  position: 'absolute', top: 12, right: 12,
                  background: 'rgba(15,14,13,0.7)', color: '#fff',
                  border: 'none', borderRadius: '50%',
                  width: 32, height: 32, cursor: 'pointer',
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

        {/* Address input */}
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-head)',
            fontWeight: 600,
            fontSize: '15px',
            marginBottom: 'var(--space-sm)',
            color: 'var(--ink)',
          }}>
            Road location / address
            <span style={{ color: 'var(--ink-muted)', fontWeight: 400, marginLeft: 6 }}>
              (optional but recommended)
            </span>
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. Foy's Lake, Chittagong — or just a city name"
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
            onBlur={e  => e.target.style.borderColor = 'var(--paper-mid)'}
          />
          <p style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: 6 }}>
            Road name, area, city, or country — any location detail helps.
          </p>
        </div>

        {/* Submit */}
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
          {uploading ? 'Uploading...' : success ? 'Submitted ✓' : 'Submit to archive →'}
        </button>

        <p style={{
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--ink-muted)',
          marginTop: 'var(--space-md)',
        }}>
          By submitting you confirm this is a road surface photograph
          and you have the right to share it.
        </p>
      </div>
    </main>
  )
}