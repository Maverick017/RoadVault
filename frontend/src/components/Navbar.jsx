// frontend/src/components/Navbar.jsx

import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: 'var(--nav-height)',
      background: 'rgba(250, 249, 247, 0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--paper-mid)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link to="/" style={{
          fontFamily: 'var(--font-head)',
          fontWeight: 800,
          fontSize: '22px',
          letterSpacing: '-0.5px',
          color: 'var(--ink)',
        }}>
          Road<span style={{ color: 'var(--accent)' }}>Vault</span>
        </Link>

        <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center' }}>
          {[
            { to: '/',        label: 'Home'    },
            { to: '/gallery', label: 'Archive' },
          ].map(link => (
            <Link key={link.to} to={link.to} style={{
              fontSize: '14px',
              fontWeight: 500,
              color: isActive(link.to) ? 'var(--accent)' : 'var(--ink-soft)',
              borderBottom: isActive(link.to) ? '2px solid var(--accent)' : '2px solid transparent',
              paddingBottom: '2px',
              transition: 'all 0.2s',
            }}>
              {link.label}
            </Link>
          ))}

          <Link to="/upload" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '13px' }}>
            + Submit photo
          </Link>
        </div>
      </div>
    </nav>
  )
}