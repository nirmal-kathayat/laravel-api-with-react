import { Link } from 'react-router-dom'
import { colors, fonts } from '../theme'
import { useCart } from '../context/CartContext'
import ProductImage from './common/ProductImage'

const Close = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" /><path d="M6 6l12 12" />
  </svg>
)

const stepperBtn = {
  width: 26,
  height: 26,
  borderRadius: 8,
  border: `1px solid ${colors.line}`,
  background: colors.white,
  color: colors.ink,
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 15,
  lineHeight: 1,
}

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQty, subtotal } = useCart()

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15,23,42,.45)',
          zIndex: 150,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity .25s ease',
        }}
      />
      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(420px, 100vw)',
          background: colors.white,
          zIndex: 151,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-20px 0 50px rgba(16,24,40,.18)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform .3s cubic-bezier(.16,1,.3,1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 22px', borderBottom: `1px solid ${colors.lineSoft}` }}>
          <h2 style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 18, color: colors.ink, margin: 0 }}>
            Your Cart{items.length > 0 && ` (${items.length})`}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            style={{ width: 34, height: 34, borderRadius: 9, border: 'none', background: colors.cloud, color: colors.slate, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Close />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 12px', color: colors.faint }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>🛒</div>
              <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Your cart is empty</p>
              <Link
                to="/shop"
                onClick={onClose}
                style={{ display: 'inline-block', marginTop: 18, color: colors.brand, fontWeight: 700, fontSize: 13.5, textDecoration: 'none' }}
              >
                Browse products →
              </Link>
            </div>
          ) : items.map((item) => (
            <div key={item.id} style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 68, flexShrink: 0 }}>
                <ProductImage src={item.image} alt={item.name} aspectRatio="1/1" radius={12} border />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: colors.ink, lineHeight: 1.3 }}>{item.name}</div>
                <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 14, color: colors.brand, marginTop: 4 }}>
                  ${item.price.toFixed(2)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <button onClick={() => updateQty(item.id, item.qty - 1)} disabled={item.qty <= 1} style={{ ...stepperBtn, opacity: item.qty <= 1 ? 0.4 : 1 }}>−</button>
                  <span style={{ fontSize: 13, fontWeight: 700, minWidth: 18, textAlign: 'center' }}>{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    disabled={item.stock != null && item.qty >= item.stock}
                    style={{ ...stepperBtn, opacity: item.stock != null && item.qty >= item.stock ? 0.4 : 1 }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#DC2626', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: fonts.body }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div style={{ padding: '18px 22px 22px', borderTop: `1px solid ${colors.lineSoft}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: colors.slate }}>Subtotal</span>
              <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 18, color: colors.ink }}>${subtotal.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 48,
                background: colors.brand,
                color: '#fff',
                borderRadius: 13,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: 'none',
                boxShadow: '0 10px 24px rgba(255,107,53,.3)',
              }}
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
