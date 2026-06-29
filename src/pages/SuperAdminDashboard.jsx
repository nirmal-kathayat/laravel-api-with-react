import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, fonts } from '../theme'

export default function SuperAdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { navigate('/login'); return }
    const parsed = JSON.parse(stored)
    if (parsed.role !== 'super admin') { navigate('/login'); return }
    setUser(parsed)
  }, [navigate])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!user) return null

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', fontFamily: fonts.body, color: '#F8FAFC' }}>
      <header style={{
        background: '#1E293B', borderBottom: '1px solid #334155',
        padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            borderRadius: 10, width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700,
          }}>S</span>
          <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 18 }}>Super Admin Panel</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#94A3B8' }}>
            {user.name} · <span style={{
              background: '#6366F1', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700,
            }}>SUPER ADMIN</span>
          </span>
          <button onClick={logout} style={{
            background: 'transparent', border: '1px solid #475569', borderRadius: 8,
            color: '#94A3B8', padding: '6px 14px', fontSize: 13, cursor: 'pointer', fontFamily: fonts.body,
          }}>Logout</button>
        </div>
      </header>

      <main style={{ padding: '40px 32px', maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontFamily: fonts.display, fontSize: 30, fontWeight: 700, margin: '0 0 8px' }}>
          Welcome back, {user.name} 👋
        </h1>
        <p style={{ color: '#94A3B8', fontSize: 15, margin: '0 0 40px' }}>
          You have full system access as <strong style={{ color: '#818CF8' }}>Super Admin</strong>.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
          {[
            { label: 'Total Users', value: '1,284', icon: '👥', color: '#6366F1' },
            { label: 'Admins',      value: '12',    icon: '🛡️', color: '#8B5CF6' },
            { label: 'Customers',   value: '1,260', icon: '🛍️', color: '#06B6D4' },
            { label: 'Revenue',     value: '$84.2k', icon: '💰', color: '#10B981' },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: '#1E293B', borderRadius: 16, padding: '24px',
              border: '1px solid #334155',
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{stat.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: stat.color, fontFamily: fonts.display }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#1E293B', borderRadius: 16, border: '1px solid #334155', padding: 28 }}>
          <h2 style={{ fontFamily: fonts.display, fontSize: 18, fontWeight: 700, margin: '0 0 20px' }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['Manage Users', 'Manage Admins', 'View Reports', 'System Settings', 'Audit Logs'].map((action) => (
              <button key={action} style={{
                background: '#0F172A', border: '1px solid #334155', borderRadius: 10,
                color: '#CBD5E1', padding: '10px 18px', fontSize: 14, cursor: 'pointer',
                fontFamily: fonts.body,
              }}>{action}</button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
