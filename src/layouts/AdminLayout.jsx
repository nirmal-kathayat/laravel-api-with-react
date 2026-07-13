import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  C, F,
  GridIcon, BoxIcon, ShoppingBagIcon, UsersIcon, TagIcon, StarIcon, ZapIcon, MailIcon, SettingsIcon,
  SearchIcon, BellIcon, ChevronDn,
} from '../pages/admin/shared'

const BASE = '/dashboard/admin'

const NAV_MAIN = [
  { key: 'dashboard',   label: 'Dashboard',   icon: <GridIcon />,           to: BASE },
  { key: 'products',    label: 'Products',    icon: <BoxIcon />,            to: `${BASE}/products` },
  { key: 'orders',      label: 'Orders',      icon: <ShoppingBagIcon />,    to: `${BASE}/orders` },
  { key: 'customers',   label: 'Customers',   icon: <UsersIcon />,          to: `${BASE}/customers` },
  { key: 'categories',  label: 'Categories',  icon: <TagIcon />,            to: `${BASE}/categories` },
  { key: 'reviews',     label: 'Reviews',     icon: <StarIcon filled />,    to: `${BASE}/reviews` },
  { key: 'flash-sales', label: 'Flash Sales', icon: <ZapIcon />,            to: `${BASE}/flash-sales` },
]
const NAV_SETTINGS = [
  { key: 'newsletter', label: 'Newsletter', icon: <MailIcon />, to: `${BASE}/newsletter` },
  { key: 'settings',   label: 'Settings',   icon: <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><SettingsIcon /></svg>, to: `${BASE}/settings` },
]

const PAGE_TITLES = { dashboard: 'Dashboard', products: 'Products', categories: 'Categories', orders: 'Orders', customers: 'Customers', reviews: 'Reviews', 'flash-sales': 'Flash Sales', newsletter: 'Newsletter', settings: 'Settings' }
const PAGE_SUBS   = {
  dashboard:    "Here's your store at a glance today.",
  products:     'Manage your catalog, stock and pricing.',
  categories:   'Organize products into collections.',
  orders:       'Track, fulfill and review customer orders.',
  customers:    'Your customer base and lifetime value.',
  reviews:      'What customers are saying about Lumora.',
  'flash-sales':'Time-limited promotions and deals.',
  newsletter:   'Campaigns and subscriber engagement.',
  settings:     'Store configuration and preferences.',
}

// Sidebar + topbar shell shared by every admin page. The active section is
// derived from the real URL (via useLocation), not internal state — so the
// URL is always accurate and a refresh lands back on the same page.
export default function AdminLayout({ user, onLogout, children }) {
  const [search, setSearch] = useState('')
  const [bellOpen, setBellOpen] = useState(false)
  const [acctOpen, setAcctOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // '/dashboard/admin' -> 'dashboard', '/dashboard/admin/products' -> 'products'
  const page = location.pathname === BASE
    ? 'dashboard'
    : location.pathname.slice(BASE.length + 1)

  const navItem = (to) => {
    const active = location.pathname === to
    return {
      display: 'flex', alignItems: 'center', gap: 11,
      padding: '9px 14px 9px 22px', margin: '1px 10px',
      borderRadius: 11, cursor: 'pointer', textDecoration: 'none',
      fontSize: 13.5, fontWeight: active ? 700 : 600,
      color: active ? C.brand : C.slate,
      background: active ? C.brandSoft : 'transparent',
    }
  }

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Manrope:wght@500;600;700;800&display=swap');
        *{box-sizing:border-box;}
        body{margin:0;background:#F8FAFC;-webkit-font-smoothing:antialiased;}
        ::-webkit-scrollbar{width:11px;height:11px;}
        ::-webkit-scrollbar-thumb{background:#DDE5EE;border-radius:999px;border:3px solid #F8FAFC;}
        ::-webkit-scrollbar-thumb:hover{background:#CBD5E1;}
        ::-webkit-scrollbar-track{background:transparent;}
        @keyframes pageIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
        @keyframes overlayIn{from{opacity:0;}to{opacity:1;}}
        @keyframes modalIn{from{opacity:0;transform:translateY(18px) scale(.985);}to{opacity:1;transform:none;}}
        @keyframes popIn{from{opacity:0;transform:translateY(-6px) scale(.98);}to{opacity:1;transform:none;}}
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: F.body, color: C.ink }}>

        {/* ── Sidebar ── */}
        <aside style={{ position: 'sticky', top: 0, height: '100vh', width: 240, flexShrink: 0, background: C.white, borderRight: `1px solid ${C.line}`, display: 'flex', flexDirection: 'column', zIndex: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '22px 22px 16px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: C.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 6px 16px rgba(255,107,53,.32)' }}>
              <div style={{ width: 13, height: 13, background: '#fff', borderRadius: 3, transform: 'rotate(45deg)' }} />
            </div>
            <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 21, letterSpacing: '-.03em', color: C.ink }}>Lumora</span>
          </div>

          <nav style={{ flex: 1, overflowY: 'auto', padding: '4px 0 10px' }}>
            <div style={{ padding: '8px 26px 8px', fontSize: 11, fontWeight: 700, color: C.faint, letterSpacing: '.11em' }}>MAIN MENU</div>
            {NAV_MAIN.map(item => (
              <Link key={item.key} to={item.to} style={navItem(item.to)}>
                <span style={{ display: 'flex', alignItems: 'center', color: location.pathname === item.to ? C.brand : C.faint }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            <div style={{ padding: '18px 26px 8px', fontSize: 11, fontWeight: 700, color: C.faint, letterSpacing: '.11em' }}>SETTINGS</div>
            {NAV_SETTINGS.map(item => (
              <Link key={item.key} to={item.to} style={navItem(item.to)}>
                <span style={{ display: 'flex', alignItems: 'center', color: location.pathname === item.to ? C.brand : C.faint }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div style={{ padding: '14px 16px', borderTop: `1px solid ${C.lineSoft}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', background: C.bg, border: `1px solid ${C.lineSoft}`, borderRadius: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: C.brandSoft, color: '#C2410C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{initials}</div>
              <div style={{ minWidth: 0, lineHeight: 1.25 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                <div style={{ fontSize: 11.5, color: C.faint, fontWeight: 500, textTransform: 'capitalize' }}>{user.role}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

          {/* Header */}
          <header style={{ position: 'sticky', top: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '15px 32px', background: 'rgba(248,250,252,.88)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: `1px solid #E8EDF3` }}>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontFamily: F.display, fontWeight: 800, fontSize: 22, letterSpacing: '-.025em', color: C.ink, margin: 0, lineHeight: 1.1 }}>{PAGE_TITLES[page]}</h1>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 2, fontWeight: 500 }}>{PAGE_SUBS[page]}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13, flexShrink: 0 }}>
              <div style={{ position: 'relative', width: 300 }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.faint, display: 'flex' }}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><SearchIcon /></svg>
                </span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products, orders, customers…" style={{ width: '100%', height: 42, padding: '0 14px 0 39px', border: `1px solid ${C.line}`, borderRadius: 12, background: C.white, fontFamily: F.body, fontSize: 13.5, fontWeight: 500, color: C.ink, outline: 'none', boxShadow: '0 1px 2px rgba(16,24,40,.03)' }} />
              </div>

              {/* Bell */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => { setBellOpen(v => !v); setAcctOpen(false) }} style={{ position: 'relative', width: 42, height: 42, borderRadius: 12, border: `1px solid ${C.line}`, background: C.white, color: C.slate, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><BellIcon /></svg>
                  <span style={{ position: 'absolute', top: 7, right: 8, minWidth: 16, height: 16, padding: '0 4px', borderRadius: 999, background: C.brand, color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #F8FAFC' }}>3</span>
                </button>
                {bellOpen && (
                  <div style={{ position: 'absolute', right: 0, top: 50, width: 320, background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, boxShadow: '0 12px 40px rgba(16,24,40,.12)', zIndex: 50, animation: 'popIn .2s ease' }}>
                    <div style={{ padding: '16px 18px 12px', borderBottom: `1px solid ${C.lineSoft}` }}>
                      <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 16, color: C.ink }}>Notifications</div>
                    </div>
                    {[
                      { title: 'New order received', sub: '#LUM-4821 · $249.00', time: '2 min ago', dot: C.brand },
                      { title: 'Low stock alert', sub: 'Cove Cashmere Scarf — 6 left', time: '14 min ago', dot: '#D97706' },
                      { title: 'Review pending', sub: 'Botanic Facial Serum · ★★★★☆', time: '1 hr ago', dot: '#3B82F6' },
                    ].map((n, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 18px', borderBottom: i < 2 ? `1px solid ${C.lineSoft}` : 'none' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.dot, marginTop: 6, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>{n.title}</div>
                          <div style={{ fontSize: 12, color: C.faint, fontWeight: 500, marginTop: 2 }}>{n.sub}</div>
                        </div>
                        <div style={{ marginLeft: 'auto', fontSize: 11, color: C.faint, fontWeight: 600, whiteSpace: 'nowrap' }}>{n.time}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Account */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => { setAcctOpen(v => !v); setBellOpen(false) }} style={{ display: 'flex', alignItems: 'center', gap: 9, height: 42, padding: '0 10px 0 5px', borderRadius: 12, border: `1px solid ${C.line}`, background: C.white, cursor: 'pointer', boxShadow: '0 1px 2px rgba(16,24,40,.03)' }}>
                  <span style={{ width: 32, height: 32, borderRadius: 9, background: C.brandSoft, color: '#C2410C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12.5 }}>{initials}</span>
                  <span style={{ color: C.faint, display: 'flex' }}><ChevronDn /></span>
                </button>
                {acctOpen && (
                  <div style={{ position: 'absolute', right: 0, top: 50, width: 200, background: C.white, border: `1px solid ${C.line}`, borderRadius: 14, boxShadow: '0 12px 40px rgba(16,24,40,.12)', zIndex: 50, animation: 'popIn .2s ease', overflow: 'hidden' }}>
                    <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.lineSoft}` }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>{user.name}</div>
                      <div style={{ fontSize: 12, color: C.faint, marginTop: 2, textTransform: 'capitalize' }}>{user.role}</div>
                    </div>
                    <button onClick={() => { navigate(`${BASE}/settings`); setAcctOpen(false) }} style={{ width: '100%', textAlign: 'left', padding: '11px 16px', border: 'none', background: 'none', fontSize: 13.5, fontWeight: 600, color: C.inkSoft, cursor: 'pointer', fontFamily: F.body }}>Settings</button>
                    <button onClick={onLogout} style={{ width: '100%', textAlign: 'left', padding: '11px 16px', border: 'none', borderTop: `1px solid ${C.lineSoft}`, background: 'none', fontSize: 13.5, fontWeight: 600, color: '#DC2626', cursor: 'pointer', fontFamily: F.body }}>Log out</button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page content */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {children}
          </main>
        </div>

        {/* Close dropdowns on outside click */}
        {(bellOpen || acctOpen) && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => { setBellOpen(false); setAcctOpen(false) }} />
        )}
      </div>
    </>
  )
}
