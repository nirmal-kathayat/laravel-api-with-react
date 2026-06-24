import { colors, fonts, sectionStyle } from '../theme'
import { testimonials } from '../data.jsx'
import Reveal from './Reveal'

function TestimonialCard({ name, role, initials, tint, text }) {
  return (
    <>
      <div style={{ color: colors.amber, fontSize: 16, letterSpacing: 1 }}>★★★★★</div>
      <p style={{ fontSize: 16, lineHeight: 1.6, color: colors.inkSoft, fontWeight: 500, margin: '16px 0 24px' }}>
        &ldquo;{text}&rdquo;
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: tint,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: colors.ink,
            fontSize: 16,
          }}
        >
          {initials}
        </span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: colors.ink }}>{name}</div>
          <div style={{ fontSize: 13, color: colors.faint, fontWeight: 600 }}>{role}</div>
        </div>
      </div>
    </>
  )
}

export default function Testimonials() {
  return (
    <section style={sectionStyle('clamp(40px,5vw,64px) 24px')}>
      <div style={{ textAlign: 'center', marginBottom: 38 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: colors.brand, letterSpacing: '.08em', textTransform: 'uppercase' }}>
          Real reviews
        </span>
        <h2
          style={{
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: 'clamp(28px,3.4vw,40px)',
            letterSpacing: '-.02em',
            margin: '8px 0 0',
            color: colors.ink,
          }}
        >
          Loved by 50,000+ shoppers
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 22 }}>
        {testimonials.map((r) => (
          <Reveal
            key={r.name}
            style={{
              background: colors.white,
              border: `1px solid ${colors.lineSoft}`,
              borderRadius: 22,
              padding: 28,
              boxShadow: '0 1px 2px rgba(16,24,40,.04)',
            }}
          >
            <TestimonialCard {...r} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
