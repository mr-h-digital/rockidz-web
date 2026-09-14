import { useState } from 'react'
import { api } from '../api/client'
import ThemedPage from '../components/ThemedPage'

const ROLE_OPTIONS = ['STUDENT', 'EDUCATOR', 'ADMIN']

export default function AdminUsers() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('EDUCATOR')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setResult(null)
    setSubmitting(true)

    try {
      const res = await api.patch('/api/admin/users/role', {
        email: email.trim().toLowerCase(),
        role,
      })
      setResult(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ThemedPage variant="admin">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="font-body text-xs font-bold uppercase tracking-[0.2em] text-rock-gold">Admin</p>
        <h1 className="mt-2 text-4xl font-display sm:text-5xl">User role management</h1>
        <p className="mt-3 max-w-xl text-sm text-rock-muted">
          Promote registered users to educator or admin, or return them to student access.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-rock-border bg-rock-panel p-5 sm:p-6">
          <label className="block">
            <span className="text-sm font-semibold text-rock-cream">User email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
              className="mt-1.5 w-full rounded-lg border border-rock-border bg-white/5 px-4 py-2.5 text-sm text-rock-cream outline-none placeholder:text-rock-muted/50 focus:border-rock-gold"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-rock-cream">Role</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-rock-border bg-white/5 px-4 py-2.5 text-sm text-rock-cream outline-none focus:border-rock-gold"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-grad-gold px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-[#0b1220] transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
          >
            {submitting ? 'Updating role…' : 'Update role'}
          </button>
        </form>

        {error && <p className="mt-5 text-sm text-rock-ember">{error}</p>}

        {result && (
          <div className="mt-6 rounded-2xl border border-rock-border bg-rock-panel p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-rock-gold">Updated user</p>
            <p className="mt-3 text-sm text-rock-cream">{result.displayName}</p>
            <p className="text-sm text-rock-muted">{result.email}</p>
            <p className="mt-2 text-xs uppercase tracking-wide text-rock-goldlight">Role: {result.role}</p>
          </div>
        )}
      </div>
    </ThemedPage>
  )
}
