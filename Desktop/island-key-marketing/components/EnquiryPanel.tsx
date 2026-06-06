'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type PanelType = 'host' | 'operator' | null
type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface Props {
  type: PanelType
  onClose: () => void
}

// ── Shared input styles
const inputStyle: React.CSSProperties = {
  background: 'rgba(253,252,250,0.04)',
  border: '0.5px solid rgba(253,252,250,0.1)',
  color: 'var(--cream)',
  padding: '0.75rem 1rem',
  fontFamily: 'var(--font-jakarta)',
  fontSize: '0.82rem',
  fontWeight: 200,
  outline: 'none',
  width: '100%',
  WebkitAppearance: 'none',
  appearance: 'none',
  transition: 'border-color 0.3s ease',
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.6rem',
  letterSpacing: '0.25em',
  textTransform: 'uppercase' as const,
  color: 'rgba(253,252,250,0.35)',
  fontWeight: 300,
  fontFamily: 'var(--font-jakarta)',
  display: 'block',
  marginBottom: '0.4rem',
}

const SELECT_CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(253,252,250,0.3)'/%3E%3C/svg%3E\")"

function FormField({
  label,
  children,
  full,
}: {
  label: string
  children: React.ReactNode
  full?: boolean
}) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : undefined }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      {...props}
      style={{
        ...inputStyle,
        borderColor: focused ? 'rgba(253,252,250,0.3)' : 'rgba(253,252,250,0.1)',
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  )
}

function StyledSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const [focused, setFocused] = useState(false)
  return (
    <select
      {...props}
      style={{
        ...inputStyle,
        backgroundImage: SELECT_CHEVRON,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 1rem center',
        paddingRight: '2.5rem',
        borderColor: focused ? 'rgba(253,252,250,0.3)' : 'rgba(253,252,250,0.1)',
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {props.children}
    </select>
  )
}

// ── Host form
function HostForm({ onSubmit, formState }: { onSubmit: (data: Record<string, string>) => void; formState: FormState }) {
  const ref = useRef<HTMLFormElement>(null)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fd = new FormData(ref.current!)
    onSubmit({
      type: 'host',
      name: fd.get('name') as string,
      propertyName: fd.get('propertyName') as string,
      propertyType: fd.get('propertyType') as string,
      units: fd.get('units') as string,
      location: fd.get('location') as string,
      phone: fd.get('phone') as string,
      email: fd.get('email') as string,
    })
  }

  return (
    <form ref={ref} onSubmit={handleSubmit}>
      <div className="form-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <FormField label="Your Name">
          <StyledInput name="name" type="text" placeholder="First name" required />
        </FormField>
        <FormField label="Property Name">
          <StyledInput name="propertyName" type="text" placeholder="Villa / Hotel name" />
        </FormField>
        <FormField label="Property Type">
          <StyledSelect name="propertyType">
            <option value="">Select type</option>
            <option>Private Villa</option>
            <option>Boutique Hotel</option>
            <option>Apartment / Studio</option>
            <option>Multiple Properties</option>
          </StyledSelect>
        </FormField>
        <FormField label="Units / Rooms">
          <StyledSelect name="units">
            <option value="">Select range</option>
            <option>1</option>
            <option>2 – 5</option>
            <option>6 – 15</option>
            <option>15+</option>
          </StyledSelect>
        </FormField>
        <FormField label="Location">
          <StyledInput name="location" type="text" placeholder="Chania, Rethymnon, Heraklion..." required />
        </FormField>
        <FormField label="WhatsApp / Phone">
          <StyledInput name="phone" type="tel" placeholder="+30 ..." required />
        </FormField>
        <FormField label="Email" full>
          <StyledInput name="email" type="email" placeholder="your@email.com" required />
        </FormField>
      </div>
      <SubmitButton label="Request Access →" formState={formState} />
    </form>
  )
}

// ── Operator form
function OperatorForm({ onSubmit, formState }: { onSubmit: (data: Record<string, string>) => void; formState: FormState }) {
  const ref = useRef<HTMLFormElement>(null)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fd = new FormData(ref.current!)
    onSubmit({
      type: 'operator',
      name: fd.get('name') as string,
      businessName: fd.get('businessName') as string,
      serviceCategory: fd.get('serviceCategory') as string,
      location: fd.get('location') as string,
      phone: fd.get('phone') as string,
      email: fd.get('email') as string,
    })
  }

  return (
    <form ref={ref} onSubmit={handleSubmit}>
      <div className="form-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <FormField label="Your Name">
          <StyledInput name="name" type="text" placeholder="First name" required />
        </FormField>
        <FormField label="Business Name">
          <StyledInput name="businessName" type="text" placeholder="Company / brand name" />
        </FormField>
        <FormField label="Service Category">
          <StyledSelect name="serviceCategory">
            <option value="">Select category</option>
            <option>Boat Tours &amp; Water</option>
            <option>Hiking &amp; Land Activities</option>
            <option>Private Transfers</option>
            <option>Car / Bike Rentals</option>
            <option>Restaurants &amp; Dining</option>
            <option>Wellness &amp; Spa</option>
            <option>Beach Services</option>
            <option>Photography</option>
            <option>Other</option>
          </StyledSelect>
        </FormField>
        <FormField label="Location">
          <StyledInput name="location" type="text" placeholder="Chania, Rethymnon..." required />
        </FormField>
        <FormField label="WhatsApp">
          <StyledInput name="phone" type="tel" placeholder="+30 ..." required />
        </FormField>
        <FormField label="Email">
          <StyledInput name="email" type="email" placeholder="your@email.com" required />
        </FormField>
      </div>
      <SubmitButton label="Send Enquiry →" formState={formState} />
    </form>
  )
}

function SubmitButton({ label, formState }: { label: string; formState: FormState }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      type="submit"
      disabled={formState === 'submitting'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        marginTop: '1.5rem',
        width: '100%',
        padding: '0.95rem',
        background: hovered && formState !== 'submitting' ? '#1d9d8f' : '#1A8A7D',
        color: 'var(--cream)',
        border: 'none',
        fontFamily: 'var(--font-jakarta)',
        fontSize: '0.7rem',
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        fontWeight: 300,
        cursor: formState === 'submitting' ? 'default' : 'pointer',
        transform: hovered && formState !== 'submitting' ? 'translateY(-1px)' : 'none',
        transition: 'background 0.3s, transform 0.2s',
        opacity: formState === 'submitting' ? 0.7 : 1,
      }}
    >
      {formState === 'submitting' ? 'Sending...' : label}
    </button>
  )
}

export default function EnquiryPanel({ type, onClose }: Props) {
  const [formState, setFormState] = useState<FormState>('idle')

  // Reset state when panel type changes
  useEffect(() => {
    setFormState('idle')
  }, [type])

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSubmit = async (data: Record<string, string>) => {
    setFormState('submitting')
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.success) {
        setFormState('success')
      } else {
        setFormState('error')
      }
    } catch {
      setFormState('error')
    }
  }

  const isHost = type === 'host'
  const eyebrow = isHost ? 'Hosting Partnership' : 'Operator Partnership'
  const title   = isHost ? 'Transform every stay.' : 'Join the ecosystem.'
  const sub     = isHost
    ? "Tell us about your property. We'll be in touch within 24 hours."
    : 'Connect your service to curated guests at premium properties across the island.'

  return (
    <AnimatePresence>
      {type !== null && (
        // Overlay
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0,0,0,0.82)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          {/* Panel — stop propagation so clicking it doesn't close */}
          <motion.div
            key="panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            className="enquiry-panel"
            style={{
              width: '100%',
              maxWidth: 600,
              background: '#0a1420',
              border: '0.5px solid rgba(253,252,250,0.1)',
              borderBottom: 'none',
              padding: 'clamp(2rem, 5vw, 3rem)',
              paddingBottom: 'clamp(3rem, 6vw, 4rem)',
              position: 'relative',
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                opacity: 0.4,
                background: 'none',
                border: 'none',
                color: 'var(--cream)',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-jakarta)',
                letterSpacing: '0.1em',
                transition: 'opacity 0.3s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}
            >
              ✕ close
            </button>

            {/* Header */}
            <p style={{
              fontSize: '0.6rem',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '0.7rem',
              fontWeight: 300,
              fontFamily: 'var(--font-jakarta)',
            }}>
              {eyebrow}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-fraunces)',
              fontWeight: 200,
              fontSize: '2rem',
              marginBottom: '0.4rem',
              lineHeight: 1.1,
              color: 'var(--cream)',
            }}>
              {title}
            </h2>
            <p style={{
              fontSize: '0.8rem',
              fontWeight: 200,
              color: 'rgba(253,252,250,0.45)',
              marginBottom: '2.5rem',
              lineHeight: 1.7,
              fontFamily: 'var(--font-jakarta)',
            }}>
              {sub}
            </p>

            {/* Form or feedback */}
            {formState === 'success' ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem 0',
                color: 'rgba(253,252,250,0.7)',
                fontFamily: 'var(--font-jakarta)',
                fontSize: '0.85rem',
                lineHeight: 1.8,
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>✓</div>
                <p>We&apos;ll be in touch within 24 hours.</p>
              </div>
            ) : formState === 'error' ? (
              <div style={{
                color: 'rgba(253,252,250,0.55)',
                fontFamily: 'var(--font-jakarta)',
                fontSize: '0.8rem',
                lineHeight: 1.8,
                marginBottom: '1.5rem',
              }}>
                <p>Something went wrong.</p>
                <p>WhatsApp us directly: <a href="https://wa.me/306974176759" style={{ color: 'var(--gold)', textDecoration: 'none' }}>+30 697 417 6759</a></p>
              </div>
            ) : (
              isHost
                ? <HostForm onSubmit={handleSubmit} formState={formState} />
                : <OperatorForm onSubmit={handleSubmit} formState={formState} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
