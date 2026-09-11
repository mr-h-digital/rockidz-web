import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FormField from '../components/FormField'

const authBackdropUrl = `${import.meta.env.BASE_URL}images/auth-bg-designer-59.png`

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
      <div className="pointer-events-none absolute inset-0 -z-10">
        <img src={authBackdropUrl} alt="" aria-hidden="true" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(18,28,42,0.16),rgba(12,17,28,0.52)_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1320]/28 via-[#0f1a2b]/40 to-[#101521]/56" />
      </div>

      <div className="mx-auto max-w-md px-6 py-20">
        <div className="rounded-2xl border border-rock-border bg-[#0f1a2b]/58 p-6 backdrop-blur-md sm:p-8">
          <h1 className="font-display text-5xl">Create your profile</h1>
          <p className="mt-2 text-sm text-rock-muted">
            Join Rockidz for colourful Bible stories, games, and joyful activities.
          </p>

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
              hint="At least 8 chars, including upper/lowercase, number and symbol"
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

            {error && <p className="text-sm text-rock-ember">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-grad-gold px-6 py-3.5 text-sm font-extrabold uppercase tracking-wide text-[#0b1220] hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-rock-muted">
            Already have a profile?{' '}
            <Link to="/sign-in" className="text-rock-gold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
