import { Fragment, useState } from 'react'
import { colors, fonts, dottedBg, sectionStyle } from '../theme'
import { heroImage } from '../data.jsx'
import { Truck } from './common/Icons'

const stats = [
  { value: '50k+', label: 'Happy customers' },
  { value: '4.9', star: true, label: 'Average rating' },
  { value: '2k+', label: 'Premium products' },
]

const Stat = ({ value, label, star }) => (
  <div>
    <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 26, color: colors.ink }}>
      {value}
      {star && <span style={{ color: colors.amber }}>★</span>}
    </div>
    <div style={{ fontSize: 13, color: colors.faint, fontWeight: 600 }}>{label}</div>
  </div>
)

export default function Hero() {
  const [heroFailed, setHeroFailed] = useState(!heroImage)

  return (
    <section style={sectionStyle('clamp(40px,6vw,80px) 24px clamp(30px,4vw,56px)')}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))',
          gap: 'clamp(32px,5vw,72px)',
          alignItems: 'center',
        }}
      >
        {/* Copy column */}
        <div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: colors.brandSoft,
              color: colors.brand,
              fontWeight: 700,
              fontSize: 13,
              padding: '8px 14px',
              borderRadius: 99,
              letterSpacing: '.01em',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: colors.brand }} />
            New season • Curated drops
          </span>
          <h1
            style={{
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: 'clamp(40px,6vw,68px)',
              lineHeight: 1.02,
              letterSpacing: '-.03em',
              margin: '22px 0 0',
              color: colors.ink,
            }}
          >
            Shop Smarter,<br />
            <span style={{ color: colors.brand }}>Live Better</span>
          </h1>
          <p
            style={{
              fontSize: 'clamp(16px,1.6vw,18px)',
              lineHeight: 1.65,
              color: colors.muted,
              maxWidth: 480,
              margin: '22px 0 0',
              fontWeight: 500,
            }}
          >
            Discover thoughtfully curated essentials for a more beautiful everyday. Premium quality,
            honest pricing, and delivery that just works.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 34 }}>
            <a
              href="#deals"
              className="btn-primary"
              style={{
                textDecoration: 'none',
                background: colors.brand,
                color: '#fff',
                fontWeight: 700,
                fontSize: 16,
                padding: '16px 30px',
                borderRadius: 14,
                boxShadow: '0 12px 28px rgba(255,107,53,.34)',
              }}
            >
              Shop Now
            </a>
            <a
              href="#categories"
              className="btn-outline"
              style={{
                textDecoration: 'none',
                background: colors.white,
                color: colors.ink,
                fontWeight: 700,
                fontSize: 16,
                padding: '16px 30px',
                borderRadius: 14,
                border: `1px solid ${colors.line}`,
              }}
            >
              Explore Collections
            </a>
          </div>
          <div style={{ display: 'flex', gap: 32, marginTop: 42, flexWrap: 'wrap' }}>
            {stats.map((s, i) => (
              <Fragment key={s.label}>
                {i > 0 && <div style={{ width: 1, background: colors.line }} />}
                <Stat {...s} />
              </Fragment>
            ))}
          </div>
        </div>

        {/* Visual column */}
        <div style={{ position: 'relative', minHeight: 440 }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 28,
              overflow: 'hidden',
              backgroundColor: '#E9EEF4',
              backgroundImage: dottedBg(0.05),
              backgroundSize: '22px 22px',
              boxShadow: '0 30px 60px rgba(30,41,59,.14)',
            }}
          >
            {!heroFailed && (
              <img
                src={heroImage}
                alt="Curated lifestyle products"
                onError={() => setHeroFailed(true)}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            )}
            {heroFailed && (
              <span
                style={{
                  position: 'absolute',
                  bottom: 18,
                  left: 18,
                  fontFamily: fonts.mono,
                  fontSize: 11,
                  letterSpacing: '.08em',
                  color: colors.muted,
                  background: 'rgba(255,255,255,.7)',
                  padding: '5px 9px',
                  borderRadius: 6,
                }}
              >
                HERO_LIFESTYLE.jpg
              </span>
            )}
          </div>

          {/* Floating discount badge */}
          <div
            style={{
              position: 'absolute',
              top: -14,
              right: -10,
              width: 96,
              height: 96,
              borderRadius: '50%',
              background: colors.amber,
              color: colors.ink,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 14px 28px rgba(255,209,102,.5)',
              animation: 'floaty 6s ease-in-out infinite',
            }}
          >
            <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 22, lineHeight: 1 }}>-30%</span>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em' }}>TODAY</span>
          </div>

          {/* Floating delivery card */}
          <div
            style={{
              position: 'absolute',
              bottom: 24,
              left: -16,
              background: colors.white,
              borderRadius: 16,
              padding: '14px 16px',
              boxShadow: '0 16px 34px rgba(30,41,59,.16)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              animation: 'floatyB 7s ease-in-out infinite',
            }}
          >
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: colors.brandSoft,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Truck size={20} />
            </span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: colors.ink }}>Free Delivery</div>
              <div style={{ fontSize: 12, color: colors.faint, fontWeight: 600 }}>Arrives in 2 days</div>
            </div>
          </div>

          {/* Floating rating card */}
          <div
            style={{
              position: 'absolute',
              top: 28,
              left: -12,
              background: colors.white,
              borderRadius: 14,
              padding: '11px 15px',
              boxShadow: '0 16px 34px rgba(30,41,59,.16)',
              animation: 'floaty 8s ease-in-out infinite',
            }}
          >
            <div style={{ color: colors.amber, fontSize: 14, letterSpacing: 1 }}>★★★★★</div>
            <div style={{ fontSize: 12, color: colors.muted, fontWeight: 700, marginTop: 2 }}>12,480 reviews</div>
          </div>
        </div>
      </div>
    </section>
  )
}
