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
            className={`${dimension} rounded-full transition-colors duration-500 ${
              state === 'lit'
                ? 'bg-[#00c2ff] shadow-[0_0_8px_rgba(0,194,255,0.6)]'
                : state === 'ember'
                  ? 'bg-[#ff6fb5] shadow-[0_0_8px_rgba(255,111,181,0.6)]'
                  : 'bg-white/60'
            }`}
          />
        ))}
      </div>
      <span className="whitespace-nowrap font-body text-xs text-[#5b5872]">
        {completed}/{total}
      </span>
    </div>
  )
}
