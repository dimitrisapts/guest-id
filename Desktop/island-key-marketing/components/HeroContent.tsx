'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  visible: boolean
  onOpenHost: () => void
  onOpenOperator: () => void
}

const cardVariants = {
  rest: {
    background: 'rgba(253,252,250,0.04)',
    borderColor: 'rgba(253,252,250,0.10)',
    y: 0,
  },
  hover: {
    background: 'rgba(253,252,250,0.08)',
    borderColor: 'rgba(253,252,250,0.22)',
    y: -4,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  tap: {
    y: -2,
    transition: { duration: 0.1 },
  },
}

interface CardProps {
  eyebrow: string
  title: string
  titleLine2: string
  description: string
  cta: string
  onClick: () => void
}

function CtaCard({ eyebrow, title, titleLine2, description, cta, onClick }: CardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className="cta-card"
      style={{
        position: 'relative',
        padding: '1.8rem',
        border: '0.5px solid',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        cursor: 'pointer',
        userSelect: 'none',
        overflow: 'hidden',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Inner shine on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(253,252,250,0.05) 0%, transparent 55%)',
          pointerEvents: 'none',
        }}
      />

      <p style={{
        fontSize: '0.6rem',
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        marginBottom: '0.9rem',
        fontWeight: 300,
        fontFamily: 'var(--font-jakarta)',
      }}>
        {eyebrow}
      </p>

      <h2 style={{
        fontFamily: 'var(--font-fraunces)',
        fontWeight: 200,
        fontSize: '1.75rem',
        letterSpacing: '0.02em',
        lineHeight: 1.05,
        marginBottom: '0.8rem',
        color: 'var(--cream)',
      }}>
        {title}<br />{titleLine2}
      </h2>

      <p style={{
        fontSize: '0.75rem',
        fontWeight: 200,
        lineHeight: 1.7,
        color: 'rgba(253,252,250,0.5)',
        marginBottom: '1.4rem',
        fontFamily: 'var(--font-jakarta)',
      }}>
        {description}
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontSize: '0.65rem',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'var(--cream)',
        fontWeight: 300,
        fontFamily: 'var(--font-jakarta)',
      }}>
        <motion.span
          initial={{ width: 22 }}
          whileHover={{ width: 38 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            display: 'inline-block',
            height: '0.5px',
            background: 'var(--gold)',
          }}
        />
        {cta}
      </div>
    </motion.div>
  )
}

export default function HeroContent({ visible, onOpenHost, onOpenOperator }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          {/* Top-left logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            style={{
              position: 'fixed',
              top: '1.8rem',
              left: '2rem',
              zIndex: 61,
            }}
          >
            <img src="/logo.png" alt="Island Key" style={{ height: 32, width: 'auto' }} />
          </motion.div>

          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'center' }}
          >
            <h1 className="hero-h1" style={{
              fontFamily: 'var(--font-fraunces)',
              fontWeight: 200,
              fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
              letterSpacing: '0.12em',
              lineHeight: 1,
              color: 'var(--cream)',
            }}>
              Island Key
            </h1>
            <p style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 200,
              fontSize: 'clamp(0.6rem, 1.2vw, 0.8rem)',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'rgba(253,252,250,0.45)',
              marginTop: '0.9rem',
            }}>
              Your Island Unlocked
            </p>
          </motion.div>

          {/* Hairline divider */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: 1,
              height: 48,
              background: 'linear-gradient(to bottom, transparent, rgba(196,165,90,0.4), transparent)',
              margin: '2.2rem auto',
            }}
          />

          {/* CTA cards */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="cta-row"
            style={{
              display: 'flex',
              gap: '1.25rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <CtaCard
              eyebrow="For Properties"
              title="I'm a"
              titleLine2="Host"
              description="Turn your property into a complete island experience for every guest who stays."
              cta="Unlock Hosting"
              onClick={onOpenHost}
            />
            <CtaCard
              eyebrow="For Businesses"
              title="I'm an"
              titleLine2="Operator"
              description="Become part of the island ecosystem. Reach guests who are ready to book."
              cta="Partner With Us"
              onClick={onOpenOperator}
            />
          </motion.div>

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ duration: 1.2, delay: 1.4 }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              left: 0,
              right: 0,
              zIndex: 61,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2rem',
            }}
          >
            {['About', null, 'How It Works', null, 'Contact'].map((item, i) =>
              item === null ? (
                <span
                  key={i}
                  style={{
                    width: 2,
                    height: 2,
                    borderRadius: '50%',
                    background: 'rgba(253,252,250,0.35)',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <a
                  key={item}
                  href={item === 'Contact' ? 'mailto:bookings@islandkey.gr' : '#'}
                  style={{
                    fontSize: '0.6rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--cream)',
                    textDecoration: 'none',
                    fontWeight: 200,
                    fontFamily: 'var(--font-jakarta)',
                    transition: 'opacity 0.3s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.6')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  {item}
                </a>
              )
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
