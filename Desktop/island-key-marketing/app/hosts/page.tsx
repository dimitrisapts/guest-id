'use client'

import RevealWrapper from '@/components/RevealWrapper'
import EnquiryForm from '@/components/EnquiryForm'
import Footer from '@/components/Footer'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80&auto=format&fit=crop'

const STEPS = [
  { num: '1', title: 'You apply.', desc: 'Tell us about your property. We\u2019ll review within 48 hours.' },
  { num: '2', title: 'We set you up.', desc: 'Island Key is activated for your property. No tech required on your side.' },
  { num: '3', title: 'Guests arrive.', desc: 'They scan in, the island unlocks. You get happy returns.' },
]

export default function HostsPage() {
  const scrollToForm = () => {
    document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main>
      {/* ═══ HERO ═══ */}
      <section style={{
        minHeight: '100vh',
        background: 'var(--navy)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
      }} className="host-hero-grid">
        <div style={{
          padding: 'clamp(100px, 14vh, 140px) clamp(2rem, 5vw, 80px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <RevealWrapper>
            <p style={{
              color: 'var(--gold)',
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 300,
              marginBottom: '1.2rem',
            }}>
              For Properties
            </p>
          </RevealWrapper>
          <RevealWrapper delay={100}>
            <h1 style={{
              fontFamily: 'var(--font-fraunces)',
              fontWeight: 200,
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: 'var(--cream)',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
            }}>
              Turn your property into an experience.
            </h1>
          </RevealWrapper>
          <RevealWrapper delay={200}>
            <p style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 300,
              fontSize: '1rem',
              color: 'rgba(253,252,250,0.65)',
              maxWidth: 480,
              lineHeight: 1.85,
              marginBottom: '2.5rem',
            }}>
              Your guests already chose your property. Island Key makes sure they remember everything else about their stay.
            </p>
          </RevealWrapper>
          <RevealWrapper delay={300}>
            <div
              onClick={scrollToForm}
              style={{
                display: 'inline-block',
                background: 'var(--teal)',
                color: 'var(--cream)',
                padding: '0.9rem 2rem',
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 300,
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              Start your application
            </div>
          </RevealWrapper>
        </div>
        <div className="host-hero-image" style={{ overflow: 'hidden', position: 'relative' }}>
          <img
            src={HERO_IMAGE}
            alt="Premium Cretan property"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(90deg, rgba(27,45,79,0.35) 0%, transparent 40%)',
          }} />
        </div>
        <style jsx>{`
          @media (max-width: 768px) {
            .host-hero-grid { grid-template-columns: 1fr !important; }
            .host-hero-image { display: none !important; }
          }
        `}</style>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{
        background: '#0e0e0e',
        padding: 'clamp(80px, 12vh, 120px) clamp(2rem, 8vw, 100px)',
      }}>
        <RevealWrapper>
          <p style={{
            color: 'var(--gold)',
            fontSize: '0.6rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-jakarta)',
            fontWeight: 300,
            textAlign: 'center',
            marginBottom: '0.8rem',
          }}>
            How it works
          </p>
          <h2 style={{
            fontFamily: 'var(--font-fraunces)',
            fontWeight: 200,
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            color: 'var(--cream)',
            textAlign: 'center',
            marginBottom: 'clamp(3rem, 6vh, 5rem)',
            lineHeight: 1.1,
          }}>
            Three steps. That&apos;s it.
          </h2>
        </RevealWrapper>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '3rem',
          maxWidth: 900,
          margin: '0 auto',
        }} className="steps-grid">
          {STEPS.map((s, i) => (
            <RevealWrapper key={s.num} delay={i * 150}>
              <div style={{
                position: 'relative',
                paddingLeft: i > 0 ? '3rem' : 0,
              }}>
                {i > 0 && (
                  <div className="step-divider" style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 1,
                    background: 'var(--gold)',
                    opacity: 0.2,
                  }} />
                )}
                <p style={{
                  fontFamily: 'var(--font-fraunces)',
                  fontWeight: 200,
                  fontSize: '3rem',
                  color: 'var(--gold)',
                  opacity: 0.3,
                  marginBottom: '1rem',
                  lineHeight: 1,
                }}>
                  {s.num}
                </p>
                <h3 style={{
                  fontFamily: 'var(--font-jakarta)',
                  fontWeight: 400,
                  fontSize: '0.9rem',
                  color: 'var(--cream)',
                  marginBottom: '0.6rem',
                }}>
                  {s.title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-jakarta)',
                  fontWeight: 300,
                  fontSize: '0.82rem',
                  color: 'var(--cream)',
                  opacity: 0.5,
                  lineHeight: 1.7,
                }}>
                  {s.desc}
                </p>
              </div>
            </RevealWrapper>
          ))}
        </div>
        <style jsx>{`
          @media (max-width: 768px) {
            .steps-grid { grid-template-columns: 1fr !important; }
            .step-divider { display: none; }
          }
        `}</style>
      </section>

      {/* ═══ APPLICATION FORM ═══ */}
      <section id="application" style={{
        background: 'var(--ink)',
        padding: 'clamp(80px, 12vh, 120px) clamp(2rem, 6vw, 80px)',
        position: 'relative',
      }}>
        {/* Subtle radial ambient light */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '25%',
          width: '50%',
          height: '300px',
          background: 'radial-gradient(ellipse at top, rgba(27,45,79,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 520, position: 'relative' }}>
          <div className="gold-rule" style={{ margin: '0 0 2.5rem 0', marginLeft: 0, background: 'linear-gradient(90deg, var(--gold), transparent)', opacity: 0.25 }} />
          <h2 style={{
            fontFamily: 'var(--font-fraunces)',
            fontWeight: 200,
            fontStyle: 'italic',
            fontSize: '2rem',
            color: 'var(--cream)',
            marginBottom: '0.6rem',
          }}>
            Tell us about your property.
          </h2>
          <p style={{
            fontFamily: 'var(--font-jakarta)',
            fontWeight: 200,
            fontSize: '0.8rem',
            color: 'var(--cream)',
            opacity: 0.4,
            marginBottom: '3rem',
          }}>
            Five short steps. Takes about 5 minutes.
          </p>
          <EnquiryForm type="host" />
        </div>
      </section>

      <Footer />
    </main>
  )
}
