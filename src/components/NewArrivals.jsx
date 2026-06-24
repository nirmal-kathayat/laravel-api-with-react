import { colors, fonts, sectionStyle } from '../theme'
import { newArrivals } from '../data.jsx'
import SectionHeader from './common/SectionHeader'
import Reveal from './Reveal'
import ProductImage from './common/ProductImage'

function ArrivalCard({ name, cat, price, img }) {
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
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: colors.ink }}>{name}</div>
          <div style={{ fontSize: 13, color: colors.faint, fontWeight: 600, marginTop: 2 }}>{cat}</div>
        </div>
        <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 18, color: colors.brand }}>{price}</span>
      </div>
    </>
  )
}

export default function NewArrivals() {
  return (
    <section style={sectionStyle('clamp(40px,5vw,64px) 24px')}>
      <SectionHeader eyebrow="Fresh in" title="New arrivals" linkText="See the drop" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 22 }}>
        {newArrivals.map((product) => (
          <Reveal key={product.name} style={{ position: 'relative' }}>
            <ArrivalCard {...product} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
