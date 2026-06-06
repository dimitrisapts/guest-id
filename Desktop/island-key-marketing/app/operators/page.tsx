'use client'

import RevealWrapper from '@/components/RevealWrapper'
import EnquiryForm from '@/components/EnquiryForm'
import Footer from '@/components/Footer'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80&auto=format&fit=crop'

const CATEGORIES = [
  'Boat Tours', 'Hiking & Land', 'Private Transfers', 'Car & Bike Rentals',
  'Private Chef', 'Restaurant', 'Wellness & Spa', 'Beach Services', 'Photography',
]

const FACTS = [
  'Commission on completed bookings only.',
  'Enquiries come directly to your WhatsApp.',
  'No subscription fee. No upfront cost.',
]

export default function OperatorsPage() {
  const scrollToForm = () => {
    document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main>
      {/* ═══ HERO ═══ */}
      <section style={{
        minHeight: '100vh',
        background: '#0e0e0e',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
      }} className="op-hero-grid">
        <div className="op-hero-image" style={{ overflow: 'hidden', position: 'relative' }}>
          <img
            src={HERO_IMAGE}
            alt="Local Cretan experience"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(270deg, rgba(14,14,14,0.35) 0%, transparent 40%)',
          }} />
        </div>
        <div style={{
          padding: 'clamp(100px, 14vh, 140px) clamp(2rem, 5vw, 80px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <RevealWrapper>
            <p style={{
              color: 'var(--teal)',
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 300,
              marginBottom: '1.2rem',
            }}>
              For Operators
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
              Your craft. Our guests.
            </h1>
          </RevealWrapper>
          <RevealWrapper delay={200}>
            <p style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 300,
              fontSize: '1rem',
              color: 'var(--cream)',
              opacity: 0.65,
              maxWidth: 480,
              lineHeight: 1.85,
              marginBottom: '2rem',
            }}>
              Island Key connects curated guests from partner properties across Crete directly to trusted local experts.
            </p>
          </RevealWrapper>
          <RevealWrapper delay={300}>
            <div style={{ marginBottom: '2.5rem' }}>
              {FACTS.map(fact => (
                <div key={fact} style={{
                  borderLeft: '2px solid var(--gold)',
                  paddingLeft: '1rem',
                  marginBottom: '0.8rem',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-jakarta)',
                    fontWeight: 300,
                    fontSize: '0.85rem',
                    color: 'var(--cream)',
                    opacity: 0.75,
                  }}>
                    {fact}
                  </p>
                </div>
              ))}
            </div>
          </RevealWrapper>
          <RevealWrapper delay={400}>
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
              Apply to join
            </div>
          </RevealWrapper>
        </div>
        <style jsx>{`
          @media (max-width: 768px) {
            .op-hero-grid { grid-template-columns: 1fr !important; }
            .op-hero-image { display: none !important; }
          }
        `}</style>
      </section>

      {/* ═══ WHO JOINS ═══ */}
      <section style={{
        background: 'var(--navy)',
        padding: 'clamp(80px, 10vh, 100px) clamp(2rem, 8vw, 100px)',
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
            The network
          </p>
        </RevealWrapper>
        <RevealWrapper delay={100}>
          <h2 style={{
            fontFamily: 'var(--font-fraunces)',
            fontWeight: 200,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: 'var(--cream)',
            marginBottom: '2rem',
            lineHeight: 1.1,
          }}>
            Built for Cretan operators.
          </h2>
        </RevealWrapper>
        <RevealWrapper delay={200}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {CATEGORIES.map(cat => (
              <span
                key={cat}
                className="cat-tag"
                style={{
                  border: '0.5px solid rgba(196,165,90,0.35)',
                  color: 'var(--cream)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  padding: '0.5rem 1.1rem',
                  background: 'transparent',
                  fontFamily: 'var(--font-jakarta)',
                  fontWeight: 300,
                  transition: 'all 0.35s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--gold)'
                  e.currentTarget.style.background = 'rgba(196,165,90,0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(196,165,90,0.35)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {cat}
              </span>
            ))}
          </div>
        </RevealWrapper>
      </section>

      {/* ═══ APPLICATION FORM ═══ */}
      <section id="application" style={{
        background: 'var(--ink)',
        padding: 'clamp(80px, 12vh, 120px) clamp(2rem, 6vw, 80px)',
        position: 'relative',
      }}>
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
            Tell us about your operation.
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
          <EnquiryForm type="operator" />
        </div>
      </section>

      <Footer />
    </main>
  )
}
