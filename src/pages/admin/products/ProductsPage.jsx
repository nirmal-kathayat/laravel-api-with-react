import { useEffect, useState } from 'react'
import {
  C, F, card, tableHead, primaryBtn, subtleBtn, filterInput, filterSelect, actionBtn, statusBadge,
  SearchIcon, PlusIcon, PencilIcon, TrashIcon, ImageIcon, ChevronL, ChevronR,
} from '../shared'
import { listProducts, deleteProduct } from '../../../lib/products'
import ProductFormModal from './ProductFormModal'

export default function ProductsPage() {
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
