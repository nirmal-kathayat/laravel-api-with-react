import { colors, sectionStyle } from '../theme'
import { bestSellers } from '../data.jsx'
import SectionHeader from './common/SectionHeader'
import Reveal from './Reveal'
import ProductCard from './ProductCard'

export default function BestSellers() {
  return (
    <section id="deals" style={sectionStyle('clamp(28px,4vw,48px) 24px')}>
      <SectionHeader eyebrow="Loved by thousands" title="Best sellers" linkText="All products" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 22 }}>
        {bestSellers.map((product) => (
          <Reveal
            key={product.name}
            className="card-lift card-product"
            style={{
              background: colors.white,
              border: `1px solid ${colors.lineSoft}`,
              borderRadius: 22,
              overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(16,24,40,.04)',
            }}
          >
            <ProductCard {...product} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
