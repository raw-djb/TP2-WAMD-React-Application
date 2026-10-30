export const COLORS = { Black: '#2b2626', White: '#f4f1ea', Pink: '#e4aeb7', Red: '#b5323f', Beige: '#d6bf9f', Blue: '#9db7d1', Purple: '#a98bc4', Green: '#9cb59a' }
export const CATEGORIES = ['Classic Pajamas','Luxury Pajamas','Satin Pajamas','Cotton Pajamas','Winter Pajamas','Summer Pajamas','Short Pajama Sets','Long Pajama Sets','Nightgowns','Loungewear','Matching Sets','Cute and Printed Pajamas','Minimalist Pajamas','Plus-Size Pajamas','Bridal Sleepwear','Maternity and Nursing Pajamas','Kids and Family Matching Sets']

// [name, category, material, season, style, sleeve, bottom, pattern, price, colors, kind]
const T = [
 ['Silk Camisole Set','Luxury Pajamas','Silk','Spring','Luxury','Sleeveless','Long trousers','Plain',139,['Beige','Black','Pink'],'set'],
 ['Cloud Fleece Set','Winter Pajamas','Fleece','Winter','Casual','Long sleeves','Long trousers','Plain',68,['Beige','Pink','Purple'],'set'],
 ['Flannel Check Set','Winter Pajamas','Flannel','Winter','Classic','Long sleeves','Long trousers','Striped',64,['Red','Blue','Green'],'set'],
 ['Heritage Long Set','Long Pajama Sets','Cotton','Autumn','Classic','Long sleeves','Long trousers','Striped',56,['Blue','Black','Beige'],'set'],
 ['Midnight Satin Nightgown','Nightgowns','Satin','Summer','Elegant','Sleeveless','Nightgown','Plain',58,['Black','Red','Pink'],'gown'],
 ['Silk Slip Gown','Nightgowns','Silk','Summer','Luxury','Sleeveless','Nightgown','Plain',118,['Beige','Black','Purple'],'gown'],
 ['Ribbed Lounge Set','Loungewear','Cotton','Spring','Minimalist','Short sleeves','Capri pants','Plain',60,['White','Black','Beige'],'set'],
 ['Wildflower Print Set','Cute and Printed Pajamas','Polyester','Summer','Romantic','Short sleeves','Shorts','Floral',41,['Blue','Green','Pink'],'short'],
 ['Family Check Set (Women)','Kids and Family Matching Sets','Flannel','Winter','Classic','Long sleeves','Long trousers','Striped',52,['Red','Green','Blue'],'set'],
]
const BLURB = { set: 'A matching top and bottoms set', short: 'A light top and shorts set', gown: 'A flowing nightgown' }
const seed = (n) => { const x = Math.sin(n * 9301 + 49297) * 233280; return x - Math.floor(x) }
const DISC = [10, 15, 20, 25]

export const baseProducts = T.map((t, i) => {
  const [name, category, material, season, style, sleeve, bottom, pattern, price, colors, kind] = t
  const sizes = category === 'Plus-Size Pajamas' ? ['XL','XXL','1X','2X','3X'] : ['XS','S','M','L','XL','XXL']
  const discount = i % 4 === 1 ? DISC[(i >> 2) % 4] : 0
  return {
    id: i + 1, name, category, material, season, style, sleeve, bottom, pattern, kind, colors, sizes,
    price: discount ? Math.round(price * (100 - discount) / 100) : price,
    originalPrice: discount ? price : null, discount,
    description: `${BLURB[kind]} in ${material.toLowerCase()}. ${style} look, ${pattern === 'Plain' ? 'plain colour' : pattern.toLowerCase() + ' pattern'}, made for good sleep.`,
    care: 'Machine wash cold, gentle cycle. Do not bleach. Line dry. Cool iron if needed.',
    stock: i % 9 === 8 ? 0 : 4 + Math.floor(seed(i) * 40),
    rating: +(4 + seed(i + 3) * 0.9).toFixed(1), reviews: 8 + Math.floor(seed(i + 5) * 190),
    popularity: Math.floor(seed(i + 7) * 100), isNew: i >= T.length - 8, bestSeller: i % 5 === 0,
  }
})
