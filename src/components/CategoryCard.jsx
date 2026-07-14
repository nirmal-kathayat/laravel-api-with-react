import { Link } from 'react-router-dom'
import { colors } from '../theme'

export default function CategoryCard({ name, count, icon, tint }) {
  return (
    <Link
      to="/shop"
      className="card-lift card-cat"
      style={{
        textDecoration: 'none',
        background: colors.white,
        border: `1px solid ${colors.lineSoft}`,
        borderRadius: 20,
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        boxShadow: '0 1px 2px rgba(16,24,40,.04)',
      }}
    >
      <span
        style={{
          width: 54,
          height: 54,
          borderRadius: 15,
          background: tint,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 26,
        }}
      >
        {icon}
      </span>
      <div>
        <div style={{ fontWeight: 800, fontSize: 16, color: colors.ink }}>{name}</div>
        <div style={{ fontSize: 13, color: colors.faint, fontWeight: 600, marginTop: 3 }}>{count} items</div>
      </div>
    </Link>
  )
}
