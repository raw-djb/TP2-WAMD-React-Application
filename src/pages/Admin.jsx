import { useState } from 'react'
import { useStore, money } from '../context/Store'
import { CATEGORIES, COLORS } from '../data/products'

// DEMO ONLY. This page is not protected. Before production, move it behind real
// server-side authentication/authorization and replace localStorage with an API + database.
const empty = { name: '', category: CATEGORIES[0], material: 'Cotton', price: '', stock: '', colors: ['Pink'], discount: 0 }
export default function Admin() {
  const { products, orders, custom, setCustom, setStockEdits, notify } = useStore()
  const [f, setF] = useState(empty); const [err, setErr] = useState('')
  const sales = orders.reduce((n, o) => n + o.total, 0)
  const sold = {}; orders.forEach((o) => o.items.forEach((i) => (sold[i.name] = (sold[i.name] || 0) + i.qty)))
  const top = Object.entries(sold).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const add = (e) => {
    e.preventDefault()
    if (f.name.trim().length < 3 || !(+f.price > 0) || !(+f.stock >= 0) || f.stock === '') return setErr('Enter a name, a price above 0 and a stock quantity.')
    const price = +f.price; const d = +f.discount || 0
    setCustom([...custom, { id: Date.now(), name: f.name.trim(), category: f.category, material: f.material, season: 'Spring', style: 'Classic', sleeve: 'Long sleeves', bottom: 'Long trousers', pattern: 'Plain', kind: 'set', colors: f.colors, sizes: ['XS', 'S', 'M', 'L', 'XL'], price: Math.round(price * (100 - d) / 100), originalPrice: d ? price : null, discount: d, description: `${f.material} sleepwear.`, care: 'Machine wash cold. Line dry.', stock: +f.stock, rating: 4.5, reviews: 0, popularity: 50, isNew: true, bestSeller: false }])
    setF(empty); setErr(''); notify('Product added.')
  }
  return (
    <div className="container-x space-y-10 py-10"><h1 className="text-5xl">Admin</h1>
      <p className="rounded-2xl bg-blush p-3 text-sm">Demo dashboard. Not secured: add server-side login and roles before using it for real.</p>
      <div className="grid gap-4 sm:grid-cols-3">{[['Orders', orders.length], ['Sales', money(sales)], ['Products', products.length]].map(([t, v]) => <div key={t} className="rounded-3xl bg-ivory p-5"><p className="text-sm text-mocha">{t}</p><p className="text-3xl font-display">{v}</p></div>)}</div>
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={add} noValidate className="space-y-3 rounded-3xl bg-ivory p-6"><h2 className="text-3xl">Add product</h2>
          <input className="input" placeholder="Name" aria-label="Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <select className="input" aria-label="Category" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
          <select className="input" aria-label="Material" value={f.material} onChange={(e) => setF({ ...f, material: e.target.value })}>{['Cotton', 'Satin', 'Silk', 'Polyester', 'Fleece', 'Flannel', 'Blend'].map((c) => <option key={c}>{c}</option>)}</select>
          <div className="grid grid-cols-3 gap-2"><input className="input" type="number" placeholder="Price" aria-label="Price" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} /><input className="input" type="number" placeholder="Stock" aria-label="Stock" value={f.stock} onChange={(e) => setF({ ...f, stock: e.target.value })} /><input className="input" type="number" placeholder="% off" aria-label="Discount percent" value={f.discount} onChange={(e) => setF({ ...f, discount: e.target.value })} /></div>
          <div className="flex flex-wrap gap-3 text-sm">{Object.keys(COLORS).map((c) => <label key={c} className="flex items-center gap-1"><input type="checkbox" checked={f.colors.includes(c)} onChange={() => setF({ ...f, colors: f.colors.includes(c) ? f.colors.filter((x) => x !== c) : [...f.colors, c] })} />{c}</label>)}</div>
          <p className="text-xs text-mocha">Image upload needs a backend or storage service (S3, Cloudinary). Products use the vector placeholder for now.</p>
          {err && <p className="err" role="alert">{err}</p>}<button className="btn-primary" disabled={!f.colors.length}>Add product</button></form>
        <div className="space-y-4"><div className="rounded-3xl bg-ivory p-6"><h2 className="mb-2 text-3xl">Popular products</h2>{top.length ? top.map(([n, q]) => <p key={n} className="flex justify-between text-sm"><span>{n}</span><span>{q} sold</span></p>) : <p className="text-sm text-mocha">No sales yet.</p>}</div>
          <div className="rounded-3xl bg-ivory p-6"><h2 className="mb-2 text-3xl">Recent orders</h2>{orders.length ? orders.slice(0, 6).map((o) => <p key={o.id} className="flex justify-between text-sm"><span>{o.id} · {o.info.name}</span><span>{money(o.total)}</span></p>) : <p className="text-sm text-mocha">No orders yet.</p>}</div></div>
      </div>
      <section><h2 className="mb-3 text-3xl">Stock</h2><div className="overflow-x-auto rounded-3xl bg-ivory p-4"><table className="w-full text-left text-sm"><thead><tr><th className="p-2">Product</th><th>Price</th><th>Stock</th></tr></thead>
        <tbody>{products.map((p) => <tr key={p.id} className="border-t border-sand/60"><td className="p-2">{p.name}</td><td>{money(p.price)}</td><td><input type="number" min="0" aria-label={`Stock for ${p.name}`} className="input w-24 py-1" value={p.stock} onChange={(e) => setStockEdits((s) => ({ ...s, [p.id]: Math.max(0, +e.target.value) }))} /></td></tr>)}</tbody></table></div></section>
    </div>
  )
}
