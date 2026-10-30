import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useStore } from '../context/Store'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'
import { CATEGORIES } from '../data/products'

const Section = ({ title, to, children }) => (
  <section className="container-x mt-20">
    <div className="mb-6 flex items-end justify-between"><h2 className="text-4xl">{title}</h2>{to && <Link to={to} className="text-sm underline hover:text-rose">View all</Link>}</div>{children}
  </section>
)
const Grid = ({ items }) => <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div>
const REVIEWS = [['Amira K.', 'The satin set feels expensive and washes beautifully. I have bought three.'], ['Lina B.', 'Sizing guide was right. The fleece set kept me warm all winter.'], ['Sofia R.', 'Fast delivery and lovely packaging. Perfect gift for my sister.']]

export default function Home() {
  const { products } = useStore()
  const [feat] = useState(() => products[0])
  const cats = ['Satin Pajamas', 'Cotton Pajamas', 'Winter Pajamas', 'Summer Pajamas', 'Nightgowns', 'Loungewear']
  const pick = (c) => products.find((p) => p.category === c)
  return (
    <>
      <section className="container-x grid items-center gap-8 pt-8 md:grid-cols-2 md:pt-14">
        <div>
          <h1 className="text-5xl leading-[1.05] sm:text-7xl">Sleep softer.<br />Wake up lovelier.</h1>
          <p className="mt-5 max-w-md text-mocha">Satin, cotton, fleece and silk pajamas, nightgowns and loungewear in sizes XS to 3X.</p>
          <Link to="/shop" className="btn-primary mt-7">Shop now</Link>
        </div>
        <div className="aspect-[5/4] overflow-hidden rounded-[2.5rem] shadow-soft"><ProductImage product={feat} color="Pink" view={2} /></div>
      </section>

      <Section title="Shop by category">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {cats.map((c) => (
            <Link key={c} to={`/shop?category=${encodeURIComponent(c)}`} className="group text-center">
              <div className="aspect-square overflow-hidden rounded-3xl"><ProductImage product={pick(c)} /></div>
              <p className="mt-2 text-sm group-hover:text-rose">{c.replace(' Pajamas', '')}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="New arrivals" to="/shop?new=1"><Grid items={products.filter((p) => p.isNew).slice(0, 4)} /></Section>
      <Section title="Best sellers" to="/shop?best=1"><Grid items={products.filter((p) => p.bestSeller).slice(0, 4)} /></Section>

      <Section title="Seasonal collections">
        <div className="grid gap-4 md:grid-cols-2">
          {[['Cozy winter nights', 'season=Winter', 'Winter Pajamas'], ['Light summer sleepwear', 'season=Summer', 'Summer Pajamas']].map(([t, q, c], i) => (
            <Link key={t} to={`/shop?${q}`} className={`flex items-center justify-between overflow-hidden rounded-3xl p-6 ${i ? 'bg-sand' : 'bg-blush'}`}>
              <div><h3 className="text-3xl">{t}</h3><p className="mt-1 text-sm underline">Explore</p></div>
              <div className="h-32 w-28 overflow-hidden rounded-2xl"><ProductImage product={pick(c)} /></div>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Special offers" to="/shop?offer=1"><Grid items={products.filter((p) => p.discount).slice(0, 4)} /></Section>

      <Section title="Featured collections">
        <div className="grid gap-4 md:grid-cols-3">
          {[['Soft & Cozy', 'material=Fleece,Flannel'], ['Elegant Nights', 'style=Elegant,Luxury'], ['Everyday Comfort', 'material=Cotton']].map(([t, q]) => (
            <Link key={t} to={`/shop?${q}`} className="rounded-3xl border border-sand bg-ivory p-8 text-center hover:border-rose"><h3 className="text-3xl">{t}</h3><p className="mt-2 text-sm text-mocha">Browse the collection</p></Link>
          ))}
        </div>
      </Section>

      <Section title="Customer reviews">
        <div className="grid gap-4 md:grid-cols-3">
          {REVIEWS.map(([n, t]) => <figure key={n} className="rounded-3xl bg-ivory p-6 shadow-soft"><div className="text-rose" aria-label="5 out of 5">★★★★★</div><blockquote className="mt-2 text-sm">{t}</blockquote><figcaption className="mt-3 text-xs text-mocha">{n}</figcaption></figure>)}
        </div>
      </Section>
    </>
  )
}
export function Categories() {
  return (
    <div className="container-x py-10"><h1 className="mb-6 text-5xl">All categories</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => <Link key={c} to={`/shop?category=${encodeURIComponent(c)}`} className="rounded-2xl border border-sand bg-ivory p-5 text-xl font-display hover:border-rose">{c}</Link>)}
      </div>
    </div>
  )
}
