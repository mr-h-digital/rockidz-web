import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import FormField from '../components/FormField'

const authBackdropUrl = `${import.meta.env.BASE_URL}images/auth-bg-designer-59.webp`

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setResult(null)

    const cleanEmail = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address')
      return
    }

    setSubmitting(true)
    try {
      const res = await api.post('/api/auth/forgot-password', { email: cleanEmail }, { auth: false })
      setResult(res)
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

      <div className="mx-auto max-w-md px-4 py-14 sm:px-6 sm:py-20">
        <div className="rounded-2xl border border-rock-border bg-[#0f1a2b]/58 p-5 backdrop-blur-md sm:p-8">
          <h1 className="font-display text-4xl sm:text-5xl">Reset password</h1>
          <p className="mt-2 text-sm text-rock-muted">
            Enter your email and we will prepare a password reset link.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <FormField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              required
            />

            {error && <p className="text-sm text-rock-ember">{error}</p>}

            {result && (
              <div className="rounded-xl border border-rock-border bg-white/[0.02] p-4 text-sm text-rock-muted">
                <p>{result.message}</p>
                {result.resetUrl && (
                  <p className="mt-3">
                    <a href={result.resetUrl} className="text-rock-gold hover:underline">
                      Open reset link
                    </a>
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-grad-gold px-6 py-3.5 text-sm font-extrabold uppercase tracking-wide text-[#0b1220] transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? 'Preparing link…' : 'Send reset link'}
            </button>
          </form>

          <p className="mt-6 text-sm text-rock-muted">
            Remembered your password?{' '}
            <Link to="/sign-in" className="text-rock-gold hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
