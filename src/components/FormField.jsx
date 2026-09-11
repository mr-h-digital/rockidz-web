import { useState } from 'react'

export default function FormField({ label, value, onChange, type = 'text', hint, allowReveal = false, ...rest }) {
  const [revealed, setRevealed] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && allowReveal ? (revealed ? 'text' : 'password') : type

  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#5b2b86]">{label}</span>
      <div className="relative mt-1.5">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-2xl border-4 border-white bg-white/90 px-4 py-3 text-sm text-[#5b2b86] shadow-[0_10px_25px_rgba(140,82,255,0.08)] outline-none placeholder:text-[#8f7f9d] focus:border-[#7ce8ff] ${
            isPassword && allowReveal ? 'pr-20' : ''
          }`}
          {...rest}
        />
        {isPassword && allowReveal && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#fff1a8] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#8a4b00] hover:bg-[#ffe067]"
          >
            {revealed ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {hint && <span className="mt-1 block text-xs text-[#7b6d8a]">{hint}</span>}
    </label>
  )
}
