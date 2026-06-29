import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, fonts } from '../theme'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

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

const ORDERS = [
  { id: '#LUM-4821', product: 'Nimbus Wireless Headphones', date: 'Jun 28, 2026', amount: '$249.00', status: 'Delivered' },
  { id: '#LUM-4820', product: 'Aurora Linen Throw',         date: 'Jun 15, 2026', amount: '$89.00',  status: 'Shipped'   },
  { id: '#LUM-4801', product: 'Halo Scented Candle ×2',     date: 'May 30, 2026', amount: '$76.00',  status: 'Delivered' },
]

const statusBadge = (s) => {
  const map = {
    Delivered: { bg: '#ECFDF5', color: '#059669' },
    Shipped:   { bg: '#EFF6FF', color: '#2563EB' },
    Pending:   { bg: '#FFFBEB', color: '#D97706' },
    Cancelled: { bg: '#FEF2F2', color: '#DC2626' },
  }
  const t = map[s] || { bg: '#F1F5F9', color: '#64748B' }
  return { display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: t.bg, color: t.color }
}

export default function CustomerDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { navigate('/login'); return }
    const parsed = JSON.parse(stored)
    if (parsed.role !== 'customer') { navigate('/login'); return }
    setUser(parsed)
  }, [navigate])

  if (!user) return null

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
                { label: 'Active Orders',  value: '3',   icon: '📦', color: colors.brand },
                { label: 'Wishlist Items', value: '12',  icon: '❤️', color: '#EC4899'    },
                { label: 'Loyalty Points', value: '840', icon: '⭐', color: '#D97706'    },
                { label: 'Past Orders',    value: '27',  icon: '🧾', color: '#06B6D4'    },
              ].map(stat => (
                <div key={stat.label} style={{ ...card, padding: 22 }}>
                  <div style={{ fontSize: 26, marginBottom: 10 }}>{stat.icon}</div>
                  <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 26, color: stat.color }}>{stat.value}</div>
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
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#FBFCFE' }}>
                    {['Order','Product','Date','Amount','Status'].map((h, i) => (
                      <th key={h} style={{ textAlign: i === 3 ? 'right' : 'left', padding: i === 0 ? '9px 22px' : '9px 14px', fontSize: 10.5, fontWeight: 700, color: colors.faint, letterSpacing: '.06em', textTransform: 'uppercase', borderBottom: `1px solid ${colors.lineSoft}`, borderTop: `1px solid ${colors.lineSoft}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ORDERS.map(o => (
                    <tr key={o.id}>
                      <td style={{ padding: '13px 22px', borderBottom: `1px solid #F1F5F9` }}><span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 12.5, fontWeight: 700, color: colors.ink }}>{o.id}</span></td>
                      <td style={{ padding: '13px 14px', borderBottom: `1px solid #F1F5F9`, fontSize: 13.5, fontWeight: 600, color: colors.inkSoft }}>{o.product}</td>
                      <td style={{ padding: '13px 14px', borderBottom: `1px solid #F1F5F9`, fontSize: 13, color: colors.faint, fontWeight: 500 }}>{o.date}</td>
                      <td style={{ padding: '13px 14px', borderBottom: `1px solid #F1F5F9`, textAlign: 'right', fontFamily: 'ui-monospace,monospace', fontSize: 13, fontWeight: 700, color: colors.ink }}>{o.amount}</td>
                      <td style={{ padding: '13px 14px', borderBottom: `1px solid #F1F5F9` }}><span style={statusBadge(o.status)}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: My Orders */}
        {activeTab === 'orders' && (
          <div style={{ animation: 'fadeUp .25s ease' }}>
            <div style={{ ...card, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#FBFCFE' }}>
                    {['Order','Product','Date','Amount','Status',''].map((h, i) => (
                      <th key={i} style={{ textAlign: i === 3 ? 'right' : 'left', padding: i === 0 ? '11px 22px' : '11px 14px', fontSize: 10.5, fontWeight: 700, color: colors.faint, letterSpacing: '.06em', textTransform: 'uppercase', borderBottom: `1px solid ${colors.lineSoft}`, background: '#FBFCFE' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ORDERS.map(o => (
                    <tr key={o.id}>
                      <td style={{ padding: '14px 22px', borderBottom: `1px solid #F1F5F9` }}><span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 12.5, fontWeight: 700, color: colors.ink }}>{o.id}</span></td>
                      <td style={{ padding: '14px 14px', borderBottom: `1px solid #F1F5F9`, fontSize: 13.5, fontWeight: 600, color: colors.inkSoft }}>{o.product}</td>
                      <td style={{ padding: '14px 14px', borderBottom: `1px solid #F1F5F9`, fontSize: 13, color: colors.faint, fontWeight: 500 }}>{o.date}</td>
                      <td style={{ padding: '14px 14px', borderBottom: `1px solid #F1F5F9`, textAlign: 'right', fontFamily: 'ui-monospace,monospace', fontSize: 13, fontWeight: 700, color: colors.ink }}>{o.amount}</td>
                      <td style={{ padding: '14px 14px', borderBottom: `1px solid #F1F5F9` }}><span style={statusBadge(o.status)}>{o.status}</span></td>
                      <td style={{ padding: '14px 22px', borderBottom: `1px solid #F1F5F9` }}>
                        <button style={{ fontSize: 13, fontWeight: 700, color: colors.brand, background: 'none', border: 'none', cursor: 'pointer', fontFamily: fonts.body }}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Wishlist */}
        {activeTab === 'wishlist' && (
          <div style={{ animation: 'fadeUp .25s ease' }}>
            <div style={{ ...card, padding: '60px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>❤️</div>
              <h2 style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 20, color: colors.ink, margin: '0 0 8px' }}>Your wishlist is empty</h2>
              <p style={{ fontSize: 14, color: colors.faint, margin: '0 0 24px', fontWeight: 500 }}>Save items you love and come back to them anytime.</p>
              <a href="/" style={{ display: 'inline-flex', alignItems: 'center', height: 42, padding: '0 22px', background: colors.brand, color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 14, boxShadow: '0 4px 14px rgba(255,107,53,.26)' }}>
                Browse Products
              </a>
            </div>
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
                    <input defaultValue={f.value} type={f.type} placeholder={f.placeholder}
                      style={{ height: 42, padding: '0 13px', border: `1px solid ${colors.line}`, borderRadius: 11, fontFamily: fonts.body, fontSize: 13.5, color: colors.ink, outline: 'none' }} />
                  </label>
                ))}
              </div>
              <button style={{ marginTop: 20, height: 42, padding: '0 22px', background: colors.brand, color: '#fff', border: 'none', borderRadius: 12, fontFamily: fonts.body, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,107,53,.26)' }}>
                Save Changes
              </button>
            </div>

            <div style={{ ...card, padding: '24px 28px' }}>
              <h3 style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 17, color: colors.ink, margin: '0 0 20px' }}>Change Password</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {['Current Password', 'New Password', 'Confirm Password'].map(f => (
                  <label key={f} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: colors.inkSoft }}>{f}</span>
                    <input type="password" placeholder="••••••••"
                      style={{ height: 42, padding: '0 13px', border: `1px solid ${colors.line}`, borderRadius: 11, fontFamily: fonts.body, fontSize: 13.5, color: colors.ink, outline: 'none' }} />
                  </label>
                ))}
              </div>
              <button style={{ marginTop: 20, height: 42, padding: '0 22px', background: colors.ink, color: '#fff', border: 'none', borderRadius: 12, fontFamily: fonts.body, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Update Password
              </button>
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
