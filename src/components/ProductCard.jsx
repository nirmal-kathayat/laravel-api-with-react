import { colors, fonts } from '../theme'
import { Heart, Plus } from './common/Icons'
import ProductImage from './common/ProductImage'

export default function ProductCard({ name, cat, price, oldPrice, rating, reviews, badge, img }) {
  return (
    <>
      <ProductImage src={img} alt={name} aspectRatio="1/1">
        {badge && (
          <span
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              background: colors.brand,
              color: '#fff',
              fontWeight: 800,
              fontSize: 11,
              letterSpacing: '.04em',
              padding: '6px 10px',
              borderRadius: 8,
            }}
          >
            {badge}
          </span>
        )}
        <button
          aria-label="Add to wishlist"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(255,255,255,.92)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(30,41,59,.12)',
          }}
        >
          <Heart size={17} />
        </button>
      </ProductImage>

      <div style={{ padding: 18 }}>
        <div style={{ fontSize: 12, color: colors.faint, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          {cat}
        </div>
        <div style={{ fontWeight: 700, fontSize: 16, color: colors.ink, marginTop: 5, lineHeight: 1.3 }}>{name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 9 }}>
          <span style={{ color: colors.amber, fontSize: 14, letterSpacing: '.5px' }}>★★★★★</span>
          <span style={{ fontSize: 13, color: colors.ink, fontWeight: 700 }}>{rating}</span>
          <span style={{ fontSize: 13, color: colors.faint, fontWeight: 600 }}>({reviews})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 20, color: colors.ink }}>{price}</span>
            {oldPrice && (
              <span style={{ fontSize: 14, color: colors.faint, fontWeight: 600, textDecoration: 'line-through' }}>
                {oldPrice}
              </span>
            )}
          </div>
          <button
            className="add-btn"
            aria-label="Add to cart"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: colors.ink,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Plus />
          </button>
        </div>
      </div>
    </>
  )
}
