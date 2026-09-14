/**
 * ProgressPath — the app's signature visual motif.
 * Renders progress through a course as a row of stepping stones, lighting
 * up bright blue (completed) with the current lesson marked in pink, rather than
 * a generic progress bar — a path being walked.
 */
export default function ProgressPath({ completed, total, size = 'md' }) {
  const safeTotal = Math.max(total, 1)
  const stones = Array.from({ length: safeTotal }, (_, i) => {
    if (i < completed) return 'lit'
    if (i === completed) return 'ember'
    return 'off'
  })
  const dimension = size === 'sm' ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'
  const gap = size === 'sm' ? 'gap-1' : 'gap-1.5'

  return (
    <div className="flex items-center gap-3">
      <div className={`flex ${gap} flex-wrap`} role="img" aria-label={`${completed} of ${total} lessons complete`}>
        {stones.map((state, i) => (
          <span
            key={i}
            className={`${dimension} rounded-full border border-white/50 transition-colors duration-500 ${
              state === 'lit'
                ? 'bg-[#00b8ff] shadow-[0_0_10px_rgba(0,184,255,0.75)]'
                : state === 'ember'
                  ? 'bg-[#ff4fa3] shadow-[0_0_10px_rgba(255,79,163,0.7)]'
                  : 'bg-[#fff2a6]/85'
            }`}
          />
        ))}
      </div>
      <span className="whitespace-nowrap font-body text-xs text-[#5d487f]">
        {completed}/{total}
      </span>
    </div>
  )
}
