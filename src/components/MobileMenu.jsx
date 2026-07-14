import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { colors, fonts } from '../theme'
import { Search } from './common/Icons'

const Close = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" /><path d="M6 6l12 12" />
  </svg>
)

const linkStyle = {
  display: 'block',
  padding: '14px 4px',
  fontSize: 16,
  fontWeight: 700,
  color: colors.ink,
  textDecoration: 'none',
  borderBottom: `1px solid ${colors.lineSoft}`,
}

export default function MobileMenu({ open, onClose, user, onLogout }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const submitSearch = (e) => {
    e.preventDefault()
    onClose()
    navigate(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : '/shop')
  }

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
          left: 0,
          bottom: 0,
          width: 'min(320px, 84vw)',
          background: colors.white,
          zIndex: 151,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '20px 0 50px rgba(16,24,40,.18)',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform .3s cubic-bezier(.16,1,.3,1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 22px', borderBottom: `1px solid ${colors.lineSoft}` }}>
          <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 18, color: colors.ink }}>Menu</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{ width: 34, height: 34, borderRadius: 9, border: 'none', background: colors.cloud, color: colors.slate, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Close />
          </button>
        </div>

        <div style={{ padding: '18px 22px', flex: 1, overflowY: 'auto' }}>
          <form
            onSubmit={submitSearch}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: colors.cloud,
              borderRadius: 12,
              padding: '10px 14px',
              marginBottom: 12,
            }}
          >
            <Search />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              style={{ border: 'none', outline: 'none', background: 'transparent', fontFamily: fonts.body, fontSize: 14, color: colors.ink, width: '100%' }}
            />
          </form>

          <nav>
            <Link to="/shop" onClick={onClose} style={linkStyle}>Shop</Link>
            <Link to="/#categories" onClick={onClose} style={linkStyle}>Categories</Link>
            <Link to="/#deals" onClick={onClose} style={linkStyle}>Deals</Link>

            {user ? (
              <>
                <Link to="/account" onClick={onClose} style={linkStyle}>My Account</Link>
                <Link to="/account?tab=orders" onClick={onClose} style={linkStyle}>My Orders</Link>
                <Link to="/account?tab=wishlist" onClick={onClose} style={linkStyle}>My Wishlist</Link>
                <button
                  onClick={() => { onClose(); onLogout() }}
                  style={{ ...linkStyle, width: '100%', textAlign: 'left', background: 'none', border: 'none', borderBottom: `1px solid ${colors.lineSoft}`, cursor: 'pointer', color: '#DC2626', fontFamily: fonts.body }}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={onClose} style={linkStyle}>Sign in</Link>
                <Link to="/signup" onClick={onClose} style={linkStyle}>Create account</Link>
              </>
            )}
          </nav>
        </div>
      </aside>
    </>
  )
}
