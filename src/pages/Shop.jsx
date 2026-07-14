import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { colors, fonts, sectionStyle } from '../theme'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { Search } from '../components/common/Icons'
import { listProducts } from '../lib/products'

const PAGE_SIZE = 12

const SORTS = [
  { key: 'newest', label: 'Newest' },
  { key: 'price_asc', label: 'Price: Low to High' },
  { key: 'price_desc', label: 'Price: High to Low' },
  { key: 'name', label: 'Name: A to Z' },
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)

  const query = searchParams.get('q') || ''

  useEffect(() => {
    listProducts()
      .then((data) => setProducts((Array.isArray(data) ? data : []).filter((p) => p.is_active)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const setQuery = (value) => {
    setPage(1)
    const next = new URLSearchParams(searchParams)
    if (value) next.set('q', value); else next.delete('q')
    setSearchParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = !q
      ? products
      : products.filter(
          (p) => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
        )

    list = [...list]
    if (sort === 'price_asc') list.sort((a, b) => Number(a.price) - Number(b.price))
    else if (sort === 'price_desc') list.sort((a, b) => Number(b.price) - Number(a.price))
    else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    // 'newest' — backend already returns newest-first, keep as-is

    return list
  }, [products, query, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: fonts.body }}>
      <Navbar />
      <main style={sectionStyle('32px 24px 64px')}>
        <h1 style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 'clamp(28px,3.4vw,38px)', color: colors.ink, margin: '0 0 8px' }}>
          Shop All Products
        </h1>
        <p style={{ fontSize: 14, color: colors.faint, fontWeight: 500, margin: '0 0 28px' }}>
          {loading ? 'Loading products…' : `${filtered.length} product${filtered.length === 1 ? '' : 's'} found`}
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
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
              padding: '12px 16px',
            }}
          >
            <Search />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              style={{ border: 'none', outline: 'none', background: 'transparent', fontFamily: fonts.body, fontSize: 14, color: colors.ink, width: '100%' }}
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              height: 46,
              padding: '0 14px',
              border: `1px solid ${colors.line}`,
              borderRadius: 14,
              background: colors.white,
              fontFamily: fonts.body,
              fontSize: 13.5,
              fontWeight: 600,
              color: colors.ink,
              cursor: 'pointer',
            }}
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: colors.faint }}>
            <div style={{ fontSize: 44, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 15, fontWeight: 700, color: colors.ink, margin: 0 }}>No products found</p>
            <p style={{ fontSize: 13.5, margin: '8px 0 0' }}>Try a different search term.</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: 22 }}>
          {pageItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  border: `1px solid ${p === safePage ? colors.brand : colors.line}`,
                  background: p === safePage ? colors.brand : colors.white,
                  color: p === safePage ? '#fff' : colors.ink,
                  fontWeight: 700,
                  fontSize: 13.5,
                  cursor: 'pointer',
                  fontFamily: fonts.body,
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
