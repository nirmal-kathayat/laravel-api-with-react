import { sectionStyle } from '../theme'
import { categories } from '../data.jsx'
import SectionHeader from './common/SectionHeader'
import Reveal from './Reveal'
import CategoryCard from './CategoryCard'

export default function Categories() {
  return (
    <section id="categories" style={sectionStyle('clamp(40px,5vw,64px) 24px')}>
      <SectionHeader eyebrow="Browse" title="Shop by category" linkText="View all" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16 }}>
        {categories.map((cat) => (
          <Reveal key={cat.name}>
            <CategoryCard {...cat} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
