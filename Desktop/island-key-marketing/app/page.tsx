'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import RevealWrapper from '@/components/RevealWrapper'
import Footer from '@/components/Footer'

gsap.registerPlugin(ScrollTrigger)

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=1920&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=1920&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1468413253725-0d5181091126?w=1920&q=80&auto=format&fit=crop',
]

const GRID_IMAGES = [
  'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540541338287-41700c1d5500?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=1200&q=80&auto=format&fit=crop',
]

function AnimatedLine({ dark = false }: { dark?: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-block',
        height: '0.5px',
        background: dark ? 'var(--navy)' : 'var(--gold)',
        width: hovered ? 44 : 28,
        transition: 'width 0.35s ease',
        flexShrink: 0,
      }}
    />
  )
}

function CtaLink({ href, label, dark = false }: { href: string; label: string; dark?: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.7rem',
        textDecoration: 'none',
        color: dark ? 'var(--navy)' : 'var(--cream)',
        fontFamily: 'var(--font-jakarta)',
        fontWeight: 300,
        fontSize: '0.75rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          height: '0.5px',
          background: dark ? 'var(--navy)' : 'var(--gold)',
          width: hovered ? 44 : 28,
          transition: 'width 0.35s ease',
          flexShrink: 0,
        }}
      />
      {label}
    </Link>
  )
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const fallbackRef = useRef<HTMLDivElement>(null)
  const [fallbackIdx, setFallbackIdx] = useState(0)
  const [videoReady, setVideoReady] = useState(false)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const gridImgRefs = useRef<(HTMLImageElement | null)[]>([])
  const heroH1Ref = useRef<HTMLHeadingElement>(null)
  const heroTagRef = useRef<HTMLParagraphElement>(null)

  // Image cycle fallback
  useEffect(() => {
    const interval = setInterval(() => {
      setFallbackIdx(prev => (prev + 1) % FALLBACK_IMAGES.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  // Hero text animation
  useEffect(() => {
    const h1 = heroH1Ref.current
    const tag = heroTagRef.current
    if (!h1 || !tag) return
    h1.style.opacity = '0'
    h1.style.transform = 'translateY(20px)'
    tag.style.opacity = '0'
    tag.style.transform = 'translateY(20px)'

    const t1 = setTimeout(() => {
      h1.style.transition = 'opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1)'
      h1.style.opacity = '1'
      h1.style.transform = 'translateY(0)'
    }, 600)
    const t2 = setTimeout(() => {
      tag.style.transition = 'opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1)'
      tag.style.opacity = '1'
      tag.style.transform = 'translateY(0)'
    }, 1000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Scroll indicator fade
  useEffect(() => {
    const indicator = scrollIndicatorRef.current
    if (!indicator) return
    const onScroll = () => {
      indicator.style.opacity = window.scrollY > 60 ? '0' : '0.5'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // GSAP parallax for grid images
  useEffect(() => {
    const ctx = gsap.context(() => {
      gridImgRefs.current.forEach(img => {
        if (!img) return
        gsap.fromTo(img,
          { y: '-5%' },
          {
            y: '5%',
            ease: 'none',
            scrollTrigger: {
              trigger: img,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <main>
      {/* ═══ S1: HERO ═══ */}
      <section style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
        {/* Fallback image cycle */}
        <div
          ref={fallbackRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            backgroundColor: '#0d1a2e',
            opacity: videoReady ? 0 : 1,
            transition: 'opacity 1.2s ease',
          }}
        >
          {FALLBACK_IMAGES.map((id, i) => (
            <div
              key={id}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url('${id}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: i === fallbackIdx ? 1 : 0,
                transition: 'opacity 2s ease',
              }}
            />
          ))}
        </div>

        {/* Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setVideoReady(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 2,
            opacity: videoReady ? 1 : 0,
            transition: 'opacity 1.2s ease',
          }}
        >
          <source src="/videos/reel.mp4" type="video/mp4" />
        </video>

        {/* Overlay — gradient vignette for cinematic depth */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3,
          background: `
            linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.35) 85%, rgba(0,0,0,0.6) 100%),
            radial-gradient(ellipse 70% 60% at 50% 45%, transparent 0%, rgba(0,0,0,0.35) 100%)
          `,
        }} />

        {/* Letterbox bars */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5.5vh', background: 'black', zIndex: 4 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '5.5vh', background: 'black', zIndex: 4 }} />

        {/* Content */}
        <div style={{
          position: 'absolute',
          bottom: '12%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 10,
          width: '100%',
          padding: '0 2rem',
        }}>
          <img
            src="/logo.png"
            alt=""
            style={{
              height: 'clamp(80px, 14vw, 140px)',
              width: 'auto',
              margin: '0 auto 1rem',
              display: 'block',
              opacity: 0.85,
              filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.4))',
            }}
          />
          {/* Gold ornamental rule */}
          <div style={{
            width: 40,
            height: 1,
            background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
            opacity: 0.5,
            margin: '0 auto 1.2rem',
          }} />
          <h1
            ref={heroH1Ref}
            style={{
              fontFamily: 'var(--font-fraunces)',
              fontWeight: 200,
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              letterSpacing: '0.12em',
              color: 'var(--cream)',
            }}
          >
            Island Key
          </h1>
          <p
            ref={heroTagRef}
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 300,
              fontSize: 'clamp(0.65rem, 1.3vw, 0.85rem)',
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: 'rgba(253,252,250,0.8)',
              marginTop: '0.8rem',
            }}
          >
            Your island unlocked.
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          ref={scrollIndicatorRef}
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            opacity: 0.5,
            transition: 'opacity 0.4s ease',
          }}
        >
          <div style={{
            width: 1,
            height: 40,
            background: 'var(--gold)',
            animation: 'scrollPulse 2s ease-in-out infinite',
            transformOrigin: 'top',
          }} />
        </div>
        <style jsx>{`
          @keyframes scrollPulse {
            0% { transform: scaleY(1); }
            50% { transform: scaleY(0.3); }
            100% { transform: scaleY(1); }
          }
          @media (max-width: 768px) {
            div[style*="height: 5.5vh"] { height: 3vh !important; }
          }
        `}</style>
      </section>

      {/* ═══ S2: STATEMENT ═══ */}
      <section style={{
        background: '#0e0e0e',
        padding: 'clamp(100px, 18vh, 180px) clamp(2rem, 8vw, 120px)',
        position: 'relative',
      }}>
        <RevealWrapper>
          <div className="gold-rule" style={{ marginBottom: 'clamp(2rem, 4vh, 3.5rem)' }} />
          <p style={{
            fontFamily: 'var(--font-fraunces)',
            fontWeight: 200,
            fontStyle: 'italic',
            fontSize: 'clamp(1.8rem, 4.5vw, 3.8rem)',
            lineHeight: 1.25,
            maxWidth: 780,
            margin: '0 auto',
            textAlign: 'center',
            color: 'var(--cream)',
          }}>
            Crete has places most guests never find. Island Key changes that.
          </p>
          <div className="gold-rule" style={{ marginTop: 'clamp(2rem, 4vh, 3.5rem)' }} />
        </RevealWrapper>
      </section>

      {/* ═══ S3: ATMOSPHERE GRID ═══ */}
      <section style={{ background: 'var(--ink)', padding: '2px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2px',
        }} className="atmosphere-grid">
          {/* Left tall image */}
          <div className="img-hover-wrap" style={{ height: '65vh', position: 'relative' }}>
            <img
              ref={el => { gridImgRefs.current[0] = el }}
              src={GRID_IMAGES[0]}
              alt="Cretan coastline"
              style={{ width: '100%', height: '120%', objectFit: 'cover' }}
            />
          </div>
          {/* Right stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div className="img-hover-wrap" style={{ height: '32.5vh', position: 'relative' }}>
              <img
                ref={el => { gridImgRefs.current[1] = el }}
                src={GRID_IMAGES[1]}
                alt="Mediterranean scene"
                style={{ width: '100%', height: '120%', objectFit: 'cover' }}
              />
            </div>
            <div className="img-hover-wrap" style={{ height: '32.5vh', position: 'relative' }}>
              <img
                ref={el => { gridImgRefs.current[2] = el }}
                src={GRID_IMAGES[2]}
                alt="Island landscape"
                style={{ width: '100%', height: '120%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
        {/* Full-width 4th image */}
        <div className="img-hover-wrap" style={{ height: '35vh', marginTop: '2px', position: 'relative' }}>
          <img
            ref={el => { gridImgRefs.current[3] = el }}
            src={GRID_IMAGES[3]}
            alt="Island atmosphere"
            style={{ width: '100%', height: '120%', objectFit: 'cover' }}
          />
        </div>
        <style jsx>{`
          @media (max-width: 768px) {
            .atmosphere-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ═══ S4: THE CONCEPT ═══ */}
      <section style={{
        background: 'var(--navy)',
        padding: 'clamp(80px, 12vh, 120px) clamp(2rem, 8vw, 100px)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
        }} className="concept-grid">
          <div style={{ maxWidth: 520 }}>
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
                The platform
              </p>
            </RevealWrapper>
            <RevealWrapper delay={100}>
              <h2 style={{
                fontFamily: 'var(--font-fraunces)',
                fontWeight: 300,
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: 'var(--cream)',
                marginBottom: '1.5rem',
                lineHeight: 1.1,
              }}>
                Built for where you stay.
              </h2>
            </RevealWrapper>
            <RevealWrapper delay={200}>
              <p style={{
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 300,
                fontSize: '1rem',
                lineHeight: 1.85,
                color: 'rgba(253,252,250,0.7)',
              }}>
                Island Key connects guests to the island through the properties they trust. Your host sets it up. You arrive and it&apos;s already yours.
              </p>
            </RevealWrapper>
          </div>
          <div className="concept-image img-hover-wrap" style={{ position: 'relative', minHeight: 400 }}>
            <img
              src={GRID_IMAGES[3]}
              alt="Island atmosphere"
              style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 400 }}
            />
            {/* Soft vignette on image */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(135deg, rgba(27,45,79,0.3) 0%, transparent 60%)',
            }} />
          </div>
        </div>
        <style jsx>{`
          @media (max-width: 768px) {
            .concept-grid { grid-template-columns: 1fr !important; }
            .concept-image { margin-top: 2rem; }
          }
        `}</style>
      </section>

      {/* ═══ S5: FOR HOSTS ═══ */}
      <section style={{ background: 'var(--ink)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }} className="hosts-grid">
          <div style={{
            padding: 'clamp(80px, 10vh, 100px) clamp(2rem, 5vw, 80px)',
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
              <h2 style={{
                fontFamily: 'var(--font-fraunces)',
                fontWeight: 200,
                fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
                color: 'var(--cream)',
                marginBottom: '1.2rem',
                lineHeight: 1.1,
              }}>
                Your property, elevated.
              </h2>
            </RevealWrapper>
            <RevealWrapper delay={200}>
              <p style={{
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 300,
                fontSize: '0.95rem',
                lineHeight: 1.8,
                color: 'var(--cream)',
                opacity: 0.65,
                maxWidth: 400,
                marginBottom: '2.5rem',
              }}>
                Island Key becomes the concierge layer your guests remember. Set up once. Run quietly.
              </p>
            </RevealWrapper>
            <RevealWrapper delay={300}>
              <CtaLink href="/hosts" label="Apply to host" />
            </RevealWrapper>
          </div>
          <div className="hosts-image img-hover-wrap" style={{ position: 'relative', minHeight: 500 }}>
            <img
              src={GRID_IMAGES[0]}
              alt="Premium property interior"
              style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 500 }}
            />
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(90deg, rgba(14,14,14,0.4) 0%, transparent 50%)',
            }} />
          </div>
        </div>
        <style jsx>{`
          @media (max-width: 768px) {
            .hosts-grid { grid-template-columns: 1fr !important; }
            .hosts-image { display: none; }
          }
        `}</style>
      </section>

      {/* ═══ S6: FOR OPERATORS ═══ */}
      <section style={{ background: '#f7f5f0' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }} className="operators-grid">
          <div className="operators-image img-hover-wrap" style={{ position: 'relative', minHeight: 500 }}>
            <img
              src={GRID_IMAGES[1]}
              alt="Local operator experience"
              style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 500 }}
            />
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(270deg, rgba(247,245,240,0.3) 0%, transparent 50%)',
            }} />
          </div>
          <div style={{
            padding: 'clamp(80px, 10vh, 100px) clamp(2rem, 5vw, 80px)',
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
              <h2 style={{
                fontFamily: 'var(--font-fraunces)',
                fontWeight: 200,
                fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
                color: 'var(--navy)',
                marginBottom: '1.2rem',
                lineHeight: 1.1,
              }}>
                Your craft. Our guests.
              </h2>
            </RevealWrapper>
            <RevealWrapper delay={200}>
              <p style={{
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 300,
                fontSize: '0.95rem',
                lineHeight: 1.8,
                color: 'rgba(27,45,79,0.65)',
                maxWidth: 400,
                marginBottom: '2.5rem',
              }}>
                Join a curated network of trusted local experts. We bring the guests. You deliver the experience.
              </p>
            </RevealWrapper>
            <RevealWrapper delay={300}>
              <CtaLink href="/operators" label="Join the network" dark />
            </RevealWrapper>
          </div>
        </div>
        <style jsx>{`
          @media (max-width: 768px) {
            .operators-grid { grid-template-columns: 1fr !important; }
            .operators-image { display: none; }
          }
        `}</style>
      </section>

      {/* ═══ S7: SIGNAL ═══ */}
      <section style={{
        background: 'var(--ink)',
        padding: 'clamp(100px, 16vh, 160px) clamp(2rem, 6vw, 80px)',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Subtle radial glow behind content */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(196,165,90,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <RevealWrapper>
          <div className="gold-rule" style={{ marginBottom: '2.5rem' }} />
          <p style={{
            color: 'var(--gold)',
            fontSize: '0.6rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-jakarta)',
            fontWeight: 300,
            marginBottom: '1.8rem',
          }}>
            Now open
          </p>
          <p style={{
            fontFamily: 'var(--font-fraunces)',
            fontWeight: 200,
            fontStyle: 'italic',
            fontSize: 'clamp(1.5rem, 3vw, 2.8rem)',
            color: 'var(--cream)',
            marginBottom: '1.8rem',
            lineHeight: 1.2,
          }}>
            Launching Chania, summer 2026.
          </p>
          <p style={{
            fontFamily: 'var(--font-jakarta)',
            fontWeight: 300,
            fontSize: '0.85rem',
            color: 'var(--cream)',
            opacity: 0.4,
            maxWidth: 440,
            margin: '0 auto',
            lineHeight: 1.8,
          }}>
            A closed network of verified properties and local operators. Applications reviewed individually.
          </p>
          <div className="gold-rule" style={{ marginTop: '2.5rem' }} />
        </RevealWrapper>
      </section>

      {/* ═══ S8: FOOTER ═══ */}
      <Footer />
    </main>
  )
}
