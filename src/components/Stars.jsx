export default function Stars({ value, count }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-mocha" aria-label={`Rated ${value} out of 5`}>
      <span className="text-rose">{'★'.repeat(Math.round(value))}<span className="text-sand">{'★'.repeat(5 - Math.round(value))}</span></span>
      {count != null && <span>({count})</span>}
    </span>
  )
}
