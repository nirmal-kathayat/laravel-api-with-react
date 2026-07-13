// Design tokens, icons and style helpers shared across every admin panel page.
// Nothing here is Products-specific — it's the same "design system" the
// Dashboard/Orders/Customers/etc. sections and the AdminLayout shell all draw from.

/* ─── Icons ──────────────────────────────────────────────────────────────── */
export const Icon = ({ d, size = 18, stroke = 'currentColor', fill = 'none', sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
)
export const GridIcon   = () => <Icon d={['M3 3h7v7H3z','M14 3h7v7h-7z','M14 14h7v7h-7z','M3 14h7v7H3z']} />
export const BoxIcon    = () => <Icon d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
export const ShoppingBagIcon = () => <Icon d={['M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z','M3 6h18','M16 10a4 4 0 0 1-8 0']} />
export const UsersIcon  = () => <Icon d={['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M23 21v-2a4 4 0 0 0-3-3.87','M16 3.13a4 4 0 0 1 0 7.75']} ><circle cx="9" cy="7" r="4" /></Icon>
export const TagIcon    = () => <Icon d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"><line x1="7" y1="7" x2="7.01" y2="7" /></Icon>
export const StarIcon   = ({ filled }) => <svg width={14} height={14} viewBox="0 0 24 24" fill={filled ? '#F59E0B' : 'none'} stroke="#F59E0B" strokeWidth={2}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
export const ZapIcon    = () => <Icon d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
export const MailIcon   = () => <Icon d={['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z','M22 6l-10 7L2 6']} />
export const SettingsIcon = () => <><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} fill="none" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth={2} fill="none" /></>
export const SearchIcon = () => <><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth={2} fill="none" /><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth={2} /></>
export const BellIcon   = () => <Icon d={['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9','M13.73 21a2 2 0 0 1-3.46 0']} />
export const ChevronDn  = () => <Icon d="M6 9l6 6 6-6" size={16} />
export const ChevronL   = () => <Icon d="M15 18l-6-6 6-6" size={16} />
export const ChevronR   = () => <Icon d="M9 18l6-6-6-6" size={16} />
export const PlusIcon   = () => <Icon d={['M12 5v14','M5 12h14']} />
export const PencilIcon = () => <Icon d={['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z']} size={15} />
export const TrashIcon  = () => <Icon d={['M3 6h18','M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2']} size={15} />
export const EyeIcon    = () => <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth={2} fill="none" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} fill="none" /></>
export const XIcon      = () => <Icon d={['M18 6L6 18','M6 6l12 12']} />
export const ImageIcon  = ({ size = 20 }) => <Icon size={size} d={['M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z']}><circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth={2} fill="none" /></Icon>
export const TrendUpIcon = () => <Icon d={['M23 6l-9.5 9.5-5-5L1 18','M17 6h6v6']} size={14} />
export const TrendDnIcon = () => <Icon d={['M23 18l-9.5-9.5-5 5L1 6','M17 18h6v-6']} size={14} />

/* ─── Design tokens ──────────────────────────────────────────────────────── */
export const C = {
  bg: '#F8FAFC', white: '#FFFFFF', ink: '#1E293B', inkSoft: '#334155',
  slate: '#475569', muted: '#64748B', faint: '#94A3B8',
  line: '#E2E8F0', lineSoft: '#EDF1F6', cloud: '#EEF2F7',
  brand: '#FF6B35', brandSoft: '#FFF3E9',
}
export const F = { display: "'Bricolage Grotesque', sans-serif", body: "'Manrope', sans-serif" }

/* ─── Badge helpers ───────────────────────────────────────────────────────── */
export const statusBadge = (s) => {
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

export const catChip = (cat) => {
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

export const AVATAR_COLORS = [
  { bg: '#FFF3E9', color: '#C2410C' }, { bg: '#EFF6FF', color: '#1D4ED8' },
  { bg: '#F0FDF4', color: '#166534' }, { bg: '#FDF4FF', color: '#7E22CE' },
  { bg: '#FEF2F2', color: '#991B1B' }, { bg: '#FFFBEB', color: '#92400E' },
]
export const avatarStyle = (i) => ({ ...AVATAR_COLORS[i % AVATAR_COLORS.length], width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12.5, flexShrink: 0 })

/* ─── Shared styles ───────────────────────────────────────────────────────── */
export const card = { background: C.white, border: `1px solid ${C.lineSoft}`, borderRadius: 22, boxShadow: '0 1px 2px rgba(16,24,40,.04)', overflow: 'hidden' }
export const tableHead = { textAlign: 'left', padding: '11px 12px', fontSize: 10.5, fontWeight: 700, color: C.faint, letterSpacing: '.06em', textTransform: 'uppercase', borderBottom: `1px solid ${C.lineSoft}`, background: '#FBFCFE' }
export const tablePad  = { padding: '13px 12px', borderBottom: `1px solid #F1F5F9` }
export const primaryBtn = { display: 'inline-flex', alignItems: 'center', gap: 8, height: 42, padding: '0 20px', background: C.brand, color: '#fff', border: 'none', borderRadius: 13, fontFamily: F.body, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,107,53,.26)' }
export const subtleBtn = { height: 36, padding: '0 14px', border: `1px solid ${C.line}`, borderRadius: 10, background: C.white, fontFamily: F.body, fontSize: 13, fontWeight: 700, color: C.slate, cursor: 'pointer' }
export const filterInput = { width: '100%', height: 42, padding: '0 14px 0 39px', border: `1px solid ${C.line}`, borderRadius: 12, background: C.white, fontFamily: F.body, fontSize: 13.5, fontWeight: 500, color: C.ink, outline: 'none' }
export const filterSelect = { height: 42, padding: '0 14px', border: `1px solid ${C.line}`, borderRadius: 12, background: C.white, fontFamily: F.body, fontSize: 13.5, fontWeight: 600, color: C.slate, outline: 'none', cursor: 'pointer' }
export const actionBtn = (hover = false) => ({ width: 36, height: 36, borderRadius: 10, border: 'none', background: hover ? '#DDE5EE' : C.cloud, color: C.slate, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' })
