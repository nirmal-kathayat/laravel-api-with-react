import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { colors, fonts, layout } from '../theme'
import Logo from './common/Logo'
import { Search, Heart, Cart } from './common/Icons'

const iconButton = {
  position: 'relative',
  background: colors.white,
  border: `1px solid ${colors.line}`,
  width: 42,
  height: 42,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}

const ChevronDown = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
)

export default function Navbar({ cartCount = 3 }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { /* ignore */ }
    }
    // Re-check whenever localStorage changes (login/logout in another tab)
    const onStorage = () => {
      const s = localStorage.getItem('user')
      setUser(s ? JSON.parse(s) : null)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const logout = async () => {
    setDropOpen(false)
    const token = localStorage.getItem('token')
    if (token) {
      await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      }).catch(() => {})
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  const initials = user
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : ''

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(248,250,252,0.88)',
        backdropFilter: 'saturate(180%) blur(14px)',
        WebkitBackdropFilter: 'saturate(180%) blur(14px)',
        borderBottom: `1px solid ${colors.lineNav}`,
      }}
    >
      <div
        style={{
          maxWidth: layout.maxWidth,
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <a href="#" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <Logo />
        </a>

        <div
          style={{
            flex: 1,
            minWidth: 220,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: colors.white,
            border: `1px solid ${colors.line}`,
            borderRadius: 14,
            padding: '10px 16px',
            boxShadow: '0 1px 2px rgba(16,24,40,.04)',
          }}
        >
          <Search />
          <input
            placeholder="Search for products, brands and more…"
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: fonts.body,
              fontSize: 14,
              color: colors.ink,
              width: '100%',
            }}
          />
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 22, flexShrink: 0 }}>
          <a href="#categories" style={{ textDecoration: 'none', color: colors.slate, fontWeight: 600, fontSize: 14 }}>Categories</a>
          <a href="#deals" style={{ textDecoration: 'none', color: colors.slate, fontWeight: 600, fontSize: 14 }}>Deals</a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button style={iconButton} aria-label="Wishlist">
            <Heart />
          </button>
          <button style={iconButton} aria-label="Cart">
            <Cart />
            <span
              style={{
                position: 'absolute',
                top: -5,
                right: -5,
                background: colors.brand,
                color: '#fff',
                fontSize: 11,
                fontWeight: 800,
                minWidth: 18,
                height: 18,
                borderRadius: 9,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                border: `2px solid ${colors.bg}`,
              }}
            >
              {cartCount}
            </span>
          </button>

          {/* ── Logged-in profile OR login button ── */}
          {user ? (
            <div ref={dropRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setDropOpen(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  height: 42, padding: '0 12px 0 6px',
                  background: colors.white, border: `1px solid ${colors.line}`,
                  borderRadius: 12, cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(16,24,40,.04)',
                }}
              >
                {/* Avatar */}
                <span style={{
                  width: 30, height: 30, borderRadius: 9,
                  background: colors.brandSoft, color: '#C2410C',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: fonts.body, fontWeight: 800, fontSize: 12,
                }}>
                  {initials}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: colors.ink, maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
                <span style={{ color: colors.faint, display: 'flex' }}>
                  <ChevronDown />
                </span>
              </button>

              {dropOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 50,
                  width: 210, background: colors.white,
                  border: `1px solid ${colors.line}`, borderRadius: 16,
                  boxShadow: '0 12px 40px rgba(16,24,40,.12)',
                  zIndex: 100, overflow: 'hidden',
                  animation: 'navDropIn .18s ease',
                }}>
                  {/* User info */}
                  <div style={{ padding: '14px 16px', borderBottom: `1px solid ${colors.lineSoft}` }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: colors.ink }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: colors.faint, marginTop: 2 }}>{user.email}</div>
                  </div>

                  {/* Menu items */}
                  {[
                    { label: 'My Account',   to: '/account' },
                    { label: 'My Orders',    to: '/account' },
                    { label: 'My Wishlist',  to: '/account' },
                    { label: 'My Reviews',   to: '/account' },
                  ].map(item => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setDropOpen(false)}
                      style={{
                        display: 'block', padding: '11px 16px',
                        fontSize: 13.5, fontWeight: 600, color: colors.inkSoft,
                        textDecoration: 'none', borderBottom: `1px solid ${colors.lineSoft}`,
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}

                  {/* Logout */}
                  <button
                    onClick={logout}
                    style={{
                      width: '100%', textAlign: 'left', padding: '12px 16px',
                      border: 'none', background: 'none', cursor: 'pointer',
                      fontSize: 13.5, fontWeight: 700, color: '#DC2626',
                      fontFamily: fonts.body,
                    }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                background: colors.ink,
                border: 'none',
                height: 42,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '0 14px',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-3.6 3.6-6 8-6s8 2.4 8 6" />
              </svg>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>Account</span>
            </Link>
          )}
        </div>
      </div>

      <style>{`
        @keyframes navDropIn {
          from { opacity: 0; transform: translateY(-6px) scale(.98); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </header>
  )
}
