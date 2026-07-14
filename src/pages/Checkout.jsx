import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { colors, fonts, sectionStyle } from '../theme'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductImage from '../components/common/ProductImage'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { getUser } from '../lib/auth'
import { saveOrder } from '../lib/orders'

const FREE_SHIPPING_THRESHOLD = 75
const SHIPPING_FEE = 8

const inputStyle = {
  width: '100%',
  height: 44,
  border: `1px solid ${colors.line}`,
  borderRadius: 12,
  padding: '0 14px',
  fontFamily: fonts.body,
  fontSize: 14,
  color: colors.ink,
  background: colors.white,
  outline: 'none',
  boxSizing: 'border-box',
}
const labelStyle = { display: 'flex', flexDirection: 'column', gap: 6 }
const spanStyle = { fontSize: 13, fontWeight: 600, color: colors.inkSoft }

function ErrorText() {
  return <span style={{ fontSize: 12, fontWeight: 600, color: '#DC2626' }}>Required</span>
}

function Row({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: bold ? 15 : 13.5, fontWeight: bold ? 800 : 600, color: bold ? colors.ink : colors.slate }}>{label}</span>
      <span style={{ fontSize: bold ? 17 : 13.5, fontWeight: bold ? 800 : 700, color: colors.ink, fontFamily: bold ? fonts.display : fonts.body }}>{value}</span>
    </div>
  )
}

export default function Checkout() {
  const navigate = useNavigate()
  const { items, subtotal, clear } = useCart()
  const { push } = useToast()
  const user = getUser()

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const shipping = items.length === 0 ? 0 : (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE)
  const total = subtotal + shipping

  const handleSubmit = (e) => {
    e.preventDefault()
    const required = ['fullName', 'phone', 'address', 'city', 'state', 'zip']
    const nextErrors = {}
    required.forEach((key) => { if (!form[key].trim()) nextErrors[key] = true })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    const order = saveOrder(user.id, { items, subtotal, shipping, total, address: form })
    clear()
    push(`Order ${order.id} placed — pay on delivery`)
    navigate('/account?tab=orders')
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: fonts.body }}>
        <Navbar />
        <div style={{ padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>🛒</div>
          <p style={{ fontSize: 16, fontWeight: 700, color: colors.ink, margin: '0 0 8px' }}>Your cart is empty</p>
          <Link to="/shop" style={{ color: colors.brand, fontWeight: 700, textDecoration: 'none' }}>Browse products →</Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: fonts.body }}>
      <Navbar />
      <main style={sectionStyle('32px 24px 64px')}>
        <h1 style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 'clamp(26px,3vw,34px)', color: colors.ink, margin: '0 0 28px' }}>
          Checkout
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 40, alignItems: 'flex-start' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: colors.white, border: `1px solid ${colors.line}`, borderRadius: 20, padding: 24 }}>
              <h2 style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 17, color: colors.ink, margin: '0 0 18px' }}>
                Shipping address
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <label style={labelStyle}>
                  <span style={spanStyle}>Full name</span>
                  <input value={form.fullName} onChange={set('fullName')} style={inputStyle} />
                  {errors.fullName && <ErrorText />}
                </label>
                <label style={labelStyle}>
                  <span style={spanStyle}>Phone</span>
                  <input value={form.phone} onChange={set('phone')} placeholder="+1 (555) 000-0000" style={inputStyle} />
                  {errors.phone && <ErrorText />}
                </label>
                <label style={labelStyle}>
                  <span style={spanStyle}>Street address</span>
                  <input value={form.address} onChange={set('address')} style={inputStyle} />
                  {errors.address && <ErrorText />}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(100px,1fr))', gap: 12 }}>
                  <label style={labelStyle}>
                    <span style={spanStyle}>City</span>
                    <input value={form.city} onChange={set('city')} style={inputStyle} />
                    {errors.city && <ErrorText />}
                  </label>
                  <label style={labelStyle}>
                    <span style={spanStyle}>State</span>
                    <input value={form.state} onChange={set('state')} style={inputStyle} />
                    {errors.state && <ErrorText />}
                  </label>
                  <label style={labelStyle}>
                    <span style={spanStyle}>ZIP</span>
                    <input value={form.zip} onChange={set('zip')} style={inputStyle} />
                    {errors.zip && <ErrorText />}
                  </label>
                </div>
              </div>
            </div>

            <div style={{ background: colors.white, border: `1px solid ${colors.line}`, borderRadius: 20, padding: 24 }}>
              <h2 style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 17, color: colors.ink, margin: '0 0 14px' }}>
                Payment
              </h2>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 14px',
                  border: `1px solid ${colors.brand}`,
                  background: colors.brandSoft,
                  borderRadius: 12,
                  marginBottom: 10,
                }}
              >
                <span style={{ width: 16, height: 16, borderRadius: '50%', border: `4px solid ${colors.brand}` }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: colors.ink }}>Cash on Delivery</span>
              </div>
              <p style={{ fontSize: 12.5, color: colors.faint, fontWeight: 500, margin: 0 }}>
                Card payments are coming soon — for now every order ships cash-on-delivery.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                height: 50,
                borderRadius: 14,
                border: 'none',
                background: colors.brand,
                color: '#fff',
                fontWeight: 700,
                fontSize: 15.5,
                cursor: 'pointer',
                fontFamily: fonts.body,
                boxShadow: '0 12px 28px rgba(255,107,53,.32)',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Placing order…' : `Place Order — $${total.toFixed(2)}`}
            </button>
          </form>

          <aside style={{ background: colors.white, border: `1px solid ${colors.line}`, borderRadius: 20, padding: 24 }}>
            <h2 style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 17, color: colors.ink, margin: '0 0 18px' }}>
              Order summary
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 52, flexShrink: 0 }}>
                    <ProductImage src={item.image} alt={item.name} aspectRatio="1/1" radius={10} border />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: colors.ink }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: colors.faint, fontWeight: 600 }}>Qty {item.qty}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: colors.ink }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${colors.lineSoft}`, paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <Row label="Shipping" value={shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`} />
              <Row label="Total" value={`$${total.toFixed(2)}`} bold />
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}
