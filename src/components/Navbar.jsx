import { Link } from 'react-router-dom'
import { colors, fonts, layout } from '../theme'
import Logo from './common/Logo'
import { Search, Heart, Cart, User } from './common/Icons'

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

export default function Navbar({ cartCount = 3 }) {
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
            <User />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>Account</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
