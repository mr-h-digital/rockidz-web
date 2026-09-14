import { useState } from 'react'

export default function FormField({ label, value, onChange, type = 'text', hint, allowReveal = false, ...rest }) {
  const [revealed, setRevealed] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && allowReveal ? (revealed ? 'text' : 'password') : type

  return (
    <label className="block">
      <span className="text-sm font-semibold text-white">{label}</span>
      <div className="relative mt-1.5">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-2xl border-2 border-white/18 bg-white/88 px-4 py-3 text-sm text-[#1c2347] shadow-[0_14px_28px_rgba(5,5,28,0.18)] outline-none placeholder:text-[#55628f] focus:border-[#5fe7ff] focus:shadow-[0_0_0_4px_rgba(0,184,255,0.14)] ${
            isPassword && allowReveal ? 'pr-20' : ''
          }`}
          {...rest}
        />
        {isPassword && allowReveal && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#ffd233] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#7a4200] shadow-[0_10px_18px_rgba(255,210,51,0.28)] hover:bg-[#ffdc57]"
          >
            {revealed ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {hint && <span className="mt-1 block text-xs text-white/78">{hint}</span>}
    </label>
  )
}
