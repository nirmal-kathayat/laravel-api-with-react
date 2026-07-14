import { Link } from 'react-router-dom'
import { colors, fonts } from '../theme'
import { Heart, Plus } from './common/Icons'
import ProductImage from './common/ProductImage'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'

/** Renders a real backend product ({id, name, description?, price, stock?, image}). */
export default function ProductCard({ product, badge }) {
  const { addItem } = useCart()
  const { has, toggle } = useWishlist()
  const { push } = useToast()

  const inStock = product.stock == null || product.stock > 0
  const wished = has(product.id)

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(product)
    push(wished ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!inStock) return
    addItem(product, 1)
    push(`${product.name} added to cart`)
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="card-lift card-product"
      style={{
        display: 'block',
        textDecoration: 'none',
        background: colors.white,
        border: `1px solid ${colors.lineSoft}`,
        borderRadius: 22,
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(16,24,40,.04)',
      }}
    >
      <ProductImage src={product.image} alt={product.name} aspectRatio="1/1">
        {(!inStock || badge) && (
          <span
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              background: !inStock ? colors.ink : colors.amber,
              color: !inStock ? '#fff' : colors.ink,
              fontWeight: 800,
              fontSize: 11,
              letterSpacing: '.04em',
              padding: '6px 10px',
              borderRadius: 8,
            }}
          >
            {!inStock ? 'OUT OF STOCK' : badge}
          </span>
        )}
        <button
          onClick={handleWishlist}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
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
          <Heart size={17} color={wished ? colors.brand : colors.ink} filled={wished} />
        </button>
      </ProductImage>

      <div style={{ padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: colors.ink, lineHeight: 1.3 }}>{product.name}</div>
        {product.description && (
          <div
            style={{
              fontSize: 13,
              color: colors.faint,
              fontWeight: 500,
              marginTop: 5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {product.description}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
          <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 20, color: colors.ink }}>
            ${Number(product.price).toFixed(2)}
          </span>
          <button
            className="add-btn"
            onClick={handleAddToCart}
            disabled={!inStock}
            aria-label="Add to cart"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: inStock ? colors.ink : colors.line,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inStock ? 'pointer' : 'not-allowed',
            }}
          >
            <Plus color={inStock ? '#fff' : colors.faint} />
          </button>
        </div>
      </div>
    </Link>
  )
}
