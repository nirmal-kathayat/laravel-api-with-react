import { colors, fonts } from '../../theme'

/** Lumora wordmark + ring glyph. `dark` renders the footer (white text) variant. */
export default function Logo({ dark = false }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: 11,
          background: colors.brand,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: dark ? 'none' : '0 6px 16px rgba(255,107,53,.32)',
        }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            border: '3px solid #fff',
            borderRadius: '50%',
            borderTopColor: 'transparent',
            transform: 'rotate(45deg)',
          }}
        />
      </span>
      <span
        style={{
          fontFamily: fonts.display,
          fontWeight: 800,
          fontSize: 22,
          letterSpacing: '-.02em',
          color: dark ? colors.white : colors.ink,
        }}
      >
        Lumora
      </span>
    </span>
  )
}
