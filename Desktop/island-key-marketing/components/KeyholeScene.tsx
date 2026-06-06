'use client'

import { useEffect, useRef } from 'react'

// ── Future-proofing: flip to true when /videos/reel.mp4 is ready
export const REEL_READY = false

const BG_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=1920&q=85&auto=format&fit=crop', pos: 'center 70%' },
  { url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1920&q=85&auto=format&fit=crop', pos: 'center center' },
  { url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=85&auto=format&fit=crop', pos: 'center center' },
  { url: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=1920&q=85&auto=format&fit=crop', pos: 'center 60%' },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85&auto=format&fit=crop', pos: 'center 40%' },
  { url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1920&q=85&auto=format&fit=crop', pos: 'center 70%' },
]

// ── SVG geometry constants (viewBox 1000 × 700)
const CX = 500, CY = 315
const CR = 112, SW = 78, SH = 168, STAPER = 0.68

function buildCurtainPath(scale: number): string {
  const r  = CR * scale
  const sw = SW * scale
  const sh = SH * scale
  const stemTop = CY + r
  const stemBot = stemTop + sh
  const taperW  = sw * STAPER

  const outerRect = 'M 0 0 H 1000 V 700 H 0 Z'
  const circle    = `M ${CX - r} ${CY} A ${r} ${r} 0 1 1 ${CX + r} ${CY} A ${r} ${r} 0 1 1 ${CX - r} ${CY} Z`
  const stem      = `M ${CX - sw / 2} ${stemTop} L ${CX + sw / 2} ${stemTop} L ${CX + taperW / 2} ${stemBot} L ${CX - taperW / 2} ${stemBot} Z`
  return `${outerRect} ${circle} ${stem}`
}

function buildGlowPath(scale: number): string {
  const r  = CR * scale
  const sw = SW * scale
  const sh = SH * scale
  const stemTop = CY + r
  const stemBot = stemTop + sh
  const taperW  = sw * STAPER

  const circle = `M ${CX - r} ${CY} A ${r} ${r} 0 1 1 ${CX + r} ${CY} A ${r} ${r} 0 1 1 ${CX - r} ${CY} Z`
  const stem   = `M ${CX - sw / 2} ${stemTop} L ${CX + sw / 2} ${stemTop} L ${CX + taperW / 2} ${stemBot} L ${CX - taperW / 2} ${stemBot} Z`
  return `${circle} ${stem}`
}

// ── Easings
function easeOutCubic(t: number)   { return 1 - Math.pow(1 - t, 3) }
function easeInOutCubic(t: number) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 }

// ── Phase durations (ms)
const PHASES = {
  WAIT:   500,
  APPEAR: 900,
  HOLD:   3800,
  EXPAND: 2400,
}

interface Props {
  onHeroReady: () => void
}

export default function KeyholeScene({ onHeroReady }: Props) {
  const curtainPathRef  = useRef<SVGPathElement>(null)
  const glowPathRef     = useRef<SVGPathElement>(null)
  const glowSvgRef      = useRef<SVGSVGElement>(null)
  const curtainSvgRef   = useRef<SVGSVGElement>(null)
  const framesRef       = useRef<HTMLDivElement[]>([])
  const heroReadyCalled = useRef(false)
  // Store callback in a ref so the animation effect never needs to re-run
  const onHeroReadyRef  = useRef(onHeroReady)
  useEffect(() => { onHeroReadyRef.current = onHeroReady }, [onHeroReady])

  const rafRef      = useRef<number>(0)
  const phaseRef    = useRef<'WAIT' | 'APPEAR' | 'HOLD' | 'EXPAND' | 'DONE'>('WAIT')
  const phaseT0Ref  = useRef<number | null>(null)
  const frameIdxRef = useRef(0)
  const cycleRef    = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const curtainPath = curtainPathRef.current
    const glowPath    = glowPathRef.current
    const glowSvg     = glowSvgRef.current
    const curtainSvg  = curtainSvgRef.current
    if (!curtainPath || !glowPath || !glowSvg || !curtainSvg) return

    // Show first frame
    framesRef.current[0]?.style && (framesRef.current[0].style.opacity = '1')

    const nextFrame = () => {
      if (framesRef.current[frameIdxRef.current]) {
        framesRef.current[frameIdxRef.current].style.opacity = '0'
      }
      frameIdxRef.current = (frameIdxRef.current + 1) % BG_IMAGES.length
      if (framesRef.current[frameIdxRef.current]) {
        framesRef.current[frameIdxRef.current].style.opacity = '1'
      }
    }

    const startCycle = () => {
      if (cycleRef.current) return
      cycleRef.current = setInterval(nextFrame, 1900)
    }

    const stopCycle = () => {
      if (cycleRef.current) {
        clearInterval(cycleRef.current)
        cycleRef.current = null
      }
    }

    const animate = (ts: number) => {
      if (phaseT0Ref.current === null) phaseT0Ref.current = ts
      const elapsed = ts - phaseT0Ref.current

      switch (phaseRef.current) {
        case 'WAIT': {
          curtainPath.setAttribute('d', buildCurtainPath(0))
          if (elapsed >= PHASES.WAIT) {
            phaseRef.current = 'APPEAR'
            phaseT0Ref.current = ts
          }
          break
        }

        case 'APPEAR': {
          const t = Math.min(elapsed / PHASES.APPEAR, 1)
          const s = easeOutCubic(t)
          curtainPath.setAttribute('d', buildCurtainPath(s))
          glowPath.setAttribute('d', buildGlowPath(s))
          if (t >= 0.3) glowSvg.style.opacity = String(easeOutCubic(t) * 0.6)
          if (t >= 1) {
            phaseRef.current = 'HOLD'
            phaseT0Ref.current = ts
            glowSvg.style.animation = 'glowPulse 2s ease-in-out infinite'
            startCycle()
          }
          break
        }

        case 'HOLD': {
          curtainPath.setAttribute('d', buildCurtainPath(1))
          if (elapsed >= PHASES.HOLD) {
            phaseRef.current = 'EXPAND'
            phaseT0Ref.current = ts
            glowSvg.style.animation = ''
            glowSvg.style.transition = 'opacity 0.5s ease'
            glowSvg.style.opacity = '0'
            stopCycle()
          }
          break
        }

        case 'EXPAND': {
          const t = Math.min(elapsed / PHASES.EXPAND, 1)
          const s = 1 + easeInOutCubic(t) * 26
          curtainPath.setAttribute('d', buildCurtainPath(s))

          if (t >= 0.6 && !heroReadyCalled.current) {
            heroReadyCalled.current = true
            onHeroReadyRef.current()
          }

          if (t >= 1) {
            phaseRef.current = 'DONE'
            curtainSvg.style.transition = 'opacity 0.6s ease'
            curtainSvg.style.opacity = '0'
            return
          }
          break
        }

        case 'DONE':
          return
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      stopCycle()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* Background reel */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: '#0d1a2e',
        }}
      >
        {REEL_READY ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src="/videos/reel.mp4" type="video/mp4" />
          </video>
        ) : (
          BG_IMAGES.map((img, i) => (
            <div
              key={i}
              ref={el => { if (el) framesRef.current[i] = el }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url('${img.url}')`,
                backgroundSize: 'cover',
                backgroundPosition: img.pos,
                opacity: 0,
                transition: 'opacity 2s ease',
                backgroundColor: '#0d1a2e',
              }}
            />
          ))
        )}
      </div>

      {/* Vignette */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Grain */}
      <div
        style={{
          position: 'fixed',
          inset: '-100%',
          zIndex: 2,
          width: '300%',
          height: '300%',
          opacity: 0.04,
          pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          animation: 'grain 0.4s steps(1) infinite',
        }}
      />

      {/* Keyhole glow outline (z-index 49) */}
      <svg
        ref={glowSvgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 49,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0,
        }}
      >
        <defs>
          <filter id="keyholeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          ref={glowPathRef}
          fill="none"
          stroke="rgba(196, 165, 90, 0.3)"
          strokeWidth="1"
          filter="url(#keyholeGlow)"
        />
      </svg>

      {/* Curtain SVG (z-index 50) */}
      <svg
        ref={curtainSvgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <clipPath id="keyholeClip" clipPathUnits="userSpaceOnUse">
            <path
              ref={curtainPathRef}
              fillRule="evenodd"
              d="M 0 0 H 1000 V 700 H 0 Z"
            />
          </clipPath>
        </defs>
        <rect
          width="1000"
          height="700"
          fill="black"
          clipPath="url(#keyholeClip)"
        />
      </svg>
    </>
  )
}
