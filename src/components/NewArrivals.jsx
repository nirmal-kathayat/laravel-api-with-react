import { sectionStyle } from '../theme'
import SectionHeader from './common/SectionHeader'
import Reveal from './Reveal'
import ProductCard from './ProductCard'
import { useActiveProducts } from '../hooks/useActiveProducts'

export default function NewArrivals() {
  const { products } = useActiveProducts()
  const arrivals = products.slice(0, 4)

  if (arrivals.length === 0) return null

  return (
    <section style={sectionStyle('clamp(40px,5vw,64px) 24px')}>
      <SectionHeader eyebrow="Fresh in" title="New arrivals" linkText="See the drop" linkHref="/shop" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 22 }}>
        {arrivals.map((product) => (
          <Reveal key={product.id}>
            <ProductCard product={product} badge="NEW" />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
