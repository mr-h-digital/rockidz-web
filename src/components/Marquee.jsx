const DEFAULT_ITEMS = ['New season dropping soon', 'Walk the path', 'Earn your badges', 'Go deeper']

export default function Marquee({ items = DEFAULT_ITEMS }) {
  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden border-y border-white/70 bg-[linear-gradient(90deg,rgba(255,216,77,0.35),rgba(124,232,255,0.28),rgba(255,111,181,0.26),rgba(196,240,0,0.22))] py-2.5">
      <div className="marquee-track flex gap-10 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-display text-sm uppercase tracking-[0.08em] text-[#5b2b86]"
          >
            {item}
            <span className="text-[#ff6fb5]" aria-hidden="true">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
