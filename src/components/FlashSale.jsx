import { Link } from 'react-router-dom'
import { colors, fonts } from '../theme'
import { useCountdown } from '../hooks/useCountdown'
import Reveal from './Reveal'

function CountdownBox({ value, label, accent }) {
  return (
    <div
      style={{
        background: accent ? 'rgba(255,107,53,.18)' : 'rgba(255,255,255,.06)',
        border: accent ? '1px solid rgba(255,107,53,.4)' : '1px solid rgba(255,255,255,.12)',
        borderRadius: 16,
        width: 78,
        padding: '16px 0',
        textAlign: 'center',
      }}
    >
      <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 34, color: accent ? colors.amber : '#fff', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: accent ? colors.amber : colors.faint, fontWeight: 700, letterSpacing: '.1em', marginTop: 7 }}>
        {label}
      </div>
    </div>
  )
}

export default function FlashSale({ saleHours = 32, saleMinutes = 45 }) {
  const { days, hours, mins, secs } = useCountdown(saleHours, saleMinutes)

  const boxes = [
    { value: days, label: 'DAYS' },
    { value: hours, label: 'HRS' },
    { value: mins, label: 'MIN' },
    { value: secs, label: 'SEC', accent: true },
  ]

  return (
    <section style={{ maxWidth: 1280, margin: 'clamp(24px,4vw,48px) auto', padding: '0 24px' }}>
      <Reveal
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          background: colors.ink,
          padding: 'clamp(36px,5vw,56px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
          gap: 32,
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'absolute', top: -60, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,.35), transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -70, left: '30%', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,209,102,.22), transparent 70%)' }} />

        <div style={{ position: 'relative' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,107,53,.18)',
              color: colors.amber,
              fontWeight: 800,
              fontSize: 13,
              padding: '8px 14px',
              borderRadius: 99,
              letterSpacing: '.04em',
            }}
          >
            ⚡ FLASH SALE
          </span>
          <h2
            style={{
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: 'clamp(30px,4vw,46px)',
              letterSpacing: '-.02em',
              color: '#fff',
              margin: '18px 0 0',
              lineHeight: 1.05,
            }}
          >
            Up to 50% off<br />this weekend only
          </h2>
          <p style={{ color: colors.faint, fontWeight: 500, fontSize: 16, margin: '16px 0 0', maxWidth: 420 }}>
            Hundreds of premium pieces at their lowest prices. Once they're gone, they're gone.
          </p>
          <Link
            to="/shop"
            className="sale-btn"
            style={{
              display: 'inline-block',
              marginTop: 26,
              textDecoration: 'none',
              background: colors.brand,
              color: '#fff',
              fontWeight: 700,
              fontSize: 16,
              padding: '15px 30px',
              borderRadius: 13,
              boxShadow: '0 14px 30px rgba(255,107,53,.4)',
            }}
          >
            Grab the deals
          </Link>
        </div>

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <span style={{ color: '#CBD5E1', fontWeight: 700, fontSize: 13, letterSpacing: '.12em', textTransform: 'uppercase' }}>
            Ends in
          </span>
          <div style={{ display: 'flex', gap: 12 }}>
            {boxes.map((b) => (
              <CountdownBox key={b.label} {...b} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
