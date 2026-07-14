import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { colors, fonts, sectionStyle } from '../theme'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/common/ProductImage'
import { Heart } from '../components/common/Icons'
import { getProduct } from '../lib/products'
import { useActiveProducts } from '../hooks/useActiveProducts'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'

const qtyBtn = {
  width: 42,
  height: 44,
  border: 'none',
  background: colors.white,
  color: colors.ink,
  fontWeight: 700,
  fontSize: 17,
  cursor: 'pointer',
}

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [qty, setQty] = useState(1)

  const { addItem } = useCart()
  const { has, toggle } = useWishlist()
  const { push } = useToast()
  const { products: related } = useActiveProducts()

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    getProduct(id)
      .then((data) => { setProduct(data); setQty(1) })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: fonts.body }}>
        <Navbar />
        <div style={{ padding: '80px 24px', textAlign: 'center', color: colors.faint }}>Loading…</div>
        <Footer />
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: fonts.body }}>
        <Navbar />
        <div style={{ padding: '80px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: colors.ink }}>Product not found</p>
          <Link to="/shop" style={{ color: colors.brand, fontWeight: 700, textDecoration: 'none' }}>← Back to shop</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const inStock = product.stock == null || product.stock > 0
  const wished = has(product.id)
  const maxQty = product.stock ?? 99
  const relatedProducts = related.filter((p) => p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    addItem(product, qty)
    push(`${product.name} added to cart`)
  }

  const handleWishlist = () => {
    toggle(product)
    push(wished ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: fonts.body }}>
      <Navbar />
      <main style={sectionStyle('32px 24px 64px')}>
        <div style={{ fontSize: 13, color: colors.faint, fontWeight: 600, marginBottom: 24 }}>
          <Link to="/" style={{ color: colors.faint, textDecoration: 'none' }}>Home</Link>
          {' / '}
          <Link to="/shop" style={{ color: colors.faint, textDecoration: 'none' }}>Shop</Link>
          {' / '}
          <span style={{ color: colors.ink }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 48, marginBottom: 64 }}>
          <div style={{ maxWidth: 520 }}>
            <ProductImage src={product.image} alt={product.name} aspectRatio="1/1" radius={22} border>
              {!inStock && (
                <span
                  style={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    background: colors.ink,
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 12,
                    letterSpacing: '.04em',
                    padding: '7px 12px',
                    borderRadius: 9,
                  }}
                >
                  OUT OF STOCK
                </span>
              )}
            </ProductImage>
          </div>

          <div>
            <h1 style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 'clamp(26px,3vw,36px)', color: colors.ink, margin: 0 }}>
              {product.name}
            </h1>
            {product.sku && (
              <div style={{ fontSize: 12, color: colors.faint, fontWeight: 600, marginTop: 6 }}>SKU: {product.sku}</div>
            )}
            <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 32, color: colors.brand, margin: '18px 0' }}>
              ${Number(product.price).toFixed(2)}
            </div>
            {product.description && (
              <p style={{ fontSize: 15, lineHeight: 1.7, color: colors.slate, fontWeight: 500, maxWidth: 460 }}>
                {product.description}
              </p>
            )}

            <div style={{ margin: '10px 0 24px', fontSize: 13.5, fontWeight: 700, color: inStock ? '#059669' : '#DC2626' }}>
              {inStock ? `In stock${product.stock != null ? ` (${product.stock} available)` : ''}` : 'Out of stock'}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${colors.line}`, borderRadius: 12, overflow: 'hidden' }}>
                <button onClick={() => setQty((v) => Math.max(1, v - 1))} disabled={qty <= 1} style={{ ...qtyBtn, opacity: qty <= 1 ? 0.4 : 1 }}>−</button>
                <span style={{ width: 44, textAlign: 'center', fontWeight: 700, fontSize: 14 }}>{qty}</span>
                <button onClick={() => setQty((v) => Math.min(maxQty, v + 1))} disabled={qty >= maxQty} style={{ ...qtyBtn, opacity: qty >= maxQty ? 0.4 : 1 }}>+</button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                style={{
                  flex: 1,
                  minWidth: 160,
                  height: 48,
                  borderRadius: 13,
                  border: 'none',
                  background: inStock ? colors.brand : colors.line,
                  color: inStock ? '#fff' : colors.faint,
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: inStock ? 'pointer' : 'not-allowed',
                  boxShadow: inStock ? '0 10px 24px rgba(255,107,53,.3)' : 'none',
                  fontFamily: fonts.body,
                }}
              >
                Add to Cart
              </button>

              <button
                onClick={handleWishlist}
                aria-label="Toggle wishlist"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 13,
                  border: `1px solid ${colors.line}`,
                  background: colors.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Heart size={20} color={wished ? colors.brand : colors.ink} filled={wished} />
              </button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <>
            <h2 style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 22, color: colors.ink, marginBottom: 24 }}>
              You might also like
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 22 }}>
              {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
