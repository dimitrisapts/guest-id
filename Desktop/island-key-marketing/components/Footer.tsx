import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--ink)' }}>
      {/* Gold ornament divider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 64px',
      }}>
        <div style={{
          flex: 1,
          height: '0.5px',
          background: 'linear-gradient(90deg, transparent, rgba(253,252,250,0.06))',
        }} />
        <div style={{
          width: 6,
          height: 6,
          border: '0.5px solid rgba(196,165,90,0.3)',
          transform: 'rotate(45deg)',
          margin: '0 1.5rem',
          flexShrink: 0,
        }} />
        <div style={{
          flex: 1,
          height: '0.5px',
          background: 'linear-gradient(270deg, transparent, rgba(253,252,250,0.06))',
        }} />
      </div>
      <div style={{
        padding: '3rem 64px 3.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <img src="/logo.png" alt="" style={{ height: 24, width: 'auto', opacity: 0.5 }} />
          <span style={{
            fontFamily: 'var(--font-fraunces)',
            fontWeight: 200,
            fontSize: '0.8rem',
            letterSpacing: '0.15em',
            color: 'var(--cream)',
            opacity: 0.4,
          }}>
            ISLAND KEY
          </span>
        </Link>
        <div style={{
          fontFamily: 'var(--font-jakarta)',
          fontWeight: 200,
          fontSize: '0.6rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--cream)',
          opacity: 0.3,
          display: 'flex',
          gap: '2.5rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <a href="mailto:bookings@islandkey.gr" style={{
            color: 'inherit',
            textDecoration: 'none',
            transition: 'opacity 0.3s ease',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
          >
            bookings@islandkey.gr
          </a>
          <span style={{
            width: 2,
            height: 2,
            borderRadius: '50%',
            background: 'rgba(253,252,250,0.2)',
            display: 'inline-block',
          }} />
          <span>&copy; 2026 Island Key, Chania</span>
        </div>
      </div>
    </footer>
  )
}
