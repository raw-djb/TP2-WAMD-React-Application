import { useState } from 'react'
import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom'
import { useStore } from '../context/Store'

export function Layout() {
  const { count, wishlist, session, toast } = useStore()
  const [q, setQ] = useState(''); const [open, setOpen] = useState(false); const nav = useNavigate()
  const link = ({ isActive }) => `hover:text-rose ${isActive ? 'text-rose' : ''}`
  const go = (e) => { e.preventDefault(); nav(`/shop?q=${encodeURIComponent(q)}`); setOpen(false) }
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-ivory focus:p-3">Skip to content</a>
      <div className="bg-blush py-2 text-center text-xs">Free standard delivery over $80 · Use code WELCOME10 for 10% off</div>
      <header className="sticky top-0 z-40 border-b border-sand bg-cream/95 backdrop-blur">
        <div className="container-x flex items-center gap-4 py-3">
          <button className="text-2xl lg:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
          <Link to="/" className="font-display text-3xl font-semibold tracking-wide">Lumière</Link>
          <nav className="ml-6 hidden gap-5 text-sm lg:flex" aria-label="Main">
            <NavLink to="/" end className={link}>Home</NavLink><NavLink to="/shop" end className={link}>Shop</NavLink>
            <NavLink to="/categories" className={link}>Categories</NavLink><NavLink to="/shop?new=1" className={link}>New Arrivals</NavLink>
            <NavLink to="/shop?best=1" className={link}>Best Sellers</NavLink><NavLink to="/shop?offer=1" className={link}>Offers</NavLink>
          </nav>
          <form onSubmit={go} role="search" className="ml-auto hidden flex-1 max-w-xs md:block">
            <input className="input py-2" type="search" placeholder="Search pajamas" aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
          </form>
          <div className="ml-auto flex items-center gap-4 text-sm md:ml-0">
            <Link to={session ? '/account' : '/login'} aria-label="Account" title={session ? session.name : 'Sign in'}>👤</Link>
            <Link to="/account?tab=wishlist" aria-label={`Wishlist (${wishlist.length})`}>♡<sup>{wishlist.length || ''}</sup></Link>
            <Link to="/cart" aria-label={`Cart (${count})`}>🛍<sup>{count || ''}</sup></Link>
          </div>
        </div>
        {open && (
          <nav className="container-x grid gap-3 pb-4 text-sm lg:hidden" onClick={() => setOpen(false)}>
            <form onSubmit={go}><input className="input" type="search" placeholder="Search pajamas" aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} /></form>
            <Link to="/">Home</Link><Link to="/shop">Shop</Link><Link to="/categories">Categories</Link><Link to="/shop?new=1">New Arrivals</Link><Link to="/shop?best=1">Best Sellers</Link><Link to="/shop?offer=1">Offers</Link>
          </nav>
        )}
      </header>
      <main id="main" className="min-h-[60vh]"><Outlet /></main>
      <Footer />
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
        {toast && <p className="rounded-full bg-cocoa px-5 py-3 text-sm text-ivory shadow-soft">{toast}</p>}
      </div>
    </>
  )
}
function Footer() {
  const { notify } = useStore()
  const [email, setEmail] = useState(''); const [err, setErr] = useState('')
  const sub = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('Enter a valid email address.')
    setErr(''); setEmail(''); notify('You are subscribed.') // TODO: send to your email provider
  }
  return (
    <footer className="mt-20 bg-cocoa text-ivory">
      <div className="container-x grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl">Lumière</p>
          <p className="mt-2 max-w-sm text-sm text-sand">Soft, well-made sleepwear for every night. Get news on new arrivals and offers.</p>
          <form onSubmit={sub} className="mt-4 flex max-w-sm gap-2" noValidate>
            <div className="flex-1"><label htmlFor="nl" className="sr-only">Email</label><input id="nl" className="input text-cocoa" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />{err && <p className="mt-1 text-xs text-blush">{err}</p>}</div>
            <button className="btn bg-rose text-ivory hover:bg-blush hover:text-cocoa">Subscribe</button>
          </form>
        </div>
        <div className="space-y-2 text-sm"><p className="font-medium">Help</p>
          {[['/faq','FAQ'],['/size-guide','Size guide'],['/delivery','Delivery'],['/returns','Returns'],['/contact','Contact us'],['/privacy','Privacy policy']].map(([to, t]) => <Link key={to} to={to} className="block text-sand hover:text-ivory">{t}</Link>)}
        </div>
        <div className="space-y-2 text-sm text-sand"><p className="font-medium text-ivory">Contact</p><p>hello@lumiere-sleepwear.example</p><p>+212 600 000 000</p><p>Instagram · Facebook · Pinterest</p></div>
      </div>
      <p className="border-t border-ivory/10 py-4 text-center text-xs text-sand">© {new Date().getFullYear()} Lumière. All rights reserved.</p>
    </footer>
  )
}
