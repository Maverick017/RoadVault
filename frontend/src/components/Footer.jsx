// frontend/src/components/Footer.jsx

import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--paper-mid)',
      background: 'var(--paper-warm)',
      padding: 'var(--space-xl) var(--space-lg)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--space-md)',
      }}>
        <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '18px', letterSpacing: '-0.5px' }}>
          Road<span style={{ color: 'var(--accent)' }}>Vault</span>
        </span>

        <div style={{ display: 'flex', gap: 'var(--space-lg)' }}>
          {[
            { to: '/',        label: 'Home'      },
            { to: '/gallery', label: 'Archive'   },
            { to: '/upload',  label: 'Contribute'},
          ].map(link => (
            <Link key={link.to} to={link.to} style={{
              fontSize: '14px', color: 'var(--ink-muted)', transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--ink)'}
            onMouseLeave={e => e.target.style.color = 'var(--ink-muted)'}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <span style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
          © {new Date().getFullYear()} RoadVault
        </span>
      </div>
    </footer>
  )
}