import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FormField from '../components/FormField'

const authBackdropUrl = `${import.meta.env.BASE_URL}rockidz-signup-join-crew-background.webp`
const lessonTalkUrl = `${import.meta.env.BASE_URL}david-and-goliath-lesson-talk.webp`

export default function SignUp() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ displayName: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const displayName = form.displayName.trim()
    const email = form.email.trim()
    const password = form.password

    if (displayName.length < 2) return 'Full name must be at least 2 characters'
    if (!email) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address'
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter'
    if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter'
    if (!/\d/.test(password)) return 'Password must include at least one number'
    if (!/[^A-Za-z0-9]/.test(password)) return 'Password must include at least one symbol'
    if (password !== form.confirmPassword) return 'Password and confirmation do not match'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationError = validate()
    setError(validationError)
    if (validationError) return
    setSubmitting(true)
    try {
      await signup(form.email.trim(), form.password, form.displayName.trim())
      const redirect = sessionStorage.getItem('rockidz_redirect_after_auth')
      sessionStorage.removeItem('rockidz_redirect_after_auth')
      navigate(redirect || '/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <img src={authBackdropUrl} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.9]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,8,44,0.62)_0%,rgba(23,10,73,0.56)_42%,rgba(7,53,99,0.5)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,216,77,0.12),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(95,231,255,0.12),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(255,79,163,0.12),transparent_36%)]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl items-center gap-6 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[0.98fr_1.02fr]">
        <section className="order-1">
          <div className="relative rounded-[2.2rem] border-4 border-white/70 bg-white/60 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.08)] backdrop-blur-md">
            <img src={lessonTalkUrl} alt="David and Goliath Rockidz lesson discussion page" className="w-full rounded-[1.7rem] object-cover" />
            <div className="absolute left-2 top-4 rounded-2xl bg-[#00c2ff] px-3 py-2.5 text-white shadow-xl sm:-left-3 sm:top-8 sm:px-4 sm:py-3">
              <div className="font-display text-3xl leading-none">+</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em]">Join in</div>
            </div>
            <div className="absolute right-2 bottom-4 rounded-2xl bg-[#8c52ff] px-3 py-2.5 text-white shadow-xl sm:-right-3 sm:bottom-8 sm:px-4 sm:py-3">
              <div className="font-display text-3xl leading-none">✓</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em]">Learn & play</div>
            </div>
          </div>
        </section>

        <section className="order-2 rounded-[2rem] border-4 border-white/70 bg-white/80 p-6 shadow-[0_22px_65px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-8">
          <span className="inline-flex rounded-full bg-[#fff1a8] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#8a4b00]">
            Join Rockidz
          </span>
          <h1 className="mt-5 font-display text-4xl text-[#5b2b86] sm:text-6xl">Create your fun profile</h1>
          <p className="mt-3 max-w-md text-base text-[#5b5872]">
            Start your colourful Bible journey with stories, games, memory verses, and activity packs made for kids.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <InfoCard title="Stories" tone="bg-[#dff7ff] text-[#007e8c]" />
            <InfoCard title="Verses" tone="bg-[#fff1a8] text-[#8a4b00]" />
            <InfoCard title="Rewards" tone="bg-[#efe2ff] text-[#6f33c7]" />
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <FormField
              label="Full name"
              value={form.displayName}
              onChange={(v) => setForm({ ...form, displayName: v })}
              autoComplete="name"
              required
            />
            <FormField
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              autoComplete="email"
              required
            />
            <FormField
              label="Password"
              type="password"
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })}
              autoComplete="new-password"
              minLength={8}
              hint="Use 8+ characters with upper/lowercase, a number, and a symbol"
              allowReveal
              required
            />
            <FormField
              label="Confirm password"
              type="password"
              value={form.confirmPassword}
              onChange={(v) => setForm({ ...form, confirmPassword: v })}
              autoComplete="new-password"
              allowReveal
              required
            />

            {error && <p className="rounded-2xl bg-[#ffe3ec] px-4 py-3 text-sm font-semibold text-[#c2376d]">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-[linear-gradient(120deg,#00c2ff_0%,#8c52ff_50%,#ffd84d_100%)] px-6 py-3.5 text-sm font-black uppercase tracking-wide text-white shadow-[0_14px_28px_rgba(140,82,255,0.2)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {submitting ? 'Creating account…' : 'Create my profile'}
            </button>
          </form>

          <p className="mt-6 text-sm text-[#5b5872]">
            Already have a profile?{' '}
            <Link to="/sign-in" className="font-bold text-[#00a8b5] hover:underline">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}

function InfoCard({ title, tone }) {
  return <div className={`rounded-[1.3rem] px-4 py-3 text-center text-xs font-black uppercase tracking-[0.16em] ${tone}`}>{title}</div>
}
