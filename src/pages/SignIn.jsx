import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FormField from '../components/FormField'

const authBackdropUrl = `${import.meta.env.BASE_URL}images/auth-bg-designer-59.png`

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
        <img src={authBackdropUrl} alt="" aria-hidden="true" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(18,28,42,0.16),rgba(12,17,28,0.52)_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1320]/28 via-[#0f1a2b]/40 to-[#101521]/56" />
      </div>

      <div className="mx-auto max-w-md px-6 py-20">
        <div className="rounded-2xl border border-rock-border bg-[#0f1a2b]/58 p-6 backdrop-blur-md sm:p-8">
          <h1 className="font-display text-5xl">Welcome back</h1>
          <p className="mt-2 text-sm text-rock-muted">Sign in to continue the fun.</p>

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
              <Link to="/forgot-password" className="text-xs text-rock-gold hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && <p className="text-sm text-rock-ember">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-grad-gold px-6 py-3.5 text-sm font-extrabold uppercase tracking-wide text-[#0b1220] hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-rock-muted">
            New here?{' '}
            <Link to="/sign-up" className="text-rock-gold hover:underline">
              Create a Rockidz profile
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
