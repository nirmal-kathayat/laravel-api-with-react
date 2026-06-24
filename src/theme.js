/**
 * Design tokens for the Lumora homepage.
 * Centralizes the palette, fonts and shared helpers used across components.
 */
export const colors = {
  bg: '#F8FAFC',
  ink: '#1E293B',
  inkSoft: '#334155',
  slate: '#475569',
  muted: '#64748B',
  faint: '#94A3B8',
  line: '#E2E8F0',
  lineSoft: '#EDF1F6',
  lineNav: '#E8EDF3',
  white: '#FFFFFF',
  brand: '#FF6B35',
  brandSoft: '#FFF3E9',
  amber: '#FFD166',
  amberSoft: '#FFF8E6',
  cloud: '#EEF2F7',
}

export const fonts = {
  display: "'Bricolage Grotesque', sans-serif",
  body: "'Manrope', sans-serif",
  mono: 'monospace',
}

export const layout = {
  maxWidth: 1280,
  gutter: 24,
}

/** Diagonal dotted placeholder background used for image stand-ins. */
export const dottedBg = (alpha) =>
  `linear-gradient(135deg, rgba(30,41,59,${alpha}) 25%, transparent 25%, transparent 50%, rgba(30,41,59,${alpha}) 50%, rgba(30,41,59,${alpha}) 75%, transparent 75%)`

/** Standard centered section container. */
export const sectionStyle = (padding) => ({
  maxWidth: layout.maxWidth,
  margin: '0 auto',
  padding,
})
