import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Layout } from './components/Layout'
import Home, { Categories } from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Account, { AuthPage } from './pages/Account'
import { Delivery, Returns, Privacy, SizeGuide, FAQ, Contact } from './pages/Info'
import Admin from './pages/Admin'

function ScrollTop() { const { pathname } = useLocation(); useEffect(() => window.scrollTo(0, 0), [pathname]); return null }
const NotFound = () => <div className="container-x py-24 text-center"><h1 className="text-5xl">Page not found</h1><Link to="/" className="btn-primary mt-5">Go home</Link></div>

export default function App() {
  return (
    <>
      <ScrollTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="categories" element={<Categories />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="login" element={<AuthPage mode="login" />} />
          <Route path="register" element={<AuthPage mode="register" />} />
          <Route path="account" element={<Account />} />
          <Route path="size-guide" element={<SizeGuide />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          <Route path="delivery" element={<Delivery />} />
          <Route path="returns" element={<Returns />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
