import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { colors, fonts } from '../theme'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductImage from '../components/common/ProductImage'
import { Heart } from '../components/common/Icons'
import { getUser } from '../lib/auth'
import { listOrders } from '../lib/orders'
import { useWishlist } from '../context/WishlistContext'

const card = {
  background: colors.white,
  border: `1px solid ${colors.line}`,
  borderRadius: 20,
  boxShadow: '0 2px 8px rgba(16,24,40,.05)',
}

const AVATAR_COLORS = [
  { bg: '#FFF3E9', color: '#C2410C' }, { bg: '#EFF6FF', color: '#1D4ED8' },
  { bg: '#F0FDF4', color: '#166534' }, { bg: '#FDF4FF', color: '#7E22CE' },
]

const statusBadge = (s) => {
  const map = {
    Delivered:  { bg: '#ECFDF5', color: '#059669' },
    Shipped:    { bg: '#EFF6FF', color: '#2563EB' },
    Processing: { bg: '#FFFBEB', color: '#D97706' },
    Pending:    { bg: '#FFFBEB', color: '#D97706' },
    Cancelled:  { bg: '#FEF2F2', color: '#DC2626' },
  }
  const t = map[s] || { bg: '#F1F5F9', color: '#64748B' }
  return { display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: t.bg, color: t.color }
}

const orderSummary = (order) => {
  if (order.items.length === 0) return '—'
  const first = order.items[0].name
  return order.items.length > 1 ? `${first} & ${order.items.length - 1} more` : first
}

export default function CustomerDashboard() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [user, setUser] = useState(null)
  const { items: wishlistItems, remove: removeWishlist } = useWishlist()

  const activeTab = searchParams.get('tab') || 'overview'
  const setActiveTab = (key) => setSearchParams(key === 'overview' ? {} : { tab: key })

  useEffect(() => {
    const current = getUser()   // null if missing or session expired
    if (!current || current.role !== 'customer') { navigate('/login'); return }
    setUser(current)
  }, [navigate])

  if (!user) return null

  const orders = listOrders(user.id)
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const avatarStyle = AVATAR_COLORS[user.id % AVATAR_COLORS.length] || AVATAR_COLORS[0]

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'orders',   label: 'My Orders' },
    { key: 'wishlist', label: 'Wishlist' },
    { key: 'settings', label: 'Settings' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: fonts.body }}>
      <Navbar />

      <main style={{ maxWidth: 1060, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Profile header */}
        <div style={{ ...card, padding: '28px 32px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 22 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
            background: avatarStyle.bg, color: avatarStyle.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 22, fontFamily: fonts.body,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 22, color: colors.ink, margin: 0 }}>
                {user.name}
              </h1>
              <span style={{ background: '#ECFDF5', color: '#059669', borderRadius: 999, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>
                CUSTOMER
              </span>
            </div>
            <div style={{ fontSize: 14, color: colors.faint, marginTop: 4, fontWeight: 500 }}>{user.email}</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            <button
              onClick={() => setActiveTab('settings')}
              style={{ height: 38, padding: '0 16px', border: `1px solid ${colors.line}`, borderRadius: 10, background: colors.white, fontSize: 13, fontWeight: 700, color: colors.slate, cursor: 'pointer', fontFamily: fonts.body }}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, borderBottom: `1px solid ${colors.line}`, paddingBottom: 0 }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 700, fontFamily: fonts.body,
                color: activeTab === t.key ? colors.brand : colors.muted,
                borderBottom: activeTab === t.key ? `2px solid ${colors.brand}` : '2px solid transparent',
                marginBottom: -1, transition: 'color .15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div style={{ animation: 'fadeUp .25s ease' }}>
            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
              {[
                { label: 'Orders Placed',  value: String(orders.length),        icon: '📦', color: colors.brand },
                { label: 'Wishlist Items', value: String(wishlistItems.length), icon: '❤️', color: '#EC4899'    },
                { label: 'Loyalty Points', value: 'Coming soon',                 icon: '⭐', color: '#D97706'    },
              ].map(stat => (
                <div key={stat.label} style={{ ...card, padding: 22 }}>
                  <div style={{ fontSize: 26, marginBottom: 10 }}>{stat.icon}</div>
                  <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: stat.value === 'Coming soon' ? 15 : 26, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: 13, color: colors.muted, marginTop: 4, fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent orders preview */}
            <div style={{ ...card, overflow: 'hidden', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px 14px' }}>
                <h2 style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 17, color: colors.ink, margin: 0 }}>Recent Orders</h2>
                <button onClick={() => setActiveTab('orders')} style={{ fontSize: 13, fontWeight: 700, color: colors.brand, background: 'none', border: 'none', cursor: 'pointer', fontFamily: fonts.body }}>
                  View all →
                </button>
              </div>
              {orders.length === 0 ? (
                <div style={{ padding: '32px 22px', textAlign: 'center', color: colors.faint, fontSize: 13.5, fontWeight: 500 }}>
                  No orders yet.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#FBFCFE' }}>
                      {['Order','Items','Date','Amount','Status'].map((h, i) => (
                        <th key={h} style={{ textAlign: i === 3 ? 'right' : 'left', padding: i === 0 ? '9px 22px' : '9px 14px', fontSize: 10.5, fontWeight: 700, color: colors.faint, letterSpacing: '.06em', textTransform: 'uppercase', borderBottom: `1px solid ${colors.lineSoft}`, borderTop: `1px solid ${colors.lineSoft}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 3).map(o => (
                      <tr key={o.id}>
                        <td style={{ padding: '13px 22px', borderBottom: `1px solid #F1F5F9` }}><span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 12.5, fontWeight: 700, color: colors.ink }}>{o.id}</span></td>
                        <td style={{ padding: '13px 14px', borderBottom: `1px solid #F1F5F9`, fontSize: 13.5, fontWeight: 600, color: colors.inkSoft }}>{orderSummary(o)}</td>
                        <td style={{ padding: '13px 14px', borderBottom: `1px solid #F1F5F9`, fontSize: 13, color: colors.faint, fontWeight: 500 }}>{new Date(o.placedAt).toLocaleDateString()}</td>
                        <td style={{ padding: '13px 14px', borderBottom: `1px solid #F1F5F9`, textAlign: 'right', fontFamily: 'ui-monospace,monospace', fontSize: 13, fontWeight: 700, color: colors.ink }}>${o.total.toFixed(2)}</td>
                        <td style={{ padding: '13px 14px', borderBottom: `1px solid #F1F5F9` }}><span style={statusBadge(o.status)}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Tab: My Orders */}
        {activeTab === 'orders' && (
          <div style={{ animation: 'fadeUp .25s ease' }}>
            {orders.length === 0 ? (
              <div style={{ ...card, padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🧾</div>
                <h2 style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 20, color: colors.ink, margin: '0 0 8px' }}>No orders yet</h2>
                <p style={{ fontSize: 14, color: colors.faint, margin: '0 0 24px', fontWeight: 500 }}>Once you place an order, it'll show up here.</p>
                <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', height: 42, padding: '0 22px', background: colors.brand, color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 14, boxShadow: '0 4px 14px rgba(255,107,53,.26)' }}>
                  Browse Products
                </Link>
              </div>
            ) : (
              <div style={{ ...card, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#FBFCFE' }}>
                      {['Order','Items','Date','Amount','Status'].map((h, i) => (
                        <th key={i} style={{ textAlign: i === 3 ? 'right' : 'left', padding: i === 0 ? '11px 22px' : '11px 14px', fontSize: 10.5, fontWeight: 700, color: colors.faint, letterSpacing: '.06em', textTransform: 'uppercase', borderBottom: `1px solid ${colors.lineSoft}`, background: '#FBFCFE' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td style={{ padding: '14px 22px', borderBottom: `1px solid #F1F5F9` }}><span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 12.5, fontWeight: 700, color: colors.ink }}>{o.id}</span></td>
                        <td style={{ padding: '14px 14px', borderBottom: `1px solid #F1F5F9`, fontSize: 13.5, fontWeight: 600, color: colors.inkSoft }}>{orderSummary(o)}</td>
                        <td style={{ padding: '14px 14px', borderBottom: `1px solid #F1F5F9`, fontSize: 13, color: colors.faint, fontWeight: 500 }}>{new Date(o.placedAt).toLocaleDateString()}</td>
                        <td style={{ padding: '14px 14px', borderBottom: `1px solid #F1F5F9`, textAlign: 'right', fontFamily: 'ui-monospace,monospace', fontSize: 13, fontWeight: 700, color: colors.ink }}>${o.total.toFixed(2)}</td>
                        <td style={{ padding: '14px 14px', borderBottom: `1px solid #F1F5F9` }}><span style={statusBadge(o.status)}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab: Wishlist */}
        {activeTab === 'wishlist' && (
          <div style={{ animation: 'fadeUp .25s ease' }}>
            {wishlistItems.length === 0 ? (
              <div style={{ ...card, padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>❤️</div>
                <h2 style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 20, color: colors.ink, margin: '0 0 8px' }}>Your wishlist is empty</h2>
                <p style={{ fontSize: 14, color: colors.faint, margin: '0 0 24px', fontWeight: 500 }}>Save items you love and come back to them anytime.</p>
                <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', height: 42, padding: '0 22px', background: colors.brand, color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 14, boxShadow: '0 4px 14px rgba(255,107,53,.26)' }}>
                  Browse Products
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 18 }}>
                {wishlistItems.map(item => (
                  <div key={item.id} style={{ ...card, overflow: 'hidden' }}>
                    <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                      <ProductImage src={item.image} alt={item.name} aspectRatio="1/1" />
                    </Link>
                    <div style={{ padding: 16 }}>
                      <Link to={`/product/${item.id}`} style={{ textDecoration: 'none' }}>
                        <div style={{ fontWeight: 700, fontSize: 14.5, color: colors.ink, lineHeight: 1.3 }}>{item.name}</div>
                      </Link>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                        <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 16, color: colors.brand }}>${item.price.toFixed(2)}</span>
                        <button
                          onClick={() => removeWishlist(item.id)}
                          aria-label="Remove from wishlist"
                          style={{ width: 32, height: 32, borderRadius: 9, border: `1px solid ${colors.line}`, background: colors.white, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <Heart size={15} color={colors.brand} filled />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Settings */}
        {activeTab === 'settings' && (
          <div style={{ animation: 'fadeUp .25s ease', maxWidth: 560 }}>
            <div style={{ ...card, padding: '24px 28px', marginBottom: 18 }}>
              <h3 style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 17, color: colors.ink, margin: '0 0 20px' }}>Personal Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: 'Full Name',  value: user.name,  type: 'text' },
                  { label: 'Email',      value: user.email, type: 'email' },
                  { label: 'Phone',      value: '',         type: 'tel',  placeholder: '+1 (555) 000-0000' },
                ].map(f => (
                  <label key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: colors.inkSoft }}>{f.label}</span>
                    <input defaultValue={f.value} type={f.type} placeholder={f.placeholder} disabled
                      style={{ height: 42, padding: '0 13px', border: `1px solid ${colors.line}`, borderRadius: 11, fontFamily: fonts.body, fontSize: 13.5, color: colors.faint, outline: 'none', background: colors.cloud, cursor: 'not-allowed' }} />
                  </label>
                ))}
              </div>
              <p style={{ fontSize: 12.5, color: colors.faint, fontWeight: 500, margin: '16px 0 0' }}>
                Profile editing isn't wired up yet — there's no update-profile endpoint on the backend.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  )
}
