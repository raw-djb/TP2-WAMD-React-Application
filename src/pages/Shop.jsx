import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useStore } from '../context/Store'
import ProductCard from '../components/ProductCard'
import { CATEGORIES, COLORS } from '../data/products'

const GROUPS = [['category', 'Category'], ['size', 'Size'], ['color', 'Color'], ['material', 'Material'], ['season', 'Season'], ['style', 'Style'], ['sleeve', 'Sleeve length'], ['bottom', 'Bottom style'], ['pattern', 'Pattern'], ['avail', 'Availability']]
const FIELD = { category: 'category', size: 'sizes', color: 'colors', material: 'material', season: 'season', style: 'style', sleeve: 'sleeve', bottom: 'bottom', pattern: 'pattern' }
const AVAIL = ['In stock', 'Out of stock', 'New arrivals']
const SORTS = { popular: 'Popularity', newest: 'Newest arrivals', 'price-asc': 'Price: low to high', 'price-desc': 'Price: high to low', rating: 'Customer rating', discount: 'Biggest discount' }
const uniq = (arr) => [...new Set(arr)]

export default function Shop() {
  const { products } = useStore()
  const [sp, setSp] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const get = (k) => (sp.get(k) ? sp.get(k).split(',') : [])
  const set = (k, v) => { const n = new URLSearchParams(sp); v && v.length ? n.set(k, Array.isArray(v) ? v.join(',') : v) : n.delete(k); setSp(n, { replace: true }) }
  const toggle = (k, v) => { const c = get(k); set(k, c.includes(v) ? c.filter((x) => x !== v) : [...c, v]) }

  const options = useMemo(() => ({
    category: CATEGORIES, size: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '1X', '2X', '3X'], color: Object.keys(COLORS), avail: AVAIL,
    ...Object.fromEntries(['material', 'season', 'style', 'sleeve', 'bottom', 'pattern'].map((k) => [k, uniq(products.map((p) => p[k])).sort()])),
  }), [products])

  const q = (sp.get('q') || '').toLowerCase().trim(); const min = sp.get('min'); const max = sp.get('max')
  const sort = sp.get('sort') || 'popular'
  const list = useMemo(() => {
    const avail = get('avail')
    let r = products.filter((p) => {
      if (q && !`${p.name} ${p.description} ${p.category} ${p.material} ${p.style}`.toLowerCase().includes(q)) return false
      for (const k of Object.keys(FIELD)) {
        const sel = get(k); if (!sel.length) continue
        const v = [].concat(p[FIELD[k]]); if (!sel.some((s) => v.includes(s))) return false
      }
      if (min && p.price < +min) return false
      if (max && p.price > +max) return false
      if (avail.length && !avail.some((a) => (a === 'In stock' ? p.stock > 0 : a === 'Out of stock' ? p.stock < 1 : p.isNew))) return false
      if (sp.get('offer') && !p.discount) return false
      if (sp.get('new') && !p.isNew) return false
      if (sp.get('best') && !p.bestSeller) return false
      return true
    })
    const s = { popular: (a, b) => b.popularity - a.popularity, newest: (a, b) => b.id - a.id, 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price, rating: (a, b) => b.rating - a.rating, discount: (a, b) => b.discount - a.discount }[sort]
    return [...r].sort(s)
  }, [products, sp]) // eslint-disable-line

  const chips = [...GROUPS.flatMap(([k, l]) => get(k).map((v) => [k, v, `${l}: ${v}`])),
    ...(q ? [['q', null, `Search: ${sp.get('q')}`]] : []), ...(min ? [['min', null, `Min $${min}`]] : []), ...(max ? [['max', null, `Max $${max}`]] : []),
    ...['offer', 'new', 'best'].filter((k) => sp.get(k)).map((k) => [k, null, { offer: 'Discounted', new: 'New arrivals', best: 'Best sellers' }[k]])]
  const remove = ([k, v]) => (v ? toggle(k, v) : set(k, ''))

  return (
    <div className="container-x py-8">
      <h1 className="text-5xl">Shop</h1>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button className="btn-ghost lg:hidden" onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters}>Filters</button>
        <p className="text-sm text-mocha">{list.length} products</p>
        <label className="ml-auto flex items-center gap-2 text-sm">Sort by
          <select className="input w-auto py-2" value={sort} onChange={(e) => set('sort', e.target.value)}>{Object.entries(SORTS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        </label>
      </div>
      {chips.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((c) => <button key={c[2]} onClick={() => remove(c)} className="rounded-full bg-blush px-3 py-1 text-xs" aria-label={`Remove filter ${c[2]}`}>{c[2]} ✕</button>)}
          <button onClick={() => setSp({}, { replace: true })} className="text-xs underline">Reset all</button>
        </div>
      )}
      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className={`${showFilters ? 'block' : 'hidden'} space-y-3 lg:block`} aria-label="Filters">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!sp.get('offer')} onChange={(e) => set('offer', e.target.checked ? '1' : '')} /> Discounts & offers only</label>
          <div className="rounded-2xl bg-ivory p-4"><p className="mb-2 text-sm font-medium">Price range ($)</p>
            <div className="flex gap-2"><input className="input py-2" type="number" min="0" placeholder="Min" aria-label="Minimum price" value={min || ''} onChange={(e) => set('min', e.target.value)} /><input className="input py-2" type="number" min="0" placeholder="Max" aria-label="Maximum price" value={max || ''} onChange={(e) => set('max', e.target.value)} /></div></div>
          {GROUPS.map(([k, l]) => (
            <details key={k} open={['category', 'size', 'color'].includes(k) || get(k).length > 0} className="rounded-2xl bg-ivory p-4">
              <summary className="cursor-pointer text-sm font-medium">{l}</summary>
              <div className="mt-2 max-h-52 space-y-1.5 overflow-auto">
                {options[k].map((o) => <label key={o} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={get(k).includes(o)} onChange={() => toggle(k, o)} />{k === 'color' && <span className="h-3 w-3 rounded-full border border-cocoa/20" style={{ background: COLORS[o] }} />}{o}</label>)}
              </div>
            </details>
          ))}
        </aside>
        <div>
          {list.length ? <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
            : <div className="rounded-3xl bg-ivory p-12 text-center"><p className="text-2xl font-display">No pajamas match these filters</p><p className="mt-1 text-sm text-mocha">Remove a filter or start again.</p><button className="btn-primary mt-4" onClick={() => setSp({}, { replace: true })}>Reset filters</button></div>}
        </div>
      </div>
    </div>
  )
}
