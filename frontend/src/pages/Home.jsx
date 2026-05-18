// frontend/src/pages/Home.jsx

import { Link } from 'react-router-dom'
import { useImages } from '../hooks/useImages'

export default function Home() {
  const { images } = useImages()

  return (
    <main>
      {/* ── Hero ── */}
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
        {/* Background accent glow */}
        <div style={{
          position: 'absolute',
          width: '700px', height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,80,42,0.06) 0%, transparent 70%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />

        {/* Badge */}
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
          Road surface documentation archive
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--font-head)',
          fontSize: 'clamp(46px, 8.5vw, 92px)',
          fontWeight: 800,
          lineHeight: 1.0,
          letterSpacing: '-3px',
          maxWidth: '820px',
          marginBottom: 'var(--space-lg)',
        }}>
          Every road
          <br />
          tells a <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>story.</span>
        </h1>

        {/* Subheading */}
        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)',
          color: 'var(--ink-muted)',
          maxWidth: '540px',
          lineHeight: 1.7,
          marginBottom: 'var(--space-2xl)',
        }}>
          RoadVault is a community archive of road surface photographs.
          Contribute images of roads, streets, highways and pavements —
          tagged to real locations — to build a visual record of infrastructure.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/upload" className="btn btn-primary" style={{ fontSize: '16px', padding: '16px 40px' }}>
            Submit a road photo →
          </Link>
          <Link to="/gallery" className="btn btn-outline" style={{ fontSize: '16px', padding: '16px 40px' }}>
            Browse the archive
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-2xl)',
          marginTop: 'var(--space-3xl)',
          paddingTop: 'var(--space-xl)',
          borderTop: '1px solid var(--paper-mid)',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {[
            { value: images.length || 0, label: 'Road photos archived' },
            
            { value: '600px',           label: 'Standardized width'   },
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
              <div style={{ fontSize: '13px', color: 'var(--ink-muted)', marginTop: 4 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── What we accept ── */}
      <section style={{
        background: 'var(--paper-warm)',
        padding: 'var(--space-3xl) var(--space-lg)',
        borderTop: '1px solid var(--paper-mid)',
      }}>
        <div className="container">
          <h2 style={{
            fontFamily: 'var(--font-head)',
            fontSize: 'clamp(30px, 5vw, 48px)',
            fontWeight: 800,
            letterSpacing: '-1.5px',
            marginBottom: 'var(--space-sm)',
          }}>
            What to photograph
          </h2>
          <p style={{
            color: 'var(--ink-muted)',
            fontSize: '16px',
            marginBottom: 'var(--space-2xl)',
            maxWidth: '560px',
          }}>
            We document all types of road and pavement surfaces. If it's a surface
            people or vehicles travel on, it belongs here.
          </p>

          {/* Accept / Reject grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--space-lg)',
            marginBottom: 'var(--space-2xl)',
          }}>
            {/* Accepted */}
            <div style={{
              background: 'var(--white)',
              border: '1px solid #bbf7d0',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-xl)',
            }}>
              <div style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 700,
                fontSize: '13px',
                color: 'var(--success)',
                letterSpacing: '1px',
                marginBottom: 'var(--space-md)',
              }}>
                ✓  ACCEPTED
              </div>
              {[
                'Paved asphalt roads',
                'Concrete highways',
                'Brick or cobblestone streets',
                'Dirt and gravel roads',
                'Road damage — cracks, potholes',
                'Road markings and lane lines',
                'Pavements and footpaths',
                'Intersections and crossings',
              ].map(item => (
                <div key={item} style={{
                  fontSize: '14px',
                  color: 'var(--ink-soft)',
                  padding: '6px 0',
                  borderBottom: '1px solid var(--paper-warm)',
                  display: 'flex',
                  gap: 8,
                }}>
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>—</span>
                  {item}
                </div>
              ))}
            </div>

            {/* Not accepted */}
            <div style={{
              background: 'var(--white)',
              border: '1px solid #f5c6c6',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-xl)',
            }}>
              <div style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 700,
                fontSize: '13px',
                color: 'var(--danger)',
                letterSpacing: '1px',
                marginBottom: 'var(--space-md)',
              }}>
                ✕  NOT ACCEPTED
              </div>
              {[
                'Buildings or architecture',
                'Landscapes or nature',
                'People or faces',
                'Vehicles (unless showing road)',
                'Aerial or satellite views',
                'Indoor floors or surfaces',
                'Random or off-topic photos',
              ].map(item => (
                <div key={item} style={{
                  fontSize: '14px',
                  color: 'var(--ink-soft)',
                  padding: '6px 0',
                  borderBottom: '1px solid var(--paper-warm)',
                  display: 'flex',
                  gap: 8,
                }}>
                  <span style={{ color: 'var(--danger)', fontWeight: 600 }}>—</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <h2 style={{
            fontFamily: 'var(--font-head)',
            fontSize: 'clamp(30px, 5vw, 48px)',
            fontWeight: 800,
            letterSpacing: '-1.5px',
            marginBottom: 'var(--space-xl)',
            marginTop: 'var(--space-2xl)',
          }}>
            How it works
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-lg)',
          }}>
            {[
              {
                n: '01',
                title: 'Photograph the road',
                body: 'Take a clear photo of the road surface from ground level. Ensure the road fills most of the frame.',
              },
              {
                n: '02',
                title: 'Add the location',
                body: 'Type the road name, neighborhood, or city. Even approximate locations help build the map.',
              },
              {
                n: '03',
                title: 'Auto-standardized',
                body: 'Your image is automatically resized to 600px * 600px. No editing needed.',
              },
              {
                n: '04',
                title: 'Into the archive',
                body: 'Your photo joins the searchable community archive, accessible to researchers and the public.',
              },
            ].map((step) => (
              <div key={step.n} style={{
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
                  {step.n}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: '18px',
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

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.85); }
        }
      `}</style>
    </main>
  )
}