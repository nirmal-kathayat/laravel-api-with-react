import AnnouncementBar from './components/AnnouncementBar'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Categories from './components/Categories'
import BestSellers from './components/BestSellers'
import FlashSale from './components/FlashSale'
import NewArrivals from './components/NewArrivals'
import TrustBadges from './components/TrustBadges'
import Testimonials from './components/Testimonials'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'

export default function App() {
  const showAnnouncement = true

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {showAnnouncement && <AnnouncementBar />}
      <Navbar cartCount={3} />
      <Hero />
      <Categories />
      <BestSellers />
      <FlashSale saleHours={32} saleMinutes={45} />
      <NewArrivals />
      <TrustBadges />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  )
}
