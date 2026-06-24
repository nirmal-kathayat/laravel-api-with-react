import { useState } from 'react'
import { colors, fonts, dottedBg } from '../../theme'

/**
 * Renders a product/lifestyle image inside the design's placeholder frame.
 * If `src` is missing or fails to load, it falls back to the dotted
 * placeholder with a monospace label — so the layout never breaks.
 *
 * `children` are overlaid (badges, wishlist button, etc.).
 */
export default function ProductImage({
  src,
  alt = '',
  label = 'PRODUCT_SHOT',
  aspectRatio = '1/1',
  radius = 0,
  border = false,
  dotAlpha = 0.045,
  children,
}) {
  const [failed, setFailed] = useState(!src)

  return (
    <div
      style={{
        position: 'relative',
        aspectRatio,
        borderRadius: radius,
        overflow: 'hidden',
        border: border ? `1px solid ${colors.lineSoft}` : 'none',
        backgroundColor: colors.cloud,
        backgroundImage: dottedBg(dotAlpha),
        backgroundSize: '16px 16px',
      }}
    >
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      )}

      {failed && (
        <span
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            fontFamily: fonts.mono,
            fontSize: 10,
            letterSpacing: '.06em',
            color: colors.muted,
            background: 'rgba(255,255,255,.72)',
            padding: '4px 7px',
            borderRadius: 5,
          }}
        >
          {label}
        </span>
      )}

      {children}
    </div>
  )
}
