import { colors } from '../theme'

export default function AnnouncementBar() {
  return (
    <div
      style={{
        background: colors.ink,
        color: colors.bg,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '.02em',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        flexWrap: 'wrap',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: colors.amber,
            display: 'inline-block',
            animation: 'pulseDot 1.6s ease-in-out infinite',
          }}
        />
        Free shipping on orders over $75
      </span>
      <span style={{ opacity: 0.45 }}>•</span>
      <span>Easy 30-day returns</span>
      <span style={{ opacity: 0.45 }}>•</span>
      <span style={{ color: colors.amber }}>Members save an extra 10%</span>
    </div>
  )
}
