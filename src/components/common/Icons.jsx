/**
 * Inline SVG icon set used across the homepage.
 * Each accepts size/color/strokeWidth overrides.
 */
const base = (size, stroke, strokeWidth = 2) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke,
  strokeWidth,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
})

export const ArrowRight = ({ size = 16, color = '#1E293B' }) => (
  <svg {...base(size, color)}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
)

export const Plus = ({ size = 18, color = '#fff' }) => (
  <svg {...base(size, color)}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
)

export const Search = ({ size = 18, color = '#94A3B8' }) => (
  <svg {...base(size, color)} strokeLinejoin={undefined}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
)

export const Heart = ({ size = 19, color = '#1E293B', filled = false }) => (
  <svg {...base(size, color)} fill={filled ? color : 'none'}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
  </svg>
)

export const Cart = ({ size = 19, color = '#1E293B' }) => (
  <svg {...base(size, color)}>
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
    <path d="M2 3h2.2l2.3 12.4a1.5 1.5 0 0 0 1.5 1.2h8.8a1.5 1.5 0 0 0 1.5-1.2L20 6H5.5" />
  </svg>
)

export const User = ({ size = 18, color = '#fff' }) => (
  <svg {...base(size, color)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-3.6 3.6-6 8-6s8 2.4 8 6" />
  </svg>
)

export const Truck = ({ size = 24, color = '#FF6B35' }) => (
  <svg {...base(size, color)}>
    <path d="M14 18V6a2 2 0 0 0-2-2H3v12" />
    <path d="M14 9h4l3 3v6h-7" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
)

export const Shield = ({ size = 24, color = '#FF6B35' }) => (
  <svg {...base(size, color)}>
    <path d="M12 2 4 5v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

export const Refresh = ({ size = 24, color = '#FF6B35' }) => (
  <svg {...base(size, color)}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
  </svg>
)

export const Headset = ({ size = 24, color = '#FF6B35' }) => (
  <svg {...base(size, color)}>
    <path d="M4 14v-3a8 8 0 0 1 16 0v3" />
    <path d="M4 14a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2Z" />
    <path d="M20 14a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2Z" />
    <path d="M18 16v1a3 3 0 0 1-3 3h-3" />
  </svg>
)
