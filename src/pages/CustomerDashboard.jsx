import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { colors, fonts } from '../theme'

export default function CustomerDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { navigate('/login'); return }
    const parsed = JSON.parse(stored)
    if (parsed.role !== 'customer') { navigate('/login'); return }
    setUser(parsed)
  }, [navigate])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!user) return null

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: fonts.body }}>
      <header style={{
        background: colors.white, borderBottom: `1px solid ${colors.line}`,
        padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 20, color: colors.brand }}>Lumora</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: colors.muted }}>
            Hi, {user.name} · <span style={{
              background: '#ECFDF5', color: '#059669',
              borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700,
            }}>CUSTOMER</span>
          </span>
          <button onClick={logout} style={{
            background: 'transparent', border: `1px solid ${colors.line}`, borderRadius: 8,
            color: colors.muted, padding: '6px 14px', fontSize: 13, cursor: 'pointer', fontFamily: fonts.body,
          }}>Logout</button>
        </div>
      </header>

      <main style={{ padding: '40px 32px', maxWidth: 960, margin: '0 auto' }}>
        <h1 style={{ fontFamily: fonts.display, fontSize: 28, fontWeight: 700, color: colors.ink, margin: '0 0 8px' }}>
          Hey, {user.name}! 🎉
        </h1>
        <p style={{ color: colors.muted, fontSize: 15, margin: '0 0 40px' }}>
          Welcome to your account. Here's what's happening.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
          {[
            { label: 'Active Orders',   value: '3',   icon: '📦', color: colors.brand },
            { label: 'Wishlist Items',  value: '12',  icon: '❤️', color: '#EC4899' },
            { label: 'Loyalty Points',  value: '840', icon: '⭐', color: colors.amber },
            { label: 'Past Orders',     value: '27',  icon: '🧾', color: '#06B6D4' },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: colors.white, borderRadius: 16, padding: '24px',
              border: `1px solid ${colors.line}`,
              boxShadow: '0 2px 8px rgba(16,24,40,.05)',
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{stat.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: stat.color, fontFamily: fonts.display }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: colors.muted, marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{
          background: colors.white, borderRadius: 16, border: `1px solid ${colors.line}`,
          padding: 28, boxShadow: '0 2px 8px rgba(16,24,40,.05)',
        }}>
          <h2 style={{ fontFamily: fonts.display, fontSize: 18, fontWeight: 700, color: colors.ink, margin: '0 0 20px' }}>My Account</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['Track Orders', 'My Wishlist', 'My Reviews', 'Saved Addresses', 'Account Settings'].map((action) => (
              <button key={action} style={{
                background: colors.bg, border: `1px solid ${colors.line}`, borderRadius: 10,
                color: colors.inkSoft, padding: '10px 18px', fontSize: 14, cursor: 'pointer',
                fontFamily: fonts.body,
              }}>{action}</button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
