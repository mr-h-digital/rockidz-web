import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FormField from '../components/FormField'

const authBackdropUrl = `${import.meta.env.BASE_URL}rockidz-sign-in-page-background-image.webp`
const storyPosterUrl = `${import.meta.env.BASE_URL}david-and-goliath-story.webp`

export default function SignIn() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const email = form.email.trim()
    if (!email) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address'
    if (!form.password) return 'Password is required'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationError = validate()
    setError(validationError)
    if (validationError) return
    setSubmitting(true)
    try {
      await login(form.email.trim(), form.password)
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
      <div className="pointer-events-none absolute inset-0 -z-10">
        <img src={authBackdropUrl} alt="" aria-hidden="true" className="h-full w-full object-cover object-center opacity-[0.56]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(223,247,255,0.56)_0%,rgba(255,247,209,0.42)_45%,rgba(255,229,241,0.5)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(0,194,255,0.12),transparent_30%),radial-gradient(circle_at_85%_22%,rgba(140,82,255,0.1),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(255,216,77,0.14),transparent_35%)]" />
      </div>

      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-6 py-12 lg:grid-cols-[1.02fr_0.98fr]">
        <section className="order-2 rounded-[2rem] border-4 border-white/70 bg-white/78 p-6 shadow-[0_22px_65px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-8 lg:order-1">
          <span className="inline-flex rounded-full bg-[#7ce8ff] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#005f75]">
            Welcome back
          </span>
          <h1 className="mt-5 font-display text-5xl text-[#5b2b86] sm:text-6xl">Jump back into the fun</h1>
          <p className="mt-3 max-w-md text-base text-[#5b5872]">
            Sign in to continue your Bible adventure, memory verses, games, and colourful learning activities.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Badge color="bg-[#dff7ff] text-[#007e8c]" label="Stories" />
            <Badge color="bg-[#fff1a8] text-[#8a4b00]" label="Games" />
            <Badge color="bg-[#efe2ff] text-[#6f33c7]" label="Badges" />
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
              autoComplete="current-password"
              allowReveal
              required
            />

            <div className="-mt-1 text-right">
              <Link to="/forgot-password" className="text-sm font-bold text-[#00a8b5] hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && <p className="rounded-2xl bg-[#ffe3ec] px-4 py-3 text-sm font-semibold text-[#c2376d]">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-[linear-gradient(120deg,#00c2ff_0%,#8c52ff_55%,#ffd84d_100%)] px-6 py-3.5 text-sm font-black uppercase tracking-wide text-white shadow-[0_14px_28px_rgba(0,194,255,0.22)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Start the adventure'}
            </button>
          </form>

          <p className="mt-6 text-sm text-[#5b5872]">
            New here?{' '}
            <Link to="/sign-up" className="font-bold text-[#6f33c7] hover:underline">
              Create a Rockidz profile
            </Link>
          </p>
        </section>

        <section className="order-1 lg:order-2">
          <div className="relative rounded-[2.2rem] border-4 border-white/70 bg-white/60 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.08)] backdrop-blur-md">
            <img src={storyPosterUrl} alt="David and Goliath Rockidz story sheet" className="w-full rounded-[1.7rem] object-cover" />
            <div className="absolute -left-3 top-8 rounded-2xl bg-[#8c52ff] px-4 py-3 text-white shadow-xl">
              <div className="font-display text-3xl leading-none">★</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em]">Story time</div>
            </div>
            <div className="absolute -right-3 bottom-8 rounded-2xl bg-[#ffd84d] px-4 py-3 text-[#6b4b00] shadow-xl">
              <div className="font-display text-3xl leading-none">3</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em]">Fun steps</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function Badge({ color, label }) {
  return <span className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.14em] ${color}`}>{label}</span>
}
