import { colors, fonts, layout } from '../theme'
import { footerColumns, socials, payments } from '../data.jsx'
import Logo from './common/Logo'

const linkStyle = { textDecoration: 'none', color: colors.faint, fontSize: 14, fontWeight: 600 }

export default function Footer() {
  return (
    <footer style={{ background: colors.ink, color: '#CBD5E1', marginTop: 'clamp(40px,5vw,72px)' }}>
      <div style={{ maxWidth: layout.maxWidth, margin: '0 auto', padding: 'clamp(48px,5vw,72px) 24px clamp(28px,3vw,40px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 40 }}>
          {/* Brand column */}
          <div style={{ gridColumn: 'span 1', minWidth: 220 }}>
            <div style={{ marginBottom: 18 }}>
              <Logo dark />
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: colors.faint, fontWeight: 500, maxWidth: 280, margin: '0 0 20px' }}>
              Premium everyday essentials, thoughtfully curated and honestly priced. Shop smarter, live better.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {socials.map((s) => (
                <a
                  key={s}
                  href="#"
                  className="social-link"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 11,
                    background: 'rgba(255,255,255,.07)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    color: '#CBD5E1',
                    fontWeight: 800,
                    fontSize: 12,
                    letterSpacing: '.02em',
                  }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#fff', letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 16 }}>
                {col.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {col.links.map((link) => (
                  <a key={link} href="#" style={linkStyle}>
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,.08)', margin: '40px 0 24px' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: colors.muted, fontWeight: 600 }}>© 2026 Lumora Inc. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {payments.map((p) => (
              <span
                key={p}
                style={{
                  background: 'rgba(255,255,255,.07)',
                  border: '1px solid rgba(255,255,255,.1)',
                  color: '#CBD5E1',
                  fontFamily: fonts.mono,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '.04em',
                  padding: '7px 11px',
                  borderRadius: 8,
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
