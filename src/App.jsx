import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
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
import Login from './pages/Login'
import Signup from './pages/Signup'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import AdminDashboard from './pages/AdminDashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { ToastProvider } from './context/ToastContext'

function Home() {
  const location = useLocation()

  // BrowserRouter doesn't scroll to a hash on its own, so #categories/#deals
  // links from other pages (e.g. the navbar) need this to actually land.
  useEffect(() => {
    if (location.hash) {
      document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location])

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      <AnnouncementBar />
      <Navbar />
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

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin/*"
                element={
                  <ProtectedRoute allow={['admin', 'super admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/customer"
                element={
                  <ProtectedRoute allow={['customer']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute allow={['customer']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </WishlistProvider>
    </CartProvider>
  )
}
