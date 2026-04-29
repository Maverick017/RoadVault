// frontend/src/pages/Home.jsx

import { Link } from 'react-router-dom'
import { useImages } from '../hooks/useImages'

export default function Home() {
  // Get the count of images to show in the stats
  const { images } = useImages()

  return (
    <main>
      {/* ── Hero Section ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 'var(--space-3xl) var(--space-lg) var(--space-2xl)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative background circles */}
        <div style={{
          position: 'absolute',
          width: '600px', height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,80,42,0.07) 0%, transparent 70%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />

        {/* Tag line */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          background: 'var(--paper-warm)',
          border: '1px solid var(--paper-mid)',
          borderRadius: '100px',
          padding: '6px 18px',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--ink-soft)',
          marginBottom: 'var(--space-xl)',
          letterSpacing: '0.3px',
        }}>
          <span style={{
            width: 7, height: 7,
            borderRadius: '50%',
            background: 'var(--accent)',
            display: 'inline-block',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          Community image archive
        </div>

        {/* Main heading */}
        <h1 style={{
          fontFamily: 'var(--font-head)',
          fontSize: 'clamp(48px, 9vw, 96px)', // Scales with screen size
          fontWeight: 800,
          lineHeight: 1.0,
          letterSpacing: '-3px',
          maxWidth: '800px',
          marginBottom: 'var(--space-lg)',
        }}>
          Every photo
          <br />
          tells a <span style={{
            color: 'var(--accent)',
            fontStyle: 'italic',
          }}>place.</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)',
          color: 'var(--ink-muted)',
          maxWidth: '520px',
          lineHeight: 1.7,
          marginBottom: 'var(--space-2xl)',
        }}>
          PixelVault is a community-driven archive where anyone can
          contribute photos tied to real locations. Upload, tag, and
          preserve moments from around the world.
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/upload" className="btn btn-primary" style={{ fontSize: '16px', padding: '16px 40px' }}>
            Contribute a photo →
          </Link>
          <Link to="/gallery" className="btn btn-outline" style={{ fontSize: '16px', padding: '16px 40px' }}>
            Browse gallery
          </Link>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-2xl)',
          marginTop: 'var(--space-3xl)',
          paddingTop: 'var(--space-xl)',
          borderTop: '1px solid var(--paper-mid)',
        }}>
          {[
            { value: images.length, label: 'Photos contributed' },
            { value: 'WebP', label: 'Auto-converted to' },
            { value: '1200px', label: 'Max width enforced' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-head)',
                fontSize: '28px',
                fontWeight: 800,
                color: 'var(--ink)',
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '13px',
                color: 'var(--ink-muted)',
                marginTop: 4,
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works section ── */}
      <section style={{
        background: 'var(--paper-warm)',
        padding: 'var(--space-3xl) var(--space-lg)',
        borderTop: '1px solid var(--paper-mid)',
      }}>
        <div className="container">
          <h2 style={{
            fontFamily: 'var(--font-head)',
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 800,
            letterSpacing: '-1.5px',
            marginBottom: 'var(--space-2xl)',
          }}>
            How it works
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-lg)',
          }}>
            {[
              {
                number: '01',
                title: 'Choose a photo',
                body: 'Drag and drop or select any image from your device. JPEG, PNG, WebP and GIF supported.',
              },
              {
                number: '02',
                title: 'Add the location',
                body: 'Type in the address or place name where the photo was taken. Even a city name works.',
              },
              {
                number: '03',
                title: 'Auto-processed',
                body: 'We resize and convert your photo to WebP automatically — no editing needed on your end.',
              },
              {
                number: '04',
                title: 'Stored forever',
                body: 'Your image goes into the community gallery for everyone to browse and explore.',
              },
            ].map((step) => (
              <div key={step.number} style={{
                background: 'var(--white)',
                border: '1px solid var(--paper-mid)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-xl) var(--space-lg)',
              }}>
                <div style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  marginBottom: 'var(--space-md)',
                  letterSpacing: '1px',
                }}>
                  {step.number}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: '20px',
                  fontWeight: 700,
                  marginBottom: 'var(--space-sm)',
                }}>
                  {step.title}
                </h3>
                <p style={{ color: 'var(--ink-muted)', fontSize: '14px', lineHeight: 1.7 }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pulse keyframe */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
      `}</style>
    </main>
  )
}