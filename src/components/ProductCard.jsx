import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore, money } from '../context/Store'
import { COLORS } from '../data/products'
import ProductImage from './ProductImage'
import Stars from './Stars'

export function ColorDots({ colors, selected, onPick }) {
  return (
    <div className="flex gap-1.5" role="group" aria-label="Colours">
      {colors.map((c) => (
        <button key={c} type="button" title={c} aria-label={c} aria-pressed={selected === c} onClick={() => onPick?.(c)}
          className={`h-5 w-5 rounded-full border ${selected === c ? 'ring-2 ring-rose ring-offset-1' : 'border-cocoa/20'}`} style={{ background: COLORS[c] }} />
      ))}
    </div>
  )
}
export function SizePicker({ sizes, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Sizes">
      {sizes.map((s) => (
        <button key={s} type="button" onClick={() => onChange(s)} aria-pressed={value === s}
          className={`min-w-[2.5rem] rounded-full border px-3 py-1.5 text-sm ${value === s ? 'border-cocoa bg-cocoa text-ivory' : 'border-sand hover:border-rose'}`}>{s}</button>
      ))}
    </div>
  )
}
function QuickView({ p, onClose }) {
  const { addToCart } = useStore()
  const [size, setSize] = useState(''); const [color, setColor] = useState(p.colors[0])
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-cocoa/50 p-4" role="dialog" aria-modal="true" aria-label={`Quick view: ${p.name}`} onClick={onClose}>
      <div className="grid w-full max-w-3xl gap-6 rounded-3xl bg-ivory p-5 sm:grid-cols-2" onClick={(e) => e.stopPropagation()}>
        <div className="aspect-[4/5] overflow-hidden rounded-2xl"><ProductImage product={p} color={color} /></div>
        <div className="space-y-4">
          <h3 className="text-3xl">{p.name}</h3>
          <p className="text-lg">{money(p.price)} {p.originalPrice && <s className="text-sm text-mocha">{money(p.originalPrice)}</s>}</p>
          <p className="text-sm text-mocha">{p.description}</p>
          <ColorDots colors={p.colors} selected={color} onPick={setColor} />
          <SizePicker sizes={p.sizes} value={size} onChange={setSize} />
          <div className="flex gap-2">
            <button className="btn-primary" disabled={p.stock < 1} onClick={() => addToCart(p, size, color) && onClose()}>Add to cart</button>
            <Link to={`/product/${p.id}`} className="btn-ghost" onClick={onClose}>Full details</Link>
            <button className="btn-ghost ml-auto" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default function ProductCard({ p }) {
  const { wishlist, toggleWish, addToCart } = useStore()
  const [color, setColor] = useState(p.colors[0]); const [size, setSize] = useState(''); const [quick, setQuick] = useState(false)
  const liked = wishlist.includes(p.id)
  return (
    <article className="group flex flex-col rounded-3xl bg-ivory p-3 shadow-soft">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
        <Link to={`/product/${p.id}`} aria-label={p.name}><ProductImage product={p} color={color} /></Link>
        <div className="absolute left-2 top-2 flex flex-col gap-1 text-xs">
          {p.discount > 0 && <span className="rounded-full bg-rose px-2.5 py-1 text-ivory">-{p.discount}%</span>}
          {p.isNew && <span className="rounded-full bg-ivory px-2.5 py-1">New</span>}
          {p.bestSeller && <span className="rounded-full bg-cocoa px-2.5 py-1 text-ivory">Best seller</span>}
          {p.stock < 1 && <span className="rounded-full bg-sand px-2.5 py-1">Sold out</span>}
        </div>
        <button onClick={() => toggleWish(p.id)} aria-pressed={liked} aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'} className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-ivory/90 text-lg text-rose">{liked ? '♥' : '♡'}</button>
        <button onClick={() => setQuick(true)} className="absolute inset-x-3 bottom-3 rounded-full bg-ivory/95 py-2 text-sm opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100">Quick view</button>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-1 pb-1 pt-3">
        <Link to={`/product/${p.id}`} className="text-xl leading-tight hover:text-rose font-display font-semibold">{p.name}</Link>
        <p className="line-clamp-2 text-sm text-mocha">{p.description}</p>
        <Stars value={p.rating} count={p.reviews} />
        <div className="flex items-baseline gap-2"><span className="font-medium">{money(p.price)}</span>{p.originalPrice && <s className="text-sm text-mocha">{money(p.originalPrice)}</s>}</div>
        <ColorDots colors={p.colors} selected={color} onPick={setColor} />
        <label className="sr-only" htmlFor={`s${p.id}`}>Size</label>
        <select id={`s${p.id}`} className="input py-2" value={size} onChange={(e) => setSize(e.target.value)}>
          <option value="">Select size</option>{p.sizes.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="btn-primary mt-auto" disabled={p.stock < 1} onClick={() => addToCart(p, size, color)}>{p.stock < 1 ? 'Out of stock' : 'Add to cart'}</button>
      </div>
      {quick && <QuickView p={p} onClose={() => setQuick(false)} />}
    </article>
  )
}
