
import { COLORS } from '../data/products'

// Automatically load product photos from src/assets/
const images = import.meta.glob(
  '../assets/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  {
    eager: true,
    import: 'default',
  }
)

// Normalize filenames and product names for matching.
const normalize = (name = '') =>
  name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

// Find the image whose filename matches the product name.
const getProductImage = (product) => {
  if (!product?.name) return null

  const productName = normalize(product.name)

  const match = Object.entries(images).find(([path]) => {
    const filename = path.split('/').pop()
    return normalize(filename) === productName
  })

  return match?.[1] || null
}

// Generate darker and lighter colors for the SVG fallback.
const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16)

  const c = (v) =>
    Math.max(0, Math.min(255, v + amt))

  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`
}

export default function ProductImage({
  product,
  color,
  view = 0,
  className = '',
}) {
  // Avoid errors if a product was deleted.
  if (!product) return null

  // Display the real product photo when available.
  const image = getProductImage(product)

  if (image) {
    return (
      <img
        src={image}
        alt={product.name || 'Pajama product'}
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
      />
    )
  }

  // Fallback illustration if no matching photo exists.
  const productColors = product.colors || []
  const selectedColor = color || productColors[0]
  const hex = COLORS[selectedColor] || '#D8B7A5'

  const dark = shade(hex, -28)
  const light = shade(hex, 18)

  const bgs = [
    '#F2E4DC',
    '#EBDDD0',
    '#F6EDE6',
    '#E8D6CF',
  ]

  const safeView = ((Number(view) || 0) % 4 + 4) % 4
  const scale = [1, 1.25, 0.9, 1][safeView]

  return (
    <svg
      viewBox="0 0 300 375"
      role="img"
      aria-label={`${product.name || 'Product'} in ${selectedColor || 'default color'}`}
      className={`w-full h-full ${className}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect
        width="300"
        height="375"
        fill={bgs[safeView]}
      />

      <g
        transform={`translate(150 190) scale(${scale}) translate(-150 -190)`}
      >
        {product.kind === 'gown' ? (
          <g>
            <path
              d="M105 70 L125 70 Q150 100 175 70 L195 70 L205 120 L235 330 Q150 350 65 330 L95 120 Z"
              fill={hex}
            />

            <path
              d="M95 120 L205 120"
              stroke={dark}
              strokeWidth="3"
            />

            <path
              d="M125 70 Q150 100 175 70"
              fill="none"
              stroke={dark}
              strokeWidth="3"
            />
          </g>
        ) : (
          <g>
            <path
              d="M100 60 L130 50 Q150 75 170 50 L200 60 L240 100 L225 135 L200 120 L200 190 L100 190 L100 120 L75 135 L60 100 Z"
              fill={hex}
            />

            <path
              d="M130 50 Q150 75 170 50"
              fill="none"
              stroke={dark}
              strokeWidth="3"
            />

            <path
              d="M150 75 L150 190"
              stroke={dark}
              strokeWidth="2"
            />

            {[100, 125, 150].map((y) => (
              <circle
                key={y}
                cx="150"
                cy={y}
                r="3"
                fill={light}
              />
            ))}

            {product.kind === 'short' ? (
              <path
                d="M102 200 L198 200 L206 265 L156 265 L150 235 L144 265 L94 265 Z"
                fill={dark}
              />
            ) : (
              <path
                d="M102 200 L198 200 L212 345 L160 345 L150 245 L140 345 L88 345 Z"
                fill={dark}
              />
            )}
          </g>
        )}
      </g>
    </svg>
  )
}
