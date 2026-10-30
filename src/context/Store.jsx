import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { baseProducts } from '../data/products'

const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)

// Replace these with API calls when you add a backend.
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
const useLocal = (k, d) => {
  const [v, setV] = useState(() => load(k, d))
  useEffect(() => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage full or blocked */ } }, [k, v])
  return [v, setV]
}

export const CODES = { WELCOME10: { pct: 10, min: 0 }, SLEEP20: { pct: 20, min: 100 } }
export const DELIVERY = { standard: { label: 'Standard (3–6 days)', fee: 6 }, express: { label: 'Express (1–2 days)', fee: 14 } }
export const FREE_OVER = 80
export const money = (n) => `$${n.toFixed(2)}`

export function StoreProvider({ children }) {
  const [cart, setCart] = useLocal('lm_cart', [])
  const [wishlist, setWishlist] = useLocal('lm_wish', [])
  const [users, setUsers] = useLocal('lm_users', [])
  const [session, setSession] = useLocal('lm_session', null)
  const [orders, setOrders] = useLocal('lm_orders', [])
  const [reviews, setReviews] = useLocal('lm_reviews', {})
  const [custom, setCustom] = useLocal('lm_custom_products', [])
  const [stockEdits, setStockEdits] = useLocal('lm_stock', {})
  const [code, setCode] = useLocal('lm_code', '')
  const [toast, setToast] = useState('')

  const notify = useCallback((m) => { setToast(m); setTimeout(() => setToast(''), 2400) }, [])
  const products = useMemo(
    () => [...baseProducts, ...custom].map((p) => (stockEdits[p.id] != null ? { ...p, stock: stockEdits[p.id] } : p)),
    [custom, stockEdits]
  )

  const addToCart = (product, size, color, qty = 1) => {
    if (!size || !color) return notify('Please choose a size and colour first.'), false
    if (product.stock < 1) return notify('Sorry, this item is out of stock.'), false
    const key = `${product.id}-${size}-${color}`
    setCart((c) => {
      const found = c.find((i) => i.key === key)
      if (found) return c.map((i) => (i.key === key ? { ...i, qty: Math.min(i.qty + qty, product.stock) } : i))
      return [...c, { key, id: product.id, size, color, qty }]
    })
    notify('Added to your cart.')
    return true
  }
  const updateQty = (key, qty) => setCart((c) => c.map((i) => (i.key === key ? { ...i, qty: Math.max(1, qty) } : i)))
  const changeVariant = (key, size, color) =>
    setCart((c) => {
      const it = c.find((i) => i.key === key); if (!it) return c
      const nk = `${it.id}-${size}-${color}`
      const rest = c.filter((i) => i.key !== key)
      const dup = rest.find((i) => i.key === nk)
      return dup ? rest.map((i) => (i.key === nk ? { ...i, qty: i.qty + it.qty } : i)) : [...c.map((i) => (i.key === key ? { ...i, key: nk, size, color } : i))]
    })
  const removeFromCart = (key) => setCart((c) => c.filter((i) => i.key !== key))
  const toggleWish = (id) => {
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]))
    notify(wishlist.includes(id) ? 'Removed from wishlist.' : 'Saved to your wishlist.')
  }

  const lines = cart.map((i) => ({ ...i, product: products.find((p) => p.id === i.id) })).filter((l) => l.product)
  const count = lines.reduce((n, l) => n + l.qty, 0)
  const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0)
  const promo = CODES[code]
  const discountAmt = promo && subtotal >= promo.min ? +(subtotal * promo.pct / 100).toFixed(2) : 0
  const totalsFor = (method = 'standard') => {
    const after = subtotal - discountAmt
    const delivery = !lines.length ? 0 : method === 'standard' && after >= FREE_OVER ? 0 : DELIVERY[method].fee
    return { subtotal, discount: discountAmt, delivery, total: after + delivery }
  }
  const applyCode = (raw) => {
    const c = raw.trim().toUpperCase()
    if (!CODES[c]) return notify('That code is not valid.'), false
    if (subtotal < CODES[c].min) return notify(`${c} needs a subtotal of at least ${money(CODES[c].min)}.`), false
    setCode(c); notify(`${c} applied.`); return true
  }

  const register = ({ name, email, password }) => {
    if (users.some((u) => u.email === email.toLowerCase())) return 'An account with this email already exists.'
    const u = { name, email: email.toLowerCase(), password } // DEMO ONLY: never store passwords in the browser in production
    setUsers([...users, u]); setSession({ name, email: u.email }); return null
  }
  const login = ({ email, password }) => {
    const u = users.find((x) => x.email === email.toLowerCase() && x.password === password)
    if (!u) return 'Email or password is incorrect.'
    setSession({ name: u.name, email: u.email }); return null
  }
  const logout = () => setSession(null)

  const placeOrder = (info) => {
    const t = totalsFor(info.delivery)
    const order = { id: 'LM' + Date.now().toString().slice(-8), date: new Date().toISOString(), email: session?.email || info.email, items: lines.map((l) => ({ id: l.id, name: l.product.name, size: l.size, color: l.color, qty: l.qty, price: l.product.price })), ...t, info, status: 'Received' }
    setOrders((o) => [order, ...o]); setCart([]); setCode('')
    return order
  }
  const addReview = (id, r) => setReviews((all) => ({ ...all, [id]: [{ ...r, date: new Date().toISOString() }, ...(all[id] || [])] }))

  const value = { products, cart: lines, count, subtotal, code, totalsFor, applyCode, addToCart, updateQty, changeVariant, removeFromCart, wishlist, toggleWish, session, register, login, logout, orders, placeOrder, reviews, addReview, custom, setCustom, setStockEdits, notify, toast }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
