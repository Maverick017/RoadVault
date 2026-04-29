// frontend/src/components/Navbar.jsx

import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  // useLocation gives us the current URL path
  // We use it to highlight the active navigation link
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      position: 'fixed',           // Stays at top while scrolling
      top: 0, left: 0, right: 0,
      height: 'var(--nav-height)',
      background: 'rgba(250, 249, 247, 0.92)',
      backdropFilter: 'blur(12px)', // Frosted glass effect
      borderBottom: '1px solid var(--paper-mid)',
      zIndex: 100,                 // Always above other elements
      display: 'flex',
      alignItems: 'center',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo — clicking takes you home */}
        <Link to="/" style={{
          fontFamily: 'var(--font-head)',
          fontWeight: 800,
          fontSize: '22px',
          letterSpacing: '-0.5px',
          color: 'var(--ink)',
        }}>
          Pixel<span style={{ color: 'var(--accent)' }}>Vault</span>
        </Link>

        {/* Navigation links */}
        <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center' }}>
          <Link to="/" style={{
            fontSize: '14px',
            fontWeight: 500,
            color: isActive('/') ? 'var(--accent)' : 'var(--ink-soft)',
            borderBottom: isActive('/') ? '2px solid var(--accent)' : '2px solid transparent',
            paddingBottom: '2px',
            transition: 'all 0.2s',
          }}>
            Home
          </Link>

          <Link to="/gallery" style={{
            fontSize: '14px',
            fontWeight: 500,
            color: isActive('/gallery') ? 'var(--accent)' : 'var(--ink-soft)',
            borderBottom: isActive('/gallery') ? '2px solid var(--accent)' : '2px solid transparent',
            paddingBottom: '2px',
            transition: 'all 0.2s',
          }}>
            Gallery
          </Link>

          {/* Contribute button — styled differently to stand out */}
          <Link to="/upload" className="btn btn-primary" style={{
            padding: '10px 20px',
            fontSize: '13px',
          }}>
            + Contribute
          </Link>
        </div>
      </div>
    </nav>
  )
}