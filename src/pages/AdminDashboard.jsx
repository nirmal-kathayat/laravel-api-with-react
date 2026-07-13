import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, getToken, clearSession } from '../lib/auth'
import { listProducts, createProduct, updateProduct, deleteProduct } from '../lib/products'

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const Icon = ({ d, size = 18, stroke = 'currentColor', fill = 'none', sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
)
const GridIcon   = () => <Icon d={['M3 3h7v7H3z','M14 3h7v7h-7z','M14 14h7v7h-7z','M3 14h7v7H3z']} />
const BoxIcon    = () => <Icon d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
const ShoppingBagIcon = () => <Icon d={['M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z','M3 6h18','M16 10a4 4 0 0 1-8 0']} />
const UsersIcon  = () => <Icon d={['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M23 21v-2a4 4 0 0 0-3-3.87','M16 3.13a4 4 0 0 1 0 7.75']} ><circle cx="9" cy="7" r="4" /></Icon>
const TagIcon    = () => <Icon d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"><line x1="7" y1="7" x2="7.01" y2="7" /></Icon>
const StarIcon   = ({ filled }) => <svg width={14} height={14} viewBox="0 0 24 24" fill={filled ? '#F59E0B' : 'none'} stroke="#F59E0B" strokeWidth={2}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
const ZapIcon    = () => <Icon d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
const MailIcon   = () => <Icon d={['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z','M22 6l-10 7L2 6']} />
const SettingsIcon = () => <><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} fill="none" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth={2} fill="none" /></>
const SearchIcon = () => <><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth={2} fill="none" /><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth={2} /></>
const BellIcon   = () => <Icon d={['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9','M13.73 21a2 2 0 0 1-3.46 0']} />
const ChevronDn  = () => <Icon d="M6 9l6 6 6-6" size={16} />
const ChevronL   = () => <Icon d="M15 18l-6-6 6-6" size={16} />
const ChevronR   = () => <Icon d="M9 18l6-6-6-6" size={16} />
const PlusIcon   = () => <Icon d={['M12 5v14','M5 12h14']} />
const PencilIcon = () => <Icon d={['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z']} size={15} />
const TrashIcon  = () => <Icon d={['M3 6h18','M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2']} size={15} />
const EyeIcon    = () => <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth={2} fill="none" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} fill="none" /></>
const XIcon      = () => <Icon d={['M18 6L6 18','M6 6l12 12']} />
const ImageIcon  = ({ size = 20 }) => <Icon size={size} d={['M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z']}><circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth={2} fill="none" /></Icon>
const TrendUpIcon = () => <Icon d={['M23 6l-9.5 9.5-5-5L1 18','M17 6h6v6']} size={14} />
const TrendDnIcon = () => <Icon d={['M23 18l-9.5-9.5-5 5L1 6','M17 18h6v-6']} size={14} />

/* ─── Design tokens ──────────────────────────────────────────────────────── */
const C = {
  bg: '#F8FAFC', white: '#FFFFFF', ink: '#1E293B', inkSoft: '#334155',
  slate: '#475569', muted: '#64748B', faint: '#94A3B8',
  line: '#E2E8F0', lineSoft: '#EDF1F6', cloud: '#EEF2F7',
  brand: '#FF6B35', brandSoft: '#FFF3E9',
}
const F = { display: "'Bricolage Grotesque', sans-serif", body: "'Manrope', sans-serif" }

/* ─── Badge helpers ───────────────────────────────────────────────────────── */
const statusBadge = (s) => {
  const map = {
    Active:     { bg: '#ECFDF5', color: '#059669' },
    Pending:    { bg: '#FFFBEB', color: '#D97706' },
    Processing: { bg: '#EFF6FF', color: '#2563EB' },
    Shipped:    { bg: '#F5F3FF', color: '#7C3AED' },
    Delivered:  { bg: '#ECFDF5', color: '#059669' },
    Cancelled:  { bg: '#FEF2F2', color: '#DC2626' },
    Published:  { bg: '#ECFDF5', color: '#059669' },
    'Out of Stock': { bg: '#FEF2F2', color: '#DC2626' },
    Draft:      { bg: '#F1F5F9', color: '#64748B' },
    Inactive:   { bg: '#F1F5F9', color: '#64748B' },
    Live:       { bg: '#ECFDF5', color: '#059669' },
    Scheduled:  { bg: '#EFF6FF', color: '#2563EB' },
    Ended:      { bg: '#F1F5F9', color: '#64748B' },
    Paid:       { bg: '#ECFDF5', color: '#059669' },
    Unpaid:     { bg: '#FEF2F2', color: '#DC2626' },
    Refunded:   { bg: '#F5F3FF', color: '#7C3AED' },
    Sent:       { bg: '#ECFDF5', color: '#059669' },
    Scheduled2: { bg: '#EFF6FF', color: '#2563EB' },
  }
  const t = map[s] || { bg: '#F1F5F9', color: '#64748B' }
  return { display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: t.bg, color: t.color }
}

const catChip = (cat) => {
  const map = {
    'Electronics': { bg: '#EFF6FF', color: '#2563EB' },
    'Fashion':     { bg: '#FDF4FF', color: '#9333EA' },
    'Home & Living':{ bg: '#FFF7ED', color: '#EA580C' },
    'Beauty':      { bg: '#FDF2F8', color: '#DB2777' },
    'Sports':      { bg: '#F0FDF4', color: '#16A34A' },
    'Accessories': { bg: '#FFFBEB', color: '#D97706' },
  }
  const t = map[cat] || { bg: '#F1F5F9', color: '#64748B' }
  return { display: 'inline-flex', padding: '2px 9px', borderRadius: 999, fontSize: 11.5, fontWeight: 700, background: t.bg, color: t.color }
}

const AVATAR_COLORS = [
  { bg: '#FFF3E9', color: '#C2410C' }, { bg: '#EFF6FF', color: '#1D4ED8' },
  { bg: '#F0FDF4', color: '#166534' }, { bg: '#FDF4FF', color: '#7E22CE' },
  { bg: '#FEF2F2', color: '#991B1B' }, { bg: '#FFFBEB', color: '#92400E' },
]
const avatarStyle = (i) => ({ ...AVATAR_COLORS[i % AVATAR_COLORS.length], width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12.5, flexShrink: 0 })

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

/* ─── Nav items ───────────────────────────────────────────────────────────── */
const NAV_MAIN = [
  { key: 'dashboard',   label: 'Dashboard',   icon: <GridIcon /> },
  { key: 'products',    label: 'Products',    icon: <BoxIcon /> },
  { key: 'orders',      label: 'Orders',      icon: <ShoppingBagIcon /> },
  { key: 'customers',   label: 'Customers',   icon: <UsersIcon /> },
  { key: 'categories',  label: 'Categories',  icon: <TagIcon /> },
  { key: 'reviews',     label: 'Reviews',     icon: <StarIcon filled /> },
  { key: 'flash-sales', label: 'Flash Sales', icon: <ZapIcon /> },
]
const NAV_SETTINGS = [
  { key: 'newsletter', label: 'Newsletter', icon: <MailIcon /> },
  { key: 'settings',   label: 'Settings',   icon: <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><SettingsIcon /></svg> },
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

/* ─── Shared styles ───────────────────────────────────────────────────────── */
const card = { background: C.white, border: `1px solid ${C.lineSoft}`, borderRadius: 22, boxShadow: '0 1px 2px rgba(16,24,40,.04)', overflow: 'hidden' }
const tableHead = { textAlign: 'left', padding: '11px 12px', fontSize: 10.5, fontWeight: 700, color: C.faint, letterSpacing: '.06em', textTransform: 'uppercase', borderBottom: `1px solid ${C.lineSoft}`, background: '#FBFCFE' }
const tablePad  = { padding: '13px 12px', borderBottom: `1px solid #F1F5F9` }
const primaryBtn = { display: 'inline-flex', alignItems: 'center', gap: 8, height: 42, padding: '0 20px', background: C.brand, color: '#fff', border: 'none', borderRadius: 13, fontFamily: F.body, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,107,53,.26)' }
const subtleBtn = { height: 36, padding: '0 14px', border: `1px solid ${C.line}`, borderRadius: 10, background: C.white, fontFamily: F.body, fontSize: 13, fontWeight: 700, color: C.slate, cursor: 'pointer' }
const filterInput = { width: '100%', height: 42, padding: '0 14px 0 39px', border: `1px solid ${C.line}`, borderRadius: 12, background: C.white, fontFamily: F.body, fontSize: 13.5, fontWeight: 500, color: C.ink, outline: 'none' }
const filterSelect = { height: 42, padding: '0 14px', border: `1px solid ${C.line}`, borderRadius: 12, background: C.white, fontFamily: F.body, fontSize: 13.5, fontWeight: 600, color: C.slate, outline: 'none', cursor: 'pointer' }
const actionBtn = (hover = false) => ({ width: 36, height: 36, borderRadius: 10, border: 'none', background: hover ? '#DDE5EE' : C.cloud, color: C.slate, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' })

/* ══════════════════════════════════════════════════════════════════════════ */
/*  SECTION COMPONENTS                                                        */
/* ══════════════════════════════════════════════════════════════════════════ */

/* ─── Dashboard ──────────────────────────────────────────────────────────── */
function Dashboard({ onGo }) {
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
            <span onClick={() => onGo('orders')} style={{ fontSize: 13, fontWeight: 700, color: C.brand, cursor: 'pointer' }}>View all →</span>
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
          <span onClick={() => onGo('products')} style={{ fontSize: 13, fontWeight: 700, color: C.brand, cursor: 'pointer' }}>All products →</span>
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

/* ─── Products ───────────────────────────────────────────────────────────── */
function Products() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatus] = useState('All')
  const [sort, setSort] = useState('featured')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const PER_PAGE = 8

  const load = () => {
    setLoading(true)
    setLoadError('')
    listProducts()
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setLoadError('Unable to load products. Is the backend running?'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const statusOf = (p) => p.stock === 0 ? 'Out of Stock' : (p.is_active ? 'Active' : 'Draft')

  const openAdd  = () => { setEditingProduct(null); setModalOpen(true) }
  const openEdit = (p) => { setEditingProduct(p); setModalOpen(true) }

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    try {
      await deleteProduct(product.id)
      load()
    } catch (err) {
      alert(err.message || 'Failed to delete product')
    }
  }

  let rows = products.filter(p =>
    (!search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku || '').toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === 'All' || statusOf(p) === statusFilter)
  )
  if (sort === 'price-asc')  rows = [...rows].sort((a,b) => a.price - b.price)
  if (sort === 'price-desc') rows = [...rows].sort((a,b) => b.price - a.price)
  if (sort === 'stock-asc')  rows = [...rows].sort((a,b) => a.stock - b.stock)
  const totalPages = Math.ceil(rows.length / PER_PAGE)
  const paged = rows.slice((page-1)*PER_PAGE, page*PER_PAGE)

  return (
    <section style={{ padding: '26px 32px 44px', animation: 'pageIn .3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.faint, display: 'flex' }}><svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><SearchIcon /></svg></span>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search products…" style={filterInput} />
        </div>
        <select value={statusFilter} onChange={e => { setStatus(e.target.value); setPage(1) }} style={filterSelect}>
          {['All','Active','Out of Stock','Draft'].map(o => <option key={o} value={o}>{o === 'All' ? 'All Statuses' : o}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} style={filterSelect}>
          <option value="featured">Featured</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="stock-asc">Low Stock</option>
        </select>
        <button onClick={openAdd} style={primaryBtn}><PlusIcon /> Add Product</button>
      </div>

      {loadError && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 16 }}>
          {loadError}
        </div>
      )}

      <div style={card}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>
            {['Product','Price','Stock','Status','Actions'].map((h, i) => (
              <th key={h} style={{ ...tableHead, textAlign: i === 1 ? 'right' : i === 2 ? 'center' : i === 4 ? 'right' : 'left', padding: i === 0 ? '11px 22px' : i === 4 ? '11px 22px' : '11px 12px' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '60px 22px', textAlign: 'center', fontSize: 13.5, color: C.faint, fontWeight: 600 }}>Loading products…</td></tr>
            ) : paged.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '60px 22px', textAlign: 'center' }}>
                <div style={{ color: '#CBD5E1', display: 'flex', justifyContent: 'center', marginBottom: 16 }}><ImageIcon size={40} /></div>
                <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 18, color: C.ink, marginBottom: 6 }}>No products found</div>
                <div style={{ fontSize: 13.5, color: C.faint, fontWeight: 500 }}>Try adjusting your search or filter criteria.</div>
              </td></tr>
            ) : paged.map(row => (
              <tr key={row.id}>
                <td style={{ padding: '12px 22px', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 11, background: '#F1F5F9', border: `1px solid ${C.lineSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C0CCDA', flexShrink: 0, overflow: 'hidden' }}>
                      {row.image ? <img src={row.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={16} />}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 185 }}>{row.name}</div>
                      <div style={{ fontSize: 11.5, color: C.faint, fontWeight: 600, fontFamily: 'ui-monospace,monospace' }}>{row.sku || '—'}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 12px', borderBottom: '1px solid #F1F5F9', textAlign: 'right' }}>
                  <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 13.5, fontWeight: 700, color: C.ink }}>${Number(row.price).toFixed(2)}</div>
                </td>
                <td style={{ padding: '12px 12px', borderBottom: '1px solid #F1F5F9', textAlign: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: row.stock === 0 ? '#DC2626' : row.stock < 15 ? '#D97706' : C.ink }}>{row.stock}</span>
                </td>
                <td style={{ padding: '12px 12px', borderBottom: '1px solid #F1F5F9' }}><span style={statusBadge(statusOf(row))}>{statusOf(row)}</span></td>
                <td style={{ padding: '12px 22px', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                    <button onClick={() => openEdit(row)} style={actionBtn()}><PencilIcon /></button>
                    <button onClick={() => handleDelete(row)} style={{ ...actionBtn(), background: '#FEF2F2', color: '#DC2626' }}><TrashIcon /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderTop: `1px solid ${C.lineSoft}` }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.faint }}>
            {rows.length === 0 ? 'No results' : `Showing ${(page-1)*PER_PAGE+1}–${Math.min(page*PER_PAGE, rows.length)} of ${rows.length} products`}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
              style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${C.line}`, background: C.white, color: page===1 ? C.faint : C.slate, cursor: page===1?'default':'pointer', display:'flex',alignItems:'center',justifyContent:'center' }}>
              <ChevronL />
            </button>
            {Array.from({length: totalPages}, (_,i) => i+1).map(pg => (
              <button key={pg} onClick={() => setPage(pg)}
                style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${pg===page ? C.brand : C.line}`, background: pg===page ? C.brand : C.white, color: pg===page ? '#fff' : C.slate, fontWeight: 700, fontSize: 13, cursor: 'pointer', display:'flex',alignItems:'center',justifyContent:'center' }}>
                {pg}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages||totalPages===0}
              style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${C.line}`, background: C.white, color: (page===totalPages||totalPages===0) ? C.faint : C.slate, cursor: (page===totalPages||totalPages===0)?'default':'pointer', display:'flex',alignItems:'center',justifyContent:'center' }}>
              <ChevronR />
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setModalOpen(false)}
          onSaved={() => { setModalOpen(false); load() }}
        />
      )}
    </section>
  )
}

/* ─── Add / Edit Product Modal ────────────────────────────────────────────── */
function ProductFormModal({ product, onClose, onSaved }) {
  const isEdit = Boolean(product)
  const [form, setForm] = useState({
    name:        product?.name ?? '',
    description: product?.description ?? '',
    price:       product?.price ?? '',
    stock:       product?.stock ?? '',
    sku:         product?.sku ?? '',
    is_active:   product?.is_active ?? true,
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(product?.image ?? null)
  const fileInputRef = useRef(null)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const labelStyle = { display: 'flex', flexDirection: 'column', gap: 6 }
  const spanStyle  = { fontSize: 13, fontWeight: 600, color: C.inkSoft }
  const inputStyle = { width: '100%', height: 42, border: `1px solid ${C.line}`, borderRadius: 11, padding: '0 13px', fontFamily: F.body, fontSize: 13.5, color: C.ink, outline: 'none', boxSizing: 'border-box' }
  const fieldError = { fontSize: 12, fontWeight: 600, color: '#DC2626' }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    setFormError('')
    setErrors({})

    if (!form.name.trim() || form.price === '') {
      setFormError('Name and price are required.')
      return
    }

    const payload = {
      name:        form.name.trim(),
      description: form.description.trim() || null,
      price:       Number(form.price),
      stock:       form.stock === '' ? 0 : Number(form.stock),
      sku:         form.sku.trim() || null,
      is_active:   Boolean(form.is_active),
    }
    if (imageFile) payload.image = imageFile

    setSubmitting(true)
    try {
      if (isEdit) {
        await updateProduct(product.id, payload)
      } else {
        await createProduct(payload)
      }
      onSaved()
    } catch (err) {
      if (err.status === 422 && err.errors) {
        setErrors(err.errors)
      } else {
        setFormError(err.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, animation: 'overlayIn .2s ease' }}>
      <div style={{ background: C.white, borderRadius: 24, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto', animation: 'modalIn .25s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px 0' }}>
          <h2 style={{ fontFamily: F.display, fontWeight: 800, fontSize: 21, color: C.ink, margin: 0 }}>{isEdit ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: C.cloud, color: C.slate, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><XIcon /></button>
        </div>
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {formError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#DC2626' }}>
              {formError}
            </div>
          )}

          <div
            onClick={() => fileInputRef.current?.click()}
            style={{ width: '100%', height: 140, background: '#F8FAFC', border: `2px dashed ${C.line}`, borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', color: C.faint, overflow: 'hidden' }}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Product preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <>
                <ImageIcon size={28} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Click to upload product image</span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
          {errors.image && <span style={fieldError}>{errors.image[0]}</span>}

          <label style={labelStyle}><span style={spanStyle}>Product name</span>
            <input value={form.name} onChange={set('name')} placeholder="e.g. Aurora Linen Throw" style={inputStyle} />
            {errors.name && <span style={fieldError}>{errors.name[0]}</span>}
          </label>
          <label style={labelStyle}><span style={spanStyle}>Description</span>
            <textarea value={form.description} onChange={set('description')} placeholder="Short product description…" rows={3} style={{ ...inputStyle, height: 'auto', padding: '10px 13px', resize: 'vertical' }} />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={labelStyle}><span style={spanStyle}>Price ($)</span>
              <input value={form.price} onChange={set('price')} placeholder="0.00" type="number" min="0" step="0.01" style={inputStyle} />
              {errors.price && <span style={fieldError}>{errors.price[0]}</span>}
            </label>
            <label style={labelStyle}><span style={spanStyle}>Stock</span>
              <input value={form.stock} onChange={set('stock')} placeholder="0" type="number" min="0" style={inputStyle} />
            </label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={labelStyle}><span style={spanStyle}>SKU</span>
              <input value={form.sku} onChange={set('sku')} placeholder="LUM-XXX-000" style={inputStyle} />
              {errors.sku && <span style={fieldError}>{errors.sku[0]}</span>}
            </label>
            <label style={labelStyle}><span style={spanStyle}>Status</span>
              <select value={form.is_active ? 'active' : 'inactive'} onChange={e => setForm(f => ({ ...f, is_active: e.target.value === 'active' }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '0 28px 28px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={subtleBtn}>Cancel</button>
          <button onClick={handleSubmit} disabled={submitting} style={{ ...primaryBtn, opacity: submitting ? 0.7 : 1 }}>
            {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
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
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('dashboard')
  const [search, setSearch] = useState('')
  const [bellOpen, setBellOpen] = useState(false)
  const [acctOpen, setAcctOpen] = useState(false)

  useEffect(() => {
    const current = getUser()   // null if missing or session expired
    if (!current || !['admin', 'super admin'].includes(current.role)) { navigate('/login'); return }
    setUser(current)
  }, [navigate])

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

  if (!user) return null

  /* Nav item style */
  const navItem = (key) => {
    const active = page === key
    return {
      display: 'flex', alignItems: 'center', gap: 11,
      padding: '9px 14px 9px 22px', margin: '1px 10px',
      borderRadius: 11, cursor: 'pointer', textDecoration: 'none',
      fontSize: 13.5, fontWeight: active ? 700 : 600,
      color: active ? C.brand : C.slate,
      background: active ? C.brandSoft : 'transparent',
    }
  }

  const pageContent = () => {
    switch (page) {
      case 'dashboard':   return <Dashboard onGo={setPage} />
      case 'products':    return <Products />
      case 'orders':      return <Orders />
      case 'customers':   return <Customers />
      case 'categories':  return <CategoriesPage />
      case 'reviews':     return <ReviewsPage />
      case 'flash-sales': return <FlashSalesPage />
      case 'newsletter':  return <NewsletterPage />
      case 'settings':    return <SettingsPage user={user} />
      default:            return <Dashboard onGo={setPage} />
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
              <a key={item.key} onClick={() => setPage(item.key)} style={navItem(item.key)}>
                <span style={{ display: 'flex', alignItems: 'center', color: page === item.key ? C.brand : C.faint }}>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
            <div style={{ padding: '18px 26px 8px', fontSize: 11, fontWeight: 700, color: C.faint, letterSpacing: '.11em' }}>SETTINGS</div>
            {NAV_SETTINGS.map(item => (
              <a key={item.key} onClick={() => setPage(item.key)} style={navItem(item.key)}>
                <span style={{ display: 'flex', alignItems: 'center', color: page === item.key ? C.brand : C.faint }}>{item.icon}</span>
                <span>{item.label}</span>
              </a>
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
                    <button onClick={() => { setPage('settings'); setAcctOpen(false) }} style={{ width: '100%', textAlign: 'left', padding: '11px 16px', border: 'none', background: 'none', fontSize: 13.5, fontWeight: 600, color: C.inkSoft, cursor: 'pointer', fontFamily: F.body }}>Settings</button>
                    <button onClick={logout} style={{ width: '100%', textAlign: 'left', padding: '11px 16px', border: 'none', borderTop: `1px solid ${C.lineSoft}`, background: 'none', fontSize: 13.5, fontWeight: 600, color: '#DC2626', cursor: 'pointer', fontFamily: F.body }}>Log out</button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page content */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {pageContent()}
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
