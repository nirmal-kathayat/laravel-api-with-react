import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { getUser, getToken, clearSession } from '../lib/auth'
import AdminLayout from '../layouts/AdminLayout'
import ProductsPage from './admin/products/ProductsPage'
import {
  C, F, card, tableHead, tablePad, primaryBtn, filterInput, filterSelect, actionBtn, statusBadge, catChip, avatarStyle,
  StarIcon, SearchIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon, ImageIcon, TrendUpIcon, TrendDnIcon,
} from './admin/shared'

/* ─── Static data ─────────────────────────────────────────────────────────── */
const ORDERS = [
  { id: '#LUM-4821', customer: 'Sofia Andersen',  product: 'Nimbus Wireless Headphones', count: 1, amount: '$249.00', payment: 'Paid',   status: 'Delivered',  date: 'Jun 28, 2026', initials: 'SA', ai: 0 },
  { id: '#LUM-4820', customer: 'Marcus Webb',     product: 'Meridian Leather Tote',      count: 1, amount: '$315.00', payment: 'Paid',   status: 'Shipped',    date: 'Jun 27, 2026', initials: 'MW', ai: 1 },
  { id: '#LUM-4819', customer: 'Yuki Tanaka',     product: 'Botanic Facial Serum ×3',   count: 3, amount: '$216.00', payment: 'Paid',   status: 'Processing', date: 'Jun 27, 2026', initials: 'YT', ai: 2 },
  { id: '#LUM-4818', customer: 'Lena Fischer',    product: 'Halo Scented Candle ×2',    count: 2, amount: '$76.00',  payment: 'Unpaid', status: 'Pending',    date: 'Jun 26, 2026', initials: 'LF', ai: 3 },
  { id: '#LUM-4817', customer: 'Ahmed Al-Rashid', product: 'Orbit Smart Watch',         count: 1, amount: '$399.00', payment: 'Paid',   status: 'Processing', date: 'Jun 26, 2026', initials: 'AA', ai: 4 },
  { id: '#LUM-4816', customer: 'Clara Bouchard',  product: 'Aurora Linen Throw',        count: 1, amount: '$89.00',  payment: 'Refunded', status: 'Cancelled', date: 'Jun 25, 2026', initials: 'CB', ai: 5 },
  { id: '#LUM-4815', customer: 'James O\'Brien',  product: 'Lumen Smart Lamp',          count: 1, amount: '$159.00', payment: 'Paid',   status: 'Delivered',  date: 'Jun 25, 2026', initials: 'JO', ai: 0 },
  { id: '#LUM-4814', customer: 'Priya Sharma',    product: 'Drift Yoga Mat',            count: 2, amount: '$116.00', payment: 'Paid',   status: 'Shipped',    date: 'Jun 24, 2026', initials: 'PS', ai: 1 },
]

const CUSTOMERS = [
  { name: 'Sofia Andersen',  email: 'sofia@example.com',  join: 'Jan 14, 2025', orders: 12, spent: '$1,840', status: 'Active',   ai: 0 },
  { name: 'Marcus Webb',     email: 'marcus@example.com', join: 'Mar 3, 2025',  orders: 7,  spent: '$2,105', status: 'Active',   ai: 1 },
  { name: 'Yuki Tanaka',     email: 'yuki@example.com',   join: 'Nov 22, 2024', orders: 24, spent: '$3,670', status: 'Active',   ai: 2 },
  { name: 'Lena Fischer',    email: 'lena@example.com',   join: 'Feb 8, 2025',  orders: 3,  spent: '$290',   status: 'Inactive', ai: 3 },
  { name: 'Ahmed Al-Rashid', email: 'ahmed@example.com',  join: 'Dec 1, 2024',  orders: 9,  spent: '$4,210', status: 'Active',   ai: 4 },
  { name: 'Clara Bouchard',  email: 'clara@example.com',  join: 'Apr 17, 2025', orders: 2,  spent: '$124',   status: 'Inactive', ai: 5 },
  { name: 'James O\'Brien',  email: 'james@example.com',  join: 'Oct 5, 2024',  orders: 18, spent: '$2,940', status: 'Active',   ai: 0 },
  { name: 'Priya Sharma',    email: 'priya@example.com',  join: 'May 29, 2025', orders: 5,  spent: '$580',   status: 'Active',   ai: 1 },
]

const CATEGORIES_DATA = [
  { name: 'Electronics',   productCount: 4,  revenue: '$18.2k', status: 'Active' },
  { name: 'Fashion',       productCount: 5,  revenue: '$22.8k', status: 'Active' },
  { name: 'Home & Living', productCount: 3,  revenue: '$9.4k',  status: 'Active' },
  { name: 'Beauty',        productCount: 2,  revenue: '$11.6k', status: 'Active' },
  { name: 'Sports',        productCount: 3,  revenue: '$6.2k',  status: 'Active' },
  { name: 'Accessories',   productCount: 2,  revenue: '$7.8k',  status: 'Active' },
]

const REVIEWS = [
  { customer: 'Sofia Andersen', product: 'Nimbus Wireless Headphones', date: 'Jun 28, 2026', rating: 5, status: 'Published', text: 'Absolutely incredible sound quality. The ANC is best-in-class and the battery really does last 40 hours. Worth every penny!', ai: 0 },
  { customer: 'Marcus Webb',    product: 'Meridian Leather Tote',      date: 'Jun 27, 2026', rating: 5, status: 'Published', text: 'The craftsmanship is outstanding. The leather is buttery soft and the interior layout is really thoughtful. My new daily carry.', ai: 1 },
  { customer: 'Yuki Tanaka',    product: 'Botanic Facial Serum',       date: 'Jun 27, 2026', rating: 4, status: 'Pending',   text: 'Great serum — skin looks brighter after 2 weeks. The texture is lightweight and absorbs quickly. Just wish it came in a larger size.', ai: 2 },
  { customer: 'Priya Sharma',   product: 'Drift Yoga Mat',             date: 'Jun 24, 2026', rating: 5, status: 'Published', text: 'Best mat I\'ve owned. The natural rubber grip is phenomenal and the alignment guides are subtle but genuinely useful.', ai: 3 },
]

const FLASH_SALES = [
  { name: 'Summer Solstice Sale', status: 'Live',      discount: '30% OFF', products: 24, orders: 184, revenue: '$14,280', progress: 68,  period: 'Jun 21 – Jun 30, 2026',  barColor: C.brand },
  { name: 'Electronics Week',     status: 'Scheduled', discount: '20% OFF', products: 12, orders: 0,   revenue: '$0',       progress: 0,   period: 'Jul 7 – Jul 14, 2026',   barColor: '#3B82F6' },
  { name: 'Spring Clearance',     status: 'Ended',     discount: '40% OFF', products: 31, orders: 560, revenue: '$38,420', progress: 100, period: 'Mar 1 – Mar 15, 2026',   barColor: C.faint },
]

const CAMPAIGNS = [
  { name: 'Summer Solstice Picks',  subject: 'Your summer edit is here ☀️',     sent: '12,840', opens: '34.2%', clicks: '8.1%', revenue: '$4,210', status: 'Sent', date: 'Jun 21, 2026' },
  { name: 'New Arrivals Drop',      subject: 'Just landed — fresh picks for you', sent: '12,560', opens: '28.7%', clicks: '5.4%', revenue: '$2,840', status: 'Sent', date: 'Jun 7, 2026'  },
  { name: 'Flash Sale Alert',       subject: '⚡ 30% off for 48 hours only!',    sent: '11,200', opens: '41.8%', clicks: '14.2%',revenue: '$8,290', status: 'Sent', date: 'May 28, 2026' },
  { name: 'Loyalty Rewards',        subject: 'You\'ve earned a reward 🎁',       sent: '3,840',  opens: '52.1%', clicks: '19.8%',revenue: '$1,620', status: 'Sent', date: 'May 14, 2026' },
  { name: 'July Independence Sale', subject: '🎉 Big savings this July 4th',     sent: '—',      opens: '—',     clicks: '—',    revenue: '—',      status: 'Scheduled', date: 'Jul 4, 2026' },
]

/* ══════════════════════════════════════════════════════════════════════════ */
/*  SECTION COMPONENTS                                                        */
/*  These are still demo/static content — Products is the only section wired  */
/*  to the real backend so far. See ./admin/products/ for that module.        */
/* ══════════════════════════════════════════════════════════════════════════ */

/* ─── Dashboard ──────────────────────────────────────────────────────────── */
function Dashboard() {
  const navigate = useNavigate()
  const stats = [
    { label: 'TOTAL REVENUE',  value: '$84.2k', sub: '+12.4% vs last month', trend: '+12.4%', trendUp: true,  sparkColor: '#FF6B35', sparkLine: '0,28 18,22 36,30 54,14 72,20 88,8',  sparkArea: '0,28 18,22 36,30 54,14 72,20 88,8 88,36 0,36' },
    { label: 'TOTAL ORDERS',   value: '1,284',  sub: '+8.1% vs last month',  trend: '+8.1%',  trendUp: true,  sparkColor: '#3B82F6', sparkLine: '0,30 18,26 36,20 54,24 72,14 88,10', sparkArea: '0,30 18,26 36,20 54,24 72,14 88,10 88,36 0,36' },
    { label: 'CUSTOMERS',      value: '9,201',  sub: '+5.7% vs last month',  trend: '+5.7%',  trendUp: true,  sparkColor: '#8B5CF6', sparkLine: '0,32 18,28 36,22 54,18 72,24 88,12', sparkArea: '0,32 18,28 36,22 54,18 72,24 88,12 88,36 0,36' },
    { label: 'AVG. ORDER',     value: '$66',    sub: '-1.2% vs last month',  trend: '-1.2%',  trendUp: false, sparkColor: '#10B981', sparkLine: '0,12 18,18 36,14 54,22 72,26 88,30', sparkArea: '0,12 18,18 36,14 54,22 72,26 88,30 88,36 0,36' },
  ]
  const recentOrders = ORDERS.slice(0, 6)
  const catSales = [
    { name: 'Electronics',   val: 22800, pct: 88 }, { name: 'Fashion', val: 18400, pct: 71 },
    { name: 'Beauty',        val: 14200, pct: 55 }, { name: 'Home & Living', val: 9800, pct: 38 },
    { name: 'Accessories',   val: 7400,  pct: 29 }, { name: 'Sports', val: 4200, pct: 16 },
  ]
  const topProds = [
    { name: 'Halo Scented Candle',        cat: 'Home & Living', price: '$38', sales: '4,050 sold', pct: 100 },
    { name: 'Botanic Facial Serum',       cat: 'Beauty',        price: '$72', sales: '3,210 sold', pct: 79  },
    { name: 'Velvet Matte Lipstick',      cat: 'Beauty',        price: '$32', sales: '2,680 sold', pct: 66  },
    { name: 'Nimbus Wireless Headphones', cat: 'Electronics',   price: '$249',sales: '2,140 sold', pct: 53  },
    { name: 'Lumen Smart Lamp',           cat: 'Electronics',   price: '$159',sales: '1,902 sold', pct: 47  },
  ]

  return (
    <section style={{ padding: '26px 32px 44px', animation: 'pageIn .3s ease' }}>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 18 }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...card, overflow: 'visible', padding: '19px 21px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: C.faint, letterSpacing: '.06em' }}>{s.label}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 700, color: s.trendUp ? '#16A34A' : '#DC2626' }}>
                {s.trendUp ? <TrendUpIcon /> : <TrendDnIcon />}{s.trend}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 }}>
              <div>
                <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 30, lineHeight: 1, letterSpacing: '-.03em', color: C.ink }}>{s.value}</div>
                <div style={{ fontSize: 12, color: C.faint, marginTop: 9, fontWeight: 600 }}>{s.sub}</div>
              </div>
              <svg viewBox="0 0 100 36" preserveAspectRatio="none" style={{ width: 88, height: 36, flexShrink: 0 }}>
                <polygon points={s.sparkArea} fill={s.sparkColor} style={{ opacity: .11 }} />
                <polyline points={s.sparkLine} fill="none" stroke={s.sparkColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders + category breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 18, marginBottom: 18 }}>
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '20px 22px 14px' }}>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: C.faint, letterSpacing: '.08em', marginBottom: 5 }}>RECENT</div>
              <h3 style={{ fontFamily: F.display, fontWeight: 800, fontSize: 18, letterSpacing: '-.02em', color: C.ink, margin: 0 }}>Recent Orders</h3>
            </div>
            <span onClick={() => navigate('/dashboard/admin/orders')} style={{ fontSize: 13, fontWeight: 700, color: C.brand, cursor: 'pointer' }}>View all →</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              {['Order ID','Customer','Product','Amount','Status','Date'].map((h, i) => (
                <th key={h} style={{ ...tableHead, textAlign: i === 3 ? 'right' : 'left', padding: i === 0 ? '9px 22px' : i === 5 ? '9px 22px' : '9px 12px' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {recentOrders.map((o, i) => (
                <tr key={o.id}>
                  <td style={{ padding: '13px 22px', borderBottom: '1px solid #F1F5F9' }}><span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 12.5, fontWeight: 700, color: C.ink }}>{o.id}</span></td>
                  <td style={tablePad}><span style={{ fontSize: 13.5, fontWeight: 600, color: C.inkSoft }}>{o.customer}</span></td>
                  <td style={tablePad}><span style={{ fontSize: 13, fontWeight: 500, color: C.muted }}>{o.product}</span></td>
                  <td style={{ ...tablePad, textAlign: 'right' }}><span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 13, fontWeight: 700, color: C.ink }}>{o.amount}</span></td>
                  <td style={tablePad}><span style={statusBadge(o.status)}>{o.status}</span></td>
                  <td style={{ padding: '13px 22px', borderBottom: '1px solid #F1F5F9', textAlign: 'right' }}><span style={{ fontSize: 12.5, fontWeight: 600, color: C.faint }}>{o.date}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ ...card, padding: '20px 22px 8px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: C.faint, letterSpacing: '.08em', marginBottom: 5 }}>BREAKDOWN</div>
          <h3 style={{ fontFamily: F.display, fontWeight: 800, fontSize: 18, letterSpacing: '-.02em', color: C.ink, margin: '0 0 18px' }}>Sales by Category</h3>
          {catSales.map(cat => (
            <div key={cat.name} style={{ marginBottom: 15 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft }}>{cat.name}</span>
                <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 12, fontWeight: 700, color: C.ink }}>${(cat.val/1000).toFixed(1)}k</span>
              </div>
              <div style={{ height: 8, background: '#EEF2F7', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${cat.pct}%`, borderRadius: 999, background: C.brand }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top products */}
      <div style={{ ...card, padding: '20px 24px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 6 }}>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: C.faint, letterSpacing: '.08em', marginBottom: 5 }}>BEST SELLERS</div>
            <h3 style={{ fontFamily: F.display, fontWeight: 800, fontSize: 18, letterSpacing: '-.02em', color: C.ink, margin: 0 }}>Top Products</h3>
          </div>
          <span onClick={() => navigate('/dashboard/admin/products')} style={{ fontSize: 13, fontWeight: 700, color: C.brand, cursor: 'pointer' }}>All products →</span>
        </div>
        {topProds.map(t => (
          <div key={t.name} style={{ display: 'grid', gridTemplateColumns: '40px 1.5fr auto 96px 150px', alignItems: 'center', gap: 16, padding: '13px 0', borderTop: `1px solid ${C.lineSoft}` }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F1F5F9', border: `1px solid ${C.lineSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B4C0CE' }}><ImageIcon size={16} /></div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
              <span style={catChip(t.cat)}>{t.cat}</span>
            </div>
            <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 13, fontWeight: 700, color: C.ink }}>{t.price}</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: C.muted, textAlign: 'right' }}>{t.sales}</div>
            <div style={{ height: 8, background: '#EEF2F7', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${t.pct}%`, borderRadius: 999, background: C.brand }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Orders ─────────────────────────────────────────────────────────────── */
function Orders() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatus] = useState('All')
  const orderStats = [
    { label: 'TOTAL ORDERS', value: '1,284', icon: '📦', iconBg: '#FFF3E9', iconColor: '#C2410C' },
    { label: 'PENDING',      value: '38',    icon: '⏳', iconBg: '#FFFBEB', iconColor: '#D97706' },
    { label: 'SHIPPED',      value: '142',   icon: '🚚', iconBg: '#EFF6FF', iconColor: '#2563EB' },
    { label: 'DELIVERED',    value: '1,104', icon: '✅', iconBg: '#ECFDF5', iconColor: '#059669' },
  ]
  const rows = ORDERS.filter(o =>
    (!search || o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === 'All' || o.status === statusFilter)
  )

  return (
    <section style={{ padding: '26px 32px 44px', animation: 'pageIn .3s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 22 }}>
        {orderStats.map(s => (
          <div key={s.label} style={{ ...card, overflow: 'visible', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.faint, letterSpacing: '.07em', textTransform: 'uppercase' }}>{s.label}</span>
              <span style={{ width: 34, height: 34, borderRadius: 10, background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{s.icon}</span>
            </div>
            <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 28, letterSpacing: '-.03em', color: C.ink }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.faint, display: 'flex' }}><svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><SearchIcon /></svg></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order # or customer…" style={filterInput} />
        </div>
        <select value={statusFilter} onChange={e => setStatus(e.target.value)} style={filterSelect}>
          {['All','Pending','Processing','Shipped','Delivered','Cancelled'].map(o => <option key={o} value={o}>{o === 'All' ? 'All Statuses' : o}</option>)}
        </select>
      </div>
      <div style={card}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>
            {['Order #','Customer','Items','Total','Payment','Status','Date',''].map((h, i) => (
              <th key={i} style={{ ...tableHead, textAlign: i===2?'center':i===3?'right':'left', padding: i===0?'11px 22px':i===7?'11px 22px':'11px 12px' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 60, textAlign: 'center' }}>
                <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 18, color: C.ink, marginBottom: 6 }}>No orders found</div>
                <div style={{ fontSize: 13.5, color: C.faint, fontWeight: 500 }}>Try adjusting your search or filter.</div>
              </td></tr>
            ) : rows.map((o, idx) => (
              <tr key={o.id}>
                <td style={{ padding: '14px 22px', borderBottom: '1px solid #F1F5F9' }}><span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 12.5, fontWeight: 700, color: C.ink }}>{o.id}</span></td>
                <td style={{ padding: '14px 12px', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={avatarStyle(o.ai)}>{o.initials}</div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>{o.customer}</div>
                      <div style={{ fontSize: 12, color: C.faint, fontWeight: 500 }}>{o.product}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 12px', borderBottom: '1px solid #F1F5F9', textAlign: 'center' }}>
                  <span style={{ display: 'inline-flex', padding: '2px 10px', borderRadius: 999, background: '#EEF2F7', fontSize: 12.5, fontWeight: 700, color: C.slate }}>{o.count}</span>
                </td>
                <td style={{ padding: '14px 12px', borderBottom: '1px solid #F1F5F9', textAlign: 'right', fontFamily: 'ui-monospace,monospace', fontSize: 13.5, fontWeight: 700, color: C.ink }}>{o.amount}</td>
                <td style={{ padding: '14px 12px', borderBottom: '1px solid #F1F5F9' }}><span style={statusBadge(o.payment)}>{o.payment}</span></td>
                <td style={{ padding: '14px 12px', borderBottom: '1px solid #F1F5F9' }}><span style={statusBadge(o.status)}>{o.status}</span></td>
                <td style={{ padding: '14px 12px', borderBottom: '1px solid #F1F5F9', textAlign: 'right', fontSize: 12.5, fontWeight: 600, color: C.faint, whiteSpace: 'nowrap' }}>{o.date}</td>
                <td style={{ padding: '14px 22px', borderBottom: '1px solid #F1F5F9', textAlign: 'right' }}>
                  <button style={actionBtn()}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><EyeIcon /></svg></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

/* ─── Customers ──────────────────────────────────────────────────────────── */
function Customers() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatus] = useState('All')
  const rows = CUSTOMERS.filter(c =>
    (!search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === 'All' || c.status === statusFilter)
  )

  return (
    <section style={{ padding: '26px 32px 44px', animation: 'pageIn .3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.faint, display: 'flex' }}><svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><SearchIcon /></svg></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" style={filterInput} />
        </div>
        <select value={statusFilter} onChange={e => setStatus(e.target.value)} style={filterSelect}>
          <option value="All">All Customers</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <div style={card}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>
            {['Customer','Joined','Orders','Lifetime Value','Status','Actions'].map((h, i) => (
              <th key={h} style={{ ...tableHead, textAlign: i===2||i===3?'right':'left', padding: i===0?'11px 22px':i===5?'11px 22px':'11px 12px' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 60, textAlign: 'center' }}>
                <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 18, color: C.ink, marginBottom: 6 }}>No customers found</div>
                <div style={{ fontSize: 13.5, color: C.faint, fontWeight: 500 }}>Try adjusting your search or filter.</div>
              </td></tr>
            ) : rows.map(row => (
              <tr key={row.email}>
                <td style={{ padding: '14px 22px', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={avatarStyle(row.ai)}>{row.name.split(' ').map(n=>n[0]).join('')}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{row.name}</div>
                      <div style={{ fontSize: 12.5, color: C.faint, fontWeight: 500 }}>{row.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ ...tablePad, fontSize: 13, fontWeight: 500, color: C.muted }}>{row.join}</td>
                <td style={{ ...tablePad, textAlign: 'right', fontFamily: 'ui-monospace,monospace', fontSize: 13.5, fontWeight: 700, color: C.ink }}>{row.orders}</td>
                <td style={{ ...tablePad, textAlign: 'right', fontFamily: 'ui-monospace,monospace', fontSize: 13.5, fontWeight: 700, color: C.ink }}>{row.spent}</td>
                <td style={tablePad}><span style={statusBadge(row.status)}>{row.status}</span></td>
                <td style={{ padding: '14px 22px', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                    <button style={actionBtn()}><PencilIcon /></button>
                    <button style={{ ...actionBtn(), background: '#FEF2F2', color: '#DC2626' }}><TrashIcon /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

/* ─── Categories ─────────────────────────────────────────────────────────── */
function CategoriesPage() {
  return (
    <section style={{ padding: '26px 32px 44px', animation: 'pageIn .3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 22 }}>
        <button style={primaryBtn}><PlusIcon /> Add Category</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
        {CATEGORIES_DATA.map(cat => (
          <div key={cat.name} style={card}>
            <div style={{ height: 110, background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C8D4E0', borderBottom: `1px solid ${C.lineSoft}` }}>
              <ImageIcon size={36} />
            </div>
            <div style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 14 }}>
                <h3 style={{ fontFamily: F.display, fontWeight: 800, fontSize: 17, letterSpacing: '-.02em', color: C.ink, margin: 0 }}>{cat.name}</h3>
                <span style={statusBadge(cat.status)}>{cat.status}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[['Products', cat.productCount], ['Revenue', cat.revenue]].map(([label, val]) => (
                  <div key={label} style={{ background: '#F8FAFC', border: `1px solid ${C.lineSoft}`, borderRadius: 12, padding: '11px 14px' }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 22, color: C.ink }}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ flex: 1, height: 38, border: `1px solid ${C.line}`, borderRadius: 11, background: C.white, fontSize: 13, fontWeight: 700, color: C.slate, cursor: 'pointer' }}>Edit</button>
                <button style={{ flex: 1, height: 38, border: 'none', borderRadius: 11, background: C.ink, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>View Products</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Reviews ─────────────────────────────────────────────────────────────── */
function ReviewsPage() {
  const [filter, setFilter] = useState('All')
  const Stars = ({ n }) => <span style={{ display: 'inline-flex', gap: 2 }}>{[1,2,3,4,5].map(i => <StarIcon key={i} filled={i <= n} />)}</span>

  return (
    <section style={{ padding: '26px 32px 44px', animation: 'pageIn .3s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 22 }}>
        {[
          { label: 'Avg. Rating',      val: <>4.7 <span style={{ marginLeft: 8 }}><Stars n={5} /><div style={{ fontSize: 12, fontWeight: 600, color: C.faint, marginTop: 4 }}>1,284 reviews</div></span></>, flex: true },
          { label: 'Published',        val: '1,261', color: C.ink },
          { label: 'Pending Approval', val: '23',    color: '#D97706' },
        ].map((s, i) => (
          <div key={i} style={{ ...card, overflow: 'visible', padding: '20px 22px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>{s.label}</div>
            {s.flex
              ? <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 36, lineHeight: 1, color: C.ink }}>4.7</div><div><Stars n={5} /><div style={{ fontSize: 12, fontWeight: 600, color: C.faint, marginTop: 4 }}>1,284 reviews</div></div></div>
              : <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 36, color: s.color }}>{s.val}</div>
            }
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 20 }}>
        {['All','Published','Pending'].map(opt => (
          <button key={opt} onClick={() => setFilter(opt)} style={{ height: 36, padding: '0 16px', borderRadius: 999, border: `1px solid ${filter===opt ? C.brand : C.line}`, background: filter===opt ? C.brand : C.white, color: filter===opt ? '#fff' : C.slate, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: F.body }}>{opt}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        {REVIEWS.filter(r => filter === 'All' || r.status === filter).map((r, i) => (
          <div key={i} style={{ ...card, overflow: 'visible', padding: '18px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 11 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={avatarStyle(r.ai)}>{r.customer.split(' ').map(n=>n[0]).join('')}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{r.customer}</div>
                  <div style={{ fontSize: 12, color: C.faint, fontWeight: 500 }}>{r.date}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <Stars n={r.rating} />
                <span style={statusBadge(r.status)}>{r.status}</span>
                <div style={{ display: 'flex', gap: 5 }}>
                  <button style={actionBtn()}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><EyeIcon /></svg></button>
                  <button style={{ ...actionBtn(), background: '#FEF2F2', color: '#DC2626' }}><TrashIcon /></button>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{r.product}</div>
            <div style={{ fontSize: 14, color: C.slate, fontWeight: 500, lineHeight: 1.6 }}>{r.text}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Flash Sales ────────────────────────────────────────────────────────── */
function FlashSalesPage() {
  return (
    <section style={{ padding: '26px 32px 44px', animation: 'pageIn .3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 22 }}>
        <button style={primaryBtn}><PlusIcon /> New Sale</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {FLASH_SALES.map(sale => (
          <div key={sale.name} style={{ ...card, overflow: 'visible', padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 18 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                  <h3 style={{ fontFamily: F.display, fontWeight: 800, fontSize: 19, letterSpacing: '-.02em', color: C.ink, margin: 0 }}>{sale.name}</h3>
                  <span style={statusBadge(sale.status)}>{sale.status}</span>
                </div>
                <div style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>{sale.period}</div>
              </div>
              <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
                <button style={actionBtn()}><PencilIcon /></button>
                <button style={{ ...actionBtn(), background: '#FEF2F2', color: '#DC2626' }}><TrashIcon /></button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18 }}>
              {[
                { label: 'Discount', val: sale.discount, bg: C.brandSoft, color: C.brand },
                { label: 'Products', val: sale.products, bg: '#F8FAFC', color: C.ink, border: true },
                { label: 'Orders',   val: sale.orders,   bg: '#F8FAFC', color: C.ink, border: true },
                { label: 'Revenue',  val: sale.revenue,  bg: '#F8FAFC', color: C.ink, border: true },
              ].map(m => (
                <div key={m.label} style={{ background: m.bg, border: m.border ? `1px solid ${C.lineSoft}` : 'none', borderRadius: 13, padding: '13px 16px' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: m.border ? C.faint : '#C2410C', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>{m.label}</div>
                  <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 22, color: m.color }}>{m.val}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: C.faint, marginBottom: 6 }}>
                <span>Timeline</span><span>{sale.progress}%</span>
              </div>
              <div style={{ height: 7, background: '#EEF2F7', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${sale.progress}%`, borderRadius: 999, background: sale.barColor, transition: 'width .3s' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Newsletter ─────────────────────────────────────────────────────────── */
function NewsletterPage() {
  return (
    <section style={{ padding: '26px 32px 44px', animation: 'pageIn .3s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Subscribers',       val: '12,840', sub: '↑ +284 this month',   subColor: '#16A34A' },
          { label: 'Avg. Open Rate',    val: '34.2%',  sub: '↑ +2.1 pts vs last', subColor: '#16A34A' },
          { label: 'Revenue Attributed',val: '$8,290', sub: '↑ last 30 days',      subColor: '#16A34A' },
        ].map(s => (
          <div key={s.label} style={{ ...card, overflow:'visible', padding: '20px 22px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 32, color: C.ink, marginBottom: 5 }}>{s.val}</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: s.subColor }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: C.faint, letterSpacing: '.08em', marginBottom: 4 }}>CAMPAIGNS</div>
          <h3 style={{ fontFamily: F.display, fontWeight: 800, fontSize: 19, letterSpacing: '-.02em', color: C.ink, margin: 0 }}>Recent Campaigns</h3>
        </div>
        <button style={primaryBtn}><PlusIcon /> New Campaign</button>
      </div>
      <div style={card}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>
            {['Campaign','Sent','Opens','Clicks','Revenue','Status','Date'].map((h, i) => (
              <th key={h} style={{ ...tableHead, textAlign: i===0?'left':i===5?'left':'right', padding: i===0?'11px 22px':i===6?'11px 22px':'11px 12px' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {CAMPAIGNS.map(c => (
              <tr key={c.name}>
                <td style={{ padding: '14px 22px', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: C.faint, fontWeight: 500 }}>{c.subject}</div>
                </td>
                <td style={{ padding: '14px 12px', borderBottom: '1px solid #F1F5F9', textAlign: 'right', fontFamily: 'ui-monospace,monospace', fontSize: 13, fontWeight: 700, color: C.muted }}>{c.sent}</td>
                <td style={{ padding: '14px 12px', borderBottom: '1px solid #F1F5F9', textAlign: 'right', fontSize: 13.5, fontWeight: 700, color: C.ink }}>{c.opens}</td>
                <td style={{ padding: '14px 12px', borderBottom: '1px solid #F1F5F9', textAlign: 'right', fontSize: 13.5, fontWeight: 700, color: C.brand }}>{c.clicks}</td>
                <td style={{ padding: '14px 12px', borderBottom: '1px solid #F1F5F9', textAlign: 'right', fontFamily: 'ui-monospace,monospace', fontSize: 13.5, fontWeight: 700, color: C.ink }}>{c.revenue}</td>
                <td style={{ padding: '14px 12px', borderBottom: '1px solid #F1F5F9' }}><span style={statusBadge(c.status === 'Scheduled' ? 'Processing' : c.status)}>{c.status}</span></td>
                <td style={{ padding: '14px 22px', borderBottom: '1px solid #F1F5F9', textAlign: 'right', fontSize: 12.5, fontWeight: 600, color: C.faint, whiteSpace: 'nowrap' }}>{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

/* ─── Settings ───────────────────────────────────────────────────────────── */
function SettingsPage({ user }) {
  const sections = [
    { title: 'Store Information', fields: [
      { label: 'Store Name', value: 'Lumora', type: 'text' },
      { label: 'Support Email', value: 'support@lumora.shop', type: 'email' },
      { label: 'Currency', value: 'USD — US Dollar', type: 'select', options: ['USD — US Dollar', 'EUR — Euro', 'GBP — British Pound'] },
    ]},
    { title: 'Account', fields: [
      { label: 'Display Name', value: user?.name || 'Admin', type: 'text' },
      { label: 'Email', value: user?.email || 'admin@diyalotech.com', type: 'email' },
    ]},
  ]

  return (
    <section style={{ padding: '26px 32px 44px', animation: 'pageIn .3s ease', maxWidth: 720 }}>
      {sections.map(s => (
        <div key={s.title} style={{ ...card, overflow: 'visible', padding: '24px 28px', marginBottom: 18 }}>
          <h3 style={{ fontFamily: F.display, fontWeight: 800, fontSize: 17, color: C.ink, margin: '0 0 20px' }}>{s.title}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {s.fields.map(f => (
              <label key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft }}>{f.label}</span>
                {f.type === 'select'
                  ? <select defaultValue={f.value} style={{ height: 42, padding: '0 13px', border: `1px solid ${C.line}`, borderRadius: 11, fontFamily: F.body, fontSize: 13.5, color: C.ink, outline: 'none', background: C.white, cursor: 'pointer' }}>
                      {f.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  : <input defaultValue={f.value} type={f.type} style={{ height: 42, padding: '0 13px', border: `1px solid ${C.line}`, borderRadius: 11, fontFamily: F.body, fontSize: 13.5, color: C.ink, outline: 'none' }} />
                }
              </label>
            ))}
          </div>
          <div style={{ marginTop: 20 }}>
            <button style={primaryBtn}>Save Changes</button>
          </div>
        </div>
      ))}
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                            */
/* ══════════════════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const navigate = useNavigate()
  // ProtectedRoute (see App.jsx) already guarantees a valid admin/super-admin
  // session before this component ever renders, so this is a plain read —
  // no need to re-check or redirect here too.
  const user = getUser()

  const logout = async () => {
    const token = getToken()
    if (token) {
      await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      }).catch(() => {})
    }
    clearSession()
    navigate('/login')
  }

  return (
    <AdminLayout user={user} onLogout={logout}>
      {/* Nested routes under the /dashboard/admin/* wildcard in App.jsx — the
          URL is the source of truth for which section is showing, so a
          refresh on /dashboard/admin/products stays on Products instead of
          bouncing back to the dashboard. */}
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="flash-sales" element={<FlashSalesPage />} />
        <Route path="newsletter" element={<NewsletterPage />} />
        <Route path="settings" element={<SettingsPage user={user} />} />
      </Routes>
    </AdminLayout>
  )
}
