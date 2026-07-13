import { useEffect, useState } from 'react'
import { colors, fonts, sectionStyle } from '../theme'
import SectionHeader from './common/SectionHeader'
import Reveal from './Reveal'
import ProductImage from './common/ProductImage'
import { listProducts } from '../lib/products'

function ArrivalCard({ name, price, img }) {
  return (
    <>
      <ProductImage src={img} alt={name} aspectRatio="4/5" radius={20} border>
        <span
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            background: colors.amber,
            color: colors.ink,
            fontWeight: 800,
            fontSize: 11,
            padding: '6px 10px',
            borderRadius: 8,
          }}
        >
          NEW
        </span>
      </ProductImage>
      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: colors.ink }}>{name}</div>
        <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 18, color: colors.brand }}>{price}</span>
      </div>
    </>
  )
}

export default function NewArrivals() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    listProducts()
      .then((data) => {
        const active = (Array.isArray(data) ? data : []).filter((p) => p.is_active)
        setProducts(active.slice(0, 4))
      })
      .catch(() => setProducts([]))
  }, [])

  if (products.length === 0) return null

  return (
    <section style={sectionStyle('clamp(40px,5vw,64px) 24px')}>
      <SectionHeader eyebrow="Fresh in" title="New arrivals" linkText="See the drop" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 22 }}>
        {products.map((product) => (
          <Reveal key={product.id} style={{ position: 'relative' }}>
            <ArrivalCard name={product.name} price={`$${Number(product.price).toFixed(2)}`} img={product.image} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
