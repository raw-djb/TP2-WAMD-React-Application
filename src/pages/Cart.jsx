import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore, money, FREE_OVER } from '../context/Store'
import ProductImage from '../components/ProductImage'

export function Summary({ method = 'standard' }) {
  const { totalsFor, code } = useStore(); const t = totalsFor(method)
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(t.subtotal)}</dd></div>
      {t.discount > 0 && <div className="flex justify-between text-rose"><dt>Discount ({code})</dt><dd>-{money(t.discount)}</dd></div>}
      <div className="flex justify-between"><dt>Delivery</dt><dd>{t.delivery ? money(t.delivery) : 'Free'}</dd></div>
      <div className="flex justify-between border-t border-sand pt-2 text-lg font-medium"><dt>Total</dt><dd>{money(t.total)}</dd></div>
    </dl>
  )
}
export default function Cart() {
  const { cart, updateQty, removeFromCart, changeVariant, applyCode, subtotal } = useStore()
  const [c, setC] = useState('')
  if (!cart.length) return <div className="container-x py-24 text-center"><h1 className="text-5xl">Your cart is empty</h1><p className="mt-2 text-mocha">Find something soft to sleep in.</p><Link to="/shop" className="btn-primary mt-6">Start shopping</Link></div>
  return (
    <div className="container-x grid gap-10 py-10 lg:grid-cols-[1fr_360px]">
      <div><h1 className="mb-6 text-5xl">Your cart</h1>
        <ul className="space-y-4">
          {cart.map((l) => (
            <li key={l.key} className="flex gap-4 rounded-3xl bg-ivory p-3">
              <Link to={`/product/${l.id}`} className="h-32 w-24 shrink-0 overflow-hidden rounded-2xl"><ProductImage product={l.product} color={l.color} /></Link>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex justify-between gap-2"><Link to={`/product/${l.id}`} className="font-display text-xl">{l.product.name}</Link><p>{money(l.product.price * l.qty)}</p></div>
                <div className="flex flex-wrap gap-2">
                  <select aria-label="Size" className="input w-auto py-1.5" value={l.size} onChange={(e) => changeVariant(l.key, e.target.value, l.color)}>{l.product.sizes.map((s) => <option key={s}>{s}</option>)}</select>
                  <select aria-label="Colour" className="input w-auto py-1.5" value={l.color} onChange={(e) => changeVariant(l.key, l.size, e.target.value)}>{l.product.colors.map((s) => <option key={s}>{s}</option>)}</select>
                </div>
                <div className="mt-auto flex items-center gap-4">
                  <div className="flex items-center rounded-full border border-sand"><button className="px-3 py-1" aria-label="Decrease" onClick={() => updateQty(l.key, l.qty - 1)}>−</button><span className="w-6 text-center">{l.qty}</span><button className="px-3 py-1" aria-label="Increase" disabled={l.qty >= l.product.stock} onClick={() => updateQty(l.key, l.qty + 1)}>+</button></div>
                  <button className="text-sm underline" onClick={() => removeFromCart(l.key)}>Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Link to="/shop" className="mt-6 inline-block text-sm underline">Continue shopping</Link>
      </div>
      <aside className="h-fit space-y-5 rounded-3xl bg-ivory p-6 shadow-soft">
        <h2 className="text-3xl">Order summary</h2>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); applyCode(c) }}><label className="sr-only" htmlFor="dc">Discount code</label><input id="dc" className="input py-2" placeholder="Discount code" value={c} onChange={(e) => setC(e.target.value)} /><button className="btn-ghost">Apply</button></form>
        <Summary />
        {subtotal < FREE_OVER && <p className="text-xs text-mocha">Add {money(FREE_OVER - subtotal)} more for free standard delivery.</p>}
        <Link to="/checkout" className="btn-primary w-full">Checkout</Link>
      </aside>
    </div>
  )
}
