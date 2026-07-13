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

export const bestSellers = [
  { name: 'Aria Wireless Headphones', cat: 'Electronics', price: '$129', oldPrice: '$179', rating: '4.9', reviews: '1,240', badge: 'Bestseller', img: img('1505740420928-5e560c06d30e') },
  { name: 'Minimal Automatic Watch', cat: 'Accessories', price: '$89', oldPrice: '$120', rating: '4.8', reviews: '860', badge: '-26%', img: img('1523275335684-37898b6baf30') },
  { name: 'Heritage Leather Backpack', cat: 'Fashion', price: '$149', oldPrice: '', rating: '4.7', reviews: '540', badge: '', img: img('1553062407-98eeb64c6a62') },
  { name: 'Stoneware Mug Set of 4', cat: 'Home', price: '$34', oldPrice: '$45', rating: '4.9', reviews: '320', badge: 'New', img: img('1514228742587-6b1558fcca3d') },
  { name: 'Cloud Linen Throw', cat: 'Home', price: '$59', oldPrice: '', rating: '4.6', reviews: '210', badge: '', img: img('1600369671236-e74521d4b6ad') },
  { name: 'Arc Brass Desk Lamp', cat: 'Home', price: '$72', oldPrice: '$95', rating: '4.8', reviews: '410', badge: '', img: img('1507473885765-e6ed057f782c') },
  { name: 'Stride Everyday Sneakers', cat: 'Fashion', price: '$110', oldPrice: '', rating: '4.7', reviews: '980', badge: 'Bestseller', img: img('1542291026-7eec264c27ff') },
  { name: 'Solstice Polarized Shades', cat: 'Accessories', price: '$65', oldPrice: '$85', rating: '4.5', reviews: '150', badge: '-24%', img: img('1572635196237-14b3f281503f') },
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
