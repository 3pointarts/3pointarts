import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import './App.css'
import useAdminAuthStore from './state/admin/AdminAuthStore'
import { SEO } from './components/SEO'

import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Wishlist from './pages/Wishlist'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import OrderDetails from './pages/OrderDetails'
import About from './pages/About'
import Help from './pages/Help'
import Contact from './pages/Contact'
import Login from './pages/Login'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProductDetails from './pages/ProductDetails'
import { ToastContainer } from 'react-toastify'
import { useEffect } from 'react'
import useCustomerAuthStore from './state/customer/CustomerAuthStore'
import ScrollToTop from './components/ScrollToTop'

const PublicLayout = () => {
  return (
    <div className="app">
      <SEO
        title="Home"
        description="3 Point Arts - Custom 3D Printed Art, Models & Lamps. Discover unique handcrafted 3D prints for your home."
      />
      <Header />
      <main className="container">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  const initAdmin = useAdminAuthStore((state) => state.init);
  const initCustomer = useCustomerAuthStore((state) => state.init);
  useEffect(() => {
    initAdmin();
    initCustomer();
  }, []);
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} />
            <Route path="/order/:orderId" element={<OrderDetails />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  )
}

export default App
