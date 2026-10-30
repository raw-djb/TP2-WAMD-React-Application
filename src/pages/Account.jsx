import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useStore, money } from '../context/Store'
import ProductCard from '../components/ProductCard'

export function AuthPage({ mode }) {
  const { login, register, session } = useStore(); const nav = useNavigate()
  const [f, setF] = useState({ name: '', email: '', password: '' }); const [err, setErr] = useState({})
  if (session) return <Navigate to="/account" replace />
  const reg = mode === 'register'
  const submit = (e) => {
    e.preventDefault(); const er = {}
    if (reg && f.name.trim().length < 2) er.name = 'Enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email address.'
    if (f.password.length < 8) er.password = 'Use at least 8 characters.'
    if (!Object.keys(er).length) { const m = reg ? register(f) : login(f); if (m) er.form = m; else return nav('/account') }
    setErr(er)
  }
  return (
    <form onSubmit={submit} noValidate className="container-x max-w-md space-y-4 py-16"><h1 className="text-5xl">{reg ? 'Create account' : 'Sign in'}</h1>
      {reg && <div><label className="label" htmlFor="n">Name</label><input id="n" className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />{err.name && <p className="err">{err.name}</p>}</div>}
      <div><label className="label" htmlFor="e">Email</label><input id="e" type="email" className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />{err.email && <p className="err">{err.email}</p>}</div>
      <div><label className="label" htmlFor="p">Password</label><input id="p" type="password" className="input" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />{err.password && <p className="err">{err.password}</p>}</div>
      {err.form && <p className="err" role="alert">{err.form}</p>}
      <button className="btn-primary w-full">{reg ? 'Create account' : 'Sign in'}</button>
      <p className="text-sm">{reg ? <>Already registered? <Link className="underline" to="/login">Sign in</Link></> : <>New here? <Link className="underline" to="/register">Create an account</Link></>}</p>
      <p className="text-xs text-mocha">Demo accounts are stored in this browser only. Connect a backend for real authentication.</p>
    </form>
  )
}
export default function Account() {
  const { session, logout, orders, wishlist, products } = useStore(); const [sp, setSp] = useSearchParams(); const tab = sp.get('tab') || 'profile'
  if (!session) return <Navigate to="/login" replace />
  const mine = orders.filter((o) => o.email === session.email)
  return (
    <div className="container-x py-10"><h1 className="text-5xl">Hello, {session.name.split(' ')[0]}</h1>
      <div className="mt-6 flex gap-2" role="tablist">{['profile', 'orders', 'wishlist'].map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setSp({ tab: t })} className={`btn capitalize ${tab === t ? 'bg-cocoa text-ivory' : 'border border-sand'}`}>{t}</button>)}</div>
      <div className="mt-8">
        {tab === 'profile' && <div className="max-w-md space-y-2 rounded-3xl bg-ivory p-6"><p><b>Name:</b> {session.name}</p><p><b>Email:</b> {session.email}</p><button className="btn-ghost mt-3" onClick={logout}>Sign out</button></div>}
        {tab === 'orders' && (mine.length ? <ul className="space-y-3">{mine.map((o) => <li key={o.id} className="rounded-2xl bg-ivory p-4 text-sm"><p className="font-medium">{o.id} · {new Date(o.date).toLocaleDateString()} · {o.status} · {money(o.total)}</p><p className="text-mocha">{o.items.map((i) => `${i.qty}× ${i.name} (${i.size}, ${i.color})`).join(', ')}</p></li>)}</ul> : <p>No orders yet. <Link className="underline" to="/shop">Start shopping</Link></p>)}
        {tab === 'wishlist' && (wishlist.length ? <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{products.filter((p) => wishlist.includes(p.id)).map((p) => <ProductCard key={p.id} p={p} />)}</div> : <p>Your wishlist is empty. Tap ♡ on any product to save it.</p>)}
      </div>
    </div>
  )
}
