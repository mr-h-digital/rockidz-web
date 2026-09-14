import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import FormField from '../components/FormField'

const authBackdropUrl = `${import.meta.env.BASE_URL}rockidz-signin-mission-control-background.webp`

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const tokenFromQuery = searchParams.get('token') || ''

  const [token, setToken] = useState(tokenFromQuery)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  function validate() {
    if (!token.trim()) return 'Reset token is required'
    if (newPassword.length < 8) return 'New password must be at least 8 characters'
    if (!/[A-Z]/.test(newPassword)) return 'New password must include an uppercase letter'
    if (!/[a-z]/.test(newPassword)) return 'New password must include a lowercase letter'
    if (!/\d/.test(newPassword)) return 'New password must include a number'
    if (!/[^A-Za-z0-9]/.test(newPassword)) return 'New password must include a symbol'
    if (newPassword !== confirmPassword) return 'Password and confirmation do not match'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)
    try {
      const res = await api.post(
        '/api/auth/reset-password',
        { token: token.trim(), newPassword },
        { auth: false }
      )
      setSuccess(res.message || 'Password reset successful. Please sign in.')
      setTimeout(() => navigate('/sign-in'), 1200)
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
          <h1 className="font-display text-4xl sm:text-5xl">Set new password</h1>
          <p className="mt-2 text-sm text-rock-muted">Use your reset token to create a new password.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <FormField
              label="Reset token"
              value={token}
              onChange={setToken}
              autoComplete="off"
              required
            />
            <FormField
              label="New password"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
              autoComplete="new-password"
              hint="At least 8 chars, including upper/lowercase, number and symbol"
              allowReveal
              required
            />
            <FormField
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete="new-password"
              allowReveal
              required
            />

            {error && <p className="text-sm text-rock-ember">{error}</p>}
            {success && <p className="text-sm text-rock-goldlight">{success}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-grad-gold px-6 py-3.5 text-sm font-extrabold uppercase tracking-wide text-[#0b1220] transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? 'Updating password…' : 'Update password'}
            </button>
          </form>

          <p className="mt-6 text-sm text-rock-muted">
            Need another link?{' '}
            <Link to="/forgot-password" className="text-rock-gold hover:underline">
              Request reset token
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
