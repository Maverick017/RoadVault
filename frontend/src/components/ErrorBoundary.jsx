// frontend/src/components/ErrorBoundary.jsx

import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    // hasError tracks whether a crash has been caught
    this.state = { hasError: false, message: '' }
  }

  // React calls this when any child component throws an error
  static getDerivedStateFromError(error) {
    return { hasError: true, message: error.message }
  }

  // Good place to log errors to a monitoring service in production
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
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
          <div style={{ fontSize: '56px', marginBottom: 'var(--space-lg)' }}>⚠️</div>

          <h1 style={{
            fontFamily: 'var(--font-head)',
            fontSize: '36px',
            fontWeight: 800,
            letterSpacing: '-1px',
            marginBottom: 'var(--space-sm)',
          }}>
            Something went wrong
          </h1>

          <p style={{
            color: 'var(--ink-muted)',
            fontSize: '15px',
            maxWidth: '420px',
            marginBottom: 'var(--space-md)',
            lineHeight: 1.6,
          }}>
            An unexpected error occurred. Try refreshing the page.
          </p>

          {/* Show the actual error in development only */}
          {import.meta.env.DEV && (
            <pre style={{
              background: 'var(--paper-warm)',
              border: '1px solid var(--paper-mid)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-md)',
              fontSize: '12px',
              color: 'var(--danger)',
              textAlign: 'left',
              maxWidth: '560px',
              overflowX: 'auto',
              marginBottom: 'var(--space-xl)',
            }}>
              {this.state.message}
            </pre>
          )}

          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Reload page
          </button>
        </main>
      )
    }

    // If no error, render children normally
    return this.props.children
  }
}