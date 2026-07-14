import { Truck, Shield, Refresh, Headset } from './components/common/Icons'

// Unsplash image helper — consistent crop/size/quality across all shots.
const img = (id, w = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const heroImage = img('1483985988355-763728e1935b', 900) // shopping / lifestyle

export const categories = [
  { name: 'Electronics', count: 320, icon: '🎧', tint: '#FFF3E9' },
  { name: 'Fashion', count: 480, icon: '👜', tint: '#EEF2F7' },
  { name: 'Home & Living', count: 260, icon: '🛋️', tint: '#FFF8E6' },
  { name: 'Beauty', count: 190, icon: '🧴', tint: '#FFF3E9' },
  { name: 'Sports', count: 140, icon: '🏃', tint: '#EEF2F7' },
  { name: 'Accessories', count: 210, icon: '⌚', tint: '#FFF8E6' },
]

export const trust = [
  { title: 'Free shipping', sub: 'On all orders over $75', Icon: Truck },
  { title: 'Secure payments', sub: '256-bit SSL encryption', Icon: Shield },
  { title: 'Easy returns', sub: '30-day money back', Icon: Refresh },
  { title: '24/7 support', sub: 'Always here to help', Icon: Headset },
]

export const testimonials = [
  { name: 'Maya Thompson', role: 'Verified buyer', initials: 'MT', tint: '#FFF3E9', text: 'The quality completely exceeded my expectations. Everything arrived beautifully packaged and two days early. This is my new go-to shop.' },
  { name: 'Daniel Reyes', role: 'Verified buyer', initials: 'DR', tint: '#FFF8E6', text: 'Honest pricing and genuinely premium products. The flash sale deals are unreal — I furnished half my apartment from here.' },
  { name: 'Priya Nair', role: 'Verified buyer', initials: 'PN', tint: '#EEF2F7', text: 'Customer support answered within minutes and the return was effortless. You can tell they actually care about the experience.' },
]

export const footerColumns = [
  { title: 'Shop', links: ['New arrivals', 'Best sellers', 'Flash deals', 'Gift cards'] },
  { title: 'Company', links: ['About us', 'Careers', 'Sustainability', 'Press'] },
  { title: 'Support', links: ['Help center', 'Shipping & returns', 'Track order', 'Contact'] },
]

export const socials = ['IG', 'X', 'FB', 'YT', 'IN']
export const payments = ['VISA', 'MASTERCARD', 'AMEX', 'PAYPAL', 'APPLE PAY']
