'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type FormType = 'host' | 'operator'
type Status = 'idle' | 'submitting' | 'success' | 'error'

interface Props {
  type: FormType
}

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']

// ── Field styles
const labelStyle: React.CSSProperties = {
  fontSize: '0.6rem',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  fontFamily: 'var(--font-jakarta)',
  fontWeight: 300,
  color: 'rgba(253,252,250,0.4)',
  display: 'block',
  marginBottom: '0.5rem',
}

const inputStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  borderBottom: '0.5px solid rgba(253,252,250,0.2)',
  color: 'var(--cream)',
  padding: '0.75rem 0',
  fontFamily: 'var(--font-jakarta)',
  fontWeight: 300,
  fontSize: '0.9rem',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.3s ease',
}

const SELECT_CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23C4A55A'/%3E%3C/svg%3E\")"

function Field({ label, children, optional }: { label: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <div style={{ marginBottom: '1.8rem' }}>
      <span style={labelStyle}>
        {label}
        {optional && <span style={{ opacity: 0.5, marginLeft: '0.5rem' }}>(optional)</span>}
      </span>
      {children}
    </div>
  )
}

function TextInput({ name, placeholder, type = 'text', required, value, onChange }: {
  name: string; placeholder?: string; type?: string; required?: boolean;
  value: string; onChange: (v: string) => void
}) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputStyle,
        borderBottomColor: focused ? 'var(--gold)' : 'rgba(253,252,250,0.2)',
      }}
    />
  )
}

function SelectInput({ name, options, placeholder, value, onChange }: {
  name: string; options: string[]; placeholder?: string;
  value: string; onChange: (v: string) => void
}) {
  const [focused, setFocused] = useState(false)
  return (
    <select
      name={name}
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputStyle,
        appearance: 'none',
        WebkitAppearance: 'none',
        backgroundImage: SELECT_CHEVRON,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 0 center',
        paddingRight: '1.5rem',
        borderBottomColor: focused ? 'var(--gold)' : 'rgba(253,252,250,0.2)',
        color: value ? 'var(--cream)' : 'rgba(253,252,250,0.2)',
      }}
    >
      <option value="" style={{ background: '#0e0e0e', color: 'var(--cream)' }}>{placeholder || 'Select...'}</option>
      {options.map(o => (
        <option key={o} value={o} style={{ background: '#0e0e0e', color: 'var(--cream)' }}>{o}</option>
      ))}
    </select>
  )
}

function TextArea({ name, placeholder, value, onChange }: {
  name: string; placeholder?: string; value: string; onChange: (v: string) => void
}) {
  const [focused, setFocused] = useState(false)
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputStyle,
        resize: 'none',
        minHeight: 100,
        borderBottomColor: focused ? 'var(--gold)' : 'rgba(253,252,250,0.2)',
      }}
    />
  )
}

function MultiSelect({ options, selected, onChange }: {
  options: string[]; selected: string[]; onChange: (v: string[]) => void
}) {
  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt])
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {options.map(opt => {
        const active = selected.includes(opt)
        return (
          <div
            key={opt}
            onClick={() => toggle(opt)}
            onMouseEnter={e => {
              if (!active) {
                e.currentTarget.style.borderColor = 'var(--gold)'
                e.currentTarget.style.background = 'rgba(196,165,90,0.08)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={e => {
              if (!active) {
                e.currentTarget.style.borderColor = 'rgba(196,165,90,0.4)'
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
            style={{
              border: `0.5px solid ${active ? 'var(--gold)' : 'rgba(196,165,90,0.4)'}`,
              background: active ? 'var(--gold)' : 'transparent',
              color: active ? 'var(--ink)' : 'var(--cream)',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '0.4rem 0.9rem',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 300,
            }}
          >
            {opt}
          </div>
        )
      })}
    </div>
  )
}

function RatingScale({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: '1.2rem', marginBottom: '0.6rem', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map(n => {
          const isActive = value >= n
          return (
            <div
              key={n}
              onClick={() => onChange(n)}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: `0.5px solid ${isActive ? 'var(--gold)' : 'rgba(253,252,250,0.15)'}`,
                background: isActive ? 'var(--gold)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.55rem',
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 300,
                color: isActive ? 'var(--ink)' : 'rgba(253,252,250,0.25)',
                transform: value === n ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {n}
            </div>
          )
        })}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.6rem',
        color: 'var(--cream)',
        opacity: 0.3,
        fontFamily: 'var(--font-jakarta)',
        fontWeight: 200,
        maxWidth: 28 * 5 + 19.2 * 4,
        letterSpacing: '0.05em',
      }}>
        <span>Not important</span>
        <span>Essential</span>
      </div>
    </div>
  )
}

// ── Checkmark SVG
function AnimatedCheck() {
  const pathRef = useRef<SVGPathElement>(null)
  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const length = path.getTotalLength()
    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length}`
    requestAnimationFrame(() => {
      path.style.transition = 'stroke-dashoffset 0.6s ease'
      path.style.strokeDashoffset = '0'
    })
  }, [])
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 2rem' }}>
      <path
        ref={pathRef}
        d="M4 12l6 6L20 6"
        stroke="var(--gold)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function EnquiryForm({ type }: Props) {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [status, setStatus] = useState<Status>('idle')
  const [data, setData] = useState<Record<string, string | string[] | number>>({})

  const set = (key: string, val: string | string[] | number) => {
    setData(prev => ({ ...prev, [key]: val }))
  }

  const next = () => {
    if (step < 5) {
      setDirection(1)
      setStep(s => s + 1)
    }
  }

  const back = () => {
    if (step > 1) {
      setDirection(-1)
      setStep(s => s - 1)
    }
  }

  const submit = async () => {
    setStatus('submitting')
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type }),
      })
      const json = await res.json()
      setStatus(json.success ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  // Check if current step is valid
  const isStepValid = () => {
    if (type === 'host') {
      switch (step) {
        case 1: return !!(data.property_name && data.property_type && data.location)
        case 2: return !!(data.unit_count && data.monthly_guests && (data.operating_months as string[] | undefined)?.length)
        case 3: return !!data.current_experience
        case 4: return !!(data.experience_importance && data.vision)
        case 5: return !!(data.contact_name && data.email && data.whatsapp)
      }
    } else {
      switch (step) {
        case 1: return !!(data.service_category && data.business_name && data.description)
        case 2: return !!(data.operating_location && (data.operating_months as string[] | undefined)?.length)
        case 3: return !!(data.weekly_capacity && data.advance_notice)
        case 4: return !!(data.years_operating && (data.booking_methods as string[] | undefined)?.length)
        case 5: return !!(data.contact_name && data.email && data.whatsapp)
      }
    }
    return false
  }

  const valid = isStepValid()

  const stepTitles = type === 'host'
    ? ['Your Property', 'Scale & Season', 'Guest Experience', 'Your Vision', 'Contact Details']
    : ['Your Service', 'Location & Season', 'Capacity', 'Background', 'Contact Details']

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', position: 'relative' }}>
        {/* Atmospheric radial glow behind checkmark */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,165,90,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <AnimatedCheck />
        <h3 style={{
          fontFamily: 'var(--font-fraunces)',
          fontWeight: 200,
          fontStyle: 'italic',
          fontSize: '2.2rem',
          color: 'var(--cream)',
          marginBottom: '1rem',
          position: 'relative',
        }}>
          Thank you.
        </h3>
        <p style={{
          fontFamily: 'var(--font-jakarta)',
          fontWeight: 300,
          fontSize: '0.85rem',
          color: 'var(--cream)',
          opacity: 0.55,
          maxWidth: 400,
          margin: '0 auto 2rem',
          lineHeight: 1.7,
        }}>
          We review every application personally. Spyros will be in touch on WhatsApp within 48 hours.
        </p>
        <div style={{
          width: 60,
          height: 1,
          background: 'var(--gold)',
          opacity: 0.4,
          margin: '0 auto 2rem',
        }} />
        <p style={{
          fontFamily: 'var(--font-jakarta)',
          fontWeight: 300,
          fontSize: '0.8rem',
          color: 'var(--cream)',
          opacity: 0.5,
          marginBottom: '1rem',
        }}>
          Know a property or local business that belongs in this network?
        </p>
        <a
          href="https://wa.me/?text=I%20just%20applied%20to%20Island%20Key%20%E2%80%94%20a%20new%20concierge%20platform%20launching%20in%20Crete.%20Thought%20you%20might%20be%20interested%3A%20www.islandkey.gr"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.7rem',
            textDecoration: 'none',
            color: 'var(--cream)',
            fontFamily: 'var(--font-jakarta)',
            fontWeight: 300,
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          <span style={{
            display: 'inline-block',
            width: 28,
            height: '0.5px',
            background: 'var(--gold)',
          }} />
          Share the link
        </a>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <h3 style={{
          fontFamily: 'var(--font-fraunces)',
          fontWeight: 200,
          fontSize: '1.5rem',
          color: 'var(--cream)',
          marginBottom: '1rem',
        }}>
          Something went wrong.
        </h3>
        <p style={{
          fontFamily: 'var(--font-jakarta)',
          fontWeight: 300,
          fontSize: '0.85rem',
          color: 'var(--cream)',
          opacity: 0.55,
        }}>
          WhatsApp us directly:{' '}
          <a
            href="https://wa.me/306974176759"
            style={{ color: 'var(--gold)', textDecoration: 'none' }}
          >
            +30 697 417 6759
          </a>
        </p>
      </div>
    )
  }

  const renderStep = () => {
    if (type === 'host') return renderHostStep()
    return renderOperatorStep()
  }

  const renderHostStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <Field label="Property name">
              <TextInput name="property_name" placeholder="Villa or hotel name" required value={(data.property_name as string) || ''} onChange={v => set('property_name', v)} />
            </Field>
            <Field label="Property type">
              <SelectInput name="property_type" value={(data.property_type as string) || ''} onChange={v => set('property_type', v)}
                options={['Private Villa', 'Boutique Hotel', 'Apartment or Studio', 'Holiday Home', 'Multiple Properties', 'Other']}
                placeholder="Select type"
              />
            </Field>
            <Field label="Location">
              <TextInput name="location" placeholder="Village or area — e.g. Old Town Chania" required value={(data.location as string) || ''} onChange={v => set('location', v)} />
            </Field>
          </div>
        )
      case 2:
        return (
          <div>
            <Field label="Bookable units or rooms">
              <SelectInput name="unit_count" value={(data.unit_count as string) || ''} onChange={v => set('unit_count', v)}
                options={['1', '2–4', '5–10', '11–20', '20+']}
                placeholder="Select range"
              />
            </Field>
            <Field label="Monthly guest stays (peak season)">
              <SelectInput name="monthly_guests" value={(data.monthly_guests as string) || ''} onChange={v => set('monthly_guests', v)}
                options={['Under 10', '10–25', '25–50', '50–100', '100+']}
                placeholder="Select range"
              />
            </Field>
            <Field label="Operating months">
              <MultiSelect options={MONTHS} selected={(data.operating_months as string[]) || []} onChange={v => set('operating_months', v)} />
            </Field>
          </div>
        )
      case 3:
        return (
          <div>
            <Field label="How do guests currently access local experiences?">
              <SelectInput name="current_experience" value={(data.current_experience as string) || ''} onChange={v => set('current_experience', v)}
                options={['WhatsApp or email recommendations', 'Printed welcome guide', 'Guests find things independently', 'No current system', 'Other']}
                placeholder="Select..."
              />
            </Field>
            <Field label="What do guests ask for most that you find difficult to arrange?" optional>
              <TextArea name="guest_requests" placeholder="e.g. transfers, activities, private dining..." value={(data.guest_requests as string) || ''} onChange={v => set('guest_requests', v)} />
            </Field>
          </div>
        )
      case 4:
        return (
          <div>
            <Field label="How important is the guest experience beyond the property?">
              <RatingScale value={(data.experience_importance as number) || 0} onChange={v => set('experience_importance', v)} />
            </Field>
            <Field label="What would you most like Island Key to do for your guests?">
              <TextArea name="vision" placeholder="There's no right answer. We want to understand your vision." value={(data.vision as string) || ''} onChange={v => set('vision', v)} />
            </Field>
          </div>
        )
      case 5:
        return (
          <div>
            <Field label="Your name">
              <TextInput name="contact_name" placeholder="Full name" required value={(data.contact_name as string) || ''} onChange={v => set('contact_name', v)} />
            </Field>
            <Field label="Email">
              <TextInput name="email" type="email" placeholder="your@email.com" required value={(data.email as string) || ''} onChange={v => set('email', v)} />
            </Field>
            <Field label="WhatsApp">
              <TextInput name="whatsapp" type="tel" placeholder="+30 ..." required value={(data.whatsapp as string) || ''} onChange={v => set('whatsapp', v)} />
            </Field>
            <Field label="Website or Instagram" optional>
              <TextInput name="website_or_instagram" placeholder="https://..." value={(data.website_or_instagram as string) || ''} onChange={v => set('website_or_instagram', v)} />
            </Field>
          </div>
        )
    }
  }

  const renderOperatorStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <Field label="Service category">
              <SelectInput name="service_category" value={(data.service_category as string) || ''} onChange={v => set('service_category', v)}
                options={['Boat Tours & Water', 'Hiking & Land Activities', 'Private Transfers', 'Car & Bike & ATV Rentals', 'Private Chef', 'Restaurant', 'Wellness & Spa', 'Beach Services', 'Photography', 'Other']}
                placeholder="Select category"
              />
            </Field>
            <Field label="Business name">
              <TextInput name="business_name" placeholder="Company or brand name" required value={(data.business_name as string) || ''} onChange={v => set('business_name', v)} />
            </Field>
            <Field label="Describe what you offer">
              <TextArea name="description" placeholder="Describe what you offer in one or two sentences" value={(data.description as string) || ''} onChange={v => set('description', v)} />
            </Field>
          </div>
        )
      case 2:
        return (
          <div>
            <Field label="Where on Crete do you operate?">
              <TextInput name="operating_location" placeholder="e.g. Chania area, western Crete" required value={(data.operating_location as string) || ''} onChange={v => set('operating_location', v)} />
            </Field>
            <Field label="Any areas you don't cover?" optional>
              <TextInput name="coverage_limits" placeholder="Optional" value={(data.coverage_limits as string) || ''} onChange={v => set('coverage_limits', v)} />
            </Field>
            <Field label="Operating months">
              <MultiSelect options={MONTHS} selected={(data.operating_months as string[]) || []} onChange={v => set('operating_months', v)} />
            </Field>
          </div>
        )
      case 3:
        return (
          <div>
            <Field label="Weekly bookings during peak season">
              <SelectInput name="weekly_capacity" value={(data.weekly_capacity as string) || ''} onChange={v => set('weekly_capacity', v)}
                options={['1–3', '4–10', '10–20', '20+', 'Flexible']}
                placeholder="Select range"
              />
            </Field>
            <Field label="Minimum group size" optional>
              <TextInput name="min_group_size" type="number" placeholder="If any" value={(data.min_group_size as string) || ''} onChange={v => set('min_group_size', v)} />
            </Field>
            <Field label="How much advance notice do you need?">
              <SelectInput name="advance_notice" value={(data.advance_notice as string) || ''} onChange={v => set('advance_notice', v)}
                options={['Same day', '24 hours', '2–3 days', '1 week+', 'Depends on request']}
                placeholder="Select..."
              />
            </Field>
          </div>
        )
      case 4:
        return (
          <div>
            <Field label="How long have you been operating?">
              <SelectInput name="years_operating" value={(data.years_operating as string) || ''} onChange={v => set('years_operating', v)}
                options={['Less than 1 year', '1–3 years', '3–7 years', '7+ years']}
                placeholder="Select..."
              />
            </Field>
            <Field label="Website, Instagram or Google listing" optional>
              <TextInput name="online_presence" placeholder="https://..." value={(data.online_presence as string) || ''} onChange={v => set('online_presence', v)} />
            </Field>
            <Field label="How are you currently receiving bookings?">
              <MultiSelect
                options={['WhatsApp or phone', 'Hotel & villa referrals', 'Viator or GetYourGuide', 'Direct website', 'Walk-in', 'Other']}
                selected={(data.booking_methods as string[]) || []}
                onChange={v => set('booking_methods', v)}
              />
            </Field>
          </div>
        )
      case 5:
        return (
          <div>
            <Field label="Your name">
              <TextInput name="contact_name" placeholder="Full name" required value={(data.contact_name as string) || ''} onChange={v => set('contact_name', v)} />
            </Field>
            <Field label="Email">
              <TextInput name="email" type="email" placeholder="your@email.com" required value={(data.email as string) || ''} onChange={v => set('email', v)} />
            </Field>
            <Field label="WhatsApp">
              <TextInput name="whatsapp" type="tel" placeholder="+30 ..." required value={(data.whatsapp as string) || ''} onChange={v => set('whatsapp', v)} />
            </Field>
          </div>
        )
    }
  }

  return (
    <div style={{ maxWidth: 520 }}>
      {/* Progress bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2.5rem',
      }}>
        <div style={{
          flex: 1,
          height: 1,
          background: 'rgba(253,252,250,0.1)',
          position: 'relative',
          marginRight: '1rem',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: 1,
            background: 'var(--gold)',
            width: `${(step / 5) * 100}%`,
            transition: 'width 0.5s ease-in-out',
          }} />
        </div>
        <span style={{
          fontSize: '0.65rem',
          color: 'var(--cream)',
          opacity: 0.35,
          fontFamily: 'var(--font-jakarta)',
          fontWeight: 300,
          whiteSpace: 'nowrap',
        }}>
          {step} / 5
        </span>
      </div>

      {/* Step context title */}
      <p style={{
        fontFamily: 'var(--font-fraunces)',
        fontWeight: 200,
        fontStyle: 'italic',
        fontSize: '1.1rem',
        color: 'var(--gold)',
        opacity: 0.6,
        marginBottom: '1.8rem',
        letterSpacing: '0.02em',
      }}>
        {stepTitles[step - 1]}
      </p>

      {/* Step content */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: direction * 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '2rem',
      }}>
        {step > 1 ? (
          <div
            onClick={back}
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 300,
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--cream)',
              opacity: 0.4,
              cursor: 'pointer',
              background: 'none',
              border: 'none',
            }}
          >
            Back
          </div>
        ) : (
          <div />
        )}

        {step < 5 ? (
          <div
            onClick={valid ? next : undefined}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.7rem',
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 300,
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--cream)',
              cursor: valid ? 'pointer' : 'not-allowed',
              opacity: valid ? 1 : 0.25,
            }}
          >
            Next
            <span style={{
              display: 'inline-block',
              width: 28,
              height: '0.5px',
              background: 'var(--gold)',
            }} />
          </div>
        ) : (
          <div
            onClick={valid && status !== 'submitting' ? submit : undefined}
            style={{
              flex: 1,
              marginLeft: step > 1 ? '2rem' : 0,
              background: 'var(--teal)',
              color: 'var(--cream)',
              padding: '0.9rem 2rem',
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 300,
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textAlign: 'center',
              cursor: valid && status !== 'submitting' ? 'pointer' : 'not-allowed',
              opacity: valid ? 1 : 0.25,
              border: 'none',
              transition: 'opacity 0.3s ease',
            }}
          >
            {status === 'submitting' ? 'Sending...' : 'Submit application'}
          </div>
        )}
      </div>
    </div>
  )
}
