'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Nav() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!isHome) return
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.7)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const visible = !isHome || scrolled

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 3rem',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        background: visible ? 'rgba(10,10,10,0.8)' : 'transparent',
        backdropFilter: visible ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: visible ? 'blur(16px)' : 'none',
        transition: 'opacity 0.4s ease, background 0.4s ease',
      }}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
        <img src="/logo.png" alt="" style={{ height: 26, width: 'auto', opacity: 0.9 }} />
        <span style={{
          fontFamily: 'var(--font-fraunces)',
          fontWeight: 200,
          fontSize: '0.85rem',
          letterSpacing: '0.15em',
          color: 'var(--cream)',
          opacity: 0.9,
        }}>
          ISLAND KEY
        </span>
      </Link>
      <div
        className="nav-links"
        style={{
          display: 'flex',
          gap: '2rem',
        }}
      >
        <NavLink href="/hosts" label="For Hosts" />
        <NavLink href="/operators" label="For Operators" />
      </div>
      {/* Gold accent line at bottom of nav */}
      {visible && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '3rem',
          right: '3rem',
          height: '0.5px',
          background: 'linear-gradient(90deg, transparent, rgba(196,165,90,0.15), transparent)',
        }} />
      )}
      <style jsx global>{`
        @media (max-width: 640px) {
          .nav-links { display: none !important; }
        }
      `}</style>
    </nav>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font-jakarta)',
        fontWeight: 200,
        fontSize: '0.7rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--cream)',
        opacity: hovered ? 1 : 0.65,
        textDecoration: 'none',
        position: 'relative',
        paddingBottom: '2px',
        transition: 'opacity 0.3s ease',
      }}
    >
      {label}
      <span
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '0.5px',
          background: 'var(--gold)',
          width: hovered ? '100%' : '0%',
          transition: 'width 0.3s ease',
        }}
      />
    </Link>
  )
}
