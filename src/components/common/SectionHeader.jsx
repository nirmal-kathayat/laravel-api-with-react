import { colors, fonts } from '../../theme'
import { ArrowRight } from './Icons'

/** Eyebrow + title on the left, optional "view all" link on the right. */
export default function SectionHeader({ eyebrow, title, linkText, linkHref = '#' }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        marginBottom: 30,
      }}
    >
      <div>
        <span
          style={{
            fontWeight: 700,
            fontSize: 13,
            color: colors.brand,
            letterSpacing: '.08em',
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
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
          {title}
        </h2>
      </div>
      {linkText && (
        <a
          href={linkHref}
          style={{
            textDecoration: 'none',
            color: colors.ink,
            fontWeight: 700,
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {linkText}
          <ArrowRight />
        </a>
      )}
    </div>
  )
}
