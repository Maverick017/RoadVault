// frontend/src/pages/NotFound.jsx

import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 'var(--space-lg)',
    }}>
      <div style={{
        fontFamily: 'var(--font-head)',
        fontSize: '120px',
        fontWeight: 800,
        letterSpacing: '-6px',
        lineHeight: 1,
        color: 'var(--paper-mid)',
        marginBottom: 'var(--space-lg)',
        userSelect: 'none',
      }}>
        404
      </div>

      <h1 style={{
        fontFamily: 'var(--font-head)',
        fontSize: 'clamp(28px, 5vw, 42px)',
        fontWeight: 800,
        letterSpacing: '-1.5px',
        marginBottom: 'var(--space-sm)',
      }}>
        Page not found
      </h1>

      <p style={{
        color: 'var(--ink-muted)',
        fontSize: '16px',
        marginBottom: 'var(--space-xl)',
        maxWidth: '380px',
        lineHeight: 1.6,
      }}>
        The page you're looking for doesn't exist or was moved.
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">
          Go home →
        </Link>
        <Link to="/gallery" className="btn btn-outline">
          Browse gallery
        </Link>
      </div>
    </main>
  )
}