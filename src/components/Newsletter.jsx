import { colors, fonts, sectionStyle } from '../theme'
import Reveal from './Reveal'

export default function Newsletter() {
  return (
    <section style={sectionStyle('clamp(24px,4vw,48px) 24px')}>
      <Reveal
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          background: 'linear-gradient(120deg,#FF6B35,#FF8A4C)',
          padding: 'clamp(40px,6vw,64px) clamp(24px,5vw,56px)',
          textAlign: 'center',
        }}
      >
        <div style={{ position: 'absolute', top: -50, left: -30, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,.12)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -20, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,209,102,.28)' }} />
        <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: 'clamp(28px,3.6vw,42px)',
              letterSpacing: '-.02em',
              color: '#fff',
              margin: 0,
            }}
          >
            Get 15% off your first order
          </h2>
          <p style={{ color: 'rgba(255,255,255,.92)', fontWeight: 500, fontSize: 16, margin: '14px 0 28px' }}>
            Join the Lumora list for early access to drops, members-only deals and styling inspiration.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 480, margin: '0 auto' }}
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              style={{
                flex: 1,
                minWidth: 220,
                border: 'none',
                outline: 'none',
                borderRadius: 13,
                padding: '16px 18px',
                fontFamily: fonts.body,
                fontSize: 15,
                color: colors.ink,
                boxShadow: '0 8px 20px rgba(30,41,59,.12)',
              }}
            />
            <button
              type="submit"
              className="subscribe-btn"
              style={{
                background: colors.ink,
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: 15,
                padding: '16px 28px',
                borderRadius: 13,
                cursor: 'pointer',
              }}
            >
              Subscribe
            </button>
          </form>
          <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 12, fontWeight: 500, margin: '16px 0 0' }}>
            No spam, unsubscribe anytime.
          </p>
        </div>
      </Reveal>
    </section>
  )
}
