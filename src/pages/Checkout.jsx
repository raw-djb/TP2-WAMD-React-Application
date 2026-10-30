import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore, money, DELIVERY } from '../context/Store'
import { Summary } from './Cart'

// Edit this list to match your business. "Online payment" stays disabled until a real provider
// (Stripe, PayPal, CMI, etc.) is integrated on a backend. No card data is collected here.
const PAYMENTS = [
  { id: 'cod', label: 'Cash on delivery', on: true },
  { id: 'bank', label: 'Bank transfer (details sent after you order)', on: true },
  { id: 'online', label: 'Online card payment (coming soon)', on: false },
]
const rules = {
  name: (v) => v.trim().length < 2 && 'Enter your full name.',
  email: (v) => !/^\S+@\S+\.\S+$/.test(v) && 'Enter a valid email address.',
  phone: (v) => !/^[+\d][\d\s-]{7,}$/.test(v.trim()) && 'Enter a valid phone number.',
  address: (v) => v.trim().length < 5 && 'Enter your street address.',
  city: (v) => v.trim().length < 2 && 'Enter your city.',
  postal: (v) => v.trim().length < 3 && 'Enter your postal code.',
}
const FIELDS = [['name', 'Full name'], ['email', 'Email'], ['phone', 'Phone'], ['address', 'Street address'], ['city', 'City'], ['postal', 'Postal code']]

export default function Checkout() {
  const { cart, placeOrder, session } = useStore()
  const [f, setF] = useState({ name: session?.name || '', email: session?.email || '', phone: '', address: '', city: '', postal: '', delivery: 'standard', payment: 'cod' })
  const [errs, setErrs] = useState({}); const [done, setDone] = useState(null)
  if (done) return (
    <div className="container-x max-w-xl py-20 text-center"><h1 className="text-5xl">Thank you, {done.info.name.split(' ')[0]}</h1>
      <p className="mt-3">Order <b>{done.id}</b> is confirmed. Total: {money(done.total)}.</p>
      <p className="mt-1 text-sm text-mocha">We will contact you on {done.info.phone} to confirm delivery.</p>
      <div className="mt-6 flex justify-center gap-3"><Link className="btn-primary" to="/account?tab=orders">View orders</Link><Link className="btn-ghost" to="/shop">Keep shopping</Link></div></div>
  )
  if (!cart.length) return <div className="container-x py-24 text-center"><h1 className="text-4xl">Nothing to check out</h1><Link to="/shop" className="btn-primary mt-4">Go to shop</Link></div>
  const submit = (e) => {
    e.preventDefault()
    const er = Object.fromEntries(Object.keys(rules).map((k) => [k, rules[k](f[k])]).filter(([, v]) => v))
    setErrs(er); if (Object.keys(er).length) return document.getElementById(Object.keys(er)[0])?.focus()
    setDone(placeOrder(f))
  }
  return (
    <form onSubmit={submit} noValidate className="container-x grid gap-10 py-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-8"><h1 className="text-5xl">Checkout</h1>
        <fieldset className="grid gap-4 sm:grid-cols-2"><legend className="mb-2 text-2xl font-display">Contact and address</legend>
          {FIELDS.map(([k, l]) => <div key={k} className={k === 'address' ? 'sm:col-span-2' : ''}><label className="label" htmlFor={k}>{l}</label><input id={k} className="input" aria-invalid={!!errs[k]} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />{errs[k] && <p className="err" role="alert">{errs[k]}</p>}</div>)}
        </fieldset>
        <fieldset className="space-y-2"><legend className="mb-2 text-2xl font-display">Delivery</legend>
          {Object.entries(DELIVERY).map(([k, d]) => <label key={k} className="flex items-center gap-3 rounded-2xl bg-ivory p-4 text-sm"><input type="radio" name="d" checked={f.delivery === k} onChange={() => setF({ ...f, delivery: k })} />{d.label}<span className="ml-auto">{money(d.fee)}</span></label>)}
        </fieldset>
        <fieldset className="space-y-2"><legend className="mb-2 text-2xl font-display">Payment</legend>
          {PAYMENTS.map((p) => <label key={p.id} className={`flex items-center gap-3 rounded-2xl bg-ivory p-4 text-sm ${p.on ? '' : 'opacity-50'}`}><input type="radio" name="p" disabled={!p.on} checked={f.payment === p.id} onChange={() => setF({ ...f, payment: p.id })} />{p.label}</label>)}
        </fieldset>
      </div>
      <aside className="h-fit space-y-4 rounded-3xl bg-ivory p-6 shadow-soft"><h2 className="text-3xl">Your order</h2>
        <ul className="space-y-1 text-sm">{cart.map((l) => <li key={l.key} className="flex justify-between"><span>{l.qty} × {l.product.name} ({l.size}, {l.color})</span><span>{money(l.qty * l.product.price)}</span></li>)}</ul>
        <Summary method={f.delivery} /><button className="btn-primary w-full">Place order</button></aside>
    </form>
  )
}
