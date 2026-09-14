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
        <p className="font-body text-xs font-bold uppercase tracking-[0.2em] text-[#ffd233]">Mission control</p>
        <h1 className="mt-2 text-4xl font-display text-white sm:text-5xl">User role management</h1>
        <p className="mt-3 max-w-xl text-sm text-white/86">
          Promote registered users to educator or admin, or return them to student access.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-2xl border border-white/18 bg-[linear-gradient(180deg,rgba(24,12,76,0.84)_0%,rgba(9,41,84,0.76)_100%)] p-5 text-white shadow-[0_18px_40px_rgba(4,4,28,0.22)] sm:p-6"
        >
          <label className="block">
            <span className="text-sm font-semibold text-white">User email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
              className="mt-1.5 w-full rounded-lg border border-white/18 bg-white/10 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/72 focus:border-[#ffd233]"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-white">Role</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-white/18 bg-[rgba(15,18,50,0.96)] px-4 py-2.5 text-sm text-white outline-none focus:border-[#ffd233]"
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

        {error && <p className="mt-5 text-sm text-[#ff8bc3]">{error}</p>}

        {result && (
          <div className="mt-6 rounded-2xl border border-white/18 bg-[linear-gradient(180deg,rgba(24,12,76,0.82)_0%,rgba(10,42,85,0.74)_100%)] p-5 text-white shadow-[0_18px_40px_rgba(4,4,28,0.2)]">
            <p className="text-xs font-bold uppercase tracking-wide text-[#ffd233]">Updated user</p>
            <p className="mt-3 text-sm text-white">{result.displayName}</p>
            <p className="text-sm text-white/84">{result.email}</p>
            <p className="mt-2 text-xs uppercase tracking-wide text-[#5fe7ff]">Role: {result.role}</p>
          </div>
        )}
      </div>
    </ThemedPage>
  )
}
