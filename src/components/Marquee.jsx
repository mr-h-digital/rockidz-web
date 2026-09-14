const DEFAULT_ITEMS = ['New season dropping soon', 'Walk the path', 'Earn your badges', 'Go deeper']

export default function Marquee({ items = DEFAULT_ITEMS }) {
  const tripled = [...items, ...items, ...items]

  return (
    <div className="overflow-hidden border-y border-white/10 bg-[linear-gradient(90deg,rgba(17,10,56,0.9),rgba(60,18,114,0.82),rgba(0,112,186,0.78),rgba(255,79,163,0.74))] py-2.5 shadow-[0_10px_26px_rgba(5,5,28,0.24)] backdrop-blur-sm">
      <div className="marquee-track">
        <div className="flex min-w-max gap-10 whitespace-nowrap pr-10">
          {tripled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-display text-sm uppercase tracking-[0.08em] text-white/90"
          >
            {item}
            <span className="text-[#ffd233]" aria-hidden="true">
              ✦
            </span>
          </span>
          ))}
        </div>
      </div>
    </div>
  )
}
