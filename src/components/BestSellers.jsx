import { sectionStyle } from '../theme'
import SectionHeader from './common/SectionHeader'
import Reveal from './Reveal'
import ProductCard from './ProductCard'
import { useActiveProducts } from '../hooks/useActiveProducts'

export default function BestSellers() {
  const { products } = useActiveProducts()
  // No sales-ranking data exists on the backend yet, so this is a stand-in:
  // it shows the next slice of the real catalog after what New Arrivals uses.
  const featured = products.length > 4 ? products.slice(4, 12) : products.slice(0, 8)

  if (featured.length === 0) return null

  return (
    <section id="deals" style={sectionStyle('clamp(28px,4vw,48px) 24px')}>
      <SectionHeader eyebrow="Loved by thousands" title="Best sellers" linkText="All products" linkHref="/shop" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 22 }}>
        {featured.map((product) => (
          <Reveal key={product.id}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
