import { colors, sectionStyle } from '../theme'
import { trust } from '../data.jsx'

export default function TrustBadges() {
  return (
    <section style={sectionStyle('clamp(20px,3vw,32px) 24px')}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))',
          gap: 18,
          background: colors.white,
          border: `1px solid ${colors.lineSoft}`,
          borderRadius: 24,
          padding: 'clamp(24px,3vw,34px)',
          boxShadow: '0 1px 2px rgba(16,24,40,.04)',
        }}
      >
        {trust.map(({ title, sub, Icon }) => (
          <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span
              style={{
                width: 52,
                height: 52,
                flexShrink: 0,
                borderRadius: 15,
                background: colors.brandSoft,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon />
            </span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: colors.ink }}>{title}</div>
              <div style={{ fontSize: 13, color: colors.faint, fontWeight: 600, marginTop: 2 }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
