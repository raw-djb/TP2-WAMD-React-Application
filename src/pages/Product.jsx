import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore, money } from '../context/Store'
import { ColorDots, SizePicker } from '../components/ProductCard'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'
import Stars from '../components/Stars'

export default function Product() {
  const { id } = useParams(); const nav = useNavigate()
  const { products, addToCart, toggleWish, wishlist, reviews, addReview, session, notify } = useStore()
  const p = products.find((x) => x.id === +id)
  const [color, setColor] = useState(p?.colors[0]); const [size, setSize] = useState(''); const [qty, setQty] = useState(1); const [view, setView] = useState(0)
  const [rv, setRv] = useState({ rating: 5, text: '' }); const [err, setErr] = useState('')
  if (!p) return <div className="container-x py-20 text-center"><h1 className="text-4xl">Product not found</h1><Link to="/shop" className="btn-primary mt-4">Back to shop</Link></div>
  const mine = reviews[p.id] || []
  const related = products.filter((x) => x.id !== p.id && (x.category === p.category || x.material === p.material)).slice(0, 4)
  const submit = (e) => {
    e.preventDefault()
    if (!session) return setErr('Please sign in to leave a review.')
    if (rv.text.trim().length < 10) return setErr('Write at least 10 characters.')
    addReview(p.id, { name: session.name, rating: +rv.rating, text: rv.text.trim() }); setRv({ rating: 5, text: '' }); setErr(''); notify('Thanks for your review.')
  }
  const add = () => addToCart(p, size, color, qty)
  return (
    <div className="container-x py-8">
      <nav className="mb-4 text-sm text-mocha"><Link to="/shop">Shop</Link> / <Link to={`/shop?category=${encodeURIComponent(p.category)}`}>{p.category}</Link></nav>
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-soft"><ProductImage product={p} color={color} view={view} /></div>
          <div className="mt-3 grid grid-cols-4 gap-3">{[0, 1, 2, 3].map((v) => <button key={v} onClick={() => setView(v)} aria-label={`View ${v + 1}`} aria-pressed={view === v} className={`aspect-square overflow-hidden rounded-xl border-2 ${view === v ? 'border-rose' : 'border-transparent'}`}><ProductImage product={p} color={color} view={v} /></button>)}</div>
        </div>
        <div className="space-y-5">
          <h1 className="text-5xl">{p.name}</h1>
          <Stars value={p.rating} count={p.reviews + mine.length} />
          <p className="text-2xl">{money(p.price)} {p.originalPrice && <><s className="text-base text-mocha">{money(p.originalPrice)}</s> <span className="text-sm text-rose">Save {p.discount}%</span></>}</p>
          <p className="text-mocha">{p.description}</p>
          <div><p className="label">Colour: {color}</p><ColorDots colors={p.colors} selected={color} onPick={setColor} /></div>
          <div><p className="label flex justify-between">Size <Link to="/size-guide" className="font-normal underline">Size guide</Link></p><SizePicker sizes={p.sizes} value={size} onChange={setSize} /></div>
          <p className={`text-sm ${p.stock < 1 ? 'text-red-700' : p.stock < 8 ? 'text-rose' : 'text-mocha'}`}>{p.stock < 1 ? 'Out of stock' : p.stock < 8 ? `Only ${p.stock} left` : 'In stock'}</p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-sand"><button className="px-4 py-2" aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}>−</button><span className="w-8 text-center" aria-live="polite">{qty}</span><button className="px-4 py-2" aria-label="Increase quantity" onClick={() => setQty(Math.min(Math.max(p.stock, 1), qty + 1))}>+</button></div>
            <button className="btn-primary" disabled={p.stock < 1} onClick={add}>Add to cart</button>
            <button className="btn-ghost" disabled={p.stock < 1} onClick={() => addToCart(p, size, color, qty) && nav('/checkout')}>Buy now</button>
            <button className="btn-ghost" aria-pressed={wishlist.includes(p.id)} onClick={() => toggleWish(p.id)}>{wishlist.includes(p.id) ? '♥ Saved' : '♡ Save'}</button>
          </div>
          <dl className="divide-y divide-sand rounded-2xl bg-ivory px-5 text-sm">
            {[['Material', `${p.material} · ${p.pattern} · ${p.sleeve} · ${p.bottom}`], ['Care', p.care], ['Delivery', 'Standard 3–6 days, express 1–2 days. Free standard delivery over $80.'], ['Returns', 'Unworn items with tags can be returned within 14 days.']].map(([t, d]) => <div key={t} className="py-3"><dt className="font-medium">{t}</dt><dd className="text-mocha">{d}</dd></div>)}
          </dl>
        </div>
      </div>
      <section className="mt-16 grid gap-10 md:grid-cols-2" aria-labelledby="rev">
        <div><h2 id="rev" className="text-3xl">Reviews</h2>
          {mine.length === 0 && <p className="mt-3 text-sm text-mocha">No written reviews yet. Be the first.</p>}
          <ul className="mt-3 space-y-3">{mine.map((r, i) => <li key={i} className="rounded-2xl bg-ivory p-4 text-sm"><Stars value={r.rating} /><p className="mt-1">{r.text}</p><p className="mt-1 text-xs text-mocha">{r.name} · {new Date(r.date).toLocaleDateString()}</p></li>)}</ul></div>
        <form onSubmit={submit} className="space-y-3" noValidate><h3 className="text-2xl">Write a review</h3>
          <label className="label" htmlFor="rt">Rating</label><select id="rt" className="input" value={rv.rating} onChange={(e) => setRv({ ...rv, rating: e.target.value })}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}</select>
          <label className="label" htmlFor="rx">Your review</label><textarea id="rx" rows="4" className="input" value={rv.text} onChange={(e) => setRv({ ...rv, text: e.target.value })} />
          {err && <p className="err" role="alert">{err}</p>}<button className="btn-primary">Submit review</button></form>
      </section>
      <section className="mt-16"><h2 className="mb-5 text-3xl">You may also like</h2><div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div></section>
    </div>
  )
}
